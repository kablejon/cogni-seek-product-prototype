/**
 * 搜索状态图标组件 - 用于 Step 6 已排查信息页面
 * 3D全息玻璃风格
 */

interface StatusIconProps {
  isSelected?: boolean
  className?: string
}

// 🔍 刚发现丢了 - 3D悬浮橙色感叹号/搜索镜
export function JustLostIcon({ isSelected = false, className = '' }: StatusIconProps) {
  const color = '#FF9F0A'
  
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        {/* 放大镜外圈 */}
        <circle
          cx="40"
          cy="40"
          r="20"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '4' : '3'}
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none' }}
        />
        {/* 放大镜内圈 - 玻璃效果 */}
        <circle
          cx="40"
          cy="40"
          r="15"
          fill={isSelected ? `${color}20` : 'rgba(255,255,255,0.05)'}
          stroke={isSelected ? color : 'rgba(255,255,255,0.2)'}
          strokeWidth="1.5"
        />
        {/* 放大镜手柄 */}
        <line
          x1="54"
          y1="54"
          x2="70"
          y2="70"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '4' : '3'}
          strokeLinecap="round"
          style={{ filter: isSelected ? `drop-shadow(0 0 6px ${color})` : 'none' }}
        />
        {/* 感叹号 */}
        <line
          x1="40"
          y1="32"
          x2="40"
          y2="42"
          stroke={isSelected ? color : 'rgba(255,255,255,0.5)'}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="40"
          cy="47"
          r="1.5"
          fill={isSelected ? color : 'rgba(255,255,255,0.5)'}
        />
      </g>
    </svg>
  )
}

// ✅ 已经找过 - 3D悬浮绿色盾牌/打钩清单板
export function AlreadySearchedIcon({ isSelected = false, className = '' }: StatusIconProps) {
  const color = '#2DE1FC'
  
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <g className={`transition-all duration-500 ${isSelected ? 'animate-pulse' : ''}`}>
        {/* 清单板外框 */}
        <rect
          x="25"
          y="20"
          width="50"
          height="60"
          rx="6"
          stroke={isSelected ? color : 'rgba(255,255,255,0.4)'}
          strokeWidth={isSelected ? '3' : '2.5'}
          fill={isSelected ? `${color}15` : 'rgba(255,255,255,0.05)'}
          style={{ filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none' }}
        />
        {/* 清单条目 - 第1行 */}
        <line
          x1="35"
          y1="35"
          x2="55"
          y2="35"
          stroke={isSelected ? color : 'rgba(255,255,255,0.3)'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="60" cy="35" r="3" fill={isSelected ? color : 'rgba(255,255,255,0.3)'} />
        
        {/* 清单条目 - 第2行 */}
        <line
          x1="35"
          y1="50"
          x2="55"
          y2="50"
          stroke={isSelected ? color : 'rgba(255,255,255,0.3)'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="60" cy="50" r="3" fill={isSelected ? color : 'rgba(255,255,255,0.3)'} />
        
        {/* 清单条目 - 第3行 */}
        <line
          x1="35"
          y1="65"
          x2="55"
          y2="65"
          stroke={isSelected ? color : 'rgba(255,255,255,0.3)'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="60" cy="65" r="3" fill={isSelected ? color : 'rgba(255,255,255,0.3)'} />
        
        {/* 大勾 - 核心视觉元素 */}
        <path
          d="M35 45 L42 52 L58 32"
          stroke={isSelected ? color : 'rgba(255,255,255,0.5)'}
          strokeWidth={isSelected ? '4' : '3'}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ filter: isSelected ? `drop-shadow(0 0 6px ${color})` : 'none' }}
        />
      </g>
    </svg>
  )
}

