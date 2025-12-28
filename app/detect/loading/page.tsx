"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"
import { InteractiveFog } from "@/components/ui/interactive-fog"
import { HolographicBrain } from "@/components/ui/holographic-brain"

// 三个阶段的加载文案
const loadingPhases = [
  {
    duration: 2000, // 0-2s
    text: "正在构建三维空间模型...",
    subtext: "导入重力沉降参数...",
    phase: "物理层"
  },
  {
    duration: 3000, // 2-5s  
    text: "检测到焦虑情绪……",
    subtext: "正在过滤无效记忆干扰……请深呼吸……",
    phase: "心理层"
  },
  {
    duration: 2000, // 5-7s
    text: "多维排查完成",
    subtext: "已锁定 3 个高价值盲区",
    phase: "逻辑层"
  },
]

export default function LoadingPage() {
  const router = useRouter()
  const { session, setAnalysisResult, setIsAnalyzing } = useSearchStore()
  const [currentPhase, setCurrentPhase] = useState(0) // 当前阶段
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showTargetLocked, setShowTargetLocked] = useState(false)
  
  // 使用 ref 来防止重复调用
  const isCallingRef = useRef(false)
  const hasCalledRef = useRef(false)

  // 阶段切换动画
  useEffect(() => {
    let phaseTimer: NodeJS.Timeout
    let currentPhaseIndex = 0
    
    const nextPhase = () => {
      if (currentPhaseIndex < loadingPhases.length - 1) {
        currentPhaseIndex++
        setCurrentPhase(currentPhaseIndex)
        phaseTimer = setTimeout(nextPhase, loadingPhases[currentPhaseIndex].duration)
      } else {
        // 最后阶段：显示 "Target Locked"
        setShowTargetLocked(true)
      }
    }
    
    // 启动第一个阶段
    phaseTimer = setTimeout(nextPhase, loadingPhases[0].duration)
    
    return () => clearTimeout(phaseTimer)
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
        
        const fallbackResult = getDefaultAnalysisResult(session)
        setAnalysisResult(fallbackResult)
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
          
          {/* 3D 神经网络光球 + 线框扫描背景 */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* 背景：3D 线框空间扫描图 */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  {/* 房间线框 */}
                  <path 
                    d="M 50 100 L 50 300 L 200 350 L 350 300 L 350 100 L 200 50 Z M 50 100 L 200 50 L 200 350 M 350 100 L 200 50 M 350 300 L 200 350"
                    stroke="#2DE1FC"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.6"
                  />
                  {/* 扫描线网格 */}
                  {[...Array(10)].map((_, i) => (
                    <line 
                      key={`h-${i}`}
                      x1="50" 
                      y1={100 + i * 20} 
                      x2="350" 
                      y2={100 + i * 20}
                      stroke="#2DE1FC"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <line 
                      key={`v-${i}`}
                      x1={50 + i * 30} 
                      y1="100" 
                      x2={50 + i * 30} 
                      y2="300"
                      stroke="#2DE1FC"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  ))}
                </svg>
              </div>
              
              {/* 中心：3D 神经网络光球（呼吸感动效）*/}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                  {/* 外层呼吸光环 */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      background: 'radial-gradient(circle, rgba(45,225,252,0.3) 0%, transparent 70%)',
                      animation: 'breathe 4s ease-in-out infinite'
                    }} 
                  />
                  
                  {/* 中层旋转粒子环 */}
                  <div className="absolute inset-4 rounded-full border-2 border-[#2DE1FC]/30 animate-spin-slow" />
                  <div className="absolute inset-8 rounded-full border border-[#2DE1FC]/20 animate-spin-reverse-slow" />
                  
                  {/* 内核光球（呼吸动效）*/}
                  <div 
                    className="absolute inset-16 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle, #2DE1FC 0%, #10b981 100%)',
                      boxShadow: '0 0 60px rgba(45,225,252,0.6), inset 0 0 40px rgba(255,255,255,0.3)',
                      animation: 'breathe-glow 3s ease-in-out infinite'
                    }}
                  >
                    {/* 绿色代码流 */}
                    {currentPhase === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-px h-8 bg-[#10b981]"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animation: `codeFlow ${1 + Math.random()}s linear infinite`,
                              opacity: 0.7
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Target Locked 效果 */}
                  {showTargetLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="text-2xl font-bold text-[#FFD700] tracking-wider animate-pulse"
                        style={{
                          textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.5)'
                        }}
                      >
                        TARGET LOCKED
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 添加CSS动画 */}
          <style jsx>{`
            @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 0.3; }
              50% { transform: scale(1.2); opacity: 0.6; }
            }
            @keyframes breathe-glow {
              0%, 100% { 
                transform: scale(1); 
                box-shadow: 0 0 60px rgba(45,225,252,0.6), inset 0 0 40px rgba(255,255,255,0.3);
              }
              50% { 
                transform: scale(1.05); 
                box-shadow: 0 0 80px rgba(45,225,252,0.9), inset 0 0 60px rgba(255,255,255,0.5);
              }
            }
            @keyframes codeFlow {
              0% { transform: translateY(-20px); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(20px); opacity: 0; }
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spin-reverse-slow {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 20s linear infinite;
            }
            .animate-spin-reverse-slow {
              animation: spin-reverse-slow 15s linear infinite;
            }
          `}</style>

          {/* 阶段文案显示区 */}
          <div className="scifi-container p-8 space-y-6">
            <div className="text-center space-y-4">
              {/* 阶段指示器 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2"
                   style={{
                     backgroundColor: 'rgba(45, 225, 252, 0.1)',
                     borderColor: currentPhase === 0 ? '#10b981' : currentPhase === 1 ? '#2DE1FC' : '#FFD700',
                     boxShadow: `0 0 20px ${currentPhase === 0 ? 'rgba(16,185,129,0.5)' : currentPhase === 1 ? 'rgba(45,225,252,0.5)' : 'rgba(255,215,0,0.5)'}`,
                   }}>
                <div 
                  className="w-2.5 h-2.5 rounded-full animate-pulse" 
                  style={{ 
                    backgroundColor: currentPhase === 0 ? '#10b981' : currentPhase === 1 ? '#2DE1FC' : '#FFD700' 
                  }} 
                />
                <span className="text-sm font-mono font-semibold" style={{ 
                  color: currentPhase === 0 ? '#10b981' : currentPhase === 1 ? '#2DE1FC' : '#FFD700'
                }}>
                  {loadingPhases[currentPhase].phase}
                </span>
              </div>
              
              {/* 主标题 - 根据阶段变化 */}
              <h2 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight animate-fade-in">
                {loadingPhases[currentPhase].text}
              </h2>
              
              {/* 副标题 - 等宽字体科技感 */}
              <p 
                className="text-sm md:text-base font-mono animate-fade-in" 
                style={{ 
                  color: currentPhase === 0 ? '#10b981' : currentPhase === 1 ? '#2DE1FC' : '#FFD700',
                  animationDelay: '0.2s'
                }}
              >
                {loadingPhases[currentPhase].subtext}
              </p>
            </div>

            {/* 简化的进度条 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>NEURAL NETWORK SYNC</span>
                <span className="font-bold" style={{ color: '#2DE1FC' }}>{Math.round(progress)}%</span>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-300 ease-out rounded-full"
                  style={{ 
                    width: `${progress}%`,
                    background: currentPhase === 0 
                      ? 'linear-gradient(90deg, #10b981 0%, #2DE1FC 100%)'
                      : currentPhase === 1
                        ? 'linear-gradient(90deg, #2DE1FC 0%, #818cf8 100%)'
                        : 'linear-gradient(90deg, #FFD700 0%, #FF9F0A 100%)',
                    boxShadow: currentPhase === 0 
                      ? '0 0 20px rgba(16,185,129,0.6)'
                      : currentPhase === 1
                        ? '0 0 20px rgba(45,225,252,0.6)'
                        : '0 0 20px rgba(255,215,0,0.6)'
                  }}
                />
              </div>
            </div>

            {/* 阶段提示 */}
            <div className="flex justify-center gap-2">
              {loadingPhases.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index <= currentPhase ? 'w-8 bg-[#2DE1FC]' : 'w-4 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
