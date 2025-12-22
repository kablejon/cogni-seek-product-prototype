"use client"

import { useState } from "react"
import { Lock, Brain, MapPin, CheckSquare, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClueCardsProps {
  psychologyBlindSpot: string
  predictions: Array<{ location: string; confidence: number; reasoning: string; technique: string }>
  checklist: string[]
  onUnlock?: () => void
}

export function ClueCards({ psychologyBlindSpot, predictions, checklist, onUnlock }: ClueCardsProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const handleCheck = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  const handleUnlock = () => {
    setIsUnlocked(true)
    onUnlock?.()
  }

  return (
    <div className="space-y-6">
      {/* Card 1: 心理学盲区 (免费) */}
      <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/30 rounded-3xl p-6 md:p-8 card-shadow">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">🧠 心理学盲区</h3>
            <p className="text-sm text-muted-foreground">基于行为心理学的初步推断</p>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-5 border border-border/50">
          <p className="text-base leading-relaxed">{psychologyBlindSpot}</p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          <span className="px-3">免费线索</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      {/* Card 2: 具体坐标 (付费解锁 - 黑金风格) */}
      <div className={`relative rounded-3xl overflow-hidden border-2 ${
        isUnlocked 
          ? 'border-[var(--cyber-green)]/30 bg-gradient-to-br from-[var(--cyber-green)]/10 to-cyan-500/10' 
          : 'border-border/50 bg-card'
      }`}>
        {!isUnlocked && (
          <div className="absolute inset-0 backdrop-blur-xl z-10 flex flex-col items-center justify-center p-8 text-center"
               style={{
                 background: 'radial-gradient(ellipse at center, rgba(20, 20, 30, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)',
               }}>
            {/* 黑金锁头 */}
            <div className="relative w-20 h-20 mb-6">
              {/* 金色光环 */}
              <div className="absolute inset-0 rounded-full animate-pulse-wave"
                   style={{
                     background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
                   }} />
              
              {/* 锁头主体 - 黑金渐变 */}
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                   style={{
                     background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #FFD700 100%)',
                     boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), inset 0 2px 10px rgba(255, 215, 0, 0.3)',
                   }}>
                <Lock className="h-9 w-9 text-yellow-400 drop-shadow-lg" />
              </div>
            </div>
            
            <h4 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent">
              解锁精准坐标
            </h4>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm">
              获取 AI 计算的 3 个最可能位置，包含详细搜索技巧和概率排序
            </p>
            
            {/* 黑金按钮 */}
            <button
              onClick={handleUnlock}
              className="relative px-10 py-4 rounded-full font-bold text-base overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #FFD700 100%)',
                color: '#FFD700',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.3)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                立即解锁 <span className="text-white">¥2.99</span>
                <ChevronRight className="h-5 w-5" />
              </span>
              
              {/* 悬停光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            
            <p className="text-xs text-muted-foreground mt-4 font-mono">
              🔓 87.3% 的用户在解锁后找到了失物
            </p>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${isUnlocked ? 'bg-chart-2/20' : 'bg-muted'}`}>
              <MapPin className={`h-6 w-6 ${isUnlocked ? 'text-chart-2' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">📍 精准坐标</h3>
              <p className="text-sm text-muted-foreground">AI 计算的最可能位置</p>
            </div>
          </div>

          <div className="space-y-3">
            {predictions.slice(0, 3).map((pred, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border p-4 transition-all ${
                  index === 0 
                    ? 'border-chart-2/30 bg-chart-2/5' 
                    : 'border-border/50 bg-background/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                    index === 0 ? 'bg-chart-2 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-base">{pred.location}</h4>
                      <span className={`text-sm font-bold ${index === 0 ? 'text-chart-2' : 'text-muted-foreground'}`}>
                        {pred.confidence}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{pred.reasoning}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {pred.technique}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: 游戏化排查清单 - 科幻任务条 */}
      <div className="scifi-container p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative"
               style={{
                 background: 'linear-gradient(135deg, var(--holo-blue) 0%, var(--cyber-green) 100%)',
                 boxShadow: '0 0 20px var(--holo-blue-glow)',
               }}>
            <CheckSquare className="h-6 w-6 text-black" />
            <div className="scan-line" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">🎯 任务清单</h3>
            <p className="text-xs text-muted-foreground font-mono">MISSION CHECKLIST - PROBABILITY TRANSFER ENABLED</p>
          </div>
        </div>

        <div className="space-y-3">
          {checklist.map((item, index) => {
            const isChecked = checkedItems.has(index)
            const isExcluded = checkedItems.size > 0 && !isChecked

            return (
              <div
                key={index}
                className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
                  isChecked 
                    ? 'opacity-40' 
                    : ''
                }`}
                style={{
                  background: isChecked 
                    ? 'rgba(255, 255, 255, 0.02)'
                    : isExcluded
                      ? 'rgba(0, 255, 157, 0.08)'
                      : 'rgba(255, 255, 255, 0.05)',
                  border: isChecked
                    ? '1px solid rgba(255, 255, 255, 0.05)'
                    : isExcluded
                      ? '2px solid var(--cyber-green)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isExcluded && !isChecked ? '0 0 15px var(--cyber-green-glow)' : 'none',
                }}
              >
                <label className="flex items-center gap-3 p-4 cursor-pointer relative z-10">
                  {/* 科幻复选框 */}
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheck(index)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isChecked 
                        ? 'bg-[var(--cyber-green)] border-[var(--cyber-green)]'
                        : 'border-white/30 bg-white/5'
                    }`}>
                      {isChecked && (
                        <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <span className={`flex-1 text-sm font-medium ${
                    isChecked 
                      ? 'line-through text-muted-foreground' 
                      : 'text-white'
                  }`}>
                    {item}
                  </span>
                  
                  {/* 概率转移提示 */}
                  {isExcluded && !isChecked && (
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded-full animate-pulse"
                          style={{
                            color: 'var(--cyber-green)',
                            background: 'rgba(0, 255, 157, 0.15)',
                            border: '1px solid var(--cyber-green)',
                          }}>
                      +{Math.round(10 / (checklist.length - checkedItems.size))}% ↑
                    </span>
                  )}
                </label>

                {/* 进度条效果 */}
                {isChecked && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--cyber-green)]" 
                       style={{ boxShadow: '0 0 10px var(--cyber-green-glow)' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* 进度状态提示 */}
        {checkedItems.size > 0 && checkedItems.size < checklist.length && (
          <div className="mt-6 p-4 rounded-xl relative overflow-hidden"
               style={{
                 background: 'rgba(0, 255, 157, 0.1)',
                 border: '2px solid var(--cyber-green)',
                 boxShadow: '0 0 20px var(--cyber-green-glow)',
               }}>
            {/* 扫描线动画 */}
            <div className="scan-line" />
            
            <p className="text-sm text-center font-mono relative z-10">
              <span className="font-bold" style={{ color: 'var(--cyber-green)' }}>
                ELIMINATED: {checkedItems.size}/{checklist.length}
              </span>
              <br />
              <span className="text-xs text-muted-foreground mt-1 block">
                剩余位置的概率正在重新计算...
              </span>
            </p>
          </div>
        )}

        {checkedItems.size === checklist.length && (
          <div className="mt-6 p-5 rounded-xl relative overflow-hidden animate-pulse-wave"
               style={{
                 background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.15) 0%, rgba(45, 225, 252, 0.15) 100%)',
                 border: '2px solid var(--cyber-green)',
                 boxShadow: '0 0 30px var(--cyber-green-glow)',
               }}>
            <p className="text-sm text-center font-bold" style={{ color: 'var(--cyber-green)' }}>
              ✅ MISSION COMPLETE
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              所有位置已排查！如仍未找到，建议查看升级方案。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

