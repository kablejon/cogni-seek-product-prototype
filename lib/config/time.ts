// lib/config/time.ts
// 时间/光线配置 - 提取自 step-2/page.tsx

import { Zap, Sun, Moon, Calendar } from "lucide-react"

export const MACRO_TIME_OPTIONS = [
  { 
    id: 'just_now', 
    label: '刚刚', 
    description: '1小时内',
    icon: '⚡',
    IconComponent: Zap,
    memoryScore: '极高',
    needsDetail: false,
    needsCustomTime: false,
  },
  { 
    id: 'today', 
    label: '今天', 
    description: '24小时内',
    icon: '☀️',
    IconComponent: Sun,
    memoryScore: '高',
    needsDetail: true,
    needsCustomTime: false,
  },
  { 
    id: 'yesterday', 
    label: '昨天', 
    description: '24-48小时',
    icon: '🌙',
    IconComponent: Moon,
    memoryScore: '中等',
    needsDetail: true,
    needsCustomTime: false,
  },
  { 
    id: 'earlier', 
    label: '更早', 
    description: '自定义日期',
    icon: '📅',
    IconComponent: Calendar,
    memoryScore: '低',
    needsDetail: false,
    needsCustomTime: true,
  },
]

export const LIGHT_PERIODS = [
  { 
    id: 'dawn_morning', 
    label: '凌晨/上午', 
    time: '06:00-11:00',
    icon: '🌅',
    iconName: 'Sunrise',
    // 晨曦蓝到浅白
    atmosphereGradient: 'linear-gradient(135deg, rgba(147, 197, 253, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
    selectedBorder: '#93C5FD',
    glowColor: 'rgba(147, 197, 253, 0.4)',
    aiInsight: '☀️ AI 分析：晨间光线清冷明亮，视野清晰，物品若在开阔区域应较易发现。',
    visualHint: '清冷、清晰',
  },
  { 
    id: 'noon_afternoon', 
    label: '中午/下午', 
    time: '11:00-17:00',
    icon: '☀️',
    iconName: 'Sun',
    // 暖金黄
    atmosphereGradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(252, 211, 77, 0.1) 100%)',
    selectedBorder: '#FCD34D',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    aiInsight: '☀️ AI 分析：强光环境下，物品容易被阴影遮挡，建议检查物体背光面及阴影区域。',
    visualHint: '强烈、明亮',
  },
  { 
    id: 'dusk', 
    label: '黄昏/傍晚', 
    time: '17:00-19:00',
    icon: '🌇',
    iconName: 'CloudSun',
    // 晚霞紫到橙色
    atmosphereGradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.18) 0%, rgba(251, 146, 60, 0.15) 50%, rgba(249, 115, 22, 0.12) 100%)',
    selectedBorder: '#FB923C',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    aiInsight: '🌇 AI 分析：光线快速变化期，人眼适应度下降，物品极易滑入视觉盲区，重点排查过渡区域。',
    visualHint: '昏暗、复杂',
  },
  { 
    id: 'night', 
    label: '晚上/深夜', 
    time: '19:00-06:00',
    icon: '🌑',
    iconName: 'Moon',
    // 深邃蓝黑
    atmosphereGradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(17, 24, 39, 0.2) 100%)',
    selectedBorder: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    aiInsight: '🌑 AI 分析：可见度低，若当时未开灯，请重点排查脚下及低处缝隙、家具下方等区域。',
    visualHint: '视野受限',
  },
]





