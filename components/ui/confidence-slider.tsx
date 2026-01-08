"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ConfidenceSliderProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function ConfidenceSlider({ value, onChange, className }: ConfidenceSliderProps) {
  // 根据数值生成动态颜色和文案
  const getStatus = (val: number) => {
    if (val < 60) return { 
      label: "印象模糊 (可能是误记)", 
      color: "from-orange-500 to-yellow-500",
      shadow: "shadow-orange-500/20",
      bg: "bg-orange-500",
      text: "text-orange-500"
    }
    if (val < 90) return { 
      label: "大概率在此 (比较有把握)", 
      color: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/20",
      bg: "bg-cyan-500",
      text: "text-cyan-500"
    }
    return { 
      label: "绝对确认 (亲眼所见)", 
      color: "from-emerald-500 to-green-500",
      shadow: "shadow-emerald-500/20",
      bg: "bg-emerald-500",
      text: "text-emerald-500"
    }
  }

  const status = getStatus(value)
  const trackRef = React.useRef<HTMLDivElement>(null)

  // 处理拖动逻辑
  const handleInteraction = (clientX: number) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    // 限制在 50% - 100% 之间
    const constrainedValue = Math.max(50, Math.round(percentage))
    onChange(constrainedValue)
  }

  return (
    <div className={cn("space-y-4 select-none", className)}>
      {/* 头部文案说明 */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-white font-bold text-lg">区域置信度校准</h3>
          <p className="text-slate-400 text-xs mt-1">
            拖动滑块，告诉 AI 您对这个判断的把握有多大
          </p>
        </div>
        <div className="text-right">
          <div className={cn("text-2xl font-mono font-bold transition-colors duration-300", status.text)}>
            {value}%
          </div>
        </div>
      </div>

      {/* 滑块主体区域 */}
      <div 
        className="relative h-14 w-full touch-none cursor-pointer group"
        ref={trackRef}
        onMouseDown={(e) => handleInteraction(e.clientX)}
        onTouchStart={(e) => handleInteraction(e.touches[0].clientX)}
        onTouchMove={(e) => handleInteraction(e.touches[0].clientX)}
        onMouseMove={(e) => e.buttons === 1 && handleInteraction(e.clientX)}
      >
        {/* 1. 轨道槽 (Track) */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-4 bg-slate-800 rounded-full border border-slate-700 shadow-inner overflow-hidden">
           {/* 轨道背景刻度线 (装饰) */}
           <div className="absolute inset-0 w-full h-full opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,#fff_4px,#fff_5px)]" />
        </div>

        {/* 2. 填充条 (Fill) */}
        <div 
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 rounded-full transition-all duration-100 bg-gradient-to-r",
            status.color
          )}
          style={{ width: `${value}%` }}
        />

        {/* 3. 拖拽手柄 (The Big Thumb) - 关键修改点 */}
        <div 
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -ml-5 h-10 w-10 z-10",
            "rounded-full border-2 border-white bg-slate-900 shadow-xl",
            "flex items-center justify-center transition-all duration-100",
            "hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing",
            status.shadow
          )}
          style={{ left: `${value}%` }}
        >
          {/* 发光中心点 */}
          <div className={cn("w-3 h-3 rounded-full animate-pulse", status.bg)} />
          
          {/* 随动气泡 (Tooltip) - 直接跟在滑块上方 */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
             <div className={cn(
               "px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-lg relative",
               status.bg
             )}>
               {status.label}
               {/* 小三角 */}
               <div className={cn(
                 "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent",
                 status.bg === "bg-orange-500" && "border-t-orange-500",
                 status.bg === "bg-cyan-500" && "border-t-cyan-500",
                 status.bg === "bg-emerald-500" && "border-t-emerald-500"
               )} />
             </div>
          </div>
        </div>
      </div>
      
      {/* 底部辅助说明 */}
      <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase px-1">
        <span>50% (UNCERTAIN)</span>
        <span>100% (CONFIRMED)</span>
      </div>
    </div>
  )
}













