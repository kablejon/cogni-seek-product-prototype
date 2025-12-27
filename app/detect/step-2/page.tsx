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

// 光线/时段选择（微观）
const LIGHT_PERIODS = [
  { 
    id: 'dawn_morning', 
    label: '凌晨/上午', 
    time: '06:00-11:00',
    icon: '🌅',
    bgColor: 'rgba(255, 200, 100, 0.1)', // 暖橙色
    borderColor: 'rgba(255, 200, 100, 0.3)',
    lightCondition: '光线明亮',
  },
  { 
    id: 'noon_afternoon', 
    label: '中午/下午', 
    time: '11:00-17:00',
    icon: '☀️',
    bgColor: 'rgba(255, 220, 120, 0.15)', // 强烈阳光
    borderColor: 'rgba(255, 220, 120, 0.4)',
    lightCondition: '光线最强',
  },
  { 
    id: 'dusk', 
    label: '黄昏/傍晚', 
    time: '17:00-19:00',
    icon: '🌇',
    bgColor: 'rgba(255, 150, 80, 0.1)', // 夕阳橙
    borderColor: 'rgba(255, 150, 80, 0.3)',
    lightCondition: '光线柔和',
  },
  { 
    id: 'night', 
    label: '晚上/深夜', 
    time: '19:00-06:00',
    icon: '🌑',
    bgColor: 'rgba(30, 64, 175, 0.15)', // 深蓝色
    borderColor: 'rgba(30, 64, 175, 0.4)',
    lightCondition: '光线昏暗',
  },
]

export default function Step2Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedMacroTime, setSelectedMacroTime] = useState<string>('')
  const [selectedLightPeriod, setSelectedLightPeriod] = useState<string>('')
  const [isTimeUncertain, setIsTimeUncertain] = useState(false) // 改为"不确定"开关
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
    (needsCustomTime && customDate) // 更早 + 日期（时间可选）
  )

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
    } else if (selectedLightPeriod) {
      // 今天/昨天 + 光线模式
      const macroLabel = selectedMacroConfig?.label || ''
      const lightConfig = LIGHT_PERIODS.find(p => p.id === selectedLightPeriod)
      timeDescription = `${macroLabel} ${lightConfig?.label || ''}`
      lightContext = lightConfig?.lightCondition || ''
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

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* 星空背景 - 固定定位 */}
      <div className="fixed inset-0 z-0">
        <InteractiveFog particleCount={100} color="56, 189, 248" />
      </div>

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

          {/* 光线/时段选择（条件展开 - 今天/昨天） */}
          {needsLightDetail && (
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-base md:text-lg font-bold text-white/90">
                当时的光线/时段是？
              </h2>
              <div className="flex flex-wrap gap-3">
                {LIGHT_PERIODS.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedLightPeriod(period.id)}
                    className={`
                      px-5 py-3 rounded-full text-sm font-medium
                      border transition-all duration-300
                      ${selectedLightPeriod === period.id 
                        ? 'border-[var(--holo-blue)] text-white shadow-[0_0_20px_rgba(45,225,252,0.3)]' 
                        : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40'
                      }
                      flex items-center gap-2
                    `}
                    style={
                      selectedLightPeriod === period.id
                        ? { backgroundColor: period.bgColor, borderColor: period.borderColor }
                        : {}
                    }
                  >
                    {selectedLightPeriod === period.id && <Check className="w-3.5 h-3.5" />}
                    <span className="text-base">{period.icon}</span>
                    <div className="flex flex-col items-start">
                      <span>{period.label}</span>
                      <span className="text-xs opacity-60 font-mono">{period.time}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* 光线提示 */}
              {selectedLightPeriod && (
                <div className="p-4 rounded-xl bg-[var(--holo-blue)]/5 border border-[var(--holo-blue)]/20 animate-fade-in-up delay-200">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    💡 <span className="text-white">光线分析：</span>
                    {LIGHT_PERIODS.find(p => p.id === selectedLightPeriod)?.lightCondition}
                    {selectedLightPeriod === 'night' && ' - AI将重点排查阴影处、角落等低光区域'}
                    {selectedLightPeriod === 'noon_afternoon' && ' - AI将优先排查视野开阔区域'}
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

              {/* 智能提示 */}
              {customDate && (
                <div className="p-4 rounded-xl bg-[var(--holo-blue)]/5 border border-[var(--holo-blue)]/20 animate-fade-in-up delay-200">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    💡 <span className="text-white">时空分析：</span>
                    {customTime 
                      ? `基于 ${customDate} ${customTime}，${isTimeUncertain ? 'AI将分析全天的光线变化和行为轨迹' : 'AI将重点排查该时间点后3小时内的视觉盲区'}` 
                      : `基于 ${customDate}，AI将分析全天的光线变化和行为模式`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 底部按钮区 - 居中全胶囊 */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="btn-scifi-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              继续下一步
              <ChevronRight className="w-5 h-5" />
            </button>
            
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
