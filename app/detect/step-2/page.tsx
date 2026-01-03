"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Zap, Sun, Moon, Calendar, Check } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 宏观时间选择（4个大卡片）
const MACRO_TIME_OPTIONS = [
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
    label: '更早/自定义', 
    description: '超过48小时',
    icon: '📅',
    IconComponent: Calendar,
    memoryScore: '低',
    needsDetail: false,
    needsCustomTime: true,
  },
]

// 光线/时段选择（微观）- 氛围感升级
const LIGHT_PERIODS = [
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

export default function Step2Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedMacroTime, setSelectedMacroTime] = useState<string>('')
  const [selectedLightPeriod, setSelectedLightPeriod] = useState<string>('')
  const [isTimeUncertain, setIsTimeUncertain] = useState(false) // 改为"不确定"开关
  const [fuzzyTimeMode, setFuzzyTimeMode] = useState(false) // 新增：模糊时间模式
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')

  // 获取当前选中的宏观时间配置
  const selectedMacroConfig = MACRO_TIME_OPTIONS.find(opt => opt.id === selectedMacroTime)

  // 是否需要选择光线时段
  const needsLightDetail = selectedMacroConfig?.needsDetail || false
  
  // 是否需要自定义时间输入
  const needsCustomTime = selectedMacroConfig?.needsCustomTime || false

  // 是否可以继续
  const canProceed = selectedMacroTime && (
    (!needsLightDetail && !needsCustomTime) || // 刚刚
    selectedLightPeriod || // 今天/昨天 + 光线
    fuzzyTimeMode || // 模糊时间模式
    (needsCustomTime && customDate) // 更早 + 日期（时间可选）
  )

  // 获取缺少的必填项提示（按优先级）
  const getMissingRequirement = (): string | null => {
    if (!selectedMacroTime) {
      return "请选择时间范围"
    }
    if (needsLightDetail && !selectedLightPeriod && !fuzzyTimeMode) {
      return "请选择光线时段或开启广域搜索"
    }
    if (needsCustomTime && !customDate) {
      return "请选择具体日期"
    }
    return null
  }

  // 处理宏观时间选择
  const handleMacroTimeSelect = (timeId: string) => {
    setSelectedMacroTime(timeId)
    setSelectedLightPeriod('')
    setCustomDate('')
    setCustomTime('')
  }

  // 处理下一步
  const handleNext = () => {
    if (!canProceed) return

    let timeDescription = ''
    let lightContext = ''
    let aiSearchMode = ''
    
    if (needsCustomTime && customDate) {
      // 更早/自定义模式
      if (customTime) {
        timeDescription = `${customDate} ${customTime}`
        if (isTimeUncertain) {
          aiSearchMode = '模糊时间模式 - 分析全天光线和行为模式'
          lightContext = '全天综合分析'
        } else {
          aiSearchMode = '精确时间模式 - 分析该时间点后3小时路径'
          lightContext = '锁定时间点'
        }
      } else {
        timeDescription = customDate
        aiSearchMode = '日期模式 - 分析全天光线和行为模式'
        lightContext = '全天综合分析'
      }
    } else if (fuzzyTimeMode) {
      // 模糊时间模式
      const macroLabel = selectedMacroConfig?.label || ''
      timeDescription = `${macroLabel} (时间不确定)`
      lightContext = '全天光线综合分析'
      aiSearchMode = '模糊时间模式 - AI将分析全天的光线变化与行为轨迹'
    } else if (selectedLightPeriod) {
      // 今天/昨天 + 光线模式
      const macroLabel = selectedMacroConfig?.label || ''
      const lightConfig = LIGHT_PERIODS.find(p => p.id === selectedLightPeriod)
      timeDescription = `${macroLabel} ${lightConfig?.label || ''}`
      lightContext = lightConfig?.aiInsight || ''
      aiSearchMode = '光线模式 - 重点排查对应光线条件区域'
    } else {
      // 刚刚模式
      timeDescription = selectedMacroConfig?.label || ''
      lightContext = '记忆热度极高'
      aiSearchMode = '即时模式 - 优先排查最近活动区域'
    }

    updateSession({
      lastSeenTime: timeDescription,
      lastSeenDate: customDate || new Date().toISOString().split('T')[0],
    })
    
    router.push('/detect/step-3')
  }

  // 获取当前选中的光线时段配置
  const selectedPeriodConfig = LIGHT_PERIODS.find(p => p.id === selectedLightPeriod)

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* 星空背景 - 固定定位 */}
      <div className="fixed inset-0 z-0">
        <InteractiveFog particleCount={100} color="56, 189, 248" />
      </div>

      {/* 全局氛围联动层 */}
      {selectedLightPeriod && selectedPeriodConfig && (
        <div 
          className="fixed inset-0 z-0 transition-all duration-1000 ease-out pointer-events-none"
          style={{
            background: selectedPeriodConfig.atmosphereGradient,
            opacity: 0.15,
          }}
        />
      )}

      <Header currentStep={3} showProgress />

      {/* 主容器 - 毛玻璃悬浮卡片 */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-5xl mx-auto scifi-container p-6 md:p-10 space-y-8">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">记忆回溯</h1>
            <p className="text-base md:text-lg text-white/70">
              你最后一次<span className="text-[var(--cyber-green)] font-semibold">确定</span>看见它是什么时候？
            </p>
          </div>

          {/* Grid 宫格 - 宏观时间大类（完全复用 Step-0 的布局） */}
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-bold text-white/90">时间范围</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {MACRO_TIME_OPTIONS.map((option) => {
                const Icon = option.IconComponent
                const isSelected = selectedMacroTime === option.id
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleMacroTimeSelect(option.id)}
                    className={`card-option ${isSelected ? 'card-option-selected' : ''} relative group`}
                  >
                    {isSelected && (
                      <div className="check-glow">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-1.5 py-5">
                      <div className="text-2xl">{option.icon}</div>
                      <Icon 
                        className={`w-5 h-5 transition-all ${
                          isSelected 
                            ? option.id === 'earlier' 
                              ? 'text-[var(--holo-blue)] fill-current' 
                              : 'text-[var(--holo-blue)]'
                            : 'text-white/70 group-hover:text-white'
                        }`} 
                        strokeWidth={1.5} 
                      />
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                        {option.label}
                      </span>
                      <span className="text-xs text-white/50">{option.description}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 光线/时段选择（条件展开 - 今天/昨天） - 氛围感升级 */}
          {needsLightDetail && (
            <div className="space-y-5 animate-fade-in-up">
              <h2 className="text-base md:text-lg font-bold text-white/90">
                当时的光线/时段是？
              </h2>
              
              {/* 天色卡片组 - 横向排列 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {LIGHT_PERIODS.map((period) => {
                  const isSelected = selectedLightPeriod === period.id
                  const isDisabled = fuzzyTimeMode
                  
                  return (
                    <button
                      key={period.id}
                      onClick={() => !isDisabled && setSelectedLightPeriod(period.id)}
                      disabled={isDisabled}
                      className={`
                        relative overflow-hidden rounded-2xl px-4 py-5
                        border-2 transition-all duration-500
                        ${isDisabled 
                          ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/10'
                          : isSelected 
                            ? 'shadow-lg scale-[1.02]' 
                            : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20 hover:scale-[1.01]'
                        }
                        flex flex-col items-center gap-2
                      `}
                      style={
                        !isDisabled && isSelected
                          ? { 
                              background: period.atmosphereGradient,
                              borderColor: period.selectedBorder,
                              boxShadow: `0 0 25px ${period.glowColor}, inset 0 0 20px ${period.glowColor}`,
                            }
                          : !isDisabled
                            ? { background: period.atmosphereGradient }
                            : {}
                      }
                    >
                      {/* 底部光刃效果 - 选中时 */}
                      {isSelected && !isDisabled && (
                        <div 
                          className="absolute bottom-0 left-0 right-0 h-1 animate-fade-in-up"
                          style={{
                            background: `linear-gradient(to right, transparent, ${period.selectedBorder}, transparent)`,
                            boxShadow: `0 0 15px ${period.glowColor}`,
                          }}
                        />
                      )}
                      
                      {/* 选中勾 */}
                      {isSelected && !isDisabled && (
                        <div 
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center animate-scale-in"
                          style={{ backgroundColor: period.selectedBorder }}
                        >
                          <Check className="w-3 h-3 text-black font-bold" />
                        </div>
                      )}
                      
                      {/* 图标 - 纯白发光 */}
                      <span 
                        className={`text-3xl transition-all duration-500 ${isSelected ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}`}
                        style={isSelected ? { filter: 'brightness(1.3)' } : {}}
                      >
                        {period.icon}
                      </span>
                      
                      {/* 文字 */}
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-sm font-medium ${isSelected ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/90'}`}>
                          {period.label}
                        </span>
                        <span className={`text-xs font-mono ${isSelected ? 'text-white/80' : 'text-white/60'}`}>
                          {period.time}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* AI 智能分析 - 升级版（毛玻璃增强） */}
              {selectedLightPeriod && !fuzzyTimeMode && (
                <div className="relative flex items-start gap-3 p-4 rounded-xl animate-fade-in-up overflow-hidden">
                  {/* 背景层 - 增强毛玻璃效果 */}
                  <div 
                    className="absolute inset-0 bg-[var(--holo-blue)]/5 backdrop-blur-lg border border-[var(--holo-blue)]/25 rounded-xl"
                    style={{
                      backdropFilter: 'blur(12px) saturate(180%)',
                    }}
                  />
                  
                  {/* 发光 AI 图标 */}
                  <div 
                    className="relative flex-shrink-0 w-8 h-8 rounded-full bg-[var(--holo-blue)]/20 flex items-center justify-center animate-pulse"
                    style={{ boxShadow: '0 0 15px rgba(45, 225, 252, 0.4)' }}
                  >
                    <span className="text-lg">🤖</span>
                  </div>
                  
                  {/* 打字机效果文字 */}
                  <p className="relative text-sm text-white/90 leading-relaxed flex-1 animate-typewriter">
                    {LIGHT_PERIODS.find(p => p.id === selectedLightPeriod)?.aiInsight}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 时空定位器（条件展开 - 更早/自定义） */}
          {needsCustomTime && (
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-base md:text-lg font-bold text-white/90">时空定位器</h2>
              
              {/* 第一行：日期与时间输入 */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* 日期选择按钮 */}
                <div className="flex-1 relative">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-xl text-sm font-medium font-mono
                      bg-black/30 border border-white/10
                      transition-all duration-300
                      cursor-pointer
                      ${customDate 
                        ? 'text-white shadow-[0_0_15px_rgba(45,225,252,0.2)]' 
                        : 'text-white/60'
                      }
                      focus:outline-none focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20
                    `}
                    style={{
                      colorScheme: 'dark',
                    }}
                  />
                </div>

                {/* 时间选择按钮 */}
                <div className="flex-1 relative">
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-xl text-sm font-medium font-mono
                      bg-black/30 border border-white/10
                      transition-all duration-300
                      cursor-pointer
                      ${customTime 
                        ? 'text-white shadow-[0_0_15px_rgba(45,225,252,0.2)]' 
                        : 'text-white/60'
                      }
                      focus:outline-none focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20
                    `}
                    style={{
                      colorScheme: 'dark',
                    }}
                  />
                </div>
              </div>

              {/* 第二行：置信度开关（逻辑修复） */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-white">我对具体时间点不确定</span>
                  <span className="text-xs text-white/60">
                    {isTimeUncertain 
                      ? '💭 没关系，我们将分析全天的光线变化与行为模式' 
                      : '🎯 已锁定时间点，AI将分析该时间后方3小时内的路径'}
                  </span>
                </div>
                <button
                  onClick={() => setIsTimeUncertain(!isTimeUncertain)}
                  className={`
                    relative w-14 h-7 rounded-full transition-all duration-300
                    ${isTimeUncertain 
                      ? 'bg-[var(--cyber-green)]' 
                      : 'bg-white/20'}
                  `}
                >
                  <div 
                    className={`
                      absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg
                      transition-all duration-300
                      ${isTimeUncertain ? 'left-8' : 'left-1'}
                    `}
                  />
                </button>
              </div>

              {/* 智能提示（毛玻璃增强） */}
              {customDate && (
                <div className="relative flex items-start gap-3 p-4 rounded-xl animate-fade-in-up delay-200 overflow-hidden">
                  {/* 背景层 - 增强毛玻璃效果 */}
                  <div 
                    className="absolute inset-0 bg-[var(--holo-blue)]/5 backdrop-blur-lg border border-[var(--holo-blue)]/25 rounded-xl"
                    style={{
                      backdropFilter: 'blur(12px) saturate(180%)',
                    }}
                  />
                  
                  {/* 发光图标 */}
                  <div 
                    className="relative flex-shrink-0 w-8 h-8 rounded-full bg-[var(--holo-blue)]/20 flex items-center justify-center"
                    style={{ boxShadow: '0 0 15px rgba(45, 225, 252, 0.4)' }}
                  >
                    <span className="text-lg">🤖</span>
                  </div>
                  
                  {/* 文字 */}
                  <p className="relative text-sm text-white/90 leading-relaxed flex-1">
                    <span className="font-medium">时空分析：</span>
                    {customTime 
                      ? `基于 ${customDate} ${customTime}，${isTimeUncertain ? 'AI将分析全天的光线变化和行为轨迹' : 'AI将重点排查该时间点后3小时内的视觉盲区'}` 
                      : `基于 ${customDate}，AI将分析全天的光线变化和行为模式`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI 模式切换器 - 升级版 */}
          {needsLightDetail && (
            <div className="relative overflow-hidden rounded-xl animate-fade-in-up">
              {/* 控制台背景层 */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-800/50 to-slate-900/60 backdrop-blur-md border border-[var(--holo-blue)]/40 rounded-xl"
              />
              
              {/* 底部光刃效果 */}
              <div 
                className={`
                  absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500
                  ${fuzzyTimeMode 
                    ? 'bg-gradient-to-r from-transparent via-[var(--cyber-green)] to-transparent opacity-80' 
                    : 'bg-gradient-to-r from-transparent via-[var(--holo-blue)]/30 to-transparent opacity-40'
                  }
                `}
              />
              
              {/* 内容区 */}
              <div className="relative flex items-center justify-between p-5">
                <div className="flex items-start gap-3 flex-1">
                  {/* 模式图标 */}
                  <div 
                    className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      transition-all duration-500
                      ${fuzzyTimeMode 
                        ? 'bg-[var(--cyber-green)]/20 text-[var(--cyber-green)]' 
                        : 'bg-[var(--holo-blue)]/20 text-[var(--holo-blue)]'
                      }
                    `}
                    style={{
                      boxShadow: fuzzyTimeMode 
                        ? '0 0 20px rgba(0, 255, 157, 0.3)' 
                        : '0 0 15px rgba(45, 225, 252, 0.2)'
                    }}
                  >
                    <span className="text-xl">{fuzzyTimeMode ? '📡' : '🔒'}</span>
                  </div>
                  
                  {/* 文字说明 */}
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">
                      {fuzzyTimeMode ? '广域搜索模式' : '精确锁定模式'}
                    </span>
                    <span className="text-xs text-white/70 leading-relaxed">
                      {fuzzyTimeMode 
                        ? 'AI 将自动排查前后相邻时段（±3小时）' 
                        : 'AI 仅分析选中的时段'}
                    </span>
                  </div>
                </div>
                
                {/* 开关按钮 */}
                <button
                  onClick={() => {
                    setFuzzyTimeMode(!fuzzyTimeMode)
                    if (!fuzzyTimeMode) {
                      setSelectedLightPeriod('') // 开启模糊模式时清除选择
                    }
                  }}
                  className={`
                    relative w-14 h-7 rounded-full transition-all duration-500 flex-shrink-0
                    ${fuzzyTimeMode 
                      ? 'bg-[var(--cyber-green)] shadow-[0_0_20px_rgba(0,255,157,0.5)]' 
                      : 'bg-white/20 hover:bg-white/30'}
                  `}
                >
                  <div 
                    className={`
                      absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg
                      transition-all duration-500
                      ${fuzzyTimeMode ? 'left-8' : 'left-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          )}

          {/* 底部按钮区 - 居中全胶囊 */}
          <div className="flex flex-col items-center gap-4 pt-6">
            {/* 主按钮容器 - 带hover提示 */}
            <div className="relative group/btn">
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="btn-scifi-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                继续下一步
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* 缺少必填项提示 - 仅在禁用时显示 */}
              {!canProceed && getMissingRequirement() && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-all duration-300 pointer-events-none z-50">
                  <div className="px-4 py-2 bg-gradient-to-r from-amber-500/95 to-orange-500/95 text-white text-sm font-medium rounded-xl whitespace-nowrap shadow-[0_4px_20px_rgba(245,158,11,0.4)] backdrop-blur-sm border border-amber-400/30">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {getMissingRequirement()}
                    </span>
                    {/* 箭头指向按钮 */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-amber-500/95 to-orange-500/95 rotate-45 border-r border-b border-amber-400/30" />
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-xs text-muted-foreground hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一步
            </Button>
          </div>

        </div>
      </main>
    </div>
  )
}
