"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Clock, Calendar } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 时间滑块配置
const TIME_SLIDER_STOPS = [
  { value: 0, label: '刚刚', sublabel: '10分钟内', quickId: 'just_now' },
  { value: 10, label: '今天上午', sublabel: '早上', quickId: 'this_morning' },
  { value: 20, label: '今天下午', sublabel: '中午后', quickId: 'this_afternoon' },
  { value: 30, label: '今天晚上', sublabel: '傍晚', quickId: 'this_evening' },
  { value: 40, label: '昨天', sublabel: '24小时前', quickId: 'yesterday' },
  { value: 50, label: '前天', sublabel: '48小时前', quickId: 'day_before_yesterday' },
  { value: 60, label: '3天前', sublabel: '本周内', quickId: 'three_days_ago' },
  { value: 70, label: '一周前', sublabel: '7天左右', quickId: 'last_week' },
  { value: 80, label: '更早', sublabel: '一周以上', quickId: 'even_earlier' },
  { value: 100, label: '完全不记得', sublabel: '模糊', quickId: 'unknown' },
]

export default function Step2Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  // 尝试从session恢复滑块位置
  const getInitialSliderValue = () => {
    if (session.timeQuickSelect) {
      const stop = TIME_SLIDER_STOPS.find(s => s.quickId === session.timeQuickSelect)
      if (stop) return stop.value
    }
    return 10 // 默认"今天上午"
  }

  const [sliderValue, setSliderValue] = useState(getInitialSliderValue())
  const [showPreciseInput, setShowPreciseInput] = useState(false)
  const [preciseDate, setPreciseDate] = useState(session.lastSeenDate || '')
  const [preciseTime, setPreciseTime] = useState(session.lastSeenTime || '')

  // 根据滑块值获取对应的时间描述
  const getCurrentTimeStop = () => {
    // 找到最接近的刻度
    return TIME_SLIDER_STOPS.reduce((prev, curr) => 
      Math.abs(curr.value - sliderValue) < Math.abs(prev.value - sliderValue) ? curr : prev
    )
  }

  const currentStop = getCurrentTimeStop()

  // 背景暗度：时间越久背景越暗
  const backgroundOpacity = Math.min(sliderValue / 100, 0.5)

  const handleNext = () => {
    if (showPreciseInput && !preciseDate) {
      alert('请输入精确日期')
      return
    }

    updateSession({
      timeQuickSelect: showPreciseInput ? 'custom' : currentStop.quickId,
      lastSeenDate: preciseDate,
      lastSeenTime: preciseTime,
      timeConfidence: showPreciseInput ? 'certain' : (sliderValue === 100 ? 'unknown' : 'approximate'),
    })

    router.push('/detect/step-3')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Interactive Fog with dynamic opacity */}
      <div className="absolute inset-0 z-0">
        <InteractiveFog color="29, 78, 216" />
      </div>

      {/* 记忆模糊效果 - 随时间变暗 */}
      <div 
        className="absolute inset-0 bg-black/0 transition-all duration-700 ease-out z-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }}
      />
      
      <Header currentStep={2} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Step 2 of 5</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">记忆回溯</h1>
            <p className="text-muted-foreground text-lg">
              拖动时间轴，回想最后一次<span className="text-primary font-semibold">确定</span>看见它的时候
            </p>
          </div>

          {/* 时间滑块主体 */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-8 md:p-10 card-shadow space-y-8">
            {/* 当前时间显示 */}
            <div className="text-center space-y-2 transition-all duration-500">
              <div className="text-4xl md:text-5xl font-bold">
                {currentStop.label}
              </div>
              <div className="text-lg text-muted-foreground">
                {currentStop.sublabel}
              </div>
            </div>

            {/* 时间轴滑块 */}
            <div className="space-y-6">
              {/* 滑块轨道 */}
              <div className="relative pt-8 pb-4">
                {/* 刻度标记 */}
                <div className="relative w-full">
                  {TIME_SLIDER_STOPS.slice(0, -1).map((stop, index) => (
                    <div
                      key={stop.value}
                      className="absolute"
                      style={{ left: `${stop.value}%` }}
                    >
                      <div className="relative -translate-x-1/2">
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          sliderValue >= stop.value - 5 && sliderValue <= stop.value + 5
                            ? 'bg-primary w-3 h-3'
                            : 'bg-border'
                        }`} />
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          <div className={`text-xs transition-all duration-300 ${
                            sliderValue >= stop.value - 5 && sliderValue <= stop.value + 5
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground'
                          }`}>
                            {index % 2 === 0 ? stop.label : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 滑块输入 */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer mt-2
                    bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-6
                    [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-primary/50
                    [&::-webkit-slider-thumb]:cursor-grab
                    [&::-webkit-slider-thumb]:active:cursor-grabbing
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-moz-range-thumb]:w-6
                    [&::-moz-range-thumb]:h-6
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-primary
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:shadow-lg
                    [&::-moz-range-thumb]:shadow-primary/50
                    [&::-moz-range-thumb]:cursor-grab
                    [&::-moz-range-thumb]:active:cursor-grabbing"
                />
              </div>

              {/* 时间提示 */}
              <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
                <span>刚刚</span>
                <span className="text-center">昨天</span>
                <span>很久之前</span>
              </div>
            </div>

            {/* 记忆模糊提示 */}
            {sliderValue > 60 && (
              <div className="p-4 rounded-xl bg-chart-3/10 border border-chart-3/20 animate-in fade-in duration-500">
                <p className="text-sm text-center text-muted-foreground">
                  💡 <span className="font-medium">记忆提示：</span>时间越久，记忆可能越模糊。这很正常，AI会根据这个信息调整分析策略。
                </p>
              </div>
            )}
          </div>

          {/* 精准时间输入（折叠链接） */}
          <div className="text-center">
            {!showPreciseInput ? (
              <button
                onClick={() => setShowPreciseInput(true)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                我记得精确的日期和时间 →
              </button>
            ) : (
              <div className="bg-secondary/30 rounded-2xl border border-border/50 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    精确时间
                  </h3>
                  <button
                    onClick={() => setShowPreciseInput(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    收起 ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">日期</label>
                    <input
                      type="date"
                      value={preciseDate}
                      onChange={(e) => setPreciseDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">时间（选填）</label>
                    <input
                      type="time"
                      value={preciseTime}
                      onChange={(e) => setPreciseTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
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
              disabled={showPreciseInput && !preciseDate}
            >
              继续下一步
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* 当前选择提示 */}
          <div className="text-center p-4 rounded-xl bg-secondary/30 border border-border/50">
            <p className="text-sm text-muted-foreground">
              当前选择：
              {showPreciseInput && preciseDate ? (
                <span className="font-semibold text-foreground ml-2">
                  {new Date(preciseDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {preciseTime && ` ${preciseTime}`}
                </span>
              ) : (
                <span className="font-semibold text-foreground ml-2">{currentStop.label}</span>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
