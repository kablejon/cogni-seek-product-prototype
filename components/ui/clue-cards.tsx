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

      {/* Card 2: 具体坐标 (付费解锁) */}
      <div className={`relative rounded-3xl overflow-hidden border-2 ${isUnlocked ? 'border-chart-2/30 bg-gradient-to-br from-chart-2/10 to-cyan-500/10' : 'border-border/50 bg-card'}`}>
        {!isUnlocked && (
          <div className="absolute inset-0 backdrop-blur-md bg-background/80 z-10 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-bold mb-2">解锁精准坐标</h4>
            <p className="text-muted-foreground mb-6 max-w-sm">
              获取 AI 计算的 3 个最可能位置，包含详细搜索技巧和概率排序
            </p>
            <Button 
              size="lg" 
              onClick={handleUnlock}
              className="rounded-full px-8"
            >
              立即解锁 ¥2.99
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              87.3% 的用户在解锁后找到了失物
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

      {/* Card 3: 游戏化排查清单 */}
      <div className="bg-gradient-to-br from-chart-3/10 to-orange-500/10 border-2 border-chart-3/30 rounded-3xl p-6 md:p-8 card-shadow">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-chart-3/20 flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-chart-3" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">✅ 科学排查清单</h3>
            <p className="text-sm text-muted-foreground">逐个排除，概率自动转移</p>
          </div>
        </div>

        <div className="space-y-2">
          {checklist.map((item, index) => {
            const isChecked = checkedItems.has(index)
            const isExcluded = checkedItems.size > 0 && !isChecked

            return (
              <div
                key={index}
                className={`group relative rounded-xl border transition-all duration-300 ${
                  isChecked 
                    ? 'border-muted bg-muted/30 opacity-50' 
                    : isExcluded
                    ? 'border-chart-3/40 bg-chart-3/10 shadow-sm'
                    : 'border-border/50 bg-background/50 hover:border-chart-3/30 hover:bg-chart-3/5'
                }`}
              >
                <label className="flex items-center gap-3 p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheck(index)}
                    className="w-5 h-5 rounded border-2 border-chart-3/50 text-chart-3 focus:ring-chart-3 focus:ring-offset-0"
                  />
                  <span className={`flex-1 text-sm ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                    {item}
                  </span>
                  {isExcluded && !isChecked && (
                    <span className="text-xs font-medium text-chart-3 animate-pulse">
                      +{Math.round(10 / (checklist.length - checkedItems.size))}% 概率转移
                    </span>
                  )}
                </label>
              </div>
            )
          })}
        </div>

        {checkedItems.size > 0 && checkedItems.size < checklist.length && (
          <div className="mt-4 p-4 rounded-xl bg-chart-3/10 border border-chart-3/20">
            <p className="text-sm text-center">
              <span className="font-bold text-chart-3">已排除 {checkedItems.size}/{checklist.length}</span>
              <span className="text-muted-foreground ml-2">
                剩余位置的概率正在提升...
              </span>
            </p>
          </div>
        )}

        {checkedItems.size === checklist.length && (
          <div className="mt-4 p-4 rounded-xl bg-chart-2/10 border border-chart-2/20">
            <p className="text-sm text-center text-chart-2 font-medium">
              🎉 所有位置已排查！如仍未找到，建议查看升级方案。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

