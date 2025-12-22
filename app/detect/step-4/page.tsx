"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Brain, Check, AlertCircle } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 形容词标签 - 心理状态
const MOOD_TAGS = [
  { id: 'calm', label: '冷静', desc: '正常状态', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'rushed', label: '匆忙', desc: '赶时间', color: 'from-orange-500/20 to-yellow-500/20' },
  { id: 'anxious', label: '焦急', desc: '紧张不安', color: 'from-red-500/20 to-orange-500/20' },
  { id: 'tired', label: '疲惫', desc: '累了想休息', color: 'from-purple-500/20 to-indigo-500/20' },
  { id: 'excited', label: '兴奋', desc: '激动开心', color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'distracted', label: '分心', desc: '注意力不集中', color: 'from-gray-500/20 to-slate-500/20' },
]

// 活动标签
const ACTIVITY_TAGS = [
  { id: 'working', label: '工作中', desc: '专注做事' },
  { id: 'commuting', label: '通勤中', desc: '路上移动' },
  { id: 'shopping', label: '购物', desc: '逛街买东西' },
  { id: 'eating', label: '用餐', desc: '吃饭喝东西' },
  { id: 'exercising', label: '运动', desc: '健身活动' },
  { id: 'socializing', label: '社交', desc: '见朋友聚会' },
  { id: 'relaxing', label: '休闲', desc: '放松娱乐' },
  { id: 'cleaning', label: '整理', desc: '打扫收拾' },
]

// 注意力干扰选项
const ATTENTION_DISTRACTIONS = [
  { id: 'phone_call', label: '在打电话', icon: '📞' },
  { id: 'chatting', label: '在聊天', icon: '💬' },
  { id: 'looking_phone', label: '在看手机', icon: '📱' },
  { id: 'thinking', label: '在想事情', icon: '💭' },
  { id: 'multitasking', label: '在做多件事', icon: '⚡' },
]

export default function Step4Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedMood, setSelectedMood] = useState<string>(session.mood || '')
  const [selectedActivity, setSelectedActivity] = useState<string>(session.specificActivity || '')
  const [selectedDistractions, setSelectedDistractions] = useState<string[]>(
    session.wasDistracted ? ['general'] : []
  )
  const [customActivity, setCustomActivity] = useState(session.activityCustom || '')
  const [customMood, setCustomMood] = useState(session.moodCustom || '')

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
      moodCustom: customMood,
      specificActivity: selectedActivity,
      activityCustom: customActivity,
      activityCategory: 'general',
      wasDistracted: selectedDistractions.length > 0,
      otherPeoplePresent: false,
    })

    router.push('/detect/step-5')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <InteractiveFog color="8, 145, 178" />
      </div>
      
      <Header currentStep={4} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Step 4 of 5</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">状态还原</h1>
            <p className="text-muted-foreground text-lg">
              回想<span className="text-primary font-semibold">当时的心理状态</span>和<span className="text-primary font-semibold">行为模式</span>
            </p>
          </div>

          {/* 心理状态 - 形容词标签 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">1. 当时的心理状态</h2>
              <span className="text-destructive">*</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MOOD_TAGS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedMood === mood.id
                      ? 'border-primary bg-primary/10 shadow-lg scale-105'
                      : 'border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card'
                  }`}
                >
                  {selectedMood === mood.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}

                  <div className="text-center">
                    <div className="font-bold text-base mb-1">{mood.label}</div>
                    <div className="text-xs text-muted-foreground">{mood.desc}</div>
                  </div>

                  {/* 渐变装饰 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} rounded-xl opacity-0 transition-opacity duration-300 ${
                    selectedMood === mood.id ? 'opacity-100' : ''
                  }`} style={{ zIndex: -1 }} />
                </button>
              ))}
            </div>

            {/* 自定义心情 */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">或者用自己的话描述（选填）</label>
              <input
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                placeholder="例如：很放松、有点烦躁、心不在焉..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* 活动状态 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">2. 当时在做什么</h2>
              <span className="text-destructive">*</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ACTIVITY_TAGS.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedActivity === activity.id
                      ? 'border-primary bg-primary/10 shadow-md scale-105'
                      : 'border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm mb-1">{activity.label}</div>
                    <div className="text-xs text-muted-foreground">{activity.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* 自定义活动 */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">或者自定义活动（选填）</label>
              <input
                type="text"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                placeholder="例如：搬家、装修、开会..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* 注意力状态 - 核心新功能 */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-chart-3/10 to-orange-500/10 border-2 border-chart-3/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">3. 注意力状态 <span className="text-xs font-normal text-muted-foreground">(选填但重要)</span></h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    💡 这是心理学寻物的核心依据："非注意盲视"会导致物品被遗忘在意想不到的地方
                  </p>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">当时是否分心？（可多选）</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ATTENTION_DISTRACTIONS.map((distraction) => {
                        const isSelected = selectedDistractions.includes(distraction.id)
                        return (
                          <button
                            key={distraction.id}
                            onClick={() => handleDistractionToggle(distraction.id)}
                            className={`p-3 rounded-xl border transition-all duration-200 ${
                              isSelected
                                ? 'border-chart-3 bg-chart-3/10 shadow-sm'
                                : 'border-border/50 bg-background/50 hover:border-chart-3/30'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{distraction.icon}</span>
                              <span className="text-sm font-medium">{distraction.label}</span>
                              {isSelected && <Check className="h-4 w-4 ml-auto text-chart-3" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {selectedDistractions.length > 0 && (
                      <div className="p-3 rounded-xl bg-chart-3/10 border border-chart-3/20">
                        <p className="text-sm text-center">
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

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              上一步
            </Button>

            <Button
              size="lg"
              onClick={handleNext}
              className="rounded-full px-8"
              disabled={!selectedMood || !selectedActivity}
            >
              继续下一步
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* 当前选择提示 */}
          {selectedMood && selectedActivity && (
            <div className="text-center p-4 rounded-xl bg-secondary/30 border border-border/50 animate-in fade-in duration-500">
              <p className="text-sm text-muted-foreground">
                当前状态：
                <span className="font-semibold text-foreground ml-2">
                  {MOOD_TAGS.find(m => m.id === selectedMood)?.label || customMood}
                </span>
                <span className="text-muted-foreground mx-2">·</span>
                <span className="font-semibold text-foreground">
                  {ACTIVITY_TAGS.find(a => a.id === selectedActivity)?.label || customActivity}
                </span>
                {selectedDistractions.length > 0 && (
                  <>
                    <span className="text-muted-foreground mx-2">·</span>
                    <span className="text-chart-3 font-semibold">
                      {selectedDistractions.length}个分心因素
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
