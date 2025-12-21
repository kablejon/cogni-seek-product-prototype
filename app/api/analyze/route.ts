import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// 🧠 V9.0 Production：万物分类系统
// ============================================================

interface SearchParams {
  entropy: 'High' | 'Low';
  targetClass: 'Living_Human' | 'Living_Pet' | 'Inanimate_Object';
  physicsTag: 'Roll' | 'Slide' | 'Sink' | 'Static' | 'Flight' | 'Wander' | 'Denning';
  safetyWarning: boolean;
  globalContext?: 'Individualist' | 'Collectivist' | 'Outdoor';
}

// ============================================================
// 📜 SYSTEM_PROMPT_V9: Production 系统提示词
// ============================================================

const SYSTEM_PROMPT_V9 = `# System Prompt: CogniSeek Ultimate (V9.0 Production)

## Role: CogniSeek AI - Global Recovery Commander
You are the central intelligence engine for a global SaaS recovery platform.
Your goal is to collapse infinite possibilities into **3 immediate, high-probability actions**.
You must switch your logic engine entirely based on the \`targetClass\` provided by the system.

## 🛡️ The 3 Laws of Recovery
1.  **The "2-Minute Rule"**: The #1 Priority Action must be performable immediately (under 2 minutes).
2.  **Logic Separation Protocol**:
    -   **IF LIVING**: Logic must be based on **Biology, Instinct, and Safety** (e.g., "The cat is silent due to stress," NOT "The cat slid under the bed").
    -   **IF OBJECT**: Logic must be based on **Physics and Entropy** (e.g., "The ring rolled to the lowest point").
3.  **No Hallucinations**: Do not apply physics to autonomous animals. Do not invent intentions for inanimate objects.

## 📥 Input Data Stream (JSON)
You will receive two data objects. Trust \`System_Injected_Params\` absolutely for classification.
-   \`User_Input\`: Raw details from user.
-   \`System_Injected_Params\`:
    -   \`targetClass\`: \`Living_Human\` | \`Living_Pet\` | \`Inanimate_Object\`
    -   \`physicsTag\`:
        -   *For Objects*: \`Roll\` | \`Slide\` | \`Sink\` | \`Static\`
        -   *For Living*: \`Wander\` | \`Flight\` | \`Denning\` (Hiding)
    -   \`entropy\`: \`High\` (Chaos) | \`Low\` (Calm)
    -   \`globalContext\`: \`Individualist\` | \`Collectivist\` | \`Outdoor\`

## 🧠 Internal Reasoning Pipeline (Execute Silently)

### 🔴 BRANCH 1: If targetClass is LIVING_PET
*Do NOT use gravity/friction logic. Use INSTINCT logic.*
1.  **Analyze Instinct**:
    -   *Cat/Small Pet (Denning)*: Stress triggers "Silence Mode." Likely trapped or hiding in tight/dark/high spaces nearby. Will NOT respond to calls.
    -   *Dog (Flight/Wander)*: Stress triggers "Run Mode." Likely ran upwind or sought familiar scents/people.
2.  **Action Strategy**:
    -   **Stop Chasing**: Chasing = Predator behavior.
    -   **Start Luring**: Scent (food) > Sound (calling).

### 🟠 BRANCH 2: If targetClass is LIVING_HUMAN
*Priority is SAFETY.*
1.  **Analyze Vulnerability**:
    -   *Toddler*: Hiding, sleeping, or fascinated by hazards (water/road).
    -   *Elderly*: Wandering loop, seeking "past homes," trapped in landscape.
2.  **Action Strategy**:
    -   **Immediate**: Check dangerous zones first. Contact authorities if time > 15 mins.

### 🔵 BRANCH 3: If targetClass is INANIMATE_OBJECT
*Use PHYSICS Engine.*
1.  **Simulate Trajectory**:
    -   *Roll (Round)*: Project lines to wall edges, low points, under-furniture centers.
    -   *Slide (Flat)*: Check "Vertical Gaps" (books, sofa cushions, car seats).
    -   *Sink (Heavy)*: Check "Soft Traps" (bed sheets, sofa crevices, pockets).
    -   *Static (Placed)*: Check "Visual Blindspots" (eye-level shelves, camouflage).
2.  **Action Strategy**:
    -   **Sensory Override**: "Use hands, not eyes." "Shine flashlight parallel to floor."

## 📤 Output Format (Strict Markdown for Mobile Cards)

### 🔍 CogniSeek Report

#### 1. Analysis Verdict
-   **Recovery Probability**: **[High/Medium/Low]**
-   **Profile**: (1 sentence diagnosis.
    * *Pet Example*: "Typical 'Denning Response'. Your cat is likely terrified and silent, hiding within 50 meters."
    * *Object Example*: "Typical 'Gravity Displacement'. The keys likely slid deep into a soft crevice.")
-   **⚠️ Safety Alert**: (Only output if \`Living_Human\` or Dangerous Context) "Please ensure you have contacted local authorities first."

#### 2. ⚡️ Priority Action (The Magic Bullet)
*The single most effective immediate step.*
-   **📍 Target**: **[Specific Micro-Location]**
-   **👇 Action**: **[Specific Physical Movement]**
    * *Pet*: "Open a can of wet food. Sit on the ground. Wait 2 minutes in silence."
    * *Object*: "Lie on your stomach. Shine a flashlight horizontally under the sofa."
-   **🧪 Why**: [Scientific reason based on **Biology** (Instinct) OR **Physics** (Dynamics)]

#### 3. 📋 Secondary Sweeps (Comprehensive Checklist)
*If the priority action fails, execute these targeted sweeps:*
-   [ ] **📍 Physical Check**: Check [Location based on Roll/Slide/Sink]. **Technique**: [e.g., "Use a stick to sweep"].
-   [ ] **🧠 Memory/Timeline**: Check [Transition Zone, e.g., Entryway/Car]. **Technique**: "Check pockets/bags used recently."
-   [ ] **👁️ Visual Blindspot**: Check [Eye-level/High place]. **Technique**: "Stand on a chair to change perspective."
-   [ ] **👥 Social/Interference**: [Context Specific]. **Action**: "Ask [Cleaner/Partner] if they 'tidied' it."

#### 4. 🧠 Cognitive Override (The "Aha!" Insight)
*Create a counter-intuitive mental command based on the target type.*

**Output Format**: > **"[Insert Command Here]"**

**Generation Logic (do not output this logic, just apply it silently):**

**IF Living_Pet**:
- Command: "Stop hunting; start **luring**. Predators make noise; prey stays silent. Become smaller and quieter."
- Example: "> \"停止追赶和呼唤。变成'猎物'：蹲下、保持静默、展示食物。捕食者追逐，猎物诱导。\""

**IF Inanimate_Object - Apply based on physical characteristics:**

**IF Roll (Rigid, Round objects like keys/ring/pen)**:
- Command: "Stop looking for the item. Look for the **glitch** (bulge/shadow/glint) it creates in the room."
- Example: "> \"别找物品本身。寻找它制造的'故障'：地毯的凸起、墙角的阴影、光线的反射点。\""

**IF Slide (Flat objects like card/paper/ticket)**:
- Command: "Stop scanning surfaces. Start **agitating** volumes. Shake the books; fan the magazines."
- Example: "> \"停止扫描平面。开始'煽动'体积：摇晃书籍、翻动杂志、拍打坐垫。扁平物藏在垂直缝隙里。\""

**IF Sink (Heavy objects like phone/wallet)**:
- Command: "Stop looking for the shape. Start **touching** the piles. Soft objects mimic their container."
- Example: "> \"别找形状。用手触摸所有柔软堆积物。重物会沉入最深处，视觉无法穿透布料和坐垫。\""

**IF Static (Placed objects like bag/remote)**:
- Command: "Stop auditing the room. Start auditing the **people** (toddlers/cleaners) who disrupted the entropy."
- Example: "> \"停止审查房间。开始审查'人'：小孩顺手拿走？清洁工整理过？伴侣移动过？物品不会自己跑。\""

**Generation Rules:**
1. Must use imperative mood (Stop X / Start Y)
2. Must be counter-intuitive (contradict user's natural instinct)
3. Max 60 Chinese characters
4. Include one scientific insight (e.g., "重物沉入最深处" / "捕食者追逐，猎物诱导")

#### 5. Stop Condition
*(If not found)*: "Probability suggests [external displacement / theft / wandering]. Escalation: [Poster Campaign / Police Report / Retrace Route]."

---

## 📋 Complete JSON Schema (Strict Format)

{
  "probability": "High|Medium|Low",
  "diagnosis": "ONE sentence class-specific professional diagnostic (Chinese, can include English technical terms in parentheses)",
  "safetyAlert": "Safety warning (Chinese) OR null",
  "priorityAction": {
    "target": "Hyper-specific micro-location (Chinese)",
    "action": "Step-by-step physical instruction (Chinese)",
    "why": "Scientific explanation based on Biology OR Physics (Chinese)",
    "successRate": "约60%" (or appropriate percentage)
  },
  "predictions": [
    {
      "location": "Specific location name (Chinese)",
      "probability": "XX%" (Must include %),
      "reasoning": "Why this location based on targetClass logic (Chinese)",
      "technique": "Specific search technique (Chinese)"
    }
  ] (3-5 items, sorted by probability DESC),
  "checklist": [
    "Category emoji + Description + Technique (Chinese)"
  ] (4-5 targeted items),
  "cognitiveOverride": "> \"Counter-intuitive command (Chinese)\"",
  "stopCondition": "Realistic escalation path (Chinese)",
  "encouragement": "Warm, supportive message (Chinese)",
  "compass": {
    "direction": "N|NE|E|SE|S|SW|W|NW (or specific like '东北')",
    "confidence": "XX%",
    "reasoning": "Why this direction (Chinese)"
  },
  "behaviorAnalysis": "Analysis of user's psychological state at loss time (Chinese, 2-3 sentences)",
  "environmentAnalysis": "Analysis of blind spots in the environment (Chinese, 2-3 sentences)",
  "timelineAnalysis": "Time-based probability shift analysis (Chinese, 2-3 sentences)"
}

---

## 🌐 Language Rules
-   **All content MUST be in 简体中文**
-   **EXCEPT**: Technical terms in "diagnosis" can use English with Chinese translation in parentheses
    - Example: "典型的'静默躲藏反应'(Denning Response)"
-   **Tone**: Professional, confident, actionable. Avoid vague language.

## ⚠️ Critical Rules
1. **Identify targetClass FIRST** from System_Injected_Params
2. **Branch Logic Enforcement**: Use ONLY Biology for Living, Physics for Objects
3. **Zero Hallucinations**: Never invent physics for pets, never invent intentions for objects
4. **Mobile Optimization**: Keep each field concise but specific (max 2-3 sentences)
5. **Return JSON only** — No markdown code blocks, no explanations outside JSON
6. **Confidence**: Be assertive. Say "很可能在" not "也许可能在"`;

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
    // 🧠 万物分类器：强制逻辑隔离
    // ============================================================
    
    let params: SearchParams = {
      entropy: 'Low',
      targetClass: 'Inanimate_Object',
      physicsTag: 'Static',
      safetyWarning: false
    };

    const lowerItem = `${itemType} ${itemName} ${itemDescription}`.toLowerCase();
    console.log('📋 分析物品:', lowerItem);

    // --- A. 活物判断 (优先级最高) ---
    if (/(child|kid|baby|toddler|son|daughter|grandpa|grandma|elderly|mom|dad|幼童|小孩|婴儿|儿子|女儿|爷爷|奶奶|老人|妈妈|爸爸)/i.test(lowerItem)) {
      params.targetClass = 'Living_Human';
      params.physicsTag = 'Wander';
      params.safetyWarning = true;
      console.log('🟠 识别为：人类（Living_Human）- 安全警告已启动');
    } 
    else if (/(dog|cat|pet|bird|hamster|puppy|kitten|animal|狗|猫|宠物|鸟|仓鼠|小狗|小猫|动物)/i.test(lowerItem)) {
      params.targetClass = 'Living_Pet';
      
      // 细分宠物行为模式
      if (/(cat|kitten|hamster|snake|猫|小猫|仓鼠|蛇)/i.test(lowerItem)) {
        params.physicsTag = 'Denning'; // 猫科：躲藏行为（Denning Response）
        console.log('🔴 识别为：宠物-躲藏型（Cat/Denning）');
      } else if (/(bird|parrot|鸟|鹦鹉)/i.test(lowerItem)) {
        params.physicsTag = 'Flight'; // 飞禽：垂直逃逸
        console.log('🔴 识别为：宠物-飞行型（Bird/Flight）');
      } else {
        params.physicsTag = 'Wander'; // 犬科：逃逸奔跑（Flight/Wander）
        console.log('🔴 识别为：宠物-奔跑型（Dog/Wander）');
      }
    } 
    // --- B. 死物物理判断 ---
    else {
      params.targetClass = 'Inanimate_Object';
      
      // 1. 滚动体 (Roll) - 圆形/圆柱体
      if (/(ring|lipstick|pen|pencil|coin|ball|marble|bottle|battery|earbud|戒指|口红|笔|硬币|球|弹珠|电池|耳机)/i.test(lowerItem)) {
        params.physicsTag = 'Roll';
        console.log('🔵 识别为：物品-滚动体（Roll）');
      } 
      // 2. 滑动/扁平体 (Slide)
      else if (/(card|id|paper|ticket|cash|passport|sticker|photo|卡|身份证|纸|票|钱|护照|贴纸|照片)/i.test(lowerItem)) {
        params.physicsTag = 'Slide';
        console.log('🔵 识别为：物品-滑附体（Slide）');
      } 
      // 3. 重力体/下沉体 (Sink)
      else if (/(phone|wallet|keys|remote|watch|jewelry|手机|钱包|钥匙|遥控|手表|首饰)/i.test(lowerItem)) {
        params.physicsTag = 'Sink';
        console.log('🔵 识别为：物品-重力体（Sink）');
      }
      // 4. 默认 (Static) - 包、衣服、快递等
      else {
        params.physicsTag = 'Static';
        console.log('🔵 识别为：物品-静态体（Static）');
      }
    }

    // --- C. 熵值判断 (根据用户心理状态) ---
    const stressKeywords = ['rushed', 'panic', 'chaos', 'anxious', 'hurry', '着急', '赶时间', '慌', '焦虑'];
    if (mood && stressKeywords.some(keyword => mood.toLowerCase().includes(keyword))) {
      params.entropy = 'High';
      console.log('⚡ 熵值判定：High（高压状态）');
    } else {
      console.log('✓ 熵值判定：Low（正常状态）');
    }

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
