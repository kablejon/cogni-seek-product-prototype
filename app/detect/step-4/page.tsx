"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Users, Check } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/shared"
import { useSearchStore } from "@/lib/store"
import { activityCategories, moodOptions } from "@/lib/data"

export default function Step4Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedActivityCategory, setSelectedActivityCategory] = useState(session.activityCategory)
  const [selectedActivity, setSelectedActivity] = useState(session.specificActivity)
  const [activityCustom, setActivityCustom] = useState(session.activityCustom)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  
  const [selectedMood, setSelectedMood] = useState(session.mood)
  const [moodCustom, setMoodCustom] = useState(session.moodCustom)
  
  const [wasDistracted, setWasDistracted] = useState(session.wasDistracted)
  const [otherPeoplePresent, setOtherPeoplePresent] = useState(session.otherPeoplePresent)

  const isCustomActivity = selectedActivity.includes('other')
  const isCustomMood = selectedMood === 'mood_other'

  const canProceed = selectedActivity && selectedMood && 
    (!isCustomActivity || activityCustom.trim()) &&
    (!isCustomMood || moodCustom.trim())

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
      setSelectedActivityCategory(categoryId)
    }
  }

  const handleActivitySelect = (categoryId: string, activityId: string) => {
    setSelectedActivityCategory(categoryId)
    setSelectedActivity(activityId)
  }

  const handleNext = () => {
    if (canProceed) {
      updateSession({
        activityCategory: selectedActivityCategory,
        specificActivity: selectedActivity,
        activityCustom,
        mood: selectedMood,
        moodCustom,
        wasDistracted,
        otherPeoplePresent,
      })
      router.push("/detect/step-5")
    }
  }

  const getSelectedActivityLabel = () => {
    if (!selectedActivity) return ''
    const category = activityCategories.find(c => c.id === selectedActivityCategory)
    const activity = category?.activities.find(a => a.id === selectedActivity)
    if (isCustomActivity && activityCustom) return activityCustom
    return activity?.label || ''
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentStep={4} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">行为快照</h1>
            <p className="text-muted-foreground text-lg">当时你在做什么？状态如何？</p>
          </div>

          {/* Activity Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <span className="font-semibold">当时在做什么？</span>
            </div>
            
            <div className="space-y-3">
              {activityCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="bg-card rounded-2xl border border-border/50 overflow-hidden card-shadow transition-smooth hover:border-border"
                >
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full p-4 flex items-center justify-between transition-smooth ${
                      selectedActivityCategory === category.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                      {selectedActivityCategory === category.id && selectedActivity && (
                        <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">
                          {getSelectedActivityLabel()}
                        </span>
                      )}
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedCategory === category.id && (
                    <div className="border-t border-border/50 p-4 bg-secondary/30">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {category.activities.map((activity) => (
                          <button
                            key={activity.id}
                            onClick={() => handleActivitySelect(category.id, activity.id)}
                            className={`p-3 rounded-xl text-sm text-left transition-smooth flex items-center justify-between ${
                              selectedActivity === activity.id
                                ? 'bg-primary text-primary-foreground font-medium'
                                : 'bg-card hover:bg-card/80 border border-border/50'
                            }`}
                          >
                            <span>{activity.label}</span>
                            {selectedActivity === activity.id && <Check className="h-4 w-4" />}
                          </button>
                        ))}
                      </div>

                      {selectedActivityCategory === category.id && isCustomActivity && (
                        <div className="mt-4 p-4 rounded-xl bg-card border border-border/50 space-y-2">
                          <Label htmlFor="activityCustom">请描述当时在做什么</Label>
                          <Input
                            id="activityCustom"
                            placeholder="例如：在阳台浇花、给宠物喂食..."
                            value={activityCustom}
                            onChange={(e) => setActivityCustom(e.target.value)}
                            className="h-11 rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mood Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">💭</span>
              <span className="font-semibold">当时的情绪/状态？</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-xl text-center transition-smooth border card-shadow ${
                    selectedMood === mood.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border/50 hover:border-border'
                  }`}
                >
                  <div className="text-2xl mb-2">{mood.icon}</div>
                  <div className="font-medium text-sm">{mood.label}</div>
                </button>
              ))}
            </div>

            {isCustomMood && (
              <div className="p-4 rounded-xl bg-card border border-border/50 card-shadow space-y-2">
                <Label htmlFor="moodCustom">请描述当时的状态</Label>
                <Input
                  id="moodCustom"
                  placeholder="例如：专注于某件事、心不在焉..."
                  value={moodCustom}
                  onChange={(e) => setMoodCustom(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Additional Questions */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <span className="text-xl">📋</span>
              <span className="font-semibold">补充信息</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">当时是否在同时处理多件事？</Label>
                <p className="text-sm text-muted-foreground">分心状态下更容易随手放置物品</p>
              </div>
              <div className="flex gap-2">
                {[
                  { value: false, label: '没有' },
                  { value: true, label: '是的' },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    onClick={() => setWasDistracted(option.value)}
                    className={`px-4 py-2 rounded-xl text-sm transition-smooth border ${
                      wasDistracted === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border/50 hover:border-border'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1 flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-base">当时是否有其他人在场？</Label>
                  <p className="text-sm text-muted-foreground">他们可能无意中移动了物品</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { value: false, label: '没有' },
                  { value: true, label: '有' },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    onClick={() => setOtherPeoplePresent(option.value)}
                    className={`px-4 py-2 rounded-xl text-sm transition-smooth border ${
                      otherPeoplePresent === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border/50 hover:border-border'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tip Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">🧠 科学依据：</span>
              心理学研究表明，情绪与注意力状态会显著影响物品放置的位置与方式。
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link href="/detect/step-3">
                <ArrowLeft className="mr-2 h-5 w-5" /> 上一步
              </Link>
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceed} 
              size="lg" 
              className="px-8 rounded-xl card-shadow"
            >
              下一步 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
