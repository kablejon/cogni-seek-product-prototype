"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Home, CheckCircle2, Circle, Bell, Image as ImageIcon, RefreshCw, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"
import { itemCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 战术清单（4大算法）- 移到组件外部避免初始化顺序问题
const tacticalChecklist = [
  {
    id: 1,
    icon: '💡',
    title: '指令 01（光学破防）',
    description: '关闭顶部吸顶灯，开启手机闪光灯贴地侧照。寻找【非常规材质反光点】。',
    algorithm: '光学原理'
  },
  {
    id: 2,
    icon: '👁️',
    title: '指令 02（盲区扫描）',
    description: '视线有欺骗性。此刻伸手深入【红色热力区】深处，进行扇形盲触。',
    algorithm: '触觉优先'
  },
  {
    id: 3,
    icon: '🔄',
    title: '指令 03（第三者逻辑）',
    description: '排查【非自主移动】因素：检查宠物窝、扫地机器人尘盒或被家人顺手收走的区域。',
    algorithm: '社会工程'
  },
  {
    id: 4,
    icon: '🧭',
    title: '指令 04（记忆逆行）',
    description: '前往习惯【非常规性区域】：去卫生间台面或玄关看看，是否因临时动作而遗落。',
    algorithm: '行为回溯'
  }
]

export default function ReportPage() {
  const router = useRouter()
  const { session, analysisResult, resetSession } = useSearchStore()
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const [showPlanB, setShowPlanB] = useState(false)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
    // 创建音效（简单的提示音）
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjKL0fPTgjMGHm7A7+OZURE')
    }
  }, [])

  useEffect(() => {
    // 检查是否所有清单完成但还未显示 Plan B
    if (checkedItems.length === tacticalChecklist.length && checkedItems.length > 0 && !showPlanB) {
      const timer = setTimeout(() => {
        setShowPlanB(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [checkedItems.length, showPlanB])

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
  const locationCategory = session.locationCategory || 'home'

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => {
      const isChecked = prev.includes(index)
      if (!isChecked) {
        // 播放完成音效
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => {})
        }
        return [...prev, index]
      } else {
        return prev.filter((i) => i !== index)
      }
    })
  }

  // 3D热力图热点（根据场景动态变化）
  const getHeatmapData = () => {
    const baseData = {
      home: {
        title: '家居空间热力扫描',
        hotspots: [
          { x: 30, y: 60, level: 'high', label: '沙发缝隙' },
          { x: 70, y: 40, level: 'high', label: '桌面背后' },
          { x: 50, y: 80, level: 'medium', label: '地毯边缘' },
          { x: 85, y: 25, level: 'medium', label: '柜顶' }
        ]
      },
      office: {
        title: '办公空间热力扫描',
        hotspots: [
          { x: 40, y: 50, level: 'high', label: '办公桌抽屉' },
          { x: 65, y: 35, level: 'high', label: '椅子下方' },
          { x: 80, y: 60, level: 'medium', label: '文件夹间' },
          { x: 25, y: 70, level: 'medium', label: '茶水间' }
        ]
      },
      transit: {
        title: '车内空间热力扫描',
        hotspots: [
          { x: 35, y: 55, level: 'high', label: '座椅缝隙' },
          { x: 60, y: 45, level: 'high', label: '车门储物槽' },
          { x: 75, y: 70, level: 'medium', label: '后备箱角落' },
          { x: 50, y: 30, level: 'medium', label: '脚垫下' }
        ]
      },
      outdoor: {
        title: '公共空间热力扫描',
        hotspots: [
          { x: 40, y: 60, level: 'high', label: '座位缝隙' },
          { x: 70, y: 50, level: 'high', label: '台面边缘' },
          { x: 55, y: 75, level: 'medium', label: '地面角落' },
          { x: 80, y: 35, level: 'medium', label: '柜台后方' }
        ]
      }
    }
    
    return baseData[locationCategory as keyof typeof baseData] || baseData.home
  }

  const heatmapData = getHeatmapData()

  // 设置提醒
  const setReminder = () => {
    alert('⏰ 提醒已设置！我们将在 2 小时后通过通知提醒您。\n\n提示：休息一下，让大脑"重置"记忆系统，往往能想起新的线索。')
  }

  // 生成海报
  const generatePoster = () => {
    alert('🖼️ 寻物海报生成功能开发中...\n\n即将支持：\n✓ 物品照片识别\n✓ 关键信息高亮\n✓ 一键分享到社交平台')
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
            <Button variant="outline" size="sm" className="rounded-xl">
              <Download className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">下载</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Share2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">分享</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-2/10 border border-chart-2/20">
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
              <span className="text-chart-2 font-medium text-sm">完整报告已解锁</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">「{itemName}」战术指导方案</h1>
            <p className="text-muted-foreground">基于多维度分析的精准搜索路径</p>
          </div>

          {/* 模块 A：3D 空间热力图 */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 card-shadow space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗺️</span>
              <div>
                <h2 className="text-lg md:text-xl font-bold">{heatmapData.title}</h2>
                <p className="text-sm text-muted-foreground">基于物理学与行为学的概率分析</p>
              </div>
            </div>

            {/* 3D 线框热力图 */}
            <div className="relative w-full aspect-video bg-secondary/20 rounded-xl overflow-hidden border border-border/30">
              <svg className="w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                {/* 3D 线框网格 */}
                <defs>
                  <radialGradient id="heatmapBg">
                    <stop offset="0%" stopColor="rgba(45,225,252,0.1)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                
                {/* 背景网格 */}
                <rect width="400" height="300" fill="url(#heatmapBg)" />
                
                {/* 网格线 */}
                {[...Array(10)].map((_, i) => (
                  <line 
                    key={`h-${i}`}
                    x1="0" 
                    y1={30 * i} 
                    x2="400" 
                    y2={30 * i}
                    stroke="rgba(45,225,252,0.1)"
                    strokeWidth="1"
                  />
                ))}
                {[...Array(13)].map((_, i) => (
                  <line 
                    key={`v-${i}`}
                    x1={30 * i} 
                    y1="0" 
                    x2={30 * i} 
                    y2="300"
                    stroke="rgba(45,225,252,0.1)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* 3D 房间线框 */}
                <path 
                  d="M 50 80 L 50 220 L 200 250 L 350 220 L 350 80 L 200 50 Z"
                  stroke="#2DE1FC"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.4"
                />
                <path 
                  d="M 50 80 L 200 50 L 200 250 M 350 80 L 200 50"
                  stroke="#2DE1FC"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
                
                {/* 热力标记点 */}
                {heatmapData.hotspots.map((spot, index) => (
                  <g key={index}>
                    {/* 热力光晕 */}
                    <circle
                      cx={spot.x + '%'}
                      cy={spot.y + '%'}
                      r="30"
                      fill={spot.level === 'high' ? 'rgba(255,68,68,0.3)' : 'rgba(255,215,0,0.3)'}
                      style={{
                        animation: `pulse 2s ease-in-out infinite ${index * 0.3}s`
                      }}
                    />
                    {/* 标记圆点 */}
                    <circle
                      cx={spot.x + '%'}
                      cy={spot.y + '%'}
                      r="8"
                      fill={spot.level === 'high' ? '#FF4444' : '#FFD700'}
                      stroke="white"
                      strokeWidth="2"
                    />
                    {/* 标签 */}
                    <text
                      x={spot.x + '%'}
                      y={spot.y + '%'}
                      dy="30"
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {spot.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* 图例 */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FF4444]" />
                <span>🔴 极高概率</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FFD700]" />
                <span>🟡 中等概率</span>
              </div>
            </div>
          </div>

          {/* 模块 B：战术清单（核心体验）*/}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 card-shadow space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h2 className="text-lg md:text-xl font-bold">战术指令清单</h2>
                <p className="text-sm text-muted-foreground">请按顺序执行，完成后勾选</p>
              </div>
            </div>

            <div className="space-y-3">
              {tacticalChecklist.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(index)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${
                    checkedItems.includes(index)
                      ? "border-chart-2/40 bg-chart-2/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      : "border-border/50 bg-background hover:border-border hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {checkedItems.includes(index) ? (
                      <CheckCircle2 className="h-6 w-6 text-chart-2" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-bold ${checkedItems.includes(index) ? "text-chart-2" : ""}`}>
                          {item.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          算法：{item.algorithm}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm ${checkedItems.includes(index) ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* 进度条 */}
            <div className="p-4 rounded-xl bg-secondary/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">完成进度</span>
                <span className="font-bold text-chart-2">
                  {checkedItems.length} / {tacticalChecklist.length}
                </span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2 transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${(checkedItems.length / tacticalChecklist.length) * 100}%`,
                    boxShadow: '0 0 10px rgba(16,185,129,0.5)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* 模块 C：兜底协议（Plan B）*/}
          {showPlanB && (
            <div className="bg-gradient-to-br from-chart-3/20 to-chart-1/20 rounded-2xl border-2 border-chart-3/40 p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="text-center space-y-2">
                <div className="text-4xl">🛡️</div>
                <h2 className="text-2xl font-bold">目标未确认？启动 B 计划</h2>
                <p className="text-muted-foreground">
                  物品可能处于"动态隐藏"状态，或需要更多辅助手段
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* 功能 1：时间胶囊提醒 */}
                <div className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">时间胶囊提醒</h3>
                      <p className="text-xs text-muted-foreground">让大脑休息，重置记忆</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    物品可能处于"动态隐藏"状态。建议休息，让大脑重置。AI 将在 <span className="font-bold text-primary">2 小时后</span>提醒您。
                  </p>
                  <Button 
                    onClick={setReminder}
                    className="w-full rounded-xl"
                    variant="outline"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    设置提醒
                  </Button>
                </div>

                {/* 功能 2：生成寻物海报 */}
                <div className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-bold">生成寻物海报</h3>
                      <p className="text-xs text-muted-foreground">扩大搜索范围</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    生成高可视度的寻物图片，可转发朋友圈或询问同事。
                  </p>
                  <Button 
                    onClick={generatePoster}
                    className="w-full rounded-xl bg-chart-2 hover:bg-chart-2/90"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    生成海报
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link href="/"><Home className="mr-2 h-5 w-5" /> 返回首页</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl" onClick={resetSession}>
              <RefreshCw className="mr-2 h-5 w-5" /> 重新分析
            </Button>
          </div>

          {/* 成功反馈 */}
          <div className="bg-chart-2/5 border border-chart-2/20 rounded-2xl p-6 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <h3 className="text-xl font-bold">找到了吗？</h3>
            <p className="text-muted-foreground">如果成功找回，我们很想听听你的故事！</p>
            <Button size="lg" className="rounded-xl bg-chart-2 hover:bg-chart-2/90">
              🎊 我找到了！分享成功故事
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          本报告由 CogniSeek 生成 · 感谢您的信任
        </div>
      </footer>
    </div>
  )
}
