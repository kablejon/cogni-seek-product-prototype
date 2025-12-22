"use client"

import { useEffect, useState } from "react"

interface ConfidenceMeterProps {
  probability: number // 0-100
  className?: string
}

export function ConfidenceMeter({ probability, className = "" }: ConfidenceMeterProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(probability)
    }, 500)
    return () => clearTimeout(timer)
  }, [probability])

  // 计算指针角度 (从-90度到90度，对应0-100%)
  const rotation = -90 + (animatedValue / 100) * 180

  // 根据概率确定颜色
  const getColor = () => {
    if (probability >= 70) return { stroke: "rgb(16, 185, 129)", text: "text-chart-2", label: "高概率" }
    if (probability >= 50) return { stroke: "rgb(59, 130, 246)", text: "text-primary", label: "中等概率" }
    if (probability >= 30) return { stroke: "rgb(251, 146, 60)", text: "text-chart-3", label: "较低概率" }
    return { stroke: "rgb(239, 68, 68)", text: "text-destructive", label: "低概率" }
  }

  const colorInfo = getColor()

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        {/* 背景弧线 */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* 活动弧线 (渐变) */}
        <defs>
          <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(239, 68, 68)" />
            <stop offset="30%" stopColor="rgb(251, 146, 60)" />
            <stop offset="60%" stopColor="rgb(59, 130, 246)" />
            <stop offset="100%" stopColor="rgb(16, 185, 129)" />
          </linearGradient>
        </defs>

        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#meterGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="251.2" // 半圆周长
          strokeDashoffset={251.2 - (animatedValue / 100) * 251.2}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* 中心点 */}
        <circle cx="100" cy="100" r="6" fill="rgba(255, 255, 255, 0.3)" />

        {/* 指针 */}
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "100px 100px",
            transition: "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={colorInfo.stroke}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="8" fill={colorInfo.stroke} />
        </g>

        {/* 刻度标记 */}
        {[0, 25, 50, 75, 100].map((value) => {
          const angle = -90 + (value / 100) * 180
          const radians = (angle * Math.PI) / 180
          const x1 = 100 + 70 * Math.cos(radians)
          const y1 = 100 + 70 * Math.sin(radians)
          const x2 = 100 + 80 * Math.cos(radians)
          const y2 = 100 + 80 * Math.sin(radians)

          return (
            <line
              key={value}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
            />
          )
        })}
      </svg>

      {/* 中心数值 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: "-20px" }}>
        <div className={`text-5xl md:text-6xl font-bold ${colorInfo.text} transition-all duration-1000`}>
          {animatedValue}%
        </div>
        <div className="text-sm text-muted-foreground mt-2 font-medium">
          找回概率：{colorInfo.label}
        </div>
      </div>

      {/* 底部标签 */}
      <div className="flex justify-between text-xs text-muted-foreground px-4 mt-2">
        <span>0%</span>
        <span className="text-center">50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

