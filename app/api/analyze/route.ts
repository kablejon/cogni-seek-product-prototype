import { NextRequest, NextResponse } from 'next/server';
import { classifySearchTarget, determineEntropy } from '@/lib/services/classifier';
import { SYSTEM_PROMPT_V9 } from '@/lib/services/prompt-engine';

// ============================================================
// 🧠 V9.0 Production：万物分类系统 (已重构为服务层)
// ============================================================

interface SearchParams {
  entropy: 'High' | 'Low';
  targetClass: 'Living_Human' | 'Living_Pet' | 'Inanimate_Object';
  physicsTag: 'Roll' | 'Slide' | 'Sink' | 'Static' | 'Flight' | 'Wander' | 'Denning';
  safetyWarning: boolean;
  globalContext?: 'Individualist' | 'Collectivist' | 'Outdoor';
}

// ============================================================
// 📜 SYSTEM_PROMPT_V9: Production 系统提示词 (已移至 prompt-engine.ts)
// ============================================================

// 原 SYSTEM_PROMPT_V9 已移至 lib/services/prompt-engine.ts

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  console.log('=== 🚀 CogniSeek V9.0 Production 分析开始 ===');
  
  try {
    const body = await request.json();
    console.log('接收到的数据:', JSON.stringify(body, null, 2));

    const { 
      itemType, 
      itemName,
      itemDescription, 
      lastSeenLocation,
      lastSeenTime,
      activity,
      mood,
      searchedPlaces,
      ...otherData 
    } = body;

    // ============================================================
    // 🧠 万物分类器：使用重构后的服务层
    // ============================================================
    
    const inputText = `${itemType} ${itemName} ${itemDescription}`;
    console.log('📋 分析物品:', inputText);
    
    // 1. 调用业务服务进行分类
    const classification = classifySearchTarget(inputText);
    const entropy = determineEntropy(mood);
    
    const params: SearchParams = {
      ...classification,
      entropy,
      globalContext: 'Individualist' // 可以后续根据 headers 或 user profile 动态获取
    };
    
    console.log('📊 最终分类参数:', params);

    // ============================================================
    // 🚀 调用 OpenRouter API
    // ============================================================

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error('❌ OPENROUTER_API_KEY 未配置');
      return NextResponse.json(
        { error: 'API 配置错误' },
        { status: 500 }
      );
    }

    console.log('✓ API Key 已配置');
    console.log('📡 正在调用 OpenRouter (Model: google/gemini-2.0-flash-001)...');

    // 创建超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45秒超时

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'CogniSeek V7.0',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT_V9
            },
            {
              role: 'user',
              content: JSON.stringify({
                User_Input: {
                  itemType,
                  itemName,
                  itemDescription,
                  lastSeenLocation,
                  lastSeenTime,
                  activity,
                  mood,
                  searchedPlaces,
                  ...otherData
                },
                System_Injected_Params: params // 🔐 硬参数注入
              })
            }
          ],
          temperature: 0.6,
          max_tokens: 4000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📡 OpenRouter 响应状态:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ OpenRouter API 错误:', errorData);
        return NextResponse.json(
          { error: 'AI 服务暂时不可用', details: errorData },
          { status: 500 }
        );
      }

      const data = await response.json();
      console.log('✓ OpenRouter 响应成功');
      
      const aiContent = data.choices?.[0]?.message?.content;

      if (!aiContent) {
        console.error('❌ AI 返回内容为空');
        return NextResponse.json(
          { error: 'AI 返回内容异常' },
          { status: 500 }
        );
      }

      console.log('📝 AI 回复长度:', aiContent.length);
      console.log('📝 AI 回复预览:', aiContent.substring(0, 300));

      // 解析 JSON 结果
      let result;
      try {
        const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
        result = JSON.parse(jsonString.trim());
        console.log('✓ JSON 解析成功');
      } catch (parseError) {
        console.error('⚠️ JSON 解析失败，尝试直接解析');
        
        try {
          result = JSON.parse(aiContent.trim());
          console.log('✓ 直接解析成功');
        } catch {
          console.error('❌ 所有解析尝试都失败');
          console.error('原始内容:', aiContent);
          return NextResponse.json(
            { error: 'AI 返回格式异常', raw: aiContent.substring(0, 500) },
            { status: 500 }
          );
        }
      }
      
      // 验证必需字段
      if (!result.probability || !result.predictions || !result.checklist || !result.priorityAction) {
        console.error('❌ AI 返回数据不完整:', result);
        return NextResponse.json(
          { error: 'AI 返回数据不完整', raw: JSON.stringify(result) },
          { status: 500 }
        );
      }

      // ============================================================
      // 🔄 数据格式转换：V7.0 → 前端兼容格式
      // ============================================================
      
      // 转换概率为数字
      const probabilityMap: { [key: string]: number } = {
        'High': 85,
        'Medium': 60,
        'Low': 35,
        '很高': 85,
        '较高': 75,
        '中等': 60,
        '较低': 35
      };

      const transformedResult = {
        probability: probabilityMap[result.probability] || 70, // 默认70%
        probabilityLevel: result.probability, // "High" / "Medium" / "Low"
        summary: result.diagnosis || '基于三维科学寻物系统分析的综合评估',
        safetyAlert: result.safetyAlert || null,
        priorityAction: {
          target: result.priorityAction?.target || '',
          action: result.priorityAction?.action || '',
          why: result.priorityAction?.why || '',
          successRate: result.priorityAction?.successRate || '60%'
        },
        predictions: (result.predictions || []).map((pred: any) => ({
          location: pred.location || '',
          confidence: parseInt(pred.probability) || 50, // "45%" → 45
          reason: pred.reasoning || '',
          technique: pred.technique || ''
        })),
        direction: result.compass ? {
          primary: result.compass.direction?.match(/[A-Z]+/)?.[0] || 'N',
          primaryLabel: result.compass.direction || '北方',
          confidence: parseInt(result.compass.confidence) || 70,
          description: result.compass.reasoning || ''
        } : {
          primary: 'N',
          primaryLabel: '北方',
          confidence: 70,
          description: '基于物理模拟的方向预测'
        },
        behaviorAnalysis: result.behaviorAnalysis || '',
        environmentAnalysis: result.environmentAnalysis || '',
        timelineAnalysis: result.timelineAnalysis || '',
        basicSearchPoints: result.basicSearchPoints || [
          `${lastSeenLocation || '该区域'}的表面和可见区域`,
          '桌面、台面等最后使用物品的区域',
          '地面开阔区域（掉落的第一反应位置）'
        ],
        checklist: result.checklist || [],
        cognitiveOverride: result.cognitiveOverride || '',
        stopCondition: result.stopCondition || '',
        encouragement: result.encouragement || '90%的"丢失"物品都在你认为它们所在的2米范围内。'
      };

      console.log('=== ✅ CogniSeek V9.0 Production 分析完成 ===');
      console.log('📊 转换后的结果:', JSON.stringify(transformedResult).substring(0, 300));
      
      return NextResponse.json({
        success: true,
        result: transformedResult,
        classification: params, // 返回分类信息供前端参考
        usage: data.usage,
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('⏱️ 请求超时');
        return NextResponse.json(
          { error: 'AI 服务响应超时，请重试' },
          { status: 504 }
        );
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('❌ 分析请求处理失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: String(error) },
      { status: 500 }
    );
  }
}
