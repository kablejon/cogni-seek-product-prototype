// 物品类型定义
export interface ItemCategory {
  id: string;
  label: string;
  icon: string;
  items: ItemOption[];
}

export interface ItemOption {
  id: string;
  label: string;
}

// 场景类型定义
export interface LocationCategory {
  id: string;
  label: string;
  icon: string;
  subLocations: LocationOption[];
}

export interface LocationOption {
  id: string;
  label: string;
}

// 活动类型定义
export interface ActivityCategory {
  id: string;
  label: string;
  icon: string;
  activities: ActivityOption[];
}

export interface ActivityOption {
  id: string;
  label: string;
}

// 情绪状态定义
export interface MoodOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

// 搜索会话数据
export interface SearchSession {
  // Step 1: 物品信息
  itemCategory: string;
  itemType: string;
  itemCustomName: string;
  itemColor: string;
  itemSize: 'small' | 'medium' | 'large' | '';
  itemFeatures: string; // 特征指纹：划痕、贴纸、保护套等
  hasSound: boolean | null;
  hasCase: boolean | null;

  // Step 2: 时间信息
  lastSeenDate: string;
  lastSeenTime: string;
  timeQuickSelect: string;
  timeConfidence: 'certain' | 'approximate' | 'unknown' | '';

  // Step 3: 场景信息
  locationCategory: string;
  specificLocation: string;
  locationCustom: string;
  visitedMultipleLocations: boolean;
  otherVisitedLocations: string[];

  // Step 4: 行为状态
  activityCategory: string;
  specificActivity: string;
  activityCustom: string;
  mood: string;
  moodCustom: string;
  wasDistracted: boolean;
  otherPeoplePresent: boolean;

  // Step 5: 已排查信息
  hasSearched: boolean;
  searchedLocations: string[];
  searchedCustomLocations: string[];
  searchDuration: string;
  askedOthers: boolean;
  triedFindMy: boolean;
}

// 初始状态
export const initialSearchSession: SearchSession = {
  // Step 1
  itemCategory: '',
  itemType: '',
  itemCustomName: '',
  itemColor: '',
  itemSize: '',
  itemFeatures: '',
  hasSound: null,
  hasCase: null,

  // Step 2
  lastSeenDate: '',
  lastSeenTime: '',
  timeQuickSelect: '',
  timeConfidence: '',

  // Step 3
  locationCategory: '',
  specificLocation: '',
  locationCustom: '',
  visitedMultipleLocations: false,
  otherVisitedLocations: [],

  // Step 4
  activityCategory: '',
  specificActivity: '',
  activityCustom: '',
  mood: '',
  moodCustom: '',
  wasDistracted: false,
  otherPeoplePresent: false,

  // Step 5
  hasSearched: false,
  searchedLocations: [],
  searchedCustomLocations: [],
  searchDuration: '',
  askedOthers: false,
  triedFindMy: false,
};







