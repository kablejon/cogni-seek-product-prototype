import { ItemCategory, LocationCategory, ActivityCategory, MoodOption } from './types';

// ==================== 物品类型数据 ====================
export const itemCategories: ItemCategory[] = [
  {
    id: 'daily',
    label: '日常必需品',
    icon: '🔑',
    items: [
      { id: 'keys', label: '钥匙（家门/车钥匙）' },
      { id: 'wallet', label: '钱包/卡包' },
      { id: 'glasses', label: '眼镜/墨镜' },
      { id: 'watch', label: '手表' },
      { id: 'umbrella', label: '雨伞' },
      { id: 'daily_other', label: '+ 其他' },
    ],
  },
  {
    id: 'digital',
    label: '数码产品',
    icon: '📱',
    items: [
      { id: 'phone', label: '手机' },
      { id: 'airpods', label: 'AirPods/蓝牙耳机' },
      { id: 'tablet', label: '平板电脑' },
      { id: 'laptop', label: '笔记本电脑' },
      { id: 'powerbank', label: '充电宝' },
      { id: 'cable', label: '数据线/充电器' },
      { id: 'usb', label: 'U盘/硬盘' },
      { id: 'remote', label: '遥控器' },
      { id: 'camera', label: '相机' },
      { id: 'digital_other', label: '+ 其他' },
    ],
  },
  {
    id: 'documents',
    label: '证件文件',
    icon: '📄',
    items: [
      { id: 'id_card', label: '身份证' },
      { id: 'passport', label: '护照' },
      { id: 'driver_license', label: '驾驶证' },
      { id: 'bank_card', label: '银行卡' },
      { id: 'membership_card', label: '会员卡/门禁卡' },
      { id: 'important_docs', label: '重要文件/合同' },
      { id: 'docs_other', label: '+ 其他' },
    ],
  },
  {
    id: 'valuables',
    label: '贵重物品',
    icon: '💎',
    items: [
      { id: 'ring', label: '戒指' },
      { id: 'necklace', label: '项链' },
      { id: 'earrings', label: '耳环/耳钉' },
      { id: 'bracelet', label: '手链/手镯' },
      { id: 'cash', label: '现金' },
      { id: 'valuables_other', label: '+ 其他' },
    ],
  },
  {
    id: 'pets',
    label: '宠物',
    icon: '🐱',
    items: [
      { id: 'cat', label: '猫' },
      { id: 'dog', label: '狗' },
      { id: 'bird', label: '鸟类' },
      { id: 'hamster', label: '仓鼠/兔子' },
      { id: 'pets_other', label: '+ 其他' },
    ],
  },
  {
    id: 'other',
    label: '其他物品',
    icon: '📦',
    items: [
      { id: 'bag', label: '包包/背包' },
      { id: 'clothes', label: '衣物' },
      { id: 'medicine', label: '药品' },
      { id: 'toys', label: '玩具' },
      { id: 'book', label: '书籍' },
      { id: 'completely_other', label: '+ 其他' },
    ],
  },
];

// ==================== 场景地点数据 ====================
export const locationCategories: LocationCategory[] = [
  {
    id: 'home',
    label: '家里',
    icon: '🏠',
    subLocations: [
      { id: 'living_room', label: '客厅' },
      { id: 'bedroom', label: '卧室' },
      { id: 'kitchen', label: '厨房' },
      { id: 'bathroom', label: '卫生间' },
      { id: 'entrance', label: '玄关/门口' },
      { id: 'balcony', label: '阳台' },
      { id: 'study', label: '书房' },
      { id: 'garage', label: '车库' },
      { id: 'dining_room', label: '餐厅' },
      { id: 'home_other', label: '家里其他区域' },
    ],
  },
  {
    id: 'work',
    label: '工作/学习场所',
    icon: '🏢',
    subLocations: [
      { id: 'office_desk', label: '办公室工位' },
      { id: 'meeting_room', label: '会议室' },
      { id: 'classroom', label: '教室' },
      { id: 'library', label: '图书馆' },
      { id: 'break_room', label: '茶水间/休息室' },
      { id: 'reception', label: '前台/大厅' },
      { id: 'work_other', label: '其他工作场所' },
    ],
  },
  {
    id: 'transport',
    label: '交通工具',
    icon: '🚗',
    subLocations: [
      { id: 'private_car', label: '私家车' },
      { id: 'taxi', label: '出租车/网约车' },
      { id: 'bus_subway', label: '公交/地铁' },
      { id: 'train', label: '高铁/火车' },
      { id: 'plane', label: '飞机' },
      { id: 'bike', label: '自行车/电动车' },
      { id: 'transport_other', label: '其他交通工具' },
    ],
  },
  {
    id: 'public',
    label: '公共场所',
    icon: '🏪',
    subLocations: [
      { id: 'restaurant', label: '餐厅/咖啡厅' },
      { id: 'mall', label: '商场/超市' },
      { id: 'hospital', label: '医院/诊所' },
      { id: 'gym', label: '健身房' },
      { id: 'hotel', label: '酒店/民宿' },
      { id: 'cinema', label: '电影院' },
      { id: 'ktv', label: 'KTV/酒吧' },
      { id: 'bank', label: '银行' },
      { id: 'salon', label: '理发店/美容院' },
      { id: 'public_other', label: '其他公共场所' },
    ],
  },
  {
    id: 'outdoor',
    label: '户外',
    icon: '🌳',
    subLocations: [
      { id: 'park', label: '公园' },
      { id: 'street', label: '街道/人行道' },
      { id: 'parking', label: '停车场' },
      { id: 'playground', label: '操场/运动场' },
      { id: 'scenic', label: '景区/旅游地' },
      { id: 'outdoor_other', label: '其他户外场所' },
    ],
  },
  {
    id: 'location_other',
    label: '其他地点',
    icon: '📍',
    subLocations: [
      { id: 'friend_home', label: '朋友/亲戚家' },
      { id: 'completely_other', label: '其他（自定义）' },
    ],
  },
];

// ==================== 活动类型数据 ====================
export const activityCategories: ActivityCategory[] = [
  {
    id: 'moving',
    label: '移动/出行',
    icon: '🏃',
    activities: [
      { id: 'leaving_home', label: '出门' },
      { id: 'arriving_home', label: '回家/进门' },
      { id: 'getting_in_car', label: '上车' },
      { id: 'getting_out_car', label: '下车' },
      { id: 'shopping', label: '逛街/购物' },
      { id: 'walking', label: '步行/散步' },
      { id: 'running', label: '跑步/运动' },
      { id: 'moving_other', label: '其他移动场景' },
    ],
  },
  {
    id: 'dressing',
    label: '穿戴相关',
    icon: '👔',
    activities: [
      { id: 'changing_clothes', label: '换衣服' },
      { id: 'taking_off_coat', label: '脱外套/脱鞋' },
      { id: 'washing', label: '洗澡/洗手' },
      { id: 'makeup', label: '化妆/整理仪表' },
      { id: 'dressing_other', label: '其他穿戴场景' },
    ],
  },
  {
    id: 'daily_life',
    label: '日常活动',
    icon: '🍳',
    activities: [
      { id: 'cooking', label: '做饭' },
      { id: 'eating', label: '吃饭' },
      { id: 'working', label: '工作/办公' },
      { id: 'studying', label: '学习/看书' },
      { id: 'watching_phone', label: '看手机/刷视频' },
      { id: 'watching_tv', label: '看电视' },
      { id: 'sleeping', label: '睡觉/休息' },
      { id: 'gaming', label: '打游戏' },
      { id: 'daily_other', label: '其他日常活动' },
    ],
  },
  {
    id: 'social',
    label: '社交互动',
    icon: '💬',
    activities: [
      { id: 'phone_call', label: '打电话' },
      { id: 'chatting', label: '与人聊天' },
      { id: 'meeting', label: '开会' },
      { id: 'taking_care_kids', label: '带孩子' },
      { id: 'hosting_guests', label: '接待客人' },
      { id: 'dining_out', label: '聚餐/应酬' },
      { id: 'social_other', label: '其他社交场景' },
    ],
  },
  {
    id: 'organizing',
    label: '整理清洁',
    icon: '🧹',
    activities: [
      { id: 'cleaning', label: '打扫卫生' },
      { id: 'tidying', label: '收拾东西' },
      { id: 'packing', label: '收拾行李/打包' },
      { id: 'moving_items', label: '搬运物品' },
      { id: 'laundry', label: '洗衣服/晾衣服' },
      { id: 'organizing_other', label: '其他整理场景' },
    ],
  },
  {
    id: 'activity_other',
    label: '其他活动',
    icon: '❓',
    activities: [
      { id: 'emergency', label: '处理紧急事情' },
      { id: 'completely_other', label: '其他（自定义）' },
    ],
  },
];

// ==================== 情绪状态数据 ====================
export const moodOptions: MoodOption[] = [
  { id: 'rushed', label: '着急/赶时间', icon: '😰', description: '时间紧迫，行动匆忙' },
  { id: 'relaxed', label: '轻松/平静', icon: '😊', description: '心情放松，节奏较慢' },
  { id: 'irritated', label: '烦躁/生气', icon: '😤', description: '情绪波动，注意力分散' },
  { id: 'distracted', label: '分心/多任务', icon: '🤯', description: '同时处理多件事情' },
  { id: 'tired', label: '疲惫/困倦', icon: '😴', description: '精神状态不佳' },
  { id: 'tipsy', label: '微醺/酒后', icon: '🍺', description: '饮酒后状态' },
  { id: 'sad', label: '难过/低落', icon: '😢', description: '情绪低迷' },
  { id: 'sick', label: '身体不适', icon: '🤒', description: '生病或不舒服' },
  { id: 'excited', label: '兴奋/激动', icon: '🤩', description: '情绪高涨' },
  { id: 'mood_other', label: '其他状态', icon: '❓', description: '自定义描述' },
];

// ==================== 时间快捷选项 ====================
export const timeQuickOptions = [
  { id: 'today_morning', label: '今天早上', description: '6:00 - 12:00' },
  { id: 'today_afternoon', label: '今天下午', description: '12:00 - 18:00' },
  { id: 'today_evening', label: '今天晚上', description: '18:00 - 24:00' },
  { id: 'yesterday', label: '昨天', description: '' },
  { id: 'day_before', label: '前天', description: '' },
  { id: 'this_week', label: '这周内', description: '3-7天前' },
  { id: 'longer', label: '更久之前', description: '超过一周' },
  { id: 'custom', label: '其他时间', description: '自定义' },
];

// ==================== 搜索时长选项 ====================
export const searchDurationOptions = [
  { id: 'just_now', label: '刚发现丢了' },
  { id: 'few_minutes', label: '找了几分钟' },
  { id: 'half_hour', label: '找了半小时左右' },
  { id: 'one_hour', label: '找了一小时以上' },
  { id: 'several_hours', label: '找了好几个小时' },
  { id: 'days', label: '找了好几天了' },
];

// ==================== 物品大小选项 ====================
export const itemSizeOptions = [
  { id: 'small', label: '小型', description: '如戒指、耳机、钥匙' },
  { id: 'medium', label: '中型', description: '如手机、钱包、遥控器' },
  { id: 'large', label: '大型', description: '如包包、平板、笔记本' },
];

// ==================== 物品颜色选项 ====================
export const itemColorOptions = [
  { id: 'black', label: '黑色', color: '#1a1a1a' },
  { id: 'white', label: '白色', color: '#ffffff' },
  { id: 'silver', label: '银色/灰色', color: '#9ca3af' },
  { id: 'gold', label: '金色', color: '#d4af37' },
  { id: 'red', label: '红色', color: '#ef4444' },
  { id: 'blue', label: '蓝色', color: '#3b82f6' },
  { id: 'green', label: '绿色', color: '#22c55e' },
  { id: 'pink', label: '粉色', color: '#ec4899' },
  { id: 'purple', label: '紫色', color: '#a855f7' },
  { id: 'brown', label: '棕色', color: '#92400e' },
  { id: 'transparent', label: '透明', color: 'transparent' },
  { id: 'other', label: '其他颜色', color: '#6b7280' },
];






