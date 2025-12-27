"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Brain, Check, Radio, Plus, Wine, Zap, Moon, Smile, Angry, HelpCircle, AlertTriangle } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 心理状态选项（8个+自定义）
const MOOD_OPTIONS = [
  { id: 'anxious', label: '焦虑/急忙', desc: '隧道视野', icon: '⚡', color: 'rgb(239, 68, 68)' },
  { id: 'drowsy', label: '困倦', desc: '警觉度低', icon: '😴', color: 'rgb(148, 163, 184)' },
  { id: 'excited', label: '兴奋/激动', desc: '多巴胺峰值', icon: '🎉', color: 'rgb(251, 191, 36)' },
  { id: 'calm', label: '平静/正常', desc: '正常基线', icon: '😌', color: 'rgb(34, 197, 94)' },
  { id: 'tipsy', label: '微醺/醉酒', desc: '判断力下降', icon: '🍷', color: 'rgb(168, 85, 247)' },
  { id: 'angry', label: '愤怒/生气', desc: '动作幅度大', icon: '😤', color: 'rgb(249, 115, 22)' },
  { id: 'confused', label: '困惑/迷茫', desc: '认知负荷高', icon: '🤔', color: 'rgb(59, 130, 246)' },
]

// 身体动作选项（多选）
const ACTIVITY_OPTIONS = [
  { id: 'walking', label: '行走中', icon: '🚶' },
  { id: 'sitting', label: '坐着休息', icon: '🪑' },
  { id: 'carrying', label: '手持重物/拿快递', icon: '📦' },
  { id: 'phone_call', label: '打电话', icon: '📱' },
  { id: 'cleaning', label: '整理卫生', icon: '🧹' },
  { id: 'changing', label: '试穿/换装', icon: '👗' },
  { id: 'driving', label: '驾驶/骑行', icon: '🚗' },
  { id: 'eating', label: '进餐', icon: '🍽' },
  { id: 'photo', label: '拍照', icon: '📸' },
]

// 干扰源选项
const DISTRACTION_OPTIONS = [
  { id: 'notification', label: '突发消息/电话', icon: '🔔' },
  { id: 'talking', label: '与人激烈交谈', icon: '🗣' },
  { id: 'caring', label: '照看孩子/宠物', icon: '👶' },
  { id: 'daydream', label: '沉思/走神', icon: '🧠' },
]

export default function Step4Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  // 心理状态
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [showMoodCustom, setShowMoodCustom] = useState(false)
  const [moodCustomText, setMoodCustomText] = useState('')
  
  // 身体动作（多选）
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [showActivityCustom, setShowActivityCustom] = useState(false)
  const [activityCustomText, setActivityCustomText] = useState('')
  const [customActivities, setCustomActivities] = useState<string[]>([])
  
  // 注意力干扰
  const [isDistracted, setIsDistracted] = useState(false)
  const [selectedDistractions, setSelectedDistractions] = useState<string[]>([])
  const [showDistractionCustom, setShowDistractionCustom] = useState(false)
  const [distractionCustomText, setDistractionCustomText] = useState('')
  const [customDistractions, setCustomDistractions] = useState<string[]>([])

  // 切换活动选择（多选）
  const toggleActivity = (id: string) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter(a => a !== id))
    } else {
      setSelectedActivities([...selectedActivities, id])
    }
  }

  // 切换干扰源选择（多选）
  const toggleDistraction = (id: string) => {
    if (selectedDistractions.includes(id)) {
      setSelectedDistractions(selectedDistractions.filter(d => d !== id))
    } else {
      setSelectedDistractions([...selectedDistractions, id])
    }
  }

  // 添加自定义活动
  const addCustomActivity = () => {
    if (activityCustomText.trim()) {
      setCustomActivities([...customActivities, activityCustomText.trim()])
      setSelectedActivities([...selectedActivities, `custom_${activityCustomText.trim()}`])
      setActivityCustomText('')
      setShowActivityCustom(false)
    }
  }

  // 添加自定义干扰
  const addCustomDistraction = () => {
    if (distractionCustomText.trim()) {
      setCustomDistractions([...customDistractions, distractionCustomText.trim()])
      setSelectedDistractions([...selectedDistractions, `custom_${distractionCustomText.trim()}`])
      setDistractionCustomText('')
      setShowDistractionCustom(false)
    }
  }

  // 验证是否可以继续
  const canProceed = selectedMood && selectedActivities.length > 0

  const handleNext = () => {
    if (!canProceed) return

    updateSession({
      mood: selectedMood,
      moodCustom: selectedMood === 'custom' ? moodCustomText : '',
      specificActivity: selectedActivities.join(','),
      activityCustom: customActivities.join(','),
      activityCategory: 'general',
      wasDistracted: isDistracted && selectedDistractions.length > 0,
      otherPeoplePresent: false,
    })

    router.push('/detect/step-5')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="fixed inset-0 z-0">
        <InteractiveFog color="8, 145, 178" />
      </div>
      
      <Header currentStep={5} showProgress />

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-5xl mx-auto scifi-container p-6 md:p-10 space-y-8">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">状态还原</h1>
            <p className="text-base md:text-lg text-white/70">
              回想<span className="text-[var(--cyber-green)] font-semibold">当时的心理状态</span>和<span className="text-[var(--cyber-green)] font-semibold">行为模式</span>
            </p>
          </div>

          {/* ============ 第一板块：心理能量场 ============ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Brain className="w-5 h-5" style={{ color: 'var(--holo-blue)' }} />
                <div className="absolute inset-0 animate-pulse-wave rounded-full" />
              </div>
              <h2 className="font-bold text-base md:text-lg">1. 心理能量场</h2>
              <span className="text-xs text-white/50">决定视野宽度</span>
              <span className="text-destructive ml-1">*</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood === mood.id
                
                return (
                  <button
                    key={mood.id}
                    onClick={() => {
                      setSelectedMood(mood.id)
                      setShowMoodCustom(false)
                    }}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-300
                      ${isSelected 
                        ? 'border-[var(--holo-blue)] bg-[var(--holo-blue)]/10 shadow-[0_0_25px_rgba(45,225,252,0.3)]' 
                        : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                      }
                    `}
                    style={isSelected ? { boxShadow: `0 0 30px ${mood.color}40` } : {}}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--cyber-green)] flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 text-black" />
                      </div>
                    )}

                    <div className="text-center space-y-1">
                      <div className="text-2xl mb-2">{mood.icon}</div>
                      <div className="font-bold text-sm">{mood.label}</div>
                      <div className="text-xs text-white/50">{mood.desc}</div>
                    </div>
                  </button>
                )
              })}

              {/* 自定义心理状态 */}
              {!showMoodCustom ? (
                <button
                  onClick={() => {
                    setShowMoodCustom(true)
                    setSelectedMood('custom')
                  }}
                  className={`
                    relative p-4 rounded-xl border-2 border-dashed transition-all duration-300
                    ${selectedMood === 'custom' && moodCustomText
                      ? 'border-[var(--holo-blue)] bg-[var(--holo-blue)]/10' 
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                    }
                  `}
                >
                  <div className="text-center space-y-1">
                    <div className="text-2xl mb-2">➕</div>
                    <div className="font-bold text-sm">其他状态</div>
                    <div className="text-xs text-white/50">自定义输入</div>
                  </div>
                </button>
              ) : (
                <div className="relative p-3 rounded-xl border-2 border-[var(--holo-blue)] bg-[var(--holo-blue)]/10 shadow-[0_0_20px_rgba(45,225,252,0.3)]">
                  <input
                    type="text"
                    value={moodCustomText}
                    onChange={(e) => setMoodCustomText(e.target.value)}
                    placeholder="输入你的状态..."
                    autoFocus
                    className="w-full bg-transparent border-none text-sm text-center focus:outline-none placeholder:text-white/40"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && moodCustomText.trim()) {
                        setShowMoodCustom(false)
                      }
                      if (e.key === 'Escape') {
                        setShowMoodCustom(false)
                        setMoodCustomText('')
                        setSelectedMood('')
                      }
                    }}
                    onBlur={() => {
                      if (!moodCustomText.trim()) {
                        setShowMoodCustom(false)
                        setSelectedMood('')
                      }
                    }}
                  />
                  <div className="text-xs text-white/50 text-center mt-2">回车确认</div>
                </div>
              )}
            </div>
          </div>

          {/* ============ 第二板块：身体动态流 ============ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Radio className="w-5 h-5" style={{ color: 'var(--holo-blue)' }} />
                <div className="absolute inset-0 animate-pulse-wave rounded-full" />
              </div>
              <h2 className="font-bold text-base md:text-lg">2. 身体动态流</h2>
              <span className="text-xs text-white/50">决定手在哪里（可多选）</span>
              <span className="text-destructive ml-1">*</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {ACTIVITY_OPTIONS.map((activity) => {
                const isSelected = selectedActivities.includes(activity.id)
                return (
                  <button
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`
                      px-4 py-2.5 rounded-full text-sm font-medium
                      border transition-all duration-300 flex items-center gap-2
                      ${isSelected 
                        ? 'bg-[var(--holo-blue)]/20 border-[var(--holo-blue)] text-white shadow-[0_0_15px_rgba(45,225,252,0.3)]' 
                        : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40'
                      }
                    `}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{activity.icon}</span>
                    <span>{activity.label}</span>
                  </button>
                )
              })}

              {/* 已添加的自定义活动 */}
              {customActivities.map((custom, idx) => (
                <button
                  key={`custom_${custom}`}
                  onClick={() => {
                    setCustomActivities(customActivities.filter((_, i) => i !== idx))
                    setSelectedActivities(selectedActivities.filter(a => a !== `custom_${custom}`))
                  }}
                  className="px-4 py-2.5 rounded-full text-sm font-medium bg-[var(--cyber-green)]/20 border border-[var(--cyber-green)] text-white shadow-[0_0_15px_rgba(0,255,157,0.3)] flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>✨</span>
                  <span>{custom}</span>
                </button>
              ))}

              {/* 自定义活动输入 */}
              {!showActivityCustom ? (
                <button
                  onClick={() => setShowActivityCustom(true)}
                  className="px-4 py-2.5 rounded-full text-sm font-medium border-2 border-dashed border-white/20 text-white/60 hover:border-white/40 hover:text-white/80 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>其他动作</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={activityCustomText}
                    onChange={(e) => setActivityCustomText(e.target.value)}
                    placeholder="输入动作..."
                    autoFocus
                    className="px-4 py-2 rounded-full text-sm bg-[var(--holo-blue)]/10 border-2 border-[var(--holo-blue)] focus:outline-none w-32"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addCustomActivity()
                      if (e.key === 'Escape') {
                        setShowActivityCustom(false)
                        setActivityCustomText('')
                      }
                    }}
                  />
                  <button
                    onClick={addCustomActivity}
                    className="p-2 rounded-full bg-[var(--cyber-green)] text-black"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ============ 第三板块：注意力干扰源 ============ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <AlertTriangle className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)' }} />
                <div className="absolute inset-0 animate-pulse-wave rounded-full" />
              </div>
              <h2 className="font-bold text-base md:text-lg">3. 注意力干扰源</h2>
              <span className="text-xs text-white/50">决定记忆断片原因</span>
            </div>

            {/* 分心开关 */}
            <div 
              className={`
                p-4 rounded-xl border-2 transition-all duration-500
                ${isDistracted 
                  ? 'bg-amber-500/10 border-amber-500/50' 
                  : 'bg-white/5 border-white/10'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{isDistracted ? '🔴' : '⚪'}</span>
                  <div>
                    <div className="font-medium">我当时分心了</div>
                    <div className="text-xs text-white/50">
                      {isDistracted ? '已开启干扰分析模式' : '点击开启以记录干扰因素'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsDistracted(!isDistracted)
                    if (!isDistracted) {
                      setSelectedDistractions([])
                    }
                  }}
                  className={`
                    relative w-14 h-7 rounded-full transition-all duration-300
                    ${isDistracted ? 'bg-amber-500' : 'bg-white/20'}
                  `}
                >
                  <div 
                    className={`
                      absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg
                      transition-all duration-300
                      ${isDistracted ? 'left-8' : 'left-1'}
                    `}
                  />
                </button>
              </div>

              {/* 干扰源选项（展开） */}
              {isDistracted && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in-up">
                  <p className="text-sm text-white/70">具体是什么干扰了你？（可多选）</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {DISTRACTION_OPTIONS.map((distraction) => {
                      const isSelected = selectedDistractions.includes(distraction.id)
                      return (
                        <button
                          key={distraction.id}
                          onClick={() => toggleDistraction(distraction.id)}
                          className={`
                            px-4 py-2.5 rounded-full text-sm font-medium
                            border transition-all duration-300 flex items-center gap-2
                            ${isSelected 
                              ? 'bg-amber-500/20 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                              : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40'
                            }
                          `}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{distraction.icon}</span>
                          <span>{distraction.label}</span>
                        </button>
                      )
                    })}

                    {/* 已添加的自定义干扰 */}
                    {customDistractions.map((custom, idx) => (
                      <button
                        key={`custom_${custom}`}
                        onClick={() => {
                          setCustomDistractions(customDistractions.filter((_, i) => i !== idx))
                          setSelectedDistractions(selectedDistractions.filter(d => d !== `custom_${custom}`))
                        }}
                        className="px-4 py-2.5 rounded-full text-sm font-medium bg-amber-500/20 border border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>✨</span>
                        <span>{custom}</span>
                      </button>
                    ))}

                    {/* 自定义干扰输入 */}
                    {!showDistractionCustom ? (
                      <button
                        onClick={() => setShowDistractionCustom(true)}
                        className="px-4 py-2.5 rounded-full text-sm font-medium border-2 border-dashed border-white/20 text-white/60 hover:border-amber-500/50 hover:text-white/80 transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>其他干扰</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={distractionCustomText}
                          onChange={(e) => setDistractionCustomText(e.target.value)}
                          placeholder="输入干扰..."
                          autoFocus
                          className="px-4 py-2 rounded-full text-sm bg-amber-500/10 border-2 border-amber-500 focus:outline-none w-32"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addCustomDistraction()
                            if (e.key === 'Escape') {
                              setShowDistractionCustom(false)
                              setDistractionCustomText('')
                            }
                          }}
                        />
                        <button
                          onClick={addCustomDistraction}
                          className="p-2 rounded-full bg-amber-500 text-black"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 分心提示 */}
                  {selectedDistractions.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 animate-fade-in-up">
                      <p className="text-xs text-center">
                        <span className="font-bold text-amber-400">⚠️ 干扰因素已记录</span>
                        <span className="text-white/60 ml-2">
                          AI 将重点分析"自动驾驶"行为模式和无意识放置区域
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 底部按钮 */}
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
