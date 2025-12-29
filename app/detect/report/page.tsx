"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Scan, 
  Activity, 
  ShieldAlert, 
  CheckSquare, 
  Lock, 
  Archive, 
  Printer, 
  Share2, 
  ArrowRight,
  Lightbulb,
  Eye,
  Search,
  History,
  AlertTriangle,
  Clock,
  FileOutput
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"
import { itemCategories } from "@/lib/data"

// 战术指令清单 (Tactical Directives)
const tacticalDirectives = [
  {
    id: 1,
    icon: Lightbulb,
    code: 'OPTICAL-OVERRIDE',
    title: '光学破防指令',
    description: '关闭房间主灯。开启手机闪光灯，贴近地面平行照射。',
    target: '寻找非常规材质的反光点或异常阴影。',
    algorithm: '光学原理 / 菲涅尔反射'
  },
  {
    id: 2,
    icon: Eye,
    code: 'TACTILE-SWEEP',
    title: '盲区触觉扫描',
    description: '视觉具有欺骗性。请勿用眼看，伸出手深入缝隙深处。',
    target: '沙发坐垫缝隙、床垫边缘、柜底死角。',
    algorithm: '非注意盲视 / 触觉优先'
  },
  {
    id: 3,
    icon: Search,
    code: 'SOCIAL-ENG',
    title: '第三方介入排查',
    description: '排查"非自主移动"因素。物品可能被他人/物无意转移。',
    target: '宠物窝、扫地机器人尘盒、被家人顺手收纳的区域。',
    algorithm: '社会工程 / 环境概率'
  },
  {
    id: 4,
    icon: History,
    code: 'MEM-REVERSE',
    title: '行为逆向回溯',
    description: '前往你"绝对没去过"但符合生理习惯的区域。',
    target: '卫生间台面、玄关鞋柜、冰箱顶部（无意识放置点）。',
    algorithm: '行为心理学 / 自动驾驶模式'
  }
]

export default function ReportPage() {
  const router = useRouter()
  const { session, analysisResult, resetSession } = useSearchStore()
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showContingency, setShowContingency] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [caseId, setCaseId] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
    // 生成一个随机的案件编号，增加真实感
    setCaseId(`CS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`)
    
    // 机械锁定音效 (清脆、短促、专业)
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=') 
    }
  }, [])

  // 使用 AI 结果或备用结果
  const result = analysisResult || getDefaultAnalysisResult(session)

  // 从 AI 分析结果生成战术指令
  const generateTacticalDirectives = () => {
    if (!result.predictions || result.predictions.length === 0) {
      return tacticalDirectives // 使用默认指令
    }

    // 将 AI 的 predictions 和 checklist 转换为战术指令格式
    return result.predictions.slice(0, 4).map((pred, index) => {
      const icons = [Lightbulb, Eye, Search, History]
      const codes = ['PRIORITY-ALPHA', 'ZONE-BETA', 'CONTEXT-GAMMA', 'AUXILIARY-DELTA']
      
      return {
        id: index + 1,
        icon: icons[index] || Lightbulb,
        code: codes[index],
        title: pred.location,
        description: pred.technique || '执行精准搜索操作',
        target: pred.reason,
        algorithm: `概率: ${pred.confidence}% / 物理学原理`
      }
    })
  }

  const dynamicDirectives = generateTacticalDirectives()

  // 监听进度，触发 Plan B
  useEffect(() => {
    if (completedSteps.length === dynamicDirectives.length && completedSteps.length > 0 && !showContingency) {
      const timer = setTimeout(() => {
        setShowContingency(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [completedSteps.length, showContingency, dynamicDirectives.length])

  if (!mounted) return null

  const getItemName = () => {
    if (session.itemCustomName) return session.itemCustomName
    const category = itemCategories.find(c => c.id === session.itemCategory)
    const item = category?.items.find(i => i.id === session.itemType)
    return item?.label || '未知目标'
  }

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const isChecked = prev.includes(index)
      if (!isChecked) {
        // 播放音效
        if (audioRef.current) audioRef.current.play().catch(() => {})
        return [...prev, index]
      } else {
        return prev.filter((i) => i !== index)
      }
    })
  }

  // 获取热力图配置
  const locationCategory = session.locationCategory || 'home'
  const heatmapConfig = {
    home: { title: 'RESIDENTIAL_UNIT_SCAN', zones: ['Sofa Gap', 'Under Table', 'Carpet Edge', 'Cabinet Top'] },
    office: { title: 'WORKSPACE_SCAN', zones: ['Drawer', 'Under Chair', 'File Stack', 'Pantry'] },
    transit: { title: 'VEHICLE_INTERIOR_SCAN', zones: ['Seat Gap', 'Door Pocket', 'Trunk', 'Floor Mat'] },
    outdoor: { title: 'PUBLIC_SECTOR_SCAN', zones: ['Seat Crevice', 'Counter Edge', 'Ground Corner', 'Service Desk'] }
  }[locationCategory] || { title: 'GENERIC_AREA_SCAN', zones: ['Zone A', 'Zone B', 'Zone C', 'Zone D'] }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900 selection:text-cyan-50">
      
      {/* 顶部状态栏 - 模拟终端界面 */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-14 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-cyan-950 border border-cyan-800 rounded flex items-center justify-center group-hover:bg-cyan-900 transition-colors">
                <span className="text-cyan-400 font-bold font-mono">C</span>
              </div>
              <span className="text-sm font-mono tracking-widest text-slate-400 hidden sm:inline-block">COGNITRACE_SYS</span>
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-emerald-500">LIVE_MONITORING</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-cyan-400 font-mono text-xs">
              <Printer className="w-3.5 h-3.5 mr-2" />
              PRINT_LOG
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-cyan-400 font-mono text-xs">
              <Share2 className="w-3.5 h-3.5 mr-2" />
              EXPORT
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* 档案头信息 */}
        <div className="border-l-2 border-cyan-500 pl-6 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Scan className="w-32 h-32" />
          </div>
          
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-3 text-xs font-mono text-cyan-500 mb-2">
              <span className="bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900">CASE ID: {caseId}</span>
              <span>PRIORITY: HIGH</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
              目标锁定：{getItemName()}
            </h1>
            <p className="text-slate-400 max-w-2xl">
              {result.summary || '认知取证分析已完成。系统检测到非注意盲视 (Inattentional Blindness) 现象。物品并未丢失，而是处于您的视觉感知盲区。'}
            </p>
            {result.behaviorAnalysis && (
              <p className="text-slate-500 text-sm max-w-2xl mt-2">
                <span className="text-cyan-400 font-semibold">行为分析：</span>{result.behaviorAnalysis}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">Recovery Probability</div>
                <div className="text-lg font-bold text-white font-mono">{result.probability}%</div>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">Risk Level</div>
                <div className="text-lg font-bold text-white font-mono">{result.probabilityLevel.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 核心区域：Grid 布局 */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 左侧：空间雷达分析 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 3D 扫描图 */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden relative group">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <Scan className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-mono text-cyan-500 uppercase">{heatmapConfig?.title}</span>
              </div>
              
              {/* 装饰性的网格背景 */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(45,225,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,225,252,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              <div className="relative aspect-video flex items-center justify-center p-8 overflow-hidden">
                {/* SVG 3D 线框图 */}
                <svg className="w-full h-full max-w-md drop-shadow-[0_0_15px_rgba(45,225,252,0.1)] relative z-10" viewBox="0 0 400 300">
                  <defs>
                    <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(45,225,252,0)" />
                      <stop offset="45%" stopColor="rgba(45,225,252,0.1)" />
                      <stop offset="50%" stopColor="rgba(45,225,252,0.8)" /> {/* 高亮核心，锐利线条 */}
                      <stop offset="55%" stopColor="rgba(45,225,252,0.1)" />
                      <stop offset="100%" stopColor="rgba(45,225,252,0)" />
                    </linearGradient>
                  </defs>
                  
                  {/* 扫描光束动画 - 确保覆盖整个区域 */}
                  <rect x="0" y="0" width="400" height="300" fill="url(#scanGradient)" className="animate-scan-vertical" />
                  
                  {/* 房间线框 */}
                  <path d="M50 80 L350 80 L350 220 L50 220 Z" fill="none" stroke="#1e293b" strokeWidth="1" />
                  <path d="M50 80 L200 50 L350 80" fill="none" stroke="#334155" strokeWidth="1" />
                  <path d="M50 220 L200 250 L350 220" fill="none" stroke="#334155" strokeWidth="1" />
                  <path d="M200 50 L200 250" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {/* 热点标记 */}
                  <circle cx="120" cy="180" r="4" fill="#F97316" className="animate-pulse" />
                  <circle cx="120" cy="180" r="20" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.5" className="animate-ping" />
                  <line x1="120" y1="180" x2="160" y2="140" stroke="#F97316" strokeWidth="1" />
                  <text x="165" y="140" fill="#F97316" fontSize="10" fontFamily="monospace">HIGH_PROB_ZONE</text>
                  
                  <circle cx="280" cy="100" r="3" fill="#10b981" />
                  <text x="290" y="100" fill="#10b981" fontSize="10" fontFamily="monospace">SECONDARY</text>
                </svg>
              </div>

              {/* 底部数据流 */}
              <div className="border-t border-slate-800 bg-slate-950 p-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>SECTOR_ANALYSIS: COMPLETE</span>
                <span>ERR_MARGIN: ±2.4%</span>
              </div>
            </div>

            {/* 优先行动提示 */}
            {result.priorityAction && (
              <div className="bg-gradient-to-r from-orange-950/30 to-transparent border-l-4 border-orange-500 p-4 rounded-r-lg mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-orange-400 mb-1">⚡ 优先行动 (2分钟规则)</h4>
                    <p className="text-slate-300 text-sm mb-2">
                      <span className="font-semibold">目标区域：</span>{result.priorityAction.target}
                    </p>
                    <p className="text-slate-300 text-sm mb-2">
                      <span className="font-semibold">立即执行：</span>{result.priorityAction.action}
                    </p>
                    <p className="text-slate-400 text-xs">
                      <span className="font-semibold">科学依据：</span>{result.priorityAction.why}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 战术执行协议 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">执行战术指令 (Directives)</h3>
              </div>
              
              <div className="space-y-3">
                {dynamicDirectives.map((item, index) => {
                  const isCompleted = completedSteps.includes(index)
                  const Icon = item.icon
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleStep(index)}
                      className={`
                        w-full text-left relative group overflow-hidden
                        border rounded-md transition-all duration-300
                        ${isCompleted 
                          ? 'bg-emerald-950/20 border-emerald-900/50' 
                          : 'bg-slate-900 border-slate-800 hover:border-cyan-700 hover:bg-slate-800'
                        }
                      `}
                    >
                      {/* 进度条背景 */}
                      <div 
                        className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-700 group-hover:bg-cyan-500'}`} 
                      />

                      <div className="p-4 pl-6 flex gap-4">
                        <div className={`mt-1 p-2 rounded-sm border ${isCompleted ? 'border-emerald-500/30 text-emerald-500' : 'border-slate-700 text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-mono font-bold ${isCompleted ? 'text-emerald-500' : 'text-cyan-600'}`}>
                              {item.code}
                            </span>
                            {isCompleted && <CheckSquare className="w-4 h-4 text-emerald-500" />}
                          </div>
                          
                          <h4 className={`font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {item.title}
                          </h4>
                          
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {item.description}
                            <span className={`block mt-1 font-mono text-xs ${isCompleted ? 'text-emerald-600' : 'text-orange-400'}`}>
                              &gt; 目标: {item.target}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      {/* 算法标记脚标 */}
                      <div className="bg-slate-950/50 px-6 py-1.5 border-t border-slate-800/50 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-tight">
                          ALGORITHM: {item.algorithm}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 右侧：状态与 B 计划 */}
          <div className="space-y-6">
            
            {/* 状态面板 */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Operation Status</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">DIRECTIVES_COMPLETED</span>
                    <span className="font-mono text-cyan-400">{completedSteps.length}/{dynamicDirectives.length}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 transition-all duration-500" 
                      style={{ width: `${(completedSteps.length / dynamicDirectives.length) * 100}%` }} 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-slate-300">时空回溯图谱</div>
                      <div className="text-xs text-slate-500 mt-1">需解锁完整权限查看高精度坐标</div>
                      <Button size="sm" variant="outline" className="w-full mt-3 border-cyan-800 text-cyan-500 hover:bg-cyan-950/30 hover:text-cyan-400 text-xs h-8 font-mono">
                        UNLOCK_ACCESS [L2]
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 二级响应机制 (Plan B) - 自动触发 */}
            {showContingency && (
              <div className="bg-orange-950/10 border border-orange-900/50 rounded-lg p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Contingency Protocols</h3>
                </div>
                
                <p className="text-xs text-orange-200/70 leading-relaxed">
                  一级指令未生效。目标可能处于"动态隐藏"状态或已被移出常规区域。建议启动备用协议。
                </p>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs border-orange-900/30 text-orange-400 hover:bg-orange-900/20 hover:text-orange-300 h-9">
                    <Clock className="w-3.5 h-3.5 mr-2" />
                    设定"记忆重置"闹钟 (+2h)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs border-orange-900/30 text-orange-400 hover:bg-orange-900/20 hover:text-orange-300 h-9">
                    <FileOutput className="w-3.5 h-3.5 mr-2" />
                    生成协查通报 (PDF)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部结案操作 */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col items-center gap-6">
          <div className="text-center space-y-1">
            <h3 className="text-slate-200 font-bold">RECOVERY CONFIRMATION</h3>
            <p className="text-xs text-slate-500">点击确认以关闭本案卷宗，数据将用于优化下一次模型精度。</p>
          </div>
          
          <div className="flex gap-4">
             <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 rounded shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              onClick={() => {
                resetSession()
                router.push('/')
              }}
            >
              <Archive className="w-4 h-4 mr-2" />
              确认找回 & 归档
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => resetSession()}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              未找到，重启分析
            </Button>
          </div>
        </div>
        
      </main>

      {/* 注入 CSS 动画 */}
      <style jsx global>{`
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-vertical {
          animation: scan-vertical 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
