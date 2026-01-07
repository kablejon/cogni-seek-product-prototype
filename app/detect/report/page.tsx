"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import domtoimage from "dom-to-image-more"
import { 
  Brain, 
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
  Microscope,
  Stethoscope,
  Waves,
  Search,
  CheckCircle2,
  Download,
  Share2,
  Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchStore } from "@/lib/store"
import { getDefaultAnalysisResult } from "@/lib/ai-service"

// --- 1. 场景地图配置 (全息线索地图) ---
const SCENE_CONFIG = {
  vehicle: { 
    icon: CarFront, 
    label: "VEHICLE BIO-SCAN",
    // 免费版显示的 3 个常规验证点 (Surface Layer)
    macroZones: [
      { t: '35%', l: '30%', label: '常规点 A: 驾驶座表面' }, 
      { t: '65%', l: '70%', label: '常规点 B: 后排地板' }, 
      { t: '50%', l: '50%', label: '常规点 C: 扶手箱' } 
    ]
  },
  home: { 
    icon: Armchair, 
    label: "RESIDENTIAL SCAN",
    macroZones: [
      { t: '60%', l: '20%', label: '常规点 A: 桌面' },
      { t: '60%', l: '80%', label: '常规点 B: 沙发表面' },
      { t: '40%', l: '50%', label: '常规点 C: 地面可见区' }
    ]
  },
  default: {
    icon: Briefcase,
    label: "TARGET AREA SCAN",
    macroZones: [
      { t: '30%', l: '30%', label: '常规点 A' },
      { t: '70%', l: '70%', label: '常规点 B' },
      { t: '50%', l: '50%', label: '常规点 C' }
    ]
  }
}

// --- 2. 动态分析引擎 (已废弃 - 现在使用真实 AI 分析) ---
// ⚠️ 此函数已被替换为真实的 AI API 调用，保留仅供参考
/*
const generateAnalysis = (session: any) => {
  const item = session.itemCustomName || '物品'
  const location = session.lossLocationCategory || 'home'
  const mood = session.mood || 'anxious'

  // ==========================================================
  // [PROMPT 逻辑说明]
  // 系统提示词：你是一位有20年经验的刑侦专家。请根据用户输入，
  // 生成一份笃定、反直觉、有温度的分析报告。
  // ==========================================================

  // A. 环境综述 (Environment Summary) - 代替倒计时
  let envSummary = {
    complexity: "高 (HIGH)",
    light: "弱光 (LOW LUX)",
    camouflage: "极高 (CRITICAL)",
    desc: `扫描显示 ${location === 'vehicle' ? '车内' : '该区域'} 存在大量视线死角。${item} 的材质极易与环境背景发生'视觉融合'。`
  }

  // [修改] 心理侧写: 更温情
  let psychology = {
    title: "非注意盲视 (Inattentional Blindness)",
    content: "别自责。在高压焦虑下，你的瞳孔收缩，大脑视觉皮层自动屏蔽了边缘信号。东西就在你手边，只是被你的大脑'隐形'了。深呼吸，按照下面的指令做，我们能找到。",
    tag: "应激性视野狭窄"
  }
  
  if (mood === 'calm' || mood.includes('巡航') || mood.includes('平静')) {
    psychology = {
      title: "惯性思维陷阱 (Inertial Thinking)",
      content: `你太熟悉这里了。大脑开启了'自动驾驶模式'，导致你对${item}的反常位置视而不见。我们必须用'陌生人视角'来打破这种惯性。`,
      tag: "记忆欺骗"
    }
  }

  // C. 宏观验证 (Macro Verification) - 免费版复盘
  // 模拟 AI 判断：常规地方大概率没有
  const macroReview = `常规平面扫描完毕。上述区域均未发现目标？这验证了我的推测：物品受外力或无意识动作影响，已滑入'结构性夹角'。`

  // [修改] 微观死角 (Micro Tactics) - 具体的、反直觉的动作
  let actions = []
  
  if (location === 'vehicle') {
    actions = [
      { title: "光学增强介入", desc: "关掉车内阅读灯。开启手机闪光灯，贴着地毯侧向平射。寻找金属材质的微弱反光。" },
      { title: "滑轨深层触探", desc: "别用眼看！座椅滑轨内部是视觉死角。手指伸入滑轨缝隙 5cm，像耙子一样扇形横扫。" },
      { title: "重力沉降点", desc: `检查座椅与中控台的夹缝下方。根据急刹车惯性，${item} 极可能卡在滑轨支架的凹槽里。` },
      { title: "脚垫下方复核", desc: "掀开脚垫。物品可能在滑落过程中钻入了脚垫与地毯的夹层。" },
      { title: "逆向回溯", desc: "坐在驾驶位，闭眼模仿下车动作。手里的东西是不是顺势放在了大腿旁？检查那个落点。" }
    ]
  } else {
    actions = [
      { title: "阴影侧向照明", desc: `关掉主灯。开启手机手电筒，贴着地面平射。寻找${item}投下的拉长阴影。` },
      { title: "触觉盲区扫描", desc: "视觉会欺骗你。闭上眼，将手伸入沙发/床垫缝隙深处至少10cm。依靠触觉寻找异物感。" },
      { title: "高位视野盲区", desc: "根据'灯下黑'原理，检查齐腰高的杂物堆顶端，或视线平齐的置物架边缘。" },
      { title: "织物褶皱复核", desc: "抖动被褥或外套。轻薄物品极易被织物褶皱包裹而隐形。" },
      { title: "第三方视角", desc: "邀请一位完全不知情的朋友，站在门口重新扫视一遍房间。" }
    ]
  }

  return { envSummary, psychology, macroReview, actions }
}
*/

export default function ReportPage() {
  const router = useRouter()
  const { session, resetSession, analysisResult, analysisError } = useSearchStore()
  const [isPaid, setIsPaid] = useState(false)
  const [loadingPay, setLoadingPay] = useState(false)
  const [caseId, setCaseId] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  
  // 客户端生成案件号，避免 Hydration 错误
  useEffect(() => {
    setCaseId(Math.floor(Math.random() * 10000))
  }, [])

  // ============================================================
  // 🧠 使用 AI 分析结果（真实数据）或备用数据
  // ============================================================
  const aiResult = useMemo(() => {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  📄 Report 页面: 数据源检查                              ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    
    if (analysisResult) {
      console.log('✅ 使用真实 AI 分析结果');
      console.log('📊 概率:', analysisResult.probability);
      console.log('📝 心理分析:', analysisResult.behaviorAnalysis?.substring(0, 80) + '...');
      console.log('🎯 行动清单:', analysisResult.checklist?.length, '项');
      return analysisResult;
    }
    
    console.warn('⚠️  analysisResult 为空，使用备用默认结果');
    console.log('📋 Session 数据:', {
      itemName: session.itemCustomName || session.itemName,
      location: session.lossLocationCategory,
      mood: session.userMood
    });
    
    const defaultResult = getDefaultAnalysisResult(session);
    console.log('🔄 生成的默认结果预览:', {
      probability: defaultResult.probability,
      behaviorAnalysisLength: defaultResult.behaviorAnalysis?.length,
      checklistLength: defaultResult.checklist?.length
    });
    
    return defaultResult;
  }, [analysisResult, session]);

  // 转换 AI 结果为原有的 content 格式以兼容现有 UI
  const content = useMemo(() => {
    const item = session.itemName || '物品';  // ✅ 修复：只使用 itemName
    const location = session.lossLocationCategory || 'home';
    
    console.log('🔄 转换 AI 数据为 UI 格式...');
    console.log('📦 物品:', item);
    console.log('📍 位置:', location);
    
    const transformedContent = {
      // 使用 AI 的心理分析，转换为原格式
      psychology: {
        title: "认知盲区分析",
        content: aiResult.behaviorAnalysis || "基于认知心理学分析...",
        tag: aiResult.probabilityLevel
      },
      // 环境综述
      envSummary: {
        complexity: aiResult.probabilityLevel === 'High' ? "高 (HIGH)" : "中 (MEDIUM)",
        light: "根据场景分析",
        camouflage: aiResult.probabilityLevel === 'High' ? "高 (HIGH)" : "中 (MEDIUM)",
        desc: aiResult.environmentAnalysis || "环境分析中..."
      },
      // 宏观验证
      macroReview: aiResult.summary || "常规区域扫描完毕...",
      // 战术动作清单（使用 AI 的 checklist）
      actions: (aiResult.checklist || []).slice(0, 5).map((item, index) => ({
        title: `行动 ${index + 1}`,
        desc: item
      }))
    };
    
    console.log('✅ UI 内容已生成:');
    console.log('  - 心理分析长度:', transformedContent.psychology.content.length);
    console.log('  - 环境分析长度:', transformedContent.envSummary.desc.length);
    console.log('  - 行动数量:', transformedContent.actions.length);
    console.log('  - 行动 1:', transformedContent.actions[0]?.desc?.substring(0, 50) + '...');
    
    return transformedContent;
  }, [aiResult, session]);

  // 获取当前场景配置
  const currentScene = useMemo(() => {
    const cat = (session.lossLocationCategory || 'default').toLowerCase()
    if (cat === 'vehicle') return SCENE_CONFIG.vehicle
    if (cat === 'home') return SCENE_CONFIG.home
    return SCENE_CONFIG.default
  }, [session])

  const SceneIcon = currentScene.icon

  // ============================================================
  // 🎯 动态生成 macroZones（使用 AI 的 basicSearchPoints）
  // ============================================================
  const dynamicMacroZones = useMemo(() => {
    const baseZones = currentScene.macroZones;
    const basicPoints = aiResult.basicSearchPoints || [];
    
    // 使用原有的位置坐标，但替换为 AI 生成的标签
    return baseZones.map((zone, index) => ({
      t: zone.t,
      l: zone.l,
      label: basicPoints[index] || zone.label // 使用 AI 内容，如果没有则回退到原标签
    }));
  }, [currentScene, aiResult.basicSearchPoints])

  // ============================================================
  // 🎯 寻回指数 (使用 AI 的 probability)
  // ============================================================
  const [recoveryIndex, setRecoveryIndex] = useState("85.0")
  
  useEffect(() => {
    // 使用 AI 返回的真实概率
    const aiProbability = aiResult.probability || 85;
    setRecoveryIndex(aiProbability.toFixed(1));
  }, [aiResult])

  const handleUnlock = () => {
    setLoadingPay(true)
    setTimeout(() => {
      setLoadingPay(false)
      setIsPaid(true)
    }, 1500)
  }

  const handleReturnHome = () => {
    resetSession()
    router.push('/')
  }

  // 生成完整报告图片（使用 dom-to-image-more）
  const handleGeneratePoster = async () => {
    setIsGenerating(true)
    
    try {
      // 获取报告主内容区域
      const reportElement = reportRef.current
      if (!reportElement) {
        throw new Error('报告元素未找到')
      }

      // 临时隐藏底部固定按钮区域
      const footerElement = document.querySelector('[class*="fixed bottom-0"]') as HTMLElement
      if (footerElement) {
        footerElement.style.display = 'none'
      }

      // 使用 dom-to-image-more 生成 PNG
      const dataUrl = await domtoimage.toPng(reportElement, {
        quality: 1,
        bgcolor: '#020617',
        style: {
          'transform': 'none',
          'color-scheme': 'dark'
        },
        filter: (node: Node) => {
          // 过滤掉可能导致问题的元素
          if (node instanceof HTMLElement) {
            const className = node.className || ''
            // 跳过固定定位的底部按钮
            if (typeof className === 'string' && className.includes('fixed') && className.includes('bottom-0')) {
              return false
            }
          }
          return true
        }
      })

      // 恢复底部按钮
      if (footerElement) {
        footerElement.style.display = ''
      }

      // 下载图片
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `CogniSeek-完整报告-CASE${caseId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('✅ 完整报告图片生成成功！')
    } catch (error) {
      console.error('❌ 生成报告图片失败:', error)
      // 如果 dom-to-image 也失败，提供打印方案
      const usePrint = confirm(`图片生成失败。\n\n是否使用"打印"功能保存为 PDF？\n（在打印对话框中选择"另存为 PDF"）`)
      if (usePrint) {
        window.print()
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div ref={reportRef} className="min-h-screen bg-[#020617] text-slate-200 font-mono selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden flex flex-col">
      
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
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
           <div className="text-[10px] font-mono text-cyan-700 bg-blue-950/30 border border-blue-900 px-2 py-1 rounded">
             CASE #{caseId}
          </div>
           {/* 下载报告按钮 */}
           <button 
             onClick={handleGeneratePoster}
             disabled={isGenerating}
             className="p-2 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950 hover:border-cyan-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
             title={isGenerating ? "生成中..." : "下载报告图片"}
           >
             <Download className={`w-4 h-4 group-hover:scale-110 transition-transform ${isGenerating ? 'animate-bounce' : ''}`} />
           </button>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto px-6 py-8 space-y-8 overflow-y-auto w-full pb-32">
        
        {/* --- 1. 寻回指数 (核心仪表) --- */}
        <section className="text-center space-y-2 relative">
          <h1 className="text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]">
            {recoveryIndex}
          </h1>
          
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase mt-2">
             <span className="px-2 py-0.5 border border-cyan-500/30 rounded bg-cyan-950/30">Analysis Complete</span>
             <span className="text-slate-600">|</span> 
             <span>Recovery Potential Index</span>
          </div>
          
          <div className="max-w-xs mx-auto mt-4 p-2 bg-blue-950/20 rounded border border-blue-900/30">
            <p className="text-[10px] text-slate-500 leading-relaxed scale-90">
              * AI 仅提供基于概率的线索指引，不保证 100% 找回。辅助服务，请理性消费。
            </p>
          </div>
        </section>

        {/* --- 2. 全息线索地图 (表层验证 vs 深层破局) --- */}
        <section className="relative w-full aspect-video bg-[#0B1121] border border-blue-800/30 rounded-xl overflow-hidden group shadow-[0_0_40px_rgba(2,6,23,0.8)_inset]">
          
          {/* 装饰标尺 */}
          <div className="absolute top-4 left-4 w-12 h-[1px] bg-cyan-500/30" />
          <div className="absolute bottom-4 right-4 w-[1px] h-12 bg-cyan-500/30" />
          
          {/* 扫描动画 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[20%] animate-scan-slow pointer-events-none" />

          {/* 场景图标 */}
          <div className="absolute inset-0 flex items-center justify-center">
             <SceneIcon strokeWidth={0.5} className="w-56 h-56 text-blue-800/40" />
          </div>

          {/* === 免费版：3个常规排查区 (Basic Search Points) === */}
          {!isPaid && dynamicMacroZones.map((zone, i) => (
            <div key={i} className="absolute" style={{ top: zone.t, left: zone.l }}>
              <div className="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group/zone">
                {/* 呼吸光斑 (黄色=常规) */}
                <div className="absolute w-16 h-16 bg-amber-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute w-8 h-8 border border-amber-500/30 rounded-full flex items-center justify-center animate-[spin_8s_linear_infinite]">
                   <div className="w-1 h-1 bg-amber-500/50 rounded-full" />
                </div>
                <div className="absolute top-6 px-2 py-0.5 bg-amber-950/80 border border-amber-500/30 backdrop-blur-sm rounded text-[9px] font-bold text-amber-500 tracking-widest whitespace-nowrap z-10">
                  直觉位置 {i + 1}
                </div>
              </div>
            </div>
          ))}

          {/* === 付费版：1个微观死角锁定 (Micro Target) === */}
          {isPaid && (
            <div className="absolute" style={{ top: '65%', left: '60%' }}>
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-20 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_20px_#ef4444]"></span>
                <div className="absolute left-10 top-[-20px] bg-red-950/90 border border-red-500/50 px-2 py-1 rounded">
                   <div className="text-[10px] text-red-400 font-bold whitespace-nowrap flex items-center gap-1">
                     <MapPin className="w-3 h-3" /> PRECISION TARGET
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* 底部状态条 */}
          <div className="absolute bottom-0 left-0 right-0 py-2 bg-[#0B1121]/90 border-t border-blue-900/30 flex justify-center backdrop-blur-sm">
             {!isPaid ? (
               <div className="flex items-center gap-2 text-[10px] text-amber-500 font-bold tracking-wide">
                 <ScanLine className="w-3 h-3" />
                 3个常规排查区
               </div>
             ) : (
               <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold tracking-wide">
                 <ShieldCheck className="w-3 h-3" />
                 微观死角坐标解密完成 (DEEP-SCAN)
               </div>
             )}
          </div>
        </section>

        {/* --- 3. 诊断报告 (环境综述 + 心理) --- */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
            <Microscope className="w-3 h-3" /> Diagnostic Report
          </h2>
          
          {/* A. 环境综述 (新模块 - 代替倒计时) */}
          <div className="bg-[#0f172a]/40 p-4 rounded-lg border border-blue-800/20 backdrop-blur-sm flex gap-4 items-start">
             <div className="p-2 bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 rounded-md shrink-0">
              <Waves className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-2">
               <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
                 <h3 className="font-bold text-sm text-indigo-100">环境物理扫描</h3>
                 <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20">COMPLETED</span>
              </div>
               <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div>复杂度: <span className="text-indigo-300">{content.envSummary.complexity}</span></div>
                  <div>伪装度: <span className="text-red-300">{content.envSummary.camouflage}</span></div>
                        </div>
               <p className="text-xs text-slate-400 leading-relaxed">
                 {content.envSummary.desc}
                          </p>
                        </div>
                      </div>
                      
          {/* B. 心理学侧写 */}
          <div className="bg-[#0f172a]/40 p-4 rounded-lg border border-blue-800/20 backdrop-blur-sm flex gap-4 items-start group hover:border-blue-500/30 transition-colors">
            <div className="p-2 bg-blue-950/40 text-blue-400 border border-blue-500/20 rounded-md shrink-0">
              <Brain className="w-5 h-5" />
                      </div>
            <div>
              <h3 className="font-bold text-sm text-blue-100">行为心理学分析</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {content.psychology.content}
              </p>
              <div className="mt-3 inline-flex items-center text-[10px] font-medium text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-500/20">
                诊断：{content.psychology.tag}
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. 战术行动清单 (免费验证 vs 付费破局) --- */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
             <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Stethoscope className="w-3 h-3" /> Tactical Protocol
             </h2>
             {!isPaid && <span className="text-[10px] font-bold text-cyan-600 flex items-center gap-1 opacity-80"><Lock className="w-3 h-3"/> DEEP SCAN ENCRYPTED</span>}
          </div>

          <div className="space-y-3">
             {/* [A] 免费验证区：列出 AI 猜你找过的地方 */}
             {!isPaid && (
               <div className="p-4 bg-amber-950/10 border border-amber-500/20 rounded-lg">
                 <div className="flex items-center gap-2 mb-2 text-amber-500">
                   <CheckCircle2 className="w-4 h-4" />
                   <h4 className="text-xs font-bold">免费：基础排查清单</h4>
                  </div>
                 <p className="text-[10px] text-slate-400 mb-3">
                   根据常识，你可能已经检查过以下位置：
                 </p>
                 <ul className="space-y-2 mb-3">
                   {dynamicMacroZones.map((z, i) => (
                     <li key={i} className="flex items-start gap-2 text-[10px] text-slate-400">
                       <div className="w-4 h-4 shrink-0 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mt-0.5">
                         <span className="text-[8px] text-amber-500 font-bold">{i + 1}</span>
                       </div>
                       <span className="flex-1">{z.label}</span>
                     </li>
                   ))}
                 </ul>
                 <div className="p-2 bg-amber-900/20 rounded text-[10px] text-amber-400/80 leading-relaxed border-l-2 border-amber-500/50">
                   <strong>💡 AI 分析：</strong> {content.macroReview}
                  </div>
                </div>
             )}

             {/* [B] 付费破局区：微观死角 */}
             {content.actions.map((action, i) => (
               <div key={i} className={`relative flex items-start gap-3 p-4 bg-[#0f172a]/40 rounded border transition-all ${isPaid ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-blue-900/10'}`}>
                  {!isPaid && (
                    <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-[4px] z-10 flex items-center justify-center">
                       {i === 1 && (
                         <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded text-cyan-400 shadow-lg">
                           <Lock className="w-3 h-3" />
                           <span className="text-[10px] font-bold tracking-widest">MICRO TACTICS LOCKED</span>
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

      {/* --- 底部 CTA --- */}
      {!isPaid && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#020617]/80 backdrop-blur-xl border-t border-blue-900/30 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-xl mx-auto space-y-3">
             <div className="flex justify-between items-center px-1">
               <div className="flex items-center gap-2">
                 <Search className="w-4 h-4 text-cyan-400" />
                 <span className="text-xs font-bold text-slate-300">5项微观死角 + 战术破局指令</span>
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white">$2.99</span>
                  <span className="text-xs text-slate-500 line-through decoration-slate-500">$9.99</span>
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
                 <span className="flex items-center gap-2"><ScanLine className="w-4 h-4 animate-spin"/> DECRYPTING...</span>
               ) : (
                 <span className="flex items-center gap-2">立即解锁方案 <Zap className="w-4 h-4 text-white fill-white"/></span>
               )}
                  </Button>
                </div>
              </div>
            )}

      {/* --- 付费后归档 --- */}
      {isPaid && (
         <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-md border-t border-blue-900/30 z-20">
            <div className="max-w-xl mx-auto flex flex-col gap-4">
              <p className="text-[10px] text-slate-500 text-center">
                请严格执行上述战术动作。若仍未找到，建议下载完整报告分享寻求帮助。
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* 左侧：下载完整报告 */}
                <Button 
                  onClick={handleGeneratePoster}
                  disabled={isGenerating}
                  className="h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold border border-cyan-400/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? '生成中...' : '下载完整报告'}
                </Button>
                {/* 右侧：返回首页 */}
            <Button 
              variant="outline" 
                  onClick={handleReturnHome}
                  className="h-11 border-blue-900/50 text-slate-400 bg-slate-900/50 hover:bg-slate-800 hover:text-slate-200 flex items-center justify-center gap-2"
            >
                  <Home className="w-4 h-4" />
                  返回首页
            </Button>
          </div>
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
