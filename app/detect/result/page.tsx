"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, CheckCircle2, Brain } from "lucide-react"
import Link from "next/link"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"
import { itemCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

export default function ResultPage() {
  const { session, analysisResult } = useSearchStore()
  const [mounted, setMounted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 添加展示动画延迟
    const timer = setTimeout(() => setShowDetails(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  // 使用 AI 结果或备用结果
  const result = analysisResult || getDefaultAnalysisResult(session)

  // 获取物品名称
  const getItemName = () => {
    if (session.itemCustomName) return session.itemCustomName
    const category = itemCategories.find(c => c.id === session.itemCategory)
    const item = category?.items.find(i => i.id === session.itemType)
    return item?.label || '物品'
  }

  const itemName = getItemName()

  const getProbabilityColor = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes('very high') || l === '很高') return 'text-chart-2'
    if (l.includes('high') || l === '较高') return 'text-primary'
    if (l.includes('medium') || l === '中等') return 'text-chart-3'
    return 'text-destructive'
  }

  const getProbabilityBg = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes('very high') || l === '很高') return 'bg-chart-2/10 border-chart-2/30'
    if (l.includes('high') || l === '较高') return 'bg-primary/10 border-primary/30'
    if (l.includes('medium') || l === '中等') return 'bg-chart-3/10 border-chart-3/30'
    return 'bg-destructive/10 border-destructive/30'
  }

  const translateProbabilityLevel = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes('very high')) return '很高'
    if (l.includes('high')) return '较高'
    if (l.includes('medium')) return '中等'
    if (l.includes('low')) return '较低'
    return level
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <InteractiveFog color="6, 182, 212" />
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold">CogniSeek</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Indicator */}
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-chart-2/20 transition-all duration-500 ${showDetails ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <CheckCircle2 className="h-10 w-10 text-chart-2" />
            </div>
            <div className={`space-y-2 transition-all duration-500 delay-200 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <h1 className="text-2xl md:text-3xl font-bold">分析完成！</h1>
              <p className="text-muted-foreground">根据你提供的信息，我们已经完成了「{itemName}」的寻物分析</p>
              
            </div>
          </div>

          {/* Probability Card */}
          <div className={`bg-card rounded-3xl border border-border/50 p-8 card-shadow text-center transition-all duration-500 delay-300 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/20 mb-6">
              <div className="text-5xl font-bold text-primary">{result.probability}%</div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4 ${getProbabilityBg(result.probabilityLevel)}`}>
              <span className={`font-semibold ${getProbabilityColor(result.probabilityLevel)}`}>
                找回概率：{translateProbabilityLevel(result.probabilityLevel)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">基于三维科学寻物系统分析的综合评估</p>
          </div>

          {/* Summary */}
          {result.summary && (
            <div className={`bg-primary/5 border border-primary/20 rounded-2xl p-6 transition-all duration-500 delay-400 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">初步分析</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Priority Action */}
          {result.priorityAction && (
            <div className={`bg-chart-3/10 border-2 border-chart-3/30 rounded-2xl p-6 transition-all duration-500 delay-450 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center text-lg">
                  ⚡️
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-chart-3">立即行动</h3>
                    <p className="text-xs text-muted-foreground">此操作可解决约 60% 的类似情况</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-chart-3 mt-0.5">📍</span>
                      <p className="text-sm"><strong>目标位置：</strong>{result.priorityAction.target}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-chart-3 mt-0.5">👇</span>
                      <p className="text-sm"><strong>具体动作：</strong>{result.priorityAction.action}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-chart-3 mt-0.5">🧪</span>
                      <p className="text-sm text-muted-foreground">{result.priorityAction.why}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Predictions */}
          <div className={`bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-4 transition-all duration-500 delay-500 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-bold">🎯 最可能的位置</h3>
            </div>

            <div className="space-y-3">
              {result.predictions.slice(0, 3).map((pred, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-smooth ${
                    index === 0 ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-secondary/30'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{pred.location}</span>
                      <span className={`text-sm font-medium ml-2 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {pred.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Encouragement */}
          <div className={`text-center p-6 rounded-2xl bg-chart-2/5 border border-chart-2/20 transition-all duration-500 delay-600 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <p className="text-muted-foreground leading-relaxed">{result.encouragement}</p>
          </div>

          {/* CTA */}
          <div className={`text-center space-y-4 transition-all duration-500 delay-700 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Button asChild size="lg" className="rounded-xl text-base px-8">
              <Link href="/detect/report">
                查看完整报告
                <span className="ml-2">→</span>
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              包含详细的搜寻方位指南、行为分析和定制排查清单
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
