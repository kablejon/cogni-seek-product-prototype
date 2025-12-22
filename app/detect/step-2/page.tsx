"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Calendar, Clock } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 时间描述映射
const TIME_DESCRIPTIONS = [
  { label: '刚刚', value: 0 },
  { label: '今天上午', value: 1 },
  { label: '今天中午', value: 2 },
  { label: '今天下午', value: 3 },
  { label: '今天晚上', value: 4 },
  { label: '昨天深夜', value: 5 },
  { label: '昨天', value: 6 },
  { label: '前天', value: 7 },
  { label: '几天前', value: 8 },
  { label: '很久之前', value: 9 },
]

export default function Step2Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [timeSliderValue, setTimeSliderValue] = useState<number>(0)
  const [showPreciseInput, setShowPreciseInput] = useState(false)
  const [preciseDate, setPreciseDate] = useState(session.lastSeenDate)
  const [preciseTime, setPreciseTime] = useState(session.lastSeenTime)

  // 根据滑块位置获取背景亮度（时间越久越暗）
  const getBackgroundOpacity = (value: number) => {
    return 1 - (value / 9) * 0.4 // 从1.0到0.6的渐变
  }

  // 获取当前时间描述
  const currentTimeLabel = TIME_DESCRIPTIONS.find(t => t.value === timeSliderValue)?.label || '刚刚'

  const handleNext = () => {
    if (showPreciseInput && preciseDate && preciseTime) {
      updateSession({
        lastSeenTime: `${preciseDate} ${preciseTime}`,
        lastSeenDate: preciseDate,
      })
    } else {
      updateSession({
        lastSeenTime: currentTimeLabel,
        lastSeenDate: new Date().toISOString().split('T')[0],
      })
    }
    router.push('/detect/step-3')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* 星空背景 - 动态亮度 - 固定定位 */}
      <div 
        className="fixed inset-0 z-0 transition-opacity duration-500" 
        style={{ opacity: getBackgroundOpacity(timeSliderValue) }}
      >
        <InteractiveFog color="29, 78, 216" />
      </div>
      
      <Header currentStep={2} showProgress />

      {/* 主容器 */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-3xl mx-auto scifi-container p-6 md:p-10 space-y-10">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--holo-blue)]/10 border border-[var(--holo-blue)]/30 mb-2">
              <Clock className="w-3 h-3" style={{ color: 'var(--holo-blue)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--holo-blue)' }}>Step 2 of 5</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">记忆回溯</h1>
            <p className="text-sm text-muted-foreground">
              你最后一次<span className="text-[var(--cyber-green)] font-semibold">确定</span>看见它是什么时候？
            </p>
          </div>

          {/* 时间显示 - 大字体动态放大 */}
          <div 
            className="text-center py-8 transition-all duration-300"
            style={{
              transform: `scale(${1 + timeSliderValue * 0.05})`,
            }}
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 animate-pulse-wave">
              {currentTimeLabel}
            </div>
            <div className="text-xs text-muted-foreground">
              拖动滑块选择时间
            </div>
          </div>

          {/* 发光时间轴滑块 */}
          <div className="space-y-6">
            <div className="relative">
              {/* 滑块容器 */}
              <div className="slider-glow">
                {/* 发光进度条 */}
                <div 
                  className="slider-track"
                  style={{ width: `${(timeSliderValue / 9) * 100}%` }}
                />
                
                {/* 滑块头 */}
                <input
                  type="range"
                  min={0}
                  max={9}
                  step={1}
                  value={timeSliderValue}
                  onChange={(e) => setTimeSliderValue(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                <div 
                  className="slider-thumb"
                  style={{ left: `${(timeSliderValue / 9) * 100}%` }}
                />
              </div>
              
              {/* 刻度标签 */}
              <div className="flex justify-between mt-3 text-xs text-muted-foreground px-1">
                <span>刚刚</span>
                <span>今天</span>
                <span>昨天</span>
                <span>几天前</span>
                <span>很久</span>
              </div>
            </div>

            {/* 精确时间输入 - 折叠 */}
            <div className="text-center animate-fade-in-up">
              <button
                onClick={() => setShowPreciseInput(!showPreciseInput)}
                className="text-xs hover:text-[var(--holo-blue)] transition-colors inline-flex items-center gap-1"
                style={{ color: 'var(--cyber-green)' }}
              >
                <Calendar className="w-3 h-3" />
                {showPreciseInput ? "收起精确时间输入" : "手动输入精确时间"}
              </button>
              
              {showPreciseInput && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-100">
                  <input
                    type="date"
                    value={preciseDate}
                    onChange={(e) => setPreciseDate(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all"
                  />
                  <input
                    type="time"
                    value={preciseTime}
                    onChange={(e) => setPreciseTime(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              onClick={handleNext}
              className="btn-scifi-primary"
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
