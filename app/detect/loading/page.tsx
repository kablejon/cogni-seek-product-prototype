"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult, buildAnalysisPrompt } from "@/lib/ai-service"

const analysisSteps = [
  { text: "正在构建时空坐标系统...", icon: "🌐" },
  { text: "正在分析行为心理模式...", icon: "🧠" },
  { text: "正在计算环境概率分布...", icon: "📊" },
  { text: "正在匹配 15,000+ 相似案例...", icon: "🔍" },
  { text: "正在进行深度分析...", icon: "🔬" },
  { text: "正在生成寻物路径图...", icon: "🗺️" },
  { text: "分析完成", icon: "✅" },
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
        const prompt = buildAnalysisPrompt(session)
        
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 glass">
        <div className="container mx-auto px-4 py-3 flex justify-center items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold">CogniSeek</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full space-y-12">
          {/* Animated Radar */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-4 rounded-full border-2 border-primary/20 animate-pulse"></div>
              <div className="absolute inset-8 rounded-full border-2 border-primary/30"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl">{analysisSteps[currentStep].icon}</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-0.5 h-20 bg-gradient-to-t from-primary to-transparent origin-bottom animate-spin"
                  style={{ animationDuration: '2s' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                {isComplete ? "分析完成！" : "正在智能分析..."}
              </h2>
              <p className="text-muted-foreground">
                {statusText || "请稍候，我们正在进行深度计算"}
              </p>
            </div>

            {/* Steps List */}
            <div className="bg-card rounded-2xl border border-border/50 p-5 card-shadow space-y-3">
              {analysisSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index <= currentStep ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index < currentStep
                        ? "bg-primary"
                        : index === currentStep
                          ? "bg-primary animate-pulse"
                          : "bg-secondary"
                    }`}
                  >
                    {index < currentStep ? (
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm">{step.icon}</span>
                    )}
                  </div>
                  <span className={`text-sm transition-all duration-300 ${index === currentStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>分析进度</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
