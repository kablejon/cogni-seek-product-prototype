"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Brain, Check, Radio } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 形容词标签 - 心理状态（去Emoji）
const MOOD_TAGS = [
  { id: 'calm', label: '冷静', desc: '正常状态' },
  { id: 'rushed', label: '匆忙', desc: '赶时间' },
  { id: 'anxious', label: '焦急', desc: '紧张不安' },
  { id: 'tired', label: '疲惫', desc: '累了想休息' },
  { id: 'excited', label: '兴奋', desc: '激动开心' },
  { id: 'distracted', label: '分心', desc: '注意力不集中' },
]

// 活动标签
const ACTIVITY_TAGS = [
  { id: 'working', label: '工作中' },
  { id: 'commuting', label: '通勤中' },
  { id: 'shopping', label: '购物' },
  { id: 'eating', label: '用餐' },
  { id: 'exercising', label: '运动' },
  { id: 'socializing', label: '社交' },
  { id: 'relaxing', label: '休闲' },
  { id: 'cleaning', label: '整理' },
]

// 注意力干扰选项
const ATTENTION_DISTRACTIONS = [
  { id: 'phone_call', label: '在打电话' },
  { id: 'chatting', label: '在聊天' },
  { id: 'looking_phone', label: '在看手机' },
  { id: 'thinking', label: '在想事情' },
  { id: 'multitasking', label: '在做多件事' },
]

export default function Step4Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedMood, setSelectedMood] = useState<string>(session.mood || '')
  const [selectedActivity, setSelectedActivity] = useState<string>(session.specificActivity || '')
  const [selectedDistractions, setSelectedDistractions] = useState<string[]>(
    session.wasDistracted ? ['general'] : []
  )

  const handleDistractionToggle = (id: string) => {
    if (selectedDistractions.includes(id)) {
      setSelectedDistractions(selectedDistractions.filter(d => d !== id))
    } else {
      setSelectedDistractions([...selectedDistractions, id])
    }
  }

  const handleNext = () => {
    if (!selectedMood) {
      alert('请选择当时的心理状态')
      return
    }
    if (!selectedActivity) {
      alert('请选择当时的活动')
      return
    }

    updateSession({
      mood: selectedMood,
      moodCustom: '',
      specificActivity: selectedActivity,
      activityCustom: '',
      activityCategory: 'general',
      wasDistracted: selectedDistractions.length > 0,
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
        <div className="w-full max-w-4xl mx-auto scifi-container p-6 md:p-10 space-y-10">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">状态还原</h1>
            <p className="text-base md:text-lg text-white/70">
              回想<span className="text-[var(--cyber-green)] font-semibold">当时的心理状态</span>和<span className="text-[var(--cyber-green)] font-semibold">行为模式</span>
            </p>
          </div>

          {/* 心理状态 - 形容词标签（加脉冲波纹） */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Radio className="w-4 h-4" style={{ color: 'var(--holo-blue)' }} />
                <div className="absolute inset-0 animate-pulse-wave" style={{ borderRadius: '50%' }} />
              </div>
              <h2 className="font-bold text-base">1. 当时的心理状态</h2>
              <span className="text-destructive">*</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MOOD_TAGS.map((mood) => {
                const isSelected = selectedMood === mood.id
                
                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`card-option ${isSelected ? 'card-option-selected' : ''} relative`}
                  >
                    {isSelected && (
                      <div className="check-glow">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}

                    <div className="text-center py-2">
                      <div className="font-bold text-sm mb-1">{mood.label}</div>
                      <div className="text-xs text-muted-foreground">{mood.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 活动状态 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Radio className="w-4 h-4" style={{ color: 'var(--holo-blue)' }} />
                <div className="absolute inset-0 animate-pulse-wave" style={{ borderRadius: '50%' }} />
              </div>
              <h2 className="font-bold text-base">2. 当时在做什么</h2>
              <span className="text-destructive">*</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TAGS.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity.id)}
                  className={`chip ${selectedActivity === activity.id ? 'chip-selected' : ''}`}
                >
                  {selectedActivity === activity.id && <Check className="w-3 h-3" />}
                  {activity.label}
                </button>
              ))}
            </div>
          </div>

          {/* 注意力状态 - 核心新功能 */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-chart-3/10 to-orange-500/10 border-2 border-chart-3/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0 mt-0.5">
                  <Radio className="w-4 h-4 text-chart-3" />
                  <div className="absolute inset-0 animate-pulse-wave" style={{ borderRadius: '50%' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1">3. 注意力状态 <span className="text-xs font-normal text-muted-foreground">(选填但重要)</span></h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    💡 这是心理学寻物的核心依据："非注意盲视"会导致物品被遗忘在意想不到的地方
                  </p>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">当时是否分心？（可多选）</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {ATTENTION_DISTRACTIONS.map((distraction) => {
                        const isSelected = selectedDistractions.includes(distraction.id)
                        return (
                          <button
                            key={distraction.id}
                            onClick={() => handleDistractionToggle(distraction.id)}
                            className={`chip ${isSelected ? 'chip-selected' : ''}`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {distraction.label}
                          </button>
                        )
                      })}
                    </div>

                    {selectedDistractions.length > 0 && (
                      <div className="p-3 rounded-xl bg-chart-3/10 border border-chart-3/20">
                        <p className="text-xs text-center">
                          <span className="font-bold text-chart-3">分心状态已记录</span>
                          <span className="text-muted-foreground ml-2">
                            AI 会重点分析"自动驾驶"行为和视觉盲区
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              onClick={handleNext}
              disabled={!selectedMood || !selectedActivity}
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
