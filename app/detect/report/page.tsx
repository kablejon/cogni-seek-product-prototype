"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Home, CheckCircle2, Circle, Heart, Share2, RefreshCw, Sparkles, X, Copy, Check, FileText, Image, FileJson } from "lucide-react"
import Link from "next/link"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"
import { itemCategories, locationCategories, activityCategories, moodOptions } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 社交平台图标组件
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.27-.026-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function ReportPage() {
  const { session, analysisResult, resetSession } = useSearchStore()
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const [showFoundModal, setShowFoundModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // 使用 AI 结果或备用结果
  const result = analysisResult || getDefaultAnalysisResult(session)

  // 获取显示名称的辅助函数
  const getItemName = () => {
    if (session.itemCustomName) return session.itemCustomName
    const category = itemCategories.find(c => c.id === session.itemCategory)
    const item = category?.items.find(i => i.id === session.itemType)
    return item?.label || '物品'
  }

  const getLocationName = () => {
    if (session.locationCustom) return session.locationCustom
    const category = locationCategories.find(c => c.id === session.locationCategory)
    const location = category?.subLocations.find(l => l.id === session.specificLocation)
    return location?.label || category?.label || '未指定'
  }

  const getActivityName = () => {
    if (session.activityCustom) return session.activityCustom
    const category = activityCategories.find(c => c.id === session.activityCategory)
    const activity = category?.activities.find(a => a.id === session.specificActivity)
    return activity?.label || '未指定'
  }

  const getMoodInfo = () => {
    if (session.moodCustom) return { label: session.moodCustom, icon: '❓' }
    const mood = moodOptions.find(m => m.id === session.mood)
    return { label: mood?.label || '未指定', icon: mood?.icon || '' }
  }

  const itemName = getItemName()
  const locationName = getLocationName()
  const activityName = getActivityName()
  const mood = getMoodInfo()

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const getCompassAngle = (dir: string) => {
    const angles: Record<string, number> = {
      'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
      'S': 180, 'SW': -135, 'W': -90, 'NW': -45,
    }
    return angles[dir] || 0
  }

  const getProbabilityColor = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes('very high') || l === '很高') return 'text-chart-2'
    if (l.includes('high') || l === '较高') return 'text-primary'
    if (l.includes('medium') || l === '中等') return 'text-chart-3'
    return 'text-destructive'
  }

  const translateProbabilityLevel = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes('very high')) return '很高'
    if (l.includes('high')) return '较高'
    if (l.includes('medium')) return '中等'
    if (l.includes('low')) return '较低'
    return level
  }

  // 生成报告文本
  const generateReportText = () => {
    const date = new Date().toLocaleString('zh-CN')
    return `
═══════════════════════════════════════
    CogniSeek 认知取证报告
═══════════════════════════════════════

生成时间：${date}

【基本信息】
• 丢失物品：${itemName}
• 最后位置：${locationName}
• 当时活动：${activityName}
• 情绪状态：${mood.label}

【分析结论】
找回概率：${result.probability}%（${translateProbabilityLevel(result.probabilityLevel)}）

${result.summary}

【⚡️ 优先行动】
📍 目标位置：${result.priorityAction?.target || '见下方位置列表'}
👇 具体动作：${result.priorityAction?.action || '见下方排查清单'}
🧪 原理：${result.priorityAction?.why || '基于物理学和行为心理学'}

【最可能的位置】
${result.predictions.map((p, i) => `${i + 1}. ${p.location}（${p.confidence}%）
   原因：${p.reason}
   技巧：${p.technique || '使用触觉搜索'}`).join('\n\n')}

【搜寻方位】
主要方向：${result.direction.primaryLabel}
置信度：${result.direction.confidence}%
${result.direction.description}

【🧠 认知覆盖指令】
"${result.cognitiveOverride || '用手触摸，而不是仅用眼睛看'}"

【行为模式分析】
${result.behaviorAnalysis}

【环境特征分析】
${result.environmentAnalysis}

【时间线分析】
${result.timelineAnalysis}

【排查清单】
${result.checklist.map((item, i) => `${i + 1}. ${item}`).join('\n')}

【⚠️ 如果仍未找到】
${result.stopCondition || '检查垃圾桶 → 回溯路线 → 发布寻物信息'}

【💙 给你的话】
${result.encouragement}

═══════════════════════════════════════
    由 CogniSeek 生成
    https://cogniseek.com
═══════════════════════════════════════
`.trim()
  }

  // 下载为 TXT
  const downloadAsTxt = () => {
    const text = generateReportText()
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `CogniSeek-${itemName}-报告.txt`
    a.click()
    URL.revokeObjectURL(url)
    setShowDownloadModal(false)
  }

  // 下载为 JSON
  const downloadAsJson = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      item: {
        name: itemName,
        location: locationName,
        activity: activityName,
        mood: mood.label,
      },
      analysis: result,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `CogniSeek-${itemName}-报告.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowDownloadModal(false)
  }

  // 下载为图片 (使用 html2canvas)
  const downloadAsImage = async () => {
    try {
      // 动态导入 html2canvas
      const html2canvas = (await import('html2canvas')).default
      if (reportRef.current) {
        const canvas = await html2canvas(reportRef.current, {
          backgroundColor: '#faf8f5',
          scale: 2,
        })
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = `CogniSeek-${itemName}-报告.png`
        a.click()
      }
    } catch (error) {
      console.error('图片生成失败:', error)
      alert('图片生成功能需要安装 html2canvas 库')
    }
    setShowDownloadModal(false)
  }

  // 分享功能
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `我用 CogniSeek 分析了丢失的「${itemName}」，找回概率 ${result.probability}%！快来试试这个神奇的寻物助手 🔍`

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank')
  }

  const shareToWeChat = () => {
    // 微信分享需要通过二维码或复制链接
    copyToClipboard()
    alert('链接已复制！请打开微信粘贴分享给好友')
  }

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
  }

  const shareToTikTok = () => {
    // TikTok 暂不支持直接网页分享，提示用户
    copyToClipboard()
    alert('链接已复制！请在 TikTok 中发布视频时粘贴链接')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 原生分享 API
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CogniSeek - ${itemName} 认知取证报告`,
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('分享取消或失败')
      }
    } else {
      setShowShareModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <InteractiveFog color="16, 185, 129" />
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold">CogniSeek</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex rounded-xl"
              onClick={() => setShowDownloadModal(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              下载报告
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl"
              onClick={nativeShare}
            >
              <Share2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">分享</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div ref={reportRef} className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-2/10 border border-chart-2/20">
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
              <span className="text-chart-2 font-medium text-sm">报告已生成</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">「{itemName}」认知取证报告</h1>
            <p className="text-muted-foreground">基于智能分析生成的专属寻物指南</p>
            
          </div>

          {/* Summary Card */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 card-shadow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { label: '丢失物品', value: itemName },
                { label: '最后位置', value: locationName },
                { label: '当时活动', value: activityName },
                { label: '情绪状态', value: `${mood.icon} ${mood.label}` },
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-muted-foreground text-xs">{item.label}</div>
                  <div className="font-medium truncate">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Probability */}
          <div className="bg-card rounded-2xl border border-border/50 p-8 card-shadow text-center space-y-4">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-primary/10 border-4 border-primary/20">
              <div className="text-4xl font-bold text-primary">{result.probability}%</div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">
                预测找回概率：<span className={getProbabilityColor(result.probabilityLevel)}>{translateProbabilityLevel(result.probabilityLevel)}</span>
              </h2>
              <p className="text-sm text-muted-foreground">基于深度分析的综合评估</p>
            </div>
          </div>

          {/* AI Summary */}
          {result.summary && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🎯 分析结论</h3>
                  <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Priority Action */}
          {result.priorityAction && (
            <div className="bg-chart-3/10 border-2 border-chart-3/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡️</span>
                <div>
                  <h3 className="text-lg font-bold text-chart-3">优先行动</h3>
                  <p className="text-sm text-muted-foreground">此操作可解决约 60% 的类似情况</p>
                </div>
              </div>
              <div className="space-y-3 pl-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50">
                  <span className="text-lg">📍</span>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">目标位置</div>
                    <p className="font-medium">{result.priorityAction.target}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50">
                  <span className="text-lg">👇</span>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">具体动作</div>
                    <p className="font-medium">{result.priorityAction.action}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-chart-3/5 border border-chart-3/20">
                  <span className="text-lg">🧪</span>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">科学原理</div>
                    <p className="text-sm text-muted-foreground">{result.priorityAction.why}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Encouragement */}
          <div className="bg-chart-2/5 border border-chart-2/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-chart-2/20 flex items-center justify-center">
                <Heart className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">💙 给你的话</h3>
                <p className="text-muted-foreground leading-relaxed">{result.encouragement}</p>
              </div>
            </div>
          </div>

          {/* Top Predictions */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="text-lg font-bold">推测的最可能位置</h3>
                <p className="text-sm text-muted-foreground">按可能性排序</p>
              </div>
            </div>

            <div className="space-y-3">
              {result.predictions.map((pred, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-smooth ${
                    index === 0 ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-secondary/30'
                  }`}
                >
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                    index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{pred.location}</span>
                      <span className={`text-sm font-medium ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {pred.confidence}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pred.reason}</p>
                    {pred.technique && (
                      <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-secondary/50 text-sm">
                        <span className="text-xs">🔧</span>
                        <span className="text-muted-foreground"><strong>技巧：</strong>{pred.technique}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compass */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧭</span>
              <div>
                <h3 className="text-lg font-bold">搜寻罗盘</h3>
                <p className="text-sm text-muted-foreground">空间方位分析</p>
              </div>
            </div>

            <div className="flex justify-center py-6">
              <div className="relative w-52 h-52">
                <div className="absolute inset-0 rounded-full border-2 border-border"></div>
                <div className="absolute inset-6 rounded-full border-2 border-border/50"></div>
                <div className="absolute inset-12 rounded-full border-2 border-border/30"></div>

                {['北', '南', '西', '东'].map((dir, i) => (
                  <div
                    key={dir}
                    className="absolute text-xs font-medium text-muted-foreground"
                    style={{
                      top: i === 0 ? '-8px' : i === 1 ? 'auto' : '50%',
                      bottom: i === 1 ? '-8px' : 'auto',
                      left: i === 2 ? '-12px' : i === 3 ? 'auto' : '50%',
                      right: i === 3 ? '-12px' : 'auto',
                      transform: i < 2 ? 'translateX(-50%)' : 'translateY(-50%)',
                    }}
                  >
                    {dir}
                  </div>
                ))}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>

                <div 
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                  style={{ transform: `rotate(${getCompassAngle(result.direction.primary)}deg)` }}
                >
                  <div className="w-1 h-20 bg-gradient-to-t from-primary to-chart-2 origin-bottom rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="text-xs text-muted-foreground mb-1">主要方位</div>
                <div className="font-bold text-primary">{result.direction.primaryLabel} ({result.direction.primary})</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">置信度</div>
                <div className="font-bold">{result.direction.confidence}%</div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground p-4 rounded-xl bg-secondary/30">{result.direction.description}</p>
          </div>

          {/* Analysis */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="text-lg font-bold">侦探侧写</h3>
                <p className="text-sm text-muted-foreground">三维科学寻物系统分析</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span>🧠</span> 行为模式分析
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.behaviorAnalysis}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span>🏠</span> 环境特征分析
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.environmentAnalysis}</p>
              </div>

              {result.timelineAnalysis && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span>⏰</span> 时间线分析
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.timelineAnalysis}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cognitive Override */}
          {result.cognitiveOverride && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-3">认知覆盖指令</h3>
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <p className="text-muted-foreground leading-relaxed italic">"{result.cognitiveOverride}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Checklist */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="text-lg font-bold">定制排查清单</h3>
                <p className="text-sm text-muted-foreground">针对「{itemName}」的专属建议</p>
              </div>
            </div>

            <div className="space-y-2">
              {result.checklist.map((item, index) => (
                <button
                  key={index}
                  onClick={() => toggleItem(index)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-smooth text-left ${
                    checkedItems.includes(index)
                      ? "border-primary/30 bg-primary/5"
                      : "border-border/50 hover:border-border bg-background"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {checkedItems.includes(index) ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className={`text-sm ${checkedItems.includes(index) ? "line-through text-muted-foreground" : ""}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                已完成 <span className="font-bold text-foreground">{checkedItems.length}</span> / {result.checklist.length} 项
              </p>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${(checkedItems.length / result.checklist.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Stop Condition */}
            {result.stopCondition && (
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-chart-3/50 via-chart-3/30 to-transparent"></div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <span className="text-base">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-chart-3">●</span>
                      <span>如果仍未找到</span>
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.stopCondition}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Found Section */}
          <div className="bg-chart-2/5 border-2 border-chart-2/30 rounded-2xl p-8 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <h3 className="text-xl font-bold">找到了吗？</h3>
            <p className="text-muted-foreground">如果成功找回，我们很想听听你的故事！</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg" 
                className="rounded-xl bg-chart-2 hover:bg-chart-2/90"
                onClick={() => setShowFoundModal(true)}
              >
                🎊 我找到了！
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl">
                还在找...
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link href="/"><Home className="mr-2 h-5 w-5" /> 返回首页</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl" onClick={resetSession}>
              <RefreshCw className="mr-2 h-5 w-5" /> 重新分析
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          本报告由 CogniSeek 生成 · 有效期 24 小时 · 可重复查看
        </div>
      </footer>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full card-shadow animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">下载报告</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowDownloadModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              <button
                onClick={downloadAsTxt}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">文本格式 (.txt)</div>
                  <div className="text-sm text-muted-foreground">纯文本，便于阅读和打印</div>
                </div>
              </button>
              <button
                onClick={downloadAsJson}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FileJson className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">数据格式 (.json)</div>
                  <div className="text-sm text-muted-foreground">结构化数据，便于程序处理</div>
                </div>
              </button>
              <button
                onClick={downloadAsImage}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Image className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">图片格式 (.png)</div>
                  <div className="text-sm text-muted-foreground">长图截图，便于分享</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full card-shadow animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">分享报告</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button
                onClick={shareToWeChat}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <WeChatIcon />
                </div>
                <span className="text-xs">微信</span>
              </button>
              <button
                onClick={shareToTwitter}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white">
                  <TwitterIcon />
                </div>
                <span className="text-xs">X</span>
              </button>
              <button
                onClick={shareToFacebook}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <FacebookIcon />
                </div>
                <span className="text-xs">Facebook</span>
              </button>
              <button
                onClick={shareToTikTok}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white">
                  <TikTokIcon />
                </div>
                <span className="text-xs">TikTok</span>
              </button>
              <button
                onClick={shareToWhatsApp}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <WhatsAppIcon />
                </div>
                <span className="text-xs">WhatsApp</span>
              </button>
            </div>
            <div className="border-t border-border/50 pt-4">
              <p className="text-sm text-muted-foreground mb-3">或复制链接</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-secondary rounded-xl border border-border/50 truncate"
                />
                <Button onClick={copyToClipboard} className="rounded-xl">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Found Modal */}
      {showFoundModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center space-y-5 card-shadow animate-in fade-in zoom-in duration-200">
            <div className="text-5xl">🎉</div>
            <h3 className="text-2xl font-bold">太棒了！恭喜找到了！</h3>
            <p className="text-muted-foreground">
              我们很高兴分析能帮助你。分享你的成功故事，帮助更多人找回失物。
            </p>
            <div className="flex flex-col gap-3">
              <Button size="lg" className="rounded-xl" onClick={() => { setShowFoundModal(false); setShowShareModal(true); }}>
                <Share2 className="mr-2 h-5 w-5" /> 分享成功故事
              </Button>
              <Button variant="ghost" onClick={() => setShowFoundModal(false)}>
                稍后再说
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
