"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"
import { InteractiveFog } from "@/components/ui/interactive-fog"
import { HolographicBrain } from "@/components/ui/holographic-brain"

const analysisSteps = [
  { text: "正在连接神经元网络...", subtitle: "启动量子推演引擎", icon: "🌐" },
  { text: "正在检索 3D 空间数据库...", subtitle: "匹配 15,000+ 成功案例", icon: "🔍" },
  { text: "正在解析行为心理矩阵...", subtitle: "计算记忆盲区概率", icon: "🧠" },
  { text: "正在运行物理模拟算法...", subtitle: "追踪物品位移轨迹", icon: "🎯" },
  { text: "正在生成战术指导路径...", subtitle: "构建优先级排查地图", icon: "🗺️" },
  { text: "分析完成！", subtitle: "准备展示结果", icon: "✅" },
]

export default function LoadingPage() {
  const router = useRouter()
  const { session, setAnalysisResult, setIsAnalyzing } = useSearchStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  
  // 使用 ref 来防止重复调用
  const isCallingRef = useRef(false)
  const hasCalledRef = useRef(false)

  // 步骤动画
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < analysisSteps.length - 1) return prev + 1
        return prev
      })
    }, 600)

    return () => clearInterval(stepInterval)
  }, [])

  // 智能进度条动画 - 模拟真实加载体验
  useEffect(() => {
    if (isComplete) return
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // 快速到达 30%
        if (prev < 30) return prev + 2
        // 中速到达 60%
        if (prev < 60) return prev + 1.5
        // 慢速到达 85%
        if (prev < 85) return prev + 0.8
        // 很慢速到达 95%（给 API 留时间）
        if (prev < 95) return prev + 0.3
        // 95% 之后非常慢
        if (prev < 99) return prev + 0.1
        return prev
      })
    }, 80)

    return () => clearInterval(progressInterval)
  }, [isComplete])

  // 完成时平滑过渡到 100%
  useEffect(() => {
    if (isComplete && progress < 100) {
      const completeInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(completeInterval)
            return 100
          }
          return Math.min(prev + 3, 100)
        })
      }, 30)
      return () => clearInterval(completeInterval)
    }
  }, [isComplete, progress])

  // AI 分析
  useEffect(() => {
    if (isCallingRef.current || hasCalledRef.current) return
    
    isCallingRef.current = true
    setIsAnalyzing(true)

    const callAI = async () => {
      setStatusText("正在连接分析服务...")
      
      try {
        // V7.0: 直接发送 session 数据，让 API 进行万物分类
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemType: session.itemType,
            itemName: session.itemCustomName || session.itemType,
            itemDescription: `${session.itemCategory} - ${session.itemColor} - ${session.itemSize}`,
            lastSeenLocation: session.specificLocation || session.locationCategory,
            lastSeenTime: session.lastSeenDate || session.timeQuickSelect,
            activity: session.specificActivity || session.activityCategory,
            mood: session.mood,
            searchedPlaces: session.searchedLocations,
            wasDistracted: session.wasDistracted,
            hadCompanions: session.hadCompanions,
            searchDuration: session.searchDuration,
          }),
        })

        hasCalledRef.current = true

        if (response.ok) {
          const data = await response.json()
          
          if (data.result && data.result.probability && data.result.predictions) {
            setStatusText("分析完成！")
            setCurrentStep(analysisSteps.length - 1)
            setAnalysisResult(data.result)
            setIsComplete(true)
            
            // 等待进度条平滑到 100%
            setTimeout(() => {
              setIsAnalyzing(false)
              router.push("/detect/result")
            }, 600)
            return
          }
        }
        
        throw new Error('需要使用备用分析')
        
      } catch (error) {
        hasCalledRef.current = true
        
        setStatusText("正在生成分析结果...")
        const fallbackResult = getDefaultAnalysisResult(session)
        setAnalysisResult(fallbackResult)
        setCurrentStep(analysisSteps.length - 1)
        setStatusText("分析完成！")
        setIsComplete(true)
        
        setTimeout(() => {
          setIsAnalyzing(false)
          router.push("/detect/result")
        }, 600)
      }
    }

    // 延迟执行
    const timer = setTimeout(callAI, 800)
    
    return () => {
      clearTimeout(timer)
      isCallingRef.current = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0 z-0">
        <InteractiveFog color="129, 140, 248" />
      </div>
      
      {/* Header */}
      <header className="border-b border-border/50 glass relative z-10">
        <div className="container mx-auto px-4 py-3 flex justify-center items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold">CogniSeek</span>
          </Link>
        </div>
      </header>

      {/* Main Content - 科幻级 */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-2xl w-full space-y-10">
          
          {/* 反应堆圆环动画 */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* 全息球粒子动画 */}
              <HolographicBrain 
                keywords={[
                  session.itemCustomName || '物品',
                  session.lastSeenLocation || '位置',
                  session.mood || '状态',
                ]}
              />
              
              {/* 中心反应堆发光核心 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full flex items-center justify-center relative">
                  {/* 外层脉冲光环 */}
                  <div className="absolute inset-0 rounded-full animate-pulse-wave" style={{ 
                    background: 'radial-gradient(circle, var(--holo-blue-glow) 0%, transparent 70%)',
                  }} />
                  
                  {/* 发光内核 */}
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
                       style={{
                         background: 'radial-gradient(circle, var(--holo-blue) 0%, var(--cyber-green) 100%)',
                         boxShadow: '0 0 40px var(--holo-blue-glow), inset 0 0 30px rgba(255,255,255,0.3)',
                       }}>
                    <span className="text-4xl filter drop-shadow-lg">{analysisSteps[currentStep].icon}</span>
                  </div>
                </div>
              </div>

              {/* 扫描线效果 */}
              <div className="scan-line" />
            </div>
          </div>

          {/* 打字机效果文字区 */}
          <div className="scifi-container p-8 space-y-6">
            <div className="text-center space-y-4">
              {/* 状态指示器 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2"
                   style={{
                     backgroundColor: 'rgba(45, 225, 252, 0.1)',
                     borderColor: 'var(--holo-blue)',
                     boxShadow: '0 0 20px var(--holo-blue-glow)',
                   }}>
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--cyber-green)' }} />
                <span className="text-sm font-mono font-semibold" style={{ color: 'var(--holo-blue)' }}>
                  {isComplete ? "ANALYSIS COMPLETE" : "ANALYZING..."}
                </span>
              </div>
              
              {/* 主标题 - 放大+加粗 */}
              <h2 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight">
                {analysisSteps[currentStep].text}
              </h2>
              
              {/* 副标题 - 等宽字体科技感 */}
              <p className="text-sm md:text-base font-mono" style={{ color: 'var(--cyber-green)' }}>
                {analysisSteps[currentStep].subtitle}
              </p>
            </div>

            {/* 步骤列表 - 简化版 */}
            <div className="space-y-2">
              {analysisSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    index <= currentStep 
                      ? "opacity-100 bg-white/5" 
                      : "opacity-20"
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    index < currentStep
                      ? "bg-[var(--cyber-green)] text-black"
                      : index === currentStep
                        ? "bg-[var(--holo-blue)] text-black animate-pulse"
                        : "bg-white/10"
                  }`}>
                    {index < currentStep ? "✓" : index + 1}
                  </div>
                  <span className={`text-xs font-medium ${
                    index === currentStep ? "text-white" : "text-muted-foreground"
                  }`}>
                    {step.text.replace(/\.\.\./g, '')}
                  </span>
                </div>
              ))}
            </div>

            {/* 进度条 - 发光样式 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>PROGRESS</span>
                <span className="font-bold" style={{ color: 'var(--cyber-green)' }}>{Math.round(progress)}%</span>
              </div>
              <div className="slider-glow">
                <div
                  className="slider-track h-2 rounded-full transition-all duration-150 ease-out"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--holo-blue) 0%, var(--cyber-green) 100%)',
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
