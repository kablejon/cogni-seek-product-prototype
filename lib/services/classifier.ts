// lib/services/classifier.ts
// 万物分类器逻辑 - 负责"万物分类"的核心逻辑

export interface ClassificationResult {
  targetClass: 'Living_Human' | 'Living_Pet' | 'Inanimate_Object';
  physicsTag: 'Roll' | 'Slide' | 'Sink' | 'Static' | 'Flight' | 'Wander' | 'Denning';
  safetyWarning: boolean;
}

export function classifySearchTarget(inputText: string): ClassificationResult {
  const lowerItem = inputText.toLowerCase();
  
  // 默认结果
  const result: ClassificationResult = {
    targetClass: 'Inanimate_Object',
    physicsTag: 'Static',
    safetyWarning: false
  };

  // --- A. 活物判断 (优先级最高) ---
  if (/(child|kid|baby|toddler|son|daughter|grandpa|grandma|elderly|mom|dad|幼童|小孩|婴儿|儿子|女儿|爷爷|奶奶|老人|妈妈|爸爸)/i.test(lowerItem)) {
    result.targetClass = 'Living_Human';
    result.physicsTag = 'Wander';
    result.safetyWarning = true;
  } 
  else if (/(dog|cat|pet|bird|hamster|puppy|kitten|animal|狗|猫|宠物|鸟|仓鼠|小狗|小猫|动物)/i.test(lowerItem)) {
    result.targetClass = 'Living_Pet';
    
    // 细分宠物行为模式
    if (/(cat|kitten|hamster|snake|猫|小猫|仓鼠|蛇)/i.test(lowerItem)) {
      result.physicsTag = 'Denning'; // 躲藏型
    } else if (/(bird|parrot|鸟|鹦鹉)/i.test(lowerItem)) {
      result.physicsTag = 'Flight'; // 飞行型
    } else {
      result.physicsTag = 'Wander'; // 奔跑型
    }
  } 
  // --- B. 死物物理判断 ---
  else {
    result.targetClass = 'Inanimate_Object';
    
    // 1. 滚动体 (Roll)
    if (/(ring|lipstick|pen|pencil|coin|ball|marble|bottle|battery|earbud|戒指|口红|笔|硬币|球|弹珠|电池|耳机)/i.test(lowerItem)) {
      result.physicsTag = 'Roll';
    } 
    // 2. 滑动/扁平体 (Slide)
    else if (/(card|id|paper|ticket|cash|passport|sticker|photo|卡|身份证|纸|票|钱|护照|贴纸|照片)/i.test(lowerItem)) {
      result.physicsTag = 'Slide';
    } 
    // 3. 重力体/下沉体 (Sink)
    else if (/(phone|wallet|keys|remote|watch|jewelry|手机|钱包|钥匙|遥控|手表|首饰)/i.test(lowerItem)) {
      result.physicsTag = 'Sink';
    }
    // 4. 默认 (Static)
    else {
      result.physicsTag = 'Static';
    }
  }

  return result;
}

export function determineEntropy(mood: string | undefined): 'High' | 'Low' {
  const stressKeywords = ['rushed', 'panic', 'chaos', 'anxious', 'hurry', '着急', '赶时间', '慌', '焦虑', '过载', '高压', '急躁'];
  if (mood && stressKeywords.some(keyword => mood.toLowerCase().includes(keyword))) {
    return 'High';
  }
  return 'Low';
}





