'use client'

import React from 'react'

interface HolographicIconProps {
  isSelected?: boolean
  className?: string
}

// 日常必需品 - 水晶托盘
export function DailyItemsIcon({ isSelected = false, className = '' }: HolographicIconProps) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="daily-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? "#2DE1FC" : "#6B7280"} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={isSelected ? "#0EA5E9" : "#374151"} stopOpacity="0.3"/>
        </linearGradient>
        <filter id="daily-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={isSelected ? "3" : "1.5"}/>
        </filter>
      </defs>
      
      {/* 背景光晕 */}
      {isSelected && (
        <circle cx="60" cy="60" r="50" fill="url(#daily-glow)" opacity="0.3" filter="url(#daily-blur)"/>
      )}
      
      {/* 托盘底座 - 等距视角 */}
      <path 
        d="M 30 70 L 60 85 L 90 70 L 90 65 L 60 80 L 30 65 Z" 
        fill="url(#daily-glow)" 
        opacity={isSelected ? "0.5" : "0.3"}
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="1"
      />
      
      {/* 钥匙图标 */}
      <g transform="translate(60, 45)">
        <circle 
          cx="0" 
          cy="0" 
          r="6" 
          fill="none" 
          stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
          strokeWidth="2"
        />
        <line 
          x1="0" 
          y1="6" 
          x2="0" 
          y2="18" 
          stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
          strokeWidth="2"
        />
        <line 
          x1="-3" 
          y1="14" 
          x2="0" 
          y2="14" 
          stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
          strokeWidth="2"
        />
      </g>
      
      {/* 内部发光 */}
      {isSelected && (
        <circle cx="60" cy="45" r="8" fill="#2DE1FC" opacity="0.4" filter="url(#daily-blur)"/>
      )}
    </svg>
  )
}

// 数码产品 - 发光玻璃手机
export function DigitalIcon({ isSelected = false, className = '' }: HolographicIconProps) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="digital-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? "#2DE1FC" : "#6B7280"} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={isSelected ? "#0EA5E9" : "#374151"} stopOpacity="0.3"/>
        </linearGradient>
        <filter id="digital-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={isSelected ? "3" : "1.5"}/>
        </filter>
      </defs>
      
      {/* 背景光晕 */}
      {isSelected && (
        <ellipse cx="60" cy="60" rx="45" ry="50" fill="url(#digital-glow)" opacity="0.3" filter="url(#digital-blur)"/>
      )}
      
      {/* 手机外框 - 磨砂玻璃 */}
      <rect 
        x="40" 
        y="30" 
        width="40" 
        height="60" 
        rx="6" 
        fill="url(#digital-glow)" 
        opacity={isSelected ? "0.4" : "0.25"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 屏幕 */}
      <rect 
        x="44" 
        y="36" 
        width="32" 
        height="48" 
        rx="2" 
        fill={isSelected ? "#0EA5E9" : "#374151"} 
        opacity={isSelected ? "0.3" : "0.2"}
      />
      
      {/* 摄像头 */}
      <circle 
        cx="60" 
        cy="34" 
        r="1.5" 
        fill={isSelected ? "#2DE1FC" : "#6B7280"}
      />
      
      {/* 能量流光线 */}
      {isSelected && (
        <>
          <path 
            d="M 50 50 Q 60 55, 70 50" 
            stroke="#2DE1FC" 
            strokeWidth="0.5" 
            fill="none" 
            opacity="0.6"
          />
          <path 
            d="M 48 60 Q 60 65, 72 60" 
            stroke="#0EA5E9" 
            strokeWidth="0.5" 
            fill="none" 
            opacity="0.6"
          />
        </>
      )}
      
      {/* 内部发光核心 */}
      {isSelected && (
        <circle cx="60" cy="60" r="12" fill="#2DE1FC" opacity="0.2" filter="url(#digital-blur)"/>
      )}
    </svg>
  )
}

// 证件文件 - 叠加磨砂玻璃卡片
export function DocumentsIcon({ isSelected = false, className = '' }: HolographicIconProps) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="docs-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? "#2DE1FC" : "#6B7280"} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={isSelected ? "#0EA5E9" : "#374151"} stopOpacity="0.3"/>
        </linearGradient>
        <filter id="docs-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={isSelected ? "3" : "1.5"}/>
        </filter>
      </defs>
      
      {/* 背景光晕 */}
      {isSelected && (
        <rect x="20" y="20" width="80" height="80" rx="8" fill="url(#docs-glow)" opacity="0.2" filter="url(#docs-blur)"/>
      )}
      
      {/* 后面的卡片 */}
      <rect 
        x="38" 
        y="42" 
        width="50" 
        height="36" 
        rx="3" 
        fill="url(#docs-glow)" 
        opacity={isSelected ? "0.35" : "0.2"}
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="1"
      />
      
      {/* 前面的卡片 */}
      <rect 
        x="32" 
        y="36" 
        width="50" 
        height="36" 
        rx="3" 
        fill="url(#docs-glow)" 
        opacity={isSelected ? "0.5" : "0.3"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 人像 */}
      <circle 
        cx="45" 
        cy="48" 
        r="5" 
        fill={isSelected ? "#2DE1FC" : "#6B7280"} 
        opacity="0.6"
      />
      <path 
        d="M 37 62 Q 45 58, 53 62" 
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="1.5" 
        fill="none" 
        opacity="0.6"
      />
      
      {/* 文字线条 */}
      <line x1="60" y1="46" x2="75" y2="46" stroke={isSelected ? "#0EA5E9" : "#6B7280"} strokeWidth="1" opacity="0.5"/>
      <line x1="60" y1="52" x2="75" y2="52" stroke={isSelected ? "#0EA5E9" : "#6B7280"} strokeWidth="1" opacity="0.5"/>
      <line x1="60" y1="58" x2="70" y2="58" stroke={isSelected ? "#0EA5E9" : "#6B7280"} strokeWidth="1" opacity="0.5"/>
      
      {/* 安全盾牌 */}
      <path 
        d="M 75 30 L 75 40 Q 75 44, 71 46 L 75 50 L 79 46 Q 83 44, 83 40 L 83 30 Z" 
        fill={isSelected ? "#2DE1FC" : "#6B7280"} 
        opacity={isSelected ? "0.7" : "0.4"}
      />
      
      {/* 内部发光 */}
      {isSelected && (
        <rect x="32" y="36" width="50" height="36" rx="3" fill="#2DE1FC" opacity="0.15" filter="url(#docs-blur)"/>
      )}
    </svg>
  )
}

// 贵重物品 - 多面体钻石
export function ValuablesIcon({ isSelected = false, className = '' }: HolographicIconProps) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gem-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? "#2DE1FC" : "#6B7280"} stopOpacity="0.8"/>
          <stop offset="50%" stopColor={isSelected ? "#8B5CF6" : "#4B5563"} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={isSelected ? "#0EA5E9" : "#374151"} stopOpacity="0.4"/>
        </linearGradient>
        <filter id="gem-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={isSelected ? "4" : "2"}/>
        </filter>
        <filter id="gem-sparkle">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
          <feColorMatrix type="saturate" values={isSelected ? "3" : "1"}/>
        </filter>
      </defs>
      
      {/* 璀璨光晕 */}
      {isSelected && (
        <circle cx="60" cy="60" r="40" fill="url(#gem-glow)" opacity="0.4" filter="url(#gem-blur)"/>
      )}
      
      {/* 钻石顶部 */}
      <path 
        d="M 45 40 L 60 30 L 75 40 L 60 50 Z" 
        fill="url(#gem-glow)" 
        opacity={isSelected ? "0.6" : "0.4"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 钻石中部 */}
      <path 
        d="M 40 50 L 60 50 L 80 50 L 60 85 Z" 
        fill="url(#gem-glow)" 
        opacity={isSelected ? "0.4" : "0.25"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 钻石切面细节 */}
      <line x1="45" y1="40" x2="40" y2="50" stroke={isSelected ? "#2DE1FC" : "#6B7280"} strokeWidth="0.8" opacity="0.6"/>
      <line x1="75" y1="40" x2="80" y2="50" stroke={isSelected ? "#2DE1FC" : "#6B7280"} strokeWidth="0.8" opacity="0.6"/>
      <line x1="60" y1="50" x2="60" y2="85" stroke={isSelected ? "#2DE1FC" : "#6B7280"} strokeWidth="0.8" opacity="0.6"/>
      <line x1="40" y1="50" x2="60" y2="85" stroke={isSelected ? "#0EA5E9" : "#6B7280"} strokeWidth="0.5" opacity="0.4"/>
      <line x1="80" y1="50" x2="60" y2="85" stroke={isSelected ? "#0EA5E9" : "#6B7280"} strokeWidth="0.5" opacity="0.4"/>
      
      {/* 内部戒指 */}
      <ellipse 
        cx="60" 
        cy="60" 
        rx="8" 
        ry="4" 
        fill="none" 
        stroke={isSelected ? "#F59E0B" : "#6B7280"} 
        strokeWidth="2"
        opacity={isSelected ? "0.8" : "0.5"}
      />
      
      {/* 光芒闪烁 */}
      {isSelected && (
        <>
          <line x1="60" y1="20" x2="60" y2="28" stroke="#2DE1FC" strokeWidth="1.5" opacity="0.8" filter="url(#gem-sparkle)"/>
          <line x1="35" y1="35" x2="42" y2="42" stroke="#0EA5E9" strokeWidth="1" opacity="0.6" filter="url(#gem-sparkle)"/>
          <line x1="85" y1="35" x2="78" y2="42" stroke="#8B5CF6" strokeWidth="1" opacity="0.6" filter="url(#gem-sparkle)"/>
        </>
      )}
      
      {/* 核心光爆 */}
      {isSelected && (
        <circle cx="60" cy="55" r="15" fill="#2DE1FC" opacity="0.25" filter="url(#gem-blur)"/>
      )}
    </svg>
  )
}

// 宠物 - 圆润猫咪剪影
export function PetIcon({ isSelected = false, className = '' }: HolographicIconProps) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pet-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? "#2DE1FC" : "#6B7280"} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={isSelected ? "#F59E0B" : "#374151"} stopOpacity="0.4"/>
        </linearGradient>
        <filter id="pet-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={isSelected ? "3" : "1.5"}/>
        </filter>
      </defs>
      
      {/* 背景光晕 */}
      {isSelected && (
        <circle cx="60" cy="65" r="45" fill="url(#pet-glow)" opacity="0.3" filter="url(#pet-blur)"/>
      )}
      
      {/* 猫耳朵左 */}
      <path 
        d="M 40 45 L 35 30 L 48 40 Z" 
        fill="url(#pet-glow)" 
        opacity={isSelected ? "0.5" : "0.3"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 猫耳朵右 */}
      <path 
        d="M 80 45 L 85 30 L 72 40 Z" 
        fill="url(#pet-glow)" 
        opacity={isSelected ? "0.5" : "0.3"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 猫头 */}
      <circle 
        cx="60" 
        cy="60" 
        r="25" 
        fill="url(#pet-glow)" 
        opacity={isSelected ? "0.4" : "0.25"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 猫眼睛 */}
      <ellipse 
        cx="52" 
        cy="58" 
        rx="3" 
        ry="5" 
        fill={isSelected ? "#2DE1FC" : "#6B7280"}
        opacity={isSelected ? "0.8" : "0.6"}
      />
      <ellipse 
        cx="68" 
        cy="58" 
        rx="3" 
        ry="5" 
        fill={isSelected ? "#2DE1FC" : "#6B7280"}
        opacity={isSelected ? "0.8" : "0.6"}
      />
      
      {/* 猫鼻子 */}
      <path 
        d="M 60 65 L 57 68 L 63 68 Z" 
        fill={isSelected ? "#F59E0B" : "#6B7280"}
        opacity="0.7"
      />
      
      {/* 猫嘴 */}
      <path 
        d="M 60 68 Q 55 72, 50 70" 
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="1" 
        fill="none" 
        opacity="0.6"
      />
      <path 
        d="M 60 68 Q 65 72, 70 70" 
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="1" 
        fill="none" 
        opacity="0.6"
      />
      
      {/* 项圈光环 */}
      <ellipse 
        cx="60" 
        cy="80" 
        rx="20" 
        ry="4" 
        fill="none" 
        stroke={isSelected ? "#F59E0B" : "#6B7280"} 
        strokeWidth={isSelected ? "2.5" : "2"}
        opacity={isSelected ? "0.9" : "0.5"}
      />
      
      {/* 项圈吊坠 */}
      <circle 
        cx="60" 
        cy="82" 
        r="2.5" 
        fill={isSelected ? "#F59E0B" : "#6B7280"}
        opacity={isSelected ? "0.9" : "0.6"}
      />
      
      {/* 内部发光 */}
      {isSelected && (
        <>
          <circle cx="60" cy="60" r="18" fill="#2DE1FC" opacity="0.2" filter="url(#pet-blur)"/>
          <circle cx="60" cy="80" r="15" fill="#F59E0B" opacity="0.25" filter="url(#pet-blur)"/>
        </>
      )}
    </svg>
  )
}

// 其他物品 - 半透明背包
export function OtherItemsIcon({ isSelected = false, className = '' }: HolographicIconProps) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="other-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? "#2DE1FC" : "#6B7280"} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={isSelected ? "#0EA5E9" : "#374151"} stopOpacity="0.3"/>
        </linearGradient>
        <filter id="other-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={isSelected ? "3" : "1.5"}/>
        </filter>
      </defs>
      
      {/* 背景光晕 */}
      {isSelected && (
        <rect x="25" y="25" width="70" height="70" rx="10" fill="url(#other-glow)" opacity="0.3" filter="url(#other-blur)"/>
      )}
      
      {/* 背包主体 */}
      <path 
        d="M 35 45 L 35 85 Q 35 90, 40 90 L 80 90 Q 85 90, 85 85 L 85 45 Z" 
        fill="url(#other-glow)" 
        opacity={isSelected ? "0.4" : "0.25"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 背包顶盖 */}
      <rect 
        x="35" 
        y="40" 
        width="50" 
        height="8" 
        rx="2" 
        fill="url(#other-glow)" 
        opacity={isSelected ? "0.5" : "0.3"}
        stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} 
        strokeWidth="1.5"
      />
      
      {/* 拉链（神秘光芒） */}
      <line 
        x1="60" 
        y1="45" 
        x2="60" 
        y2="85" 
        stroke={isSelected ? "#F59E0B" : "#6B7280"} 
        strokeWidth={isSelected ? "2" : "1.5"}
        opacity={isSelected ? "0.8" : "0.5"}
      />
      
      {/* 拉链头 */}
      <circle 
        cx="60" 
        cy="48" 
        r="3" 
        fill={isSelected ? "#F59E0B" : "#6B7280"}
        opacity={isSelected ? "0.9" : "0.6"}
      />
      
      {/* 背包肩带 */}
      <path 
        d="M 45 40 Q 40 35, 40 30" 
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="2" 
        fill="none" 
        opacity="0.6"
      />
      <path 
        d="M 75 40 Q 80 35, 80 30" 
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="2" 
        fill="none" 
        opacity="0.6"
      />
      
      {/* 侧袋 */}
      <ellipse 
        cx="30" 
        cy="65" 
        rx="5" 
        ry="12" 
        fill="url(#other-glow)" 
        opacity={isSelected ? "0.35" : "0.2"}
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="1"
      />
      <ellipse 
        cx="90" 
        cy="65" 
        rx="5" 
        ry="12" 
        fill="url(#other-glow)" 
        opacity={isSelected ? "0.35" : "0.2"}
        stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
        strokeWidth="1"
      />
      
      {/* 加号晶体 */}
      <g transform="translate(85, 35)">
        <circle 
          cx="0" 
          cy="0" 
          r="8" 
          fill={isSelected ? "#2DE1FC" : "#374151"} 
          opacity={isSelected ? "0.4" : "0.3"}
          stroke={isSelected ? "#2DE1FC" : "#6B7280"} 
          strokeWidth="1.5"
        />
        <line x1="0" y1="-4" x2="0" y2="4" stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} strokeWidth="1.5"/>
        <line x1="-4" y1="0" x2="4" y2="0" stroke={isSelected ? "#2DE1FC" : "#9CA3AF"} strokeWidth="1.5"/>
      </g>
      
      {/* 拉链光芒 */}
      {isSelected && (
        <>
          <line x1="58" y1="55" x2="50" y2="55" stroke="#F59E0B" strokeWidth="0.8" opacity="0.6"/>
          <line x1="62" y1="55" x2="70" y2="55" stroke="#F59E0B" strokeWidth="0.8" opacity="0.6"/>
          <line x1="58" y1="65" x2="50" y2="65" stroke="#F59E0B" strokeWidth="0.8" opacity="0.5"/>
          <line x1="62" y1="65" x2="70" y2="65" stroke="#F59E0B" strokeWidth="0.8" opacity="0.5"/>
        </>
      )}
      
      {/* 内部发光 */}
      {isSelected && (
        <rect x="40" y="50" width="40" height="35" rx="4" fill="#2DE1FC" opacity="0.2" filter="url(#other-blur)"/>
      )}
    </svg>
  )
}




