"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"
import { itemCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"
import { ConfidenceMeter } from "@/components/ui/confidence-meter"
import { ClueCards } from "@/components/ui/clue-cards"

export default function ResultPage() {
  const { session, analysisResult } = useSearchStore()
  const [mounted, setMounted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 添加展示动画延迟
    const timer = setTimeout(() => setShowDetails(true), 300)
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

  // 构建心理学盲区文案
  const getPsychologyBlindSpot = () => {
    const mood = session.mood || '正常'
    const activity = session.activity || '日常活动'
    
    let blindSpot = `根据你当时的心理状态【${mood}】和【${activity}】，`
    
    if (mood.includes('着急') || mood.includes('焦虑') || mood.includes('慌')) {
      blindSpot += '你很可能出现了"隧道视野效应"——注意力高度集中在目标上，导致周边视觉盲区扩大。'
      blindSpot += `\n\n💡 关键推断：${itemName}极有可能在【视线水平线以下】或【身体移动路径的右侧】（右利手盲区）。`
    } else if (mood.includes('疲惫') || mood.includes('累')) {
      blindSpot += '疲劳状态会显著降低工作记忆容量，导致"自动驾驶"行为增多。'
      blindSpot += `\n\n💡 关键推断：${itemName}很可能被放置在【习惯性位置】而非你有意识放置的地方。`
    } else {
      blindSpot += '在正常状态下，物品遗失通常是由于"注意力分散"或"环境干扰"。'
      blindSpot += `\n\n💡 关键推断：${itemName}可能在【多任务切换】时被遗忘在过渡区域。`
    }

    return blindSpot
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
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Success Header */}
          <div className={`text-center space-y-4 transition-all duration-700 ${showDetails ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-chart-2/20 animate-pulse-soft">
              <CheckCircle2 className="h-10 w-10 text-chart-2" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">分析完成！</h1>
              <p className="text-muted-foreground text-lg">
                根据你提供的信息，我们已完成「{itemName}」的<span className="text-primary font-semibold">三维科学寻物分析</span>
              </p>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className={`transition-all duration-700 delay-200 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-card rounded-3xl border border-border/50 p-8 md:p-10 card-shadow">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold mb-2">🎯 找回概率评估</h2>
                <p className="text-sm text-muted-foreground">基于 15,000+ 真实案例的 AI 推算</p>
              </div>
              <ConfidenceMeter probability={result.probability} />
              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-center text-muted-foreground leading-relaxed">
                  {result.summary || `根据物品特性、环境因素和行为模式的综合分析，我们预测${itemName}的找回概率为 ${result.probability}%`}
                </p>
              </div>
            </div>
          </div>

          {/* 战术指导：卡片式线索链 */}
          <div className={`transition-all duration-700 delay-400 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">战术指导</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">线索拼图</h2>
              <p className="text-muted-foreground">从心理学推断到精准坐标，逐步缩小搜索范围</p>
            </div>

            <ClueCards
              psychologyBlindSpot={getPsychologyBlindSpot()}
              predictions={result.predictions || []}
              checklist={result.checklist || [
                "📍 物理陷阱：趴下用手电筒照射家具底部的最深处角落",
                "🧠 记忆故障：检查进门后的'自动驾驶'区域（玄关、卫生间）",
                "👁️ 视觉盲区：站在椅子上，检查柜顶、冰箱顶等高处",
                "👥 社交干扰：询问家人是否'整理'过，检查垃圾桶、洗衣机"
              ]}
            />
          </div>

          {/* 完整报告 CTA */}
          <div className={`text-center space-y-4 transition-all duration-700 delay-600 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
              <h3 className="font-bold text-lg mb-2">🎁 还想要更多？</h3>
              <p className="text-sm text-muted-foreground mb-4">
                完整报告包含：方位罗盘、行为分析、环境盲区扫描、时间线推演
              </p>
              <Button asChild size="lg" className="rounded-full text-base px-8">
                <Link href="/detect/report">
                  查看完整专业报告
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-chart-2" />
                <span>87.3% 找回率</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-chart-2" />
                <span>15,000+ 成功案例</span>
              </div>
            </div>
          </div>

          {/* Encouragement */}
          {result.encouragement && (
            <div className={`text-center p-6 rounded-2xl bg-chart-2/5 border border-chart-2/20 transition-all duration-700 delay-700 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <p className="text-muted-foreground leading-relaxed">{result.encouragement}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
