"use client"

/**
 * 霓虹活动图标组件 - 用于 Step 5 身体动态流
 * 使用极简动作剪影风格（动态火柴人/奥运图标风格）
 */

interface ActivityIconProps {
  isSelected?: boolean
  className?: string
}

const iconColor = 'var(--holo-blue)'

// 🚶 行走中 - 动态脚印
export function WalkingIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* 左脚印 */}
        <ellipse
          cx="10"
          cy="18"
          rx="4"
          ry="6"
          fill={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          opacity={isSelected ? 1 : 0.6}
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
        {/* 右脚印 */}
        <ellipse
          cx="22"
          cy="12"
          rx="4"
          ry="6"
          fill={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          opacity={isSelected ? 1 : 0.6}
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
      </g>
    </svg>
  )
}

// 🪑 坐着休息 - 坐姿剪影
export function SittingIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* 椅子 */}
        <path
          d="M8,20 L24,20 M8,20 L8,12 M24,20 L24,12 M10,12 L22,12"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
        {/* 人 - 头 */}
        <circle
          cx="16"
          cy="8"
          r="2.5"
          fill={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
        />
      </g>
    </svg>
  )
}

// 📦 手持重物 - 方块在手掌上
export function CarryingIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* 重物 - 方块 */}
        <rect
          x="10"
          y="8"
          width="12"
          height="10"
          rx="2"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          fill={isSelected ? `${iconColor}20` : 'rgba(255,255,255,0.1)'}
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
        {/* 手臂/手掌轮廓 */}
        <path
          d="M12,18 L12,24 M20,18 L20,24 M12,24 Q16,26 20,24"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

// 📱 打电话 - 手机+声波
export function PhoneCallIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* 手机轮廓 */}
        <rect
          x="12"
          y="8"
          width="8"
          height="16"
          rx="2"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
        {/* 声波纹 */}
        <path
          d="M22,12 Q24,16 22,20 M25,10 Q28,16 25,22"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  )
}

// 🧹 整理卫生 - 扫帚/擦拭动作
export function CleaningIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* 扫帚柄 */}
        <line
          x1="10"
          y1="8"
          x2="22"
          y2="24"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
        {/* 扫帚头 */}
        <path
          d="M18,20 L26,20 L26,24 L18,24 Z"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          fill={isSelected ? `${iconColor}20` : 'rgba(255,255,255,0.1)'}
        />
        {/* 运动轨迹 */}
        <path
          d="M8,10 Q12,8 14,10"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.3)'}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="2,2"
        />
      </g>
    </svg>
  )
}

// 👗 试穿/换装 - 衣服轮廓
export function ChangingIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* T恤轮廓 */}
        <path
          d="M12,10 L12,8 L16,8 L16,10 L20,10 L20,8 L20,10 L22,12 L22,24 L10,24 L10,12 Z"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isSelected ? `${iconColor}20` : 'rgba(255,255,255,0.1)'}
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
      </g>
    </svg>
  )
}

// 🚗 驾驶/骑行 - 方向盘
export function DrivingIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* 方向盘外圈 */}
        <circle
          cx="16"
          cy="16"
          r="10"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
        {/* 方向盘中心 */}
        <circle
          cx="16"
          cy="16"
          r="4"
          fill={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
        />
        {/* 方向盘辐条 */}
        <line x1="16" y1="12" x2="16" y2="8" stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'} strokeWidth="2" />
        <line x1="16" y1="20" x2="16" y2="24" stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'} strokeWidth="2" />
      </g>
    </svg>
  )
}

// 🍽 进餐 - 餐具
export function EatingIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* 叉子 */}
        <path
          d="M12,8 L12,16 M10,8 L10,14 M14,8 L14,14"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
        {/* 勺子 */}
        <circle
          cx="20"
          cy="10"
          r="3"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="20"
          y1="13"
          x2="20"
          y2="24"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

// 📸 拍照 - 相机
export function PhotoIcon({ isSelected = false, className = '' }: ActivityIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <g className="transition-all duration-300">
        {/* 相机机身 */}
        <rect
          x="8"
          y="12"
          width="16"
          height="12"
          rx="2"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          fill={isSelected ? `${iconColor}20` : 'rgba(255,255,255,0.1)'}
          style={{ filter: isSelected ? `drop-shadow(0 0 3px ${iconColor})` : 'none' }}
        />
        {/* 镜头 */}
        <circle
          cx="16"
          cy="18"
          r="4"
          stroke={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
          strokeWidth="2"
          fill="none"
        />
        {/* 取景器 */}
        <rect
          x="13"
          y="8"
          width="6"
          height="4"
          rx="1"
          fill={isSelected ? iconColor : 'rgba(255,255,255,0.4)'}
        />
      </g>
    </svg>
  )
}

