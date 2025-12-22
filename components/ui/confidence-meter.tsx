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
      {/* 发光背景 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ 
            background: `radial-gradient(circle, ${colorInfo.stroke} 0%, transparent 70%)`,
          }}
        />
      </div>

      <svg
        viewBox="0 0 200 120"
        className="w-full h-full relative z-10"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        {/* 背景弧线 */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* 活动弧线 (赛博彩虹渐变) */}
        <defs>
          <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(239, 68, 68)" />
            <stop offset="30%" stopColor="rgb(251, 146, 60)" />
            <stop offset="60%" stopColor="var(--holo-blue)" />
            <stop offset="100%" stopColor="var(--cyber-green)" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#meterGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (animatedValue / 100) * 251.2}
          filter="url(#glow)"
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* 中心发光点 */}
        <circle cx="100" cy="100" r="8" fill={colorInfo.stroke} opacity="0.5" />
        <circle cx="100" cy="100" r="4" fill="#fff" />

        {/* 指针 - 三角形 */}
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "100px 100px",
            transition: "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
          }}
        >
          {/* 指针发光效果 */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={colorInfo.stroke}
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
            opacity="0.8"
          />
          {/* 指针实体 */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 指针头 - 三角形 */}
          <polygon
            points="100,25 95,35 105,35"
            fill={colorInfo.stroke}
            filter="url(#glow)"
          />
        </g>

        {/* 刻度标记 - 更科幻 */}
        {[0, 25, 50, 75, 100].map((value) => {
          const angle = -90 + (value / 100) * 180
          const radians = (angle * Math.PI) / 180
          const x1 = 100 + 72 * Math.cos(radians)
          const y1 = 100 + 72 * Math.sin(radians)
          const x2 = 100 + 85 * Math.cos(radians)
          const y2 = 100 + 85 * Math.sin(radians)

          return (
            <g key={value}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* 刻度文字 */}
              <text
                x={100 + 95 * Math.cos(radians)}
                y={100 + 95 * Math.sin(radians)}
                fill="rgba(255, 255, 255, 0.5)"
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="monospace"
              >
                {value}
              </text>
            </g>
          )
        })}
      </svg>

      {/* 中心数值 - 等宽字体 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: "-20px" }}>
        <div className={`text-6xl md:text-7xl font-bold font-mono transition-all duration-1000`}
             style={{ 
               color: colorInfo.stroke,
               textShadow: `0 0 20px ${colorInfo.stroke}, 0 0 40px ${colorInfo.stroke}`,
             }}>
          {animatedValue}
          <span className="text-3xl">%</span>
        </div>
        <div className="text-xs font-mono mt-3 px-4 py-1.5 rounded-full border"
             style={{
               color: colorInfo.stroke,
               borderColor: colorInfo.stroke,
               backgroundColor: `${colorInfo.stroke}15`,
               boxShadow: `0 0 15px ${colorInfo.stroke}40`,
             }}>
          RECOVERY PROBABILITY: {colorInfo.label.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

