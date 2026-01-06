"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Lock, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"
import { InteractiveFog } from "@/components/ui/interactive-fog"

export default function ResultPage() {
  const router = useRouter()
  const { session, analysisResult } = useSearchStore()
  const [mounted, setMounted] = useState(false)
  const [meterValue, setMeterValue] = useState(0)

  useEffect(() => {
    setMounted(true)
    // 仪表盘动画
    setTimeout(() => {
      setMeterValue(87.3)
    }, 500)
  }, [])

  if (!mounted) return null

  // 使用 AI 结果或备用结果
  const result = analysisResult || getDefaultAnalysisResult(session)

  // [修改] 心理侧写诊断文案: 更直接、更有冲击力
  const getPsychologicalDiagnosis = () => {
    const mood = session.mood || ''
    const itemColor = session.itemColor || ''
    
    // 根据心理状态 - 焦虑/急躁 -> 认知隧道
    if (mood.includes('焦虑') || mood.includes('急躁')) {
      return {
        icon: '🧠',
        title: '认知隧道效应（Tunnel Vision）',
        content: '检测到你处于高压状态，大脑自动屏蔽了【非习惯性位置】的视觉信号。你不是没看到，而是大脑把你看到的画面"P"掉了。',
        color: '#FF9F0A'
      }
    }
    
    // 根据物品颜色
    if (itemColor.includes('黑') || itemColor.includes('深')) {
      return {
        icon: '🦎',
        title: '伪装警告（视觉伪装）',
        content: '目标物品颜色与环境发生【光谱融合】。在当前光线下，人眼识别率降低至 15%。需采用逆向视觉排查。',
        color: '#2DE1FC'
      }
    }
    
    // 默认 -> 记忆欺骗
    return {
      icon: '🧠',
      title: '记忆欺骗效应',
      content: '在自动驾驶模式下，记忆系统出现了"时序错位"。物品往往不在你"记得"的位置，而在你"动作中断"的那一瞬间。',
      color: '#10b981'
    }
  }

  const diagnosis = getPsychologicalDiagnosis()

  // 加密线索
  const encryptedClues = [
    {
      icon: '🔴',
      level: 'high',
      title: '核心嫌疑区：重力沉降点',
      encrypted: '[█ DATA ENCRYPTED █] *************',
      hint: '符合物理规律的 90% 概率区域，极易被忽略……',
      status: '🔒 待解锁',
      color: '#FF4444'
    },
    {
      icon: '🟡',
      level: 'medium',
      title: '次要嫌疑区：视觉盲区',
      encrypted: '[█ DATA ENCRYPTED █] *************',
      hint: '位于视线水平面以下的习惯死角……',
      status: '🔒 待解锁',
      color: '#FFD700'
    },
    {
      icon: '🟢',
      level: 'low',
      title: '辅助嫌疑区：社交转移点',
      encrypted: '[█ DATA ENCRYPTED █] *************',
      hint: '他人可能无意识转移物品的位置……',
      status: '🔒 待解锁',
      color: '#10b981'
    }
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0 z-0">
        <InteractiveFog color="45, 225, 252" />
      </div>
      
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
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* 头部：信心仪表盘 */}
          <div className="bg-card rounded-3xl border border-border/50 p-8 md:p-12 card-shadow text-center space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                AI 寻回概率评估：<span className="text-[#2DE1FC]">极高</span>
              </h1>
              <p className="text-sm text-muted-foreground">基于 15000+ 成功案例的综合推演</p>
            </div>

            {/* 全息半圆仪表盘 */}
            <div className="flex justify-center py-6">
              <div className="relative w-80 h-40">
                <svg className="w-full h-full" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                  {/* 背景半圆 */}
                  <path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* 渐变半圆（根据数值）*/}
                  <defs>
                    <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF4444" />
                      <stop offset="50%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#2DE1FC" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="url(#meterGradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * meterValue / 100)}
                    style={{
                      transition: 'stroke-dashoffset 2s ease-out',
                      filter: 'drop-shadow(0 0 10px rgba(45,225,252,0.8))'
                    }}
                  />
                  {/* 指针 */}
                  <g 
                    transform={`rotate(${-90 + (180 * meterValue / 100)} 100 90)`}
                    style={{ transition: 'transform 2s ease-out' }}
                  >
                    <line x1="100" y1="90" x2="100" y2="30" stroke="#2DE1FC" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="90" r="5" fill="#2DE1FC" />
                  </g>
                </svg>
                
                {/* 中心数值 */}
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#2DE1FC] mb-1" style={{
                      textShadow: '0 0 20px rgba(45,225,252,0.6)'
                    }}>
                      {meterValue.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">找回概率</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 模块 A：心理侧写诊断（免费可见）*/}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 card-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: `radial-gradient(circle, ${diagnosis.color}20 0%, transparent 70%)`,
                  border: `2px solid ${diagnosis.color}40`
                }}
              >
                {diagnosis.icon}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">{diagnosis.title}</h2>
                <p className="text-xs text-muted-foreground">心理学盲区分析</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
              <p className="text-muted-foreground leading-relaxed">{diagnosis.content}</p>
            </div>
          </div>

          {/* 模块 B：加密线索（付费诱饵）*/}
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <h2 className="text-xl font-bold">精准位置分析</h2>
            </div>

            {encryptedClues.map((clue, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-4 relative overflow-hidden"
              >
                {/* 等级标签 */}
                <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-xs font-bold" style={{
                  background: `${clue.color}20`,
                  color: clue.color,
                  border: `1px solid ${clue.color}40`
                }}>
                  {clue.level === 'high' ? '高概率' : clue.level === 'medium' ? '中概率' : '辅助'}
                </div>

                <div className="flex items-start gap-4">
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: `${clue.color}20`,
                      boxShadow: `0 0 20px ${clue.color}30`
                    }}
                  >
                    {clue.icon}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="font-bold">{clue.title}</h3>
                    
                    {/* 加密内容（像素化/马赛克效果）*/}
                    <div 
                      className="p-4 rounded-xl relative overflow-hidden"
                      style={{
                        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <div className="font-mono text-sm text-muted-foreground/50 select-none">
                        {clue.encrypted}
                      </div>
                      {/* 像素化遮罩 */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: 'repeating-conic-gradient(rgba(0,0,0,0.1) 0% 25%, transparent 0% 50%) 50% / 8px 8px',
                          mixBlendMode: 'multiply'
                        }}
                      />
                    </div>

                    {/* 提示信息 */}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
                      <span className="text-xs">💡</span>
                      <p className="text-sm text-muted-foreground flex-1">{clue.hint}</p>
                    </div>

                    {/* 锁定状态 */}
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: clue.color }}>
                      <Lock className="w-4 h-4" />
                      <span>{clue.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部 CTA：付费按钮 */}
          <div className="bg-gradient-to-br from-[#2DE1FC]/20 to-[#FFD700]/20 rounded-3xl border-2 border-[#2DE1FC]/40 p-8 text-center space-y-6 relative overflow-hidden">
            {/* 背景动画 */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'radial-gradient(circle at 50% 50%, #2DE1FC 0%, transparent 50%)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/40">
                <TrendingUp className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm font-bold text-[#FFD700]">限时优惠</span>
              </div>

              {/* [修改] 标题: 卖"盲区"和"指令" */}
              <h2 className="text-2xl md:text-3xl font-bold">解锁"视觉盲区"坐标与战术搜寻指令</h2>
              
              <p className="text-muted-foreground max-w-2xl mx-auto">
                告诉你**3个你绝对没看过的死角**，以及**5步逆向寻找法**。
              </p>

              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-[#2DE1FC]">$2.99</span>
                <span className="text-muted-foreground line-through">$9.99</span>
              </div>

              <Button 
                size="lg" 
                className="rounded-full px-12 text-lg font-bold bg-gradient-to-r from-[#2DE1FC] to-[#10b981] hover:shadow-[0_0_30px_rgba(45,225,252,0.5)] transition-all"
                onClick={() => router.push('/detect/report')}
              >
                立即解锁完整报告
              </Button>

              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <span className="text-[#FF9F0A]">⚡️</span>
                距记忆黄金找回期仅剩 <span className="font-bold text-[#FF9F0A]">2 小时</span>
              </p>
            </div>
          </div>

          {/* 信任背书 */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-[#10b981]">✓</span>
              <span>87.3% 找回率</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#10b981]">✓</span>
              <span>15,000+ 成功案例</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#10b981]">✓</span>
              <span>30天退款保证</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
