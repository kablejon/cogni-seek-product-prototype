"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Calendar, Clock, HelpCircle, Check } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/shared"
import { useSearchStore } from "@/lib/store"
import { timeQuickOptions } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

export default function Step2Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedDate, setSelectedDate] = useState(session.lastSeenDate)
  const [selectedTime, setSelectedTime] = useState(session.lastSeenTime)
  const [quickSelect, setQuickSelect] = useState(session.timeQuickSelect)
  const [confidence, setConfidence] = useState(session.timeConfidence)
  const [inputMode, setInputMode] = useState<'quick' | 'precise' | 'unknown'>('quick')

  const canProceed = quickSelect || selectedDate || inputMode === 'unknown'

  const handleQuickSelect = (optionId: string) => {
    if (optionId === 'custom') {
      // "其他时间"选项 - 清空快速选择，让用户使用精确时间输入
      setQuickSelect('')
      setInputMode('precise')
      // 滚动到精确时间输入框
      setTimeout(() => {
        const preciseInput = document.querySelector('input[type="date"]') as HTMLInputElement
        preciseInput?.focus()
      }, 100)
    } else {
      setQuickSelect(optionId)
      setSelectedDate('')
      setSelectedTime('')
      setInputMode('quick')
    }
  }

  const handlePreciseDate = (date: string) => {
    setSelectedDate(date)
    setQuickSelect('')
    setInputMode('precise')
  }

  const handleUnknown = () => {
    setQuickSelect('')
    setSelectedDate('')
    setSelectedTime('')
    setConfidence('unknown')
    setInputMode('unknown')
  }

  const handleNext = () => {
    if (canProceed) {
      updateSession({
        lastSeenDate: selectedDate,
        lastSeenTime: selectedTime,
        timeQuickSelect: quickSelect,
        timeConfidence: confidence || (inputMode === 'unknown' ? 'unknown' : quickSelect ? 'approximate' : 'certain'),
      })
      router.push("/detect/step-3")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <InteractiveFog color="29, 78, 216" />
      <Header currentStep={2} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">时间锚点</h1>
            <p className="text-muted-foreground text-lg">
              你最后一次<span className="text-primary font-semibold">确定</span>看见它是什么时候？
            </p>
          </div>

          {/* Quick Time Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">快速选择</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeQuickOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleQuickSelect(option.id)}
                  className={`p-4 rounded-xl border transition-smooth text-center ${
                    quickSelect === option.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border/50 bg-card hover:border-border card-shadow'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">或者</span>
            </div>
          </div>

          {/* Precise Date/Time */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold">精确时间</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">日期</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handlePreciseDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border/50 bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">时间（可选）</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border/50 bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                />
              </div>
            </div>

            {selectedDate && (
              <div className="space-y-3 pt-4 border-t border-border/50">
                <label className="text-sm text-muted-foreground">你对这个时间有多确定？</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'certain', label: '非常确定', desc: '记得很清楚' },
                    { id: 'approximate', label: '大概记得', desc: '可能有偏差' },
                    { id: 'unknown', label: '不太确定', desc: '只是猜测' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setConfidence(option.id as 'certain' | 'approximate' | 'unknown')}
                      className={`p-3 rounded-xl text-center transition-smooth border ${
                        confidence === option.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border/50 hover:border-border'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className={`text-xs mt-1 ${confidence === option.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">或者</span>
            </div>
          </div>

          {/* Not Sure Option */}
          <button
            onClick={handleUnknown}
            className={`w-full p-6 rounded-2xl border transition-smooth text-left card-shadow ${
              inputMode === 'unknown'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border/50 bg-card hover:border-border'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-smooth ${
                inputMode === 'unknown' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}>
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="font-semibold flex items-center justify-between">
                  完全不记得了
                  {inputMode === 'unknown' && <Check className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  没关系，我们将使用当前时间作为参考点，并结合其他信息进行分析
                </p>
              </div>
            </div>
          </button>

          {/* Tip Box */}
          <div className="bg-chart-2/10 border border-chart-2/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-chart-2 font-medium">💡 提示：</span>
              时间信息有助于我们重建当时的场景与心理状态。即使是模糊的时间范围，也能帮助缩小搜索范围。
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link href="/detect/step-1">
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
