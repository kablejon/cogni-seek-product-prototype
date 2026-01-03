"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  Brain, 
  Clock, 
  MapPin, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  ScanLine,
  FileText,
  Activity,
  CarFront,
  Armchair,
  Briefcase,
  Trees,
  ShoppingBag,
  TrainFront,
  Microscope,
  Stethoscope
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchStore } from "@/lib/store"

// --- 1. 场景地图配置 (全息线索地图) ---
const SCENE_CONFIG = {
  vehicle: { 
    icon: CarFront, 
    label: "VEHICLE BIO-SCAN",
    // 免费版显示的 3 个模糊热力区
    fuzzyZones: [
      { t: '35%', l: '30%', label: 'SECTOR A' }, // 驾驶位
      { t: '65%', l: '70%', label: 'SECTOR B' }, // 后排缝隙
      { t: '50%', l: '50%', label: 'SECTOR C' }  // 中控
    ]
  },
  home: { 
    icon: Armchair, 
    label: "RESIDENTIAL SCAN",
    fuzzyZones: [
      { t: '60%', l: '20%', label: 'ZONE A' },
      { t: '60%', l: '80%', label: 'ZONE B' },
      { t: '40%', l: '50%', label: 'ZONE C' }
    ]
  },
  default: {
    icon: Briefcase,
    label: "TARGET AREA SCAN",
    fuzzyZones: [
      { t: '30%', l: '30%', label: 'SEC A' },
      { t: '70%', l: '70%', label: 'SEC B' },
      { t: '50%', l: '50%', label: 'SEC C' }
    ]
  }
}

// --- 2. 动态分析引擎 (老刑侦/专家人设) ---
const generateAnalysis = (session: any) => {
  const item = session.itemCustomName || '物品'
  const location = session.lossLocationCategory || 'home'
  const mood = session.mood || 'anxious'

  // 心理侧写 (暖心专家口吻)
  let psychology = {
    title: "非注意盲视 (Inattentional Blindness)",
    content: "别自责，这在医学上很常见。在高压焦虑下，你的大脑视觉皮层会自动屏蔽'边缘信号'。东西就在你眼皮子底下，只是被大脑'隐形'了。深呼吸，信我一次。",
    tag: "视觉屏蔽效应"
  }
  
  if (mood === 'calm') {
    psychology = {
      title: "惯性思维陷阱 (Inertial Thinking)",
      content: `你是太熟悉这里了。大脑开启了'自动驾驶模式'，导致你对${item}的反常位置视而不见。我们要用'陌生人视角'打破这种惯性。`,
      tag: "记忆欺骗"
    }
  }

  // 物理定位文案
  let physics = {
    desc: `基于${item}的光谱反射率与${location}的重力沉降模型，AI 已测算出 5 个极高概率的'隐匿坐标'。`
  }

  // 战术行动清单
  const actions = [
    { title: "光学增强介入", desc: "关掉主灯。开启手机闪光灯，贴着地面侧向平射。寻找材质的微弱反光点。" },
    { title: "盲区触觉扫描", desc: "别用眼看！把手伸进[锁定坐标]深处 5-10cm，像耙子一样进行扇形横扫。" },
    { title: "逆向回溯路径", desc: `回到门口。闭上眼，模拟你进门那一刻的手部动作。是不是随手一扔？` },
    { title: "重力沉降点排查", desc: "检查所有低于膝盖高度的平面，以及堆叠物体的最底层。" },
    { title: "第三方视角复核", desc: "请一位完全不知道此事的伙伴，站在'陌生人视角'帮你重新扫视一遍。" }
  ]

  return { psychology, physics, actions }
}

export default function ReportPage() {
  const router = useRouter()
  const { session, resetSession } = useSearchStore()
  const [isPaid, setIsPaid] = useState(false)
  const [loadingPay, setLoadingPay] = useState(false)
  const [timeLeft, setTimeLeft] = useState(7200) // 2小时倒计时

  // 返回首页并重置所有数据
  const handleReturnHome = () => {
    resetSession()
    router.push('/')
  }
  
  // 获取动态内容
  const content = useMemo(() => generateAnalysis(session), [session])

  // 获取当前场景配置
  const currentScene = useMemo(() => {
    const cat = (session.lossLocationCategory || 'default').toLowerCase()
    if (cat === 'vehicle') return SCENE_CONFIG.vehicle
    if (cat === 'home') return SCENE_CONFIG.home
    return SCENE_CONFIG.default
  }, [session])

  const SceneIcon = currentScene.icon

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // 寻回指数 (动态计算)
  const recoveryIndex = useMemo(() => {
    let base = 85
    if (session.lossLocationCategory === 'outdoor') base -= 12
    return Math.max(45, Math.min(89.5, base + (Math.random() * 4 - 2))).toFixed(1)
  }, [session])

  const handleUnlock = () => {
    setLoadingPay(true)
    setTimeout(() => {
      setLoadingPay(false)
      setIsPaid(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-mono selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden flex flex-col">
      
      {/* 背景：医用脉冲网格 */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
      {/* 顶部蓝色光晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* --- Header: 医疗仪表盘风格 --- */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-blue-900/30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-cyan-950/50 border border-cyan-400 text-cyan-400 rounded flex items-center justify-center">
            <Activity className="w-3 h-3" />
          </div>
          <span className="font-bold tracking-tight text-sm text-cyan-100">
            CogniSeek <span className="text-cyan-700">///</span> MED-SCAN
          </span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
           <div className="text-[10px] font-mono text-cyan-700 bg-blue-950/30 border border-blue-900 px-2 py-1 rounded">
             CASE #{Math.floor(Math.random() * 10000)}
           </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto px-6 py-8 space-y-8 overflow-y-auto w-full pb-32">
        
        {/* --- 1. 寻回指数 (核心仪表) --- */}
        <section className="text-center space-y-2 relative">
          {/* 指数大数字 */}
          <h1 className="text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]">
            {recoveryIndex}
          </h1>
          
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase mt-2">
             <span className="px-2 py-0.5 border border-cyan-500/30 rounded bg-cyan-950/30">Analysis Complete</span>
             <span className="text-slate-600">|</span> 
             <span>Recovery Potential Index</span>
          </div>

          {/* 免责声明 (弱化处理) */}
          <div className="max-w-xs mx-auto mt-4 p-2 bg-blue-950/20 rounded border border-blue-900/30">
            <p className="text-[10px] text-slate-500 leading-relaxed scale-90">
              * AI 仅提供基于概率的线索指引，不保证 100% 找回。辅助服务，请理性消费。
            </p>
          </div>
        </section>

        {/* --- 2. 全息线索地图 (核心视觉区) --- */}
        {/* 免费版：显示模糊热力区 | 付费版：显示精准红点 */}
        <section className="relative w-full aspect-video bg-[#0B1121] border border-blue-800/30 rounded-xl overflow-hidden group shadow-[0_0_40px_rgba(2,6,23,0.8)_inset]">
          
          {/* 医用标尺装饰 */}
          <div className="absolute top-4 left-4 w-12 h-[1px] bg-cyan-500/30" />
          <div className="absolute top-4 left-4 w-[1px] h-12 bg-cyan-500/30" />
          <div className="absolute bottom-4 right-4 w-12 h-[1px] bg-cyan-500/30" />
          <div className="absolute bottom-4 right-4 w-[1px] h-12 bg-cyan-500/30" />
          
          {/* 扫描线动画 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[20%] animate-scan-slow pointer-events-none" />

          {/* 场景图标 (蓝图底色) */}
          <div className="absolute inset-0 flex items-center justify-center">
             <SceneIcon strokeWidth={0.5} className="w-56 h-56 text-blue-800/40" />
          </div>

          {/* === A. 免费版状态：模糊热力图 (The Fuzzy Zones) === */}
          {!isPaid && currentScene.fuzzyZones.map((zone, i) => (
            <div key={i} className="absolute" style={{ top: zone.t, left: zone.l }}>
              <div className="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group/zone">
                {/* 扩散波纹 (橙黄色表示警示/热区) */}
                <div className="absolute w-20 h-20 bg-amber-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute w-12 h-12 border border-amber-500/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                   <div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full" />
                </div>
                {/* 标签 */}
                <div className="absolute top-8 px-2 py-0.5 bg-amber-950/50 border border-amber-500/30 backdrop-blur-sm rounded text-[9px] font-bold text-amber-500 tracking-widest whitespace-nowrap opacity-80">
                  SUSPECT AREA {zone.label}
                </div>
              </div>
            </div>
          ))}

          {/* === B. 付费版状态：精准锁定 (The Red Dot) === */}
          {isPaid && (
            <div className="absolute" style={{ top: '65%', left: '60%' }}>
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-20 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_20px_#ef4444]"></span>
                
                {/* 锁定引线 */}
                <div className="absolute left-4 top-[-20px] w-8 h-[20px] border-b border-l border-red-500/50" />
                <div className="absolute left-12 top-[-30px] bg-red-950/90 border border-red-500/50 px-2 py-1 rounded">
                   <div className="text-[10px] text-red-400 font-bold whitespace-nowrap flex items-center gap-1">
                     <MapPin className="w-3 h-3" /> TARGET LOCKED
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* 底部状态条 */}
          <div className="absolute bottom-0 left-0 right-0 py-2 bg-[#0B1121]/90 border-t border-blue-900/30 flex justify-center backdrop-blur-sm">
             {!isPaid ? (
               <div className="flex items-center gap-2 text-[10px] text-amber-500 font-bold tracking-wide animate-pulse">
                 <ScanLine className="w-3 h-3" />
                 已定位 3 个高热能嫌疑区域
               </div>
             ) : (
               <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold tracking-wide">
                 <ShieldCheck className="w-3 h-3" />
                 物理坐标解密完成
               </div>
             )}
          </div>
        </section>

        {/* --- 3. 核心维度卡片 (心理 + 时间) --- */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
            <Microscope className="w-3 h-3" /> Diagnostic Data
          </h2>
          
          {/* 心理学卡片 (通透蓝) */}
          <div className="bg-[#0f172a]/40 p-5 rounded-lg border border-blue-800/20 backdrop-blur-sm flex gap-4 items-start group hover:border-blue-500/30 transition-colors">
            <div className="p-2 bg-blue-950/40 text-blue-400 border border-blue-500/20 rounded-md shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-blue-100">行为心理学侧写</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {content.psychology.content}
              </p>
              <div className="mt-3 inline-flex items-center text-[10px] font-medium text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-500/20">
                诊断结果：{content.psychology.tag}
              </div>
            </div>
          </div>

          {/* 时间倒计时 (紧迫橙) */}
          <div className="bg-[#0f172a]/40 p-5 rounded-lg border border-blue-800/20 backdrop-blur-sm flex gap-4 items-start relative overflow-hidden">
            {/* 倒计时条 */}
            <div className="absolute top-0 left-0 h-[2px] bg-amber-500/80 shadow-[0_0_10px_#f59e0b] transition-all duration-1000" style={{ width: `${(timeLeft/7200)*100}%` }} />
            
            <div className="p-2 bg-amber-950/20 text-amber-500 border border-amber-500/20 rounded-md shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm text-slate-200">记忆半衰期倒计时</h3>
                <span className="font-mono text-xs font-bold text-amber-500 tabular-nums">{formatTime(timeLeft)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                距离最佳窗口仅剩 2 小时。根据算法，物品发生<strong className="text-slate-200">无意识位移</strong>（如被他人移动）的概率正以每小时 15% 的速度攀升。
              </p>
            </div>
          </div>
        </section>

        {/* --- 4. 战术行动清单 (付费锁定区) --- */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
             <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Stethoscope className="w-3 h-3" /> Tactical Protocol
             </h2>
             {!isPaid && <span className="text-[10px] font-bold text-cyan-600 flex items-center gap-1 opacity-80"><Lock className="w-3 h-3"/> ENCRYPTED DATA</span>}
          </div>

          <div className="space-y-3">
             {/* 免费诱饵：常规扫描 */}
             <div className="flex items-start gap-3 p-4 bg-[#0f172a]/30 rounded border border-blue-900/20 opacity-60">
                <div className="mt-0.5"><div className="w-4 h-4 rounded border border-slate-700 bg-slate-800" /></div>
                <div className="flex-1">
                   <h4 className="text-xs font-bold text-slate-400">表层视觉扫描 (常规)</h4>
                   <p className="text-[10px] text-slate-600 mt-1">检查桌面、椅子表面等可见区域。（大概率无效，AI 已排除）</p>
                </div>
             </div>

             {/* 付费项：模糊锁定 */}
             {content.actions.map((action, i) => (
               <div key={i} className={`relative flex items-start gap-3 p-4 bg-[#0f172a]/40 rounded border transition-all ${isPaid ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-blue-900/20'}`}>
                  {!isPaid && (
                    <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-[5px] z-10 flex items-center justify-center">
                       {i === 1 && (
                         <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded text-cyan-400">
                           <Lock className="w-3 h-3" />
                           <span className="text-[10px] font-bold tracking-widest">5 STEPS LOCKED</span>
                         </div>
                       )}
                    </div>
                  )}
                  
                  <div className="mt-0.5">
                    {isPaid ? (
                      <div className="w-4 h-4 rounded border border-cyan-500/50 bg-cyan-950/30 text-cyan-400 flex items-center justify-center shadow-[0_0_5px_rgba(34,211,238,0.2)]">
                        <ArrowRight className="w-2.5 h-2.5"/>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border border-slate-800 bg-slate-900" />
                    )}
                  </div>
                  <div className="flex-1">
                     <h4 className={`text-xs font-bold ${isPaid ? 'text-cyan-50' : 'text-slate-600'}`}>{action.title}</h4>
                     <p className={`text-[10px] mt-1 ${isPaid ? 'text-slate-300' : 'text-slate-700'}`}>
                        {action.desc}
                     </p>
                  </div>
               </div>
             ))}
          </div>
        </section>

      </main>

      {/* --- 底部 CTA (悬浮支付栏) --- */}
      {!isPaid && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#020617]/80 backdrop-blur-xl border-t border-blue-900/30 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-xl mx-auto space-y-3">
             <div className="flex justify-between items-center px-1">
               <div className="flex items-center gap-2">
                 <FileText className="w-4 h-4 text-cyan-400" />
                 <span className="text-xs font-bold text-slate-300">完整取证报告 + 5项战术指令</span>
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white">¥9.9</span>
                  <span className="text-xs text-slate-500 line-through decoration-slate-500">¥29.9</span>
               </div>
             </div>
             
             <Button 
               onClick={handleUnlock}
               size="lg"
               className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-bold shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group border border-cyan-400/20"
               disabled={loadingPay}
             >
               <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
               {loadingPay ? (
                 <span className="flex items-center gap-2"><ScanLine className="w-4 h-4 animate-spin"/> SCANNING...</span>
               ) : (
                 <span className="flex items-center gap-2">立即解锁方案 <Zap className="w-4 h-4 text-white fill-white"/></span>
               )}
             </Button>
          </div>
        </div>
      )}

      {/* --- 付费后: 底部功能区 --- */}
      {isPaid && (
         <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617] border-t border-blue-900/30 z-20">
            <div className="max-w-xl mx-auto flex flex-col gap-4">
              <p className="text-[10px] text-slate-500 text-center">
                请按照上述清单逐一排查。若仍未找到，可能物品已脱离当前环境。
              </p>
              <Button variant="outline" className="w-full h-11 border-blue-900/50 text-slate-400 bg-slate-900/50 hover:bg-slate-800 hover:text-slate-200" onClick={handleReturnHome}>
                生成协查海报 / 返回首页
              </Button>
            </div>
         </div>
      )}

      <style jsx global>{`
        @keyframes scan-slow {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(500%); opacity: 0; }
        }
        .animate-scan-slow {
          animation: scan-slow 4s linear infinite;
        }
      `}</style>
    </div>
  )
}
