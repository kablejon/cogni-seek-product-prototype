import { SearchSession } from './types';
import { itemCategories, locationCategories, activityCategories, moodOptions } from './data';

// 获取物品显示名称
export function getItemDisplayName(session: SearchSession): string {
  if (session.itemCustomName) return session.itemCustomName;
  const category = itemCategories.find(c => c.id === session.itemCategory);
  const item = category?.items.find(i => i.id === session.itemType);
  return item?.label || '物品';
}

// 获取地点显示名称
export function getLocationDisplayName(session: SearchSession): string {
  if (session.locationCustom) return session.locationCustom;
  const category = locationCategories.find(c => c.id === session.locationCategory);
  const location = category?.subLocations.find(l => l.id === session.specificLocation);
  const categoryLabel = category?.label || '';
  const locationLabel = location?.label || '';
  return locationLabel ? `${categoryLabel} - ${locationLabel}` : categoryLabel;
}

// 获取活动显示名称
export function getActivityDisplayName(session: SearchSession): string {
  if (session.activityCustom) return session.activityCustom;
  const category = activityCategories.find(c => c.id === session.activityCategory);
  const activity = category?.activities.find(a => a.id === session.specificActivity);
  return activity?.label || '';
}

// 获取情绪显示信息
export function getMoodDisplayInfo(session: SearchSession): { label: string; icon: string } {
  if (session.moodCustom) return { label: session.moodCustom, icon: '❓' };
  const mood = moodOptions.find(m => m.id === session.mood);
  return { label: mood?.label || '', icon: mood?.icon || '' };
}

// 计算找回概率（模拟算法）
export function calculateRecoveryProbability(session: SearchSession): number {
  let baseProb = 75;

  // 时间因素
  if (session.timeConfidence === 'certain') baseProb += 8;
  else if (session.timeConfidence === 'approximate') baseProb += 4;

  // 场景因素 - 家里的找回率更高
  if (session.locationCategory === 'home') baseProb += 10;
  else if (session.locationCategory === 'work') baseProb += 5;
  else if (session.locationCategory === 'transport') baseProb -= 10;
  else if (session.locationCategory === 'public') baseProb -= 15;

  // 情绪因素
  if (session.mood === 'relaxed') baseProb += 5;
  else if (session.mood === 'rushed' || session.mood === 'distracted') baseProb -= 5;
  else if (session.mood === 'tipsy') baseProb -= 10;

  // 物品大小因素
  if (session.itemSize === 'large') baseProb += 5;
  else if (session.itemSize === 'small') baseProb -= 5;

  // 是否有人在场
  if (session.otherPeoplePresent) baseProb -= 3;

  // 是否已经找过
  if (session.hasSearched && session.searchDuration === 'days') baseProb -= 10;

  // 限制在合理范围内
  return Math.min(95, Math.max(50, baseProb));
}

// 生成方位分析
export function generateDirectionAnalysis(session: SearchSession): {
  primary: string;
  primaryLabel: string;
  confidence: number;
  description: string;
} {
  const directions = [
    { id: 'NW', label: '西北方向', angle: -45 },
    { id: 'N', label: '北方', angle: 0 },
    { id: 'NE', label: '东北方向', angle: 45 },
    { id: 'E', label: '东方', angle: 90 },
    { id: 'SE', label: '东南方向', angle: 135 },
    { id: 'S', label: '南方', angle: 180 },
    { id: 'SW', label: '西南方向', angle: -135 },
    { id: 'W', label: '西方', angle: -90 },
  ];

  // 基于各种因素"计算"方位（实际是模拟）
  const hash = (session.itemType + session.specificLocation + session.specificActivity).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const directionIndex = Math.abs(hash) % directions.length;
  const direction = directions[directionIndex];
  const confidence = 60 + (Math.abs(hash) % 25);

  let description = '';
  if (session.locationCategory === 'home') {
    if (session.specificLocation === 'living_room') {
      description = '建议检查沙发缝隙、茶几下方、电视柜周围';
    } else if (session.specificLocation === 'bedroom') {
      description = '建议检查床头柜、床底、衣柜内侧、枕头下';
    } else if (session.specificLocation === 'entrance') {
      description = '建议检查鞋柜、钥匙挂钩、门口置物架';
    } else {
      description = '建议检查该区域的低矮家具、储物空间、容易被遮挡的角落';
    }
  } else {
    description = '建议仔细回忆当时的活动路径，检查可能停留过的位置';
  }

  return {
    primary: direction.id,
    primaryLabel: direction.label,
    confidence,
    description,
  };
}

// 生成行为分析
export function generateBehaviorAnalysis(session: SearchSession): string {
  const mood = getMoodDisplayInfo(session);
  const activity = getActivityDisplayName(session);

  let analysis = '';

  if (session.mood === 'rushed' || session.wasDistracted) {
    analysis = `根据你当时的「${mood.label}」状态，大脑处于高压力模式下，注意力主要集中在主要任务上。在这种状态下，人们倾向于进行自动化行为，将物品放置在最方便、最近的位置，而非常规位置。`;
  } else if (session.mood === 'relaxed') {
    analysis = `你当时处于「${mood.label}」状态，这种情况下物品通常会被放置在习惯性的位置。建议首先检查你平时最常放置该物品的地方。`;
  } else if (session.mood === 'distracted') {
    analysis = `你当时在「${activity}」的同时处于分心状态，这种多任务情境下，物品很容易被随手放在非预期的位置。建议检查当时活动动线上的各个停留点。`;
  } else if (session.mood === 'tipsy') {
    analysis = `在「${mood.label}」状态下，判断力和记忆力都会受到影响。物品可能被放置在非常规的位置，建议扩大搜索范围，包括一些平时不会放东西的地方。`;
  } else {
    analysis = `结合你当时「${activity}」的行为和「${mood.label}」的状态，物品最可能在该活动的核心区域或动线终点附近。`;
  }

  if (session.otherPeoplePresent) {
    analysis += `\n\n由于当时有其他人在场，物品也可能被无意中移动。建议向他们确认是否看到或触碰过。`;
  }

  return analysis;
}

// 生成环境分析
export function generateEnvironmentAnalysis(session: SearchSession): string {
  const location = getLocationDisplayName(session);
  const itemSize = session.itemSize;

  let analysis = `在「${location}」环境中，`;

  if (session.locationCategory === 'home') {
    analysis += '存在多个视觉遮蔽物：沙发靠垫、茶几杂物、装饰品等。';
  } else if (session.locationCategory === 'work') {
    analysis += '办公用品和文件较多，物品可能被压在其他物品下方。';
  } else if (session.locationCategory === 'transport') {
    analysis += '交通工具内空间有限，但存在多个容易遗漏的缝隙。';
  } else {
    analysis += '公共环境人流复杂，物品位置可能受到多种因素影响。';
  }

  if (itemSize === 'small') {
    analysis += '\n\n由于物品体积较小，很可能被其他物体遮挡，或滑落到低于视线水平的位置（如家具缝隙、地毯边缘）。';
  } else if (itemSize === 'large') {
    analysis += '\n\n物品体积较大，不太容易完全隐藏，建议重点关注是否被其他大型物品遮挡。';
  }

  return analysis;
}

// 生成动态排查清单
export function generateChecklist(session: SearchSession): string[] {
  const checklist: string[] = [];
  const itemName = getItemDisplayName(session);

  // 基于场景的清单
  if (session.locationCategory === 'home') {
    if (session.specificLocation === 'living_room' || !session.specificLocation) {
      checklist.push('检查沙发、座椅的缝隙和靠垫下');
      checklist.push('查看茶几、电视柜的抽屉和台面');
      checklist.push('检查地毯边缘和家具底部');
    }
    if (session.specificLocation === 'bedroom' || !session.specificLocation) {
      checklist.push('翻看床上的被子、枕头下方');
      checklist.push('检查床头柜抽屉和床与墙壁的缝隙');
      checklist.push('查看衣柜内部和换下的衣服口袋');
    }
    if (session.specificLocation === 'entrance' || !session.specificLocation) {
      checklist.push('检查鞋柜、门口置物架');
      checklist.push('查看挂在门口的外套口袋');
    }
    if (session.specificLocation === 'kitchen') {
      checklist.push('检查厨房台面和抽屉');
      checklist.push('查看冰箱门上和旁边');
    }
    if (session.specificLocation === 'bathroom') {
      checklist.push('检查洗漱台和镜柜');
      checklist.push('查看洗衣机内部和周围');
    }
  }

  // 基于物品类型的清单
  if (session.itemType === 'keys') {
    checklist.push('检查所有外套和裤子口袋');
    checklist.push('查看包包的各个夹层');
    checklist.push('检查门锁上是否忘记拔下');
  } else if (session.itemType === 'phone' || session.itemType === 'airpods') {
    if (!session.triedFindMy) {
      checklist.push('尝试使用"查找我的设备"功能定位或播放声音');
    }
    checklist.push('检查充电器附近');
    checklist.push('查看常用的放置位置');
  } else if (session.itemType === 'wallet' || session.itemType === 'id_card') {
    checklist.push('检查所有包包和背包');
    checklist.push('回忆最近一次使用的场景');
    checklist.push('查看文件和书籍堆叠处');
  } else if (session.itemType === 'glasses') {
    checklist.push('检查眼镜盒和常放位置');
    checklist.push('查看头顶（可能推到头上忘记了）');
    checklist.push('检查洗手台和卫生间');
  } else if (session.itemType === 'remote') {
    checklist.push('检查沙发缝隙和靠垫下');
    checklist.push('查看茶几和电视柜');
    checklist.push('检查是否被其他物品盖住');
  }

  // 基于行为的清单
  if (session.activityCategory === 'dressing') {
    checklist.push('检查换下的衣服所有口袋');
    checklist.push('查看更衣区域的各个角落');
  }
  if (session.specificActivity === 'cooking' || session.specificActivity === 'eating') {
    checklist.push('检查餐桌和厨房台面');
    checklist.push('查看冰箱附近');
  }

  // 通用建议
  if (session.otherPeoplePresent && !session.askedOthers) {
    checklist.push('询问同住的人是否看到或帮忙收拾过');
  }

  checklist.push('检查垃圾桶周围（可能不小心扫进去）');
  checklist.push('回到物品最后出现的位置，重新模拟当时的动作');

  // 去重并限制数量
  return [...new Set(checklist)].slice(0, 12);
}

// 生成安慰语
export function generateEncouragement(session: SearchSession, probability: number): string {
  if (probability >= 85) {
    return '别着急，根据分析你的情况找回概率很高！大多数丢失的物品都在原地静静等待被发现，往往就在你已经看过的地方——只是被你的大脑临时"隐藏"了。深呼吸，我们一起慢慢找。';
  } else if (probability >= 70) {
    return '保持耐心，你的情况找回希望很大。研究表明，90%的室内丢失物品最终都能找回。关键是系统性地排查，不要急躁。相信自己，它就在某个角落等你。';
  } else {
    return '虽然情况有些复杂，但不要放弃希望。很多人在几乎要放弃的时候找到了物品。建议你休息一下，换个心情再找——有时候大脑放松后反而能想起关键线索。';
  }
}

// 生成初步推测位置
export function generateTopPredictions(session: SearchSession): Array<{
  location: string;
  confidence: number;
  reason: string;
}> {
  const predictions: Array<{ location: string; confidence: number; reason: string }> = [];

  // 基于场景生成推测
  if (session.locationCategory === 'home') {
    if (session.specificLocation === 'living_room') {
      predictions.push({
        location: '沙发缝隙或靠垫下',
        confidence: 35,
        reason: '客厅活动频繁，沙发是最容易遗落物品的地方',
      });
      predictions.push({
        location: '茶几/电视柜附近',
        confidence: 25,
        reason: '这些是客厅的核心活动区域',
      });
    } else if (session.specificLocation === 'bedroom') {
      predictions.push({
        location: '床头柜或床上',
        confidence: 40,
        reason: '卧室物品通常放在床边触手可及的位置',
      });
      predictions.push({
        location: '衣柜内或换下的衣物中',
        confidence: 30,
        reason: '换衣服时容易将物品遗留在衣物中',
      });
    } else if (session.specificLocation === 'entrance') {
      predictions.push({
        location: '玄关置物架或鞋柜',
        confidence: 45,
        reason: '进出门时的必经之地，最容易随手放置',
      });
    }
  }

  // 基于行为生成推测
  if (session.activityCategory === 'dressing' || session.specificActivity === 'changing_clothes') {
    predictions.push({
      location: '换下的衣服口袋',
      confidence: 40,
      reason: '换衣服时物品最容易留在旧衣物中',
    });
  }

  if (session.specificActivity === 'phone_call' || session.specificActivity === 'chatting') {
    predictions.push({
      location: '通话/聊天时的位置附近',
      confidence: 30,
      reason: '社交互动时注意力分散，容易随手放置',
    });
  }

  // 确保至少有3个推测
  if (predictions.length < 3) {
    predictions.push({
      location: '常用放置位置',
      confidence: 20,
      reason: '习惯性行为可能让你无意识地放回原位',
    });
  }

  // 按置信度排序并取前3个
  return predictions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}















