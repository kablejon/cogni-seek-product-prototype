import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  console.log('=== 开始 AI 分析请求 ===');
  
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      console.error('错误: 缺少 prompt');
      return NextResponse.json(
        { error: '缺少分析内容' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error('错误: OPENROUTER_API_KEY 未配置');
      return NextResponse.json(
        { error: 'API 配置错误' },
        { status: 500 }
      );
    }

    console.log('API Key 已配置，正在调用 OpenRouter...');
    console.log('请求模型: google/gemini-2.0-flash-001');

    // 创建 AbortController 用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    try {
      // 调用 OpenRouter API
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'CogniSeek',
        },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的失物寻找分析师。你必须严格按照用户要求的 JSON 格式返回分析结果，不要添加任何额外的文字说明。'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('OpenRouter 响应状态:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenRouter API 错误:', errorData);
        return NextResponse.json(
          { error: 'AI 服务暂时不可用', details: errorData },
          { status: 500 }
        );
      }

      const data = await response.json();
      console.log('OpenRouter 响应成功');
      
      // 提取 AI 回复内容
      const aiContent = data.choices?.[0]?.message?.content;

      if (!aiContent) {
        console.error('AI 返回内容为空');
        return NextResponse.json(
          { error: 'AI 返回内容异常' },
          { status: 500 }
        );
      }

      console.log('AI 回复长度:', aiContent.length);
      console.log('AI 回复内容预览:', aiContent.substring(0, 200));

      // 解析 JSON 结果
      let result;
      try {
        // 尝试从回复中提取 JSON
        const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
        result = JSON.parse(jsonString.trim());
        console.log('JSON 解析成功');
        console.log('解析结果:', JSON.stringify(result).substring(0, 200));
      } catch (parseError) {
        console.error('JSON 解析失败，尝试直接解析');
        
        // 尝试直接解析
        try {
          result = JSON.parse(aiContent.trim());
          console.log('直接解析成功');
        } catch {
          console.error('所有解析尝试都失败');
          console.error('原始内容:', aiContent);
          return NextResponse.json(
            { error: 'AI 返回格式异常', raw: aiContent.substring(0, 500) },
            { status: 500 }
          );
        }
      }
      
      // 验证返回结果的完整性（新版提示词格式）
      if (!result.probability || !result.predictions || !result.checklist || !result.priorityAction) {
        console.error('AI 返回数据不完整:', result);
        return NextResponse.json(
          { error: 'AI 返回数据不完整', raw: JSON.stringify(result) },
          { status: 500 }
        );
      }

      console.log('=== AI 分析完成 ===');
      
      return NextResponse.json({
        success: true,
        result,
        usage: data.usage,
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('请求超时');
        return NextResponse.json(
          { error: 'AI 服务响应超时，请重试' },
          { status: 504 }
        );
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('分析请求处理失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: String(error) },
      { status: 500 }
    );
  }
}
