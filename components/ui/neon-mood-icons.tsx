"use client"

/**
 * 霓虹线框图标组件 - 用于 Step 5 状态还原页面
 * 每个图标代表一种心理状态，使用霓虹线框风格
 */

interface NeonIconProps {
  isSelected?: boolean
  color?: string
  className?: string
}

// 😡 愤怒/生气 - 爆炸符号
export function AngryIcon({ isSelected = false, color = '#FF3B30', className = '' }: NeonIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        {/* 中心爆炸点 */}
        <circle 
          cx="40" 
          cy="40" 
          r="8" 
          fill={isSelected ? color : 'rgba(255,255,255,0.3)'}
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
        {/* 放射状锯齿线 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const x1 = 40 + Math.cos(rad) * 12
          const y1 = 40 + Math.sin(rad) * 12
          const x2 = 40 + Math.cos(rad) * 30
          const y2 = 40 + Math.sin(rad) * 30
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
              strokeWidth={isSelected ? '3' : '2'}
              strokeLinecap="round"
              style={{ filter: isSelected ? `drop-shadow(0 0 3px ${color})` : 'none' }}
            />
          )
        })}
      </g>
    </svg>
  )
}

// ⚡ 焦虑/急忙 - 心电图波纹
export function AnxiousIcon({ isSelected = false, color = '#FF9500', className = '' }: NeonIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        <path
          d="M15,40 L25,40 L30,25 L35,55 L40,30 L45,50 L50,35 L55,40 L65,40"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '3' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
      </g>
    </svg>
  )
}

// 😴 困倦/疲惫 - 半闭的眼睑
export function SleepyIcon({ isSelected = false, color = '#0A84FF', className = '' }: NeonIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        {/* 左眼 */}
        <path
          d="M25,35 Q30,42 35,35"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '3' : '2'}
          strokeLinecap="round"
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
        {/* 右眼 */}
        <path
          d="M45,35 Q50,42 55,35"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '3' : '2'}
          strokeLinecap="round"
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
        {/* 电池低电量符号 */}
        <rect
          x="32"
          y="50"
          width="16"
          height="8"
          rx="2"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '2.5' : '1.5'}
          fill="none"
        />
        <rect
          x="34"
          y="52"
          width="4"
          height="4"
          fill={isSelected ? color : 'rgba(255,255,255,0.3)'}
        />
      </g>
    </svg>
  )
}

// 🥴 微醺/醉酒 - 重影圆圈
export function TipsyIcon({ isSelected = false, color = '#BF5AF2', className = '' }: NeonIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        {/* 主圆圈 */}
        <circle
          cx="40"
          cy="40"
          r="15"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '3' : '2'}
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color}) blur(0.5px)` : 'blur(0.5px)' }}
        />
        {/* 重影圆圈1 */}
        <circle
          cx="43"
          cy="37"
          r="15"
          stroke={isSelected ? color : 'rgba(255,255,255,0.3)'}
          strokeWidth={isSelected ? '2' : '1.5'}
          fill="none"
          opacity="0.5"
          style={{ filter: 'blur(1px)' }}
        />
        {/* 上升的气泡 */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={38 + i * 2}
            cy={20 - i * 5}
            r={2 - i * 0.5}
            fill={isSelected ? color : 'rgba(255,255,255,0.3)'}
            opacity={0.7 - i * 0.2}
          />
        ))}
      </g>
    </svg>
  )
}

// 🤩 兴奋/激动 - 上升的箭头/火花
export function ExcitedIcon({ isSelected = false, color = '#FF2D55', className = '' }: NeonIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        {/* 上升箭头 */}
        <path
          d="M40,55 L40,30 M40,30 L30,38 M40,30 L50,38"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '3' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
        {/* 火花/星星 */}
        {[
          { x: 30, y: 25, size: 4 },
          { x: 50, y: 22, size: 5 },
          { x: 38, y: 18, size: 3 },
        ].map((star, i) => (
          <g key={i}>
            <line
              x1={star.x}
              y1={star.y - star.size}
              x2={star.x}
              y2={star.y + star.size}
              stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
              strokeWidth={isSelected ? '2' : '1.5'}
              strokeLinecap="round"
            />
            <line
              x1={star.x - star.size}
              y1={star.y}
              x2={star.x + star.size}
              y2={star.y}
              stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
              strokeWidth={isSelected ? '2' : '1.5'}
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

// 😐 冷静/正常 - 水平直线/平衡天平
export function CalmIcon({ isSelected = false, color = '#64D2FF', className = '' }: NeonIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        {/* 水平基准线 */}
        <line
          x1="20"
          y1="40"
          x2="60"
          y2="40"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '3' : '2'}
          strokeLinecap="round"
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
        {/* 平衡点标记 */}
        <circle
          cx="40"
          cy="40"
          r="4"
          fill={isSelected ? color : 'rgba(255,255,255,0.3)'}
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
        {/* 两侧平衡指示 */}
        <line x1="25" y1="35" x2="25" y2="45" stroke={isSelected ? color : 'rgba(255,255,255,0.4)'} strokeWidth="2" />
        <line x1="55" y1="35" x2="55" y2="45" stroke={isSelected ? color : 'rgba(255,255,255,0.4)'} strokeWidth="2" />
      </g>
    </svg>
  )
}

// 😵 困惑/迷茫 - 螺旋线/问号迷宫
export function ConfusedIcon({ isSelected = false, color = '#EBEBF5', className = '' }: NeonIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        {/* 螺旋线 */}
        <path
          d="M40,40 Q50,35 50,40 T50,50 Q50,60 40,60 Q25,60 25,45 Q25,30 40,30 Q55,30 55,45"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '3' : '2'}
          strokeLinecap="round"
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
        {/* 问号点 */}
        <circle
          cx="40"
          cy="20"
          r="3"
          fill={isSelected ? color : 'rgba(255,255,255,0.4)'}
        />
      </g>
    </svg>
  )
}

// ➕ 其他状态 - 空心加号
export function CustomMoodIcon({ isSelected = false, className = '' }: NeonIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <g className="transition-all duration-300">
        <line
          x1="40"
          y1="25"
          x2="40"
          y2="55"
          stroke={isSelected ? 'var(--holo-blue)' : 'rgba(255,255,255,0.4)'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5,5"
        />
        <line
          x1="25"
          y1="40"
          x2="55"
          y2="40"
          stroke={isSelected ? 'var(--holo-blue)' : 'rgba(255,255,255,0.4)'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5,5"
        />
      </g>
    </svg>
  )
}

