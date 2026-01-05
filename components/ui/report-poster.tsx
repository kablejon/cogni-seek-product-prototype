"use client"

import { Brain, MapPin, Zap, Search, Activity } from "lucide-react"

interface ReportPosterProps {
  caseId: number
  recoveryIndex: string
  itemName: string
  location: string
  keyClues: string[]
  psychology: {
    title: string
    tag: string
  }
}

export function ReportPoster({
  caseId,
  recoveryIndex,
  itemName,
  location,
  keyClues,
  psychology
}: ReportPosterProps) {
  return (
    <div className="w-[600px] h-[800px] text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0a1628 50%, #020617 100%)' }}>
      
      {/* 背景装饰网格 */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          opacity: 0.1
        }} 
      />
      
      {/* 顶部光晕（简化版，移除 blur 避免 html2canvas 问题） */}
      <div 
        className="absolute top-0 left-1/2 w-[400px] h-[200px]" 
        style={{ 
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(6, 182, 212, 0.15)'
        }} 
      />
      
      {/* 内容区 */}
      <div className="relative z-10 h-full flex flex-col p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', border: '1px solid #22d3ee' }}>
              <Activity className="w-4 h-4" style={{ color: '#22d3ee' }} />
            </div>
            <span className="font-bold text-lg">CogniSeek</span>
          </div>
          <div className="text-xs px-3 py-1 rounded" style={{ color: '#06b6d4', backgroundColor: 'rgba(8, 51, 68, 0.3)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            CASE #{caseId}
          </div>
        </div>

        {/* 寻回指数 */}
        <div className="text-center mb-8">
          <div className="text-8xl font-bold text-white mb-2" style={{ textShadow: '0 0 30px rgba(34, 211, 238, 0.5)' }}>
            {recoveryIndex}
          </div>
          <div className="text-sm tracking-widest mb-1" style={{ color: '#22d3ee' }}>RECOVERY POTENTIAL INDEX</div>
          <div className="text-xs" style={{ color: '#94a3b8' }}>寻回可能性指数</div>
        </div>

        {/* 物品信息卡片 */}
        <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <div className="flex items-center gap-2 mb-3" style={{ color: '#22d3ee' }}>
            <Search className="w-4 h-4" />
            <span className="text-sm font-bold">目标物品</span>
          </div>
          <div className="text-2xl font-bold mb-2">{itemName}</div>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
            <MapPin className="w-3 h-3" />
            <span>最后位置：{location}</span>
          </div>
        </div>

        {/* 心理分析 */}
        <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'rgba(30, 58, 138, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div className="flex items-center gap-2 mb-3" style={{ color: '#60a5fa' }}>
            <Brain className="w-4 h-4" />
            <span className="text-sm font-bold">AI 诊断</span>
          </div>
          <div className="text-lg font-bold mb-2">{psychology.title}</div>
          <div className="inline-flex items-center text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
            {psychology.tag}
          </div>
        </div>

        {/* 关键线索 */}
        <div className="rounded-xl p-5 mb-auto" style={{ backgroundColor: 'rgba(120, 53, 15, 0.2)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div className="flex items-center gap-2 mb-3" style={{ color: '#fbbf24' }}>
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold">战术破局指令</span>
          </div>
          <ul className="space-y-2">
            {keyClues.slice(0, 3).map((clue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ border: '1px solid rgba(245, 158, 11, 0.5)', backgroundColor: 'rgba(69, 26, 3, 0.3)', color: '#fbbf24' }}>
                  {i + 1}
                </div>
                <span style={{ color: '#cbd5e1' }}>{clue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="text-xs mb-2" style={{ color: '#64748b' }}>
            * 本报告基于概率模型生成，仅供参考
          </div>
          <div className="text-xs" style={{ color: '#06b6d4' }}>
            扫码访问 CogniSeek · 寻回你的记忆
          </div>
        </div>

      </div>
    </div>
  )
}

