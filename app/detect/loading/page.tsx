"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  Scan, 
  Search,
  Crosshair,
  CarFront,
  TrainFront,
  Armchair,
  Briefcase,
  Trees,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react"
import { useSearchStore } from "@/lib/store"
import { itemCategories } from "@/lib/data"
import { analyzeWithAI } from "@/lib/ai-service"

// ============================================================================
// 1. 符号化数字孪生配置 (Symbolic Digital Twin Config)
//    使用 Lucide 矢量图标构建核心视觉
// ============================================================================
const SCENE_CONFIG = {
  // 🚗 私家车
  car: {
    id: 'VEHICLE_COCKPIT',
    icon: CarFront,
    subIcon: Zap, // 装饰小图标
    blindSpot: { top: '65%', left: '35%' }, // 盲区坐标
    label: "CHASSIS SCAN"
  },
  // 🚇 公共交通
  metro: {
    id: 'TRANSIT_UNIT',
    icon: TrainFront,
    subIcon: MapPin,
    blindSpot: { top: '60%', left: '50%' },
    label: "CABIN SCAN"
  },
  // 🏠 家里
  home: {
    id: 'RESIDENTIAL_ZONE',
    icon: Armchair,
    subIcon: ShieldCheck,
    blindSpot: { top: '55%', left: '65%' }, // 沙发缝隙
    label: "INTERIOR SCAN"
  },
  // 🏢 办公
  work: {
    id: 'WORKSPACE_SECTOR',
    icon: Briefcase,
    subIcon: Activity,
    blindSpot: { top: '70%', left: '45%' },
    label: "ASSET SCAN"
  },
  // 🛍️ 公共场所
  public: {
    id: 'COMMERCIAL_AREA',
    icon: ShoppingBag,
    subIcon: MapPin,
    blindSpot: { top: '60%', left: '55%' },
    label: "AREA SCAN"
  },
  // 🌳 户外
  outdoor: {
    id: 'OPEN_TERRAIN',
    icon: Trees,
    subIcon: MapPin,
    blindSpot: { top: '50%', left: '30%' },
    label: "TERRAIN SCAN"
  }
}

// [修改] 增加更有侦探感和心理学深度的日志
const LOGS = [
  "INITIALIZING_VECTOR_ENGINE...",
  "ACCESSING_BEHAVIORAL_DATABASE...", // [新增] 访问行为数据库
  "LOADING_SYMBOLIC_TWIN...",
  "SIMULATING_MEMORY_FRAGMENTS...", // [新增] 模拟记忆碎片
  "CALCULATING_PROBABILITY_HEATMAP...", // [新增] 计算概率热力图
  "DETECTING_VISUAL_ANOMALIES...",
  "BYPASSING_COGNITIVE_BIAS...", // [新增] 正在绕过认知偏差 (关键)
  "TARGET_LOCKED."
]

export default function LoadingPage() {
  const router = useRouter()
  const { session, setAnalysisResult, setAnalysisError } = useSearchStore()
  
  const [progress, setProgress] = useState(0)
  const [logIndex, setLogIndex] = useState(0)
  const [phase, setPhase] = useState(1) // 1:载入, 2:扫描, 3:锁定
  const [apiCallCompleted, setApiCallCompleted] = useState(false)

  // 获取物品名称
  const itemName = useMemo(() => {
    // ✅ 直接使用 session.itemName（来自 step-1 的保存）
    if (session.itemName) return session.itemName.toUpperCase()
    
    // 备用：从 itemCategory 中查找
    const category = itemCategories.find(c => c.id === session.itemCategory)
    const item = category?.items.find(i => i.id === session.itemName)
    return (item?.label || 'UNKNOWN_TARGET').toUpperCase()
  }, [session.itemName, session.itemCategory])

  // 智能场景匹配
  const currentScene = useMemo(() => {
    const cat = (session.lossLocationCategory || '').toLowerCase()
    // lossLocationSubCategory 是数组，需要转换为字符串
    const subArray = session.lossLocationSubCategory || []
    const sub = (Array.isArray(subArray) ? subArray.join(' ') : String(subArray)).toLowerCase()

    // 优先匹配二级场景
    if (['subway', 'bus', 'train', 'plane', 'station'].some(k => sub.includes(k))) return SCENE_CONFIG.metro
    if (['car', 'taxi', 'driving', 'bike'].some(k => sub.includes(k))) return SCENE_CONFIG.car
    if (['desk', 'office', 'meeting', 'class', 'school', 'work'].some(k => sub.includes(k))) return SCENE_CONFIG.work
    if (['mall', 'shop', 'restaurant', 'cinema', 'gym'].some(k => sub.includes(k))) return SCENE_CONFIG.public
    if (['park', 'street', 'parking', 'outdoor'].some(k => sub.includes(k))) return SCENE_CONFIG.outdoor
    
    // 默认回落
    if (cat === 'vehicle') return SCENE_CONFIG.car
    if (cat === 'work') return SCENE_CONFIG.work
    if (cat === 'public') return SCENE_CONFIG.public
    if (cat === 'outdoors') return SCENE_CONFIG.outdoor
    
    return SCENE_CONFIG.home
  }, [session])

  const MainIcon = currentScene.icon
  const SubIcon = currentScene.subIcon

  // ============================================================
  // 🧠 真实的 AI 分析调用（核心功能）
  // ============================================================
  useEffect(() => {
    let isMounted = true;

    async function performAnalysis() {
      try {
        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║  🚀 Loading 页面: 开始 AI 分析                           ║');
        console.log('╚══════════════════════════════════════════════════════════╝');
        console.log('📋 用户选择的物品:', itemName);
        console.log('📍 丢失位置:', session.lossLocationCategory);
        console.log('🧠 心情状态:', session.userMood);
        console.log('⏰ 丢失时间:', session.lossTime);
        
        const result = await analyzeWithAI(session);
        
        if (isMounted) {
          console.log('╔══════════════════════════════════════════════════════════╗');
          console.log('║  ✅ AI 分析成功! 数据已保存到 Store                      ║');
          console.log('╚══════════════════════════════════════════════════════════╝');
          console.log('📊 AI 返回的概率:', result.probability);
          console.log('📝 心理分析预览:', result.behaviorAnalysis?.substring(0, 50) + '...');
          console.log('🎯 行动清单数量:', result.checklist?.length);
          
          setAnalysisResult(result);
          setApiCallCompleted(true);
        }
      } catch (error) {
        console.error('╔══════════════════════════════════════════════════════════╗');
        console.error('║  ❌ AI 分析失败                                          ║');
        console.error('╚══════════════════════════════════════════════════════════╝');
        console.error('错误详情:', error);
        console.warn('⚠️  将使用备用默认分析结果');
        
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : '分析失败，请重试';
          setAnalysisError(errorMessage);
          setApiCallCompleted(true); // 即使失败也允许继续，report 页面会显示默认数据
        }
      }
    }

    performAnalysis();

    return () => {
      isMounted = false;
    };
  }, [session, setAnalysisResult, setAnalysisError, itemName]);

  // ============================================================
  // 🎬 平滑进度条 - 智能等待 API，永不回退
  // ============================================================
  useEffect(() => {
    const interval = 50
    let currentProgress = 0

    const timer = setInterval(() => {
      setProgress((prev) => {
        // 📊 智能速度控制
        let increment: number
        
        if (prev < 85) {
          // 阶段1 (0-85%): 正常速度 (约 8 秒)
          increment = 0.53  // 85% / (8000ms / 50ms) = 0.53
        } else if (prev < 95) {
          // 阶段2 (85-95%): 减速等待 API
          if (apiCallCompleted) {
            // API 已完成，快速推进
            increment = 2.0
          } else {
            // API 未完成，极慢速度缓动
            increment = 0.1
          }
        } else {
          // 阶段3 (95-100%): 只有 API 完成才能到 100%
          if (apiCallCompleted) {
            increment = 1.0  // 快速完成最后 5%
          } else {
            increment = 0  // 停在 95-99%，永不到 100%
          }
        }

        const newProgress = Math.min(100, prev + increment)
        currentProgress = newProgress

        // 阶段控制
        if (newProgress < 20) setPhase(1) // 初始化
        else if (newProgress < 80) setPhase(2) // 扫描中
        else setPhase(3) // 锁定

        // 日志控制
        const logIdx = Math.floor((newProgress / 100) * LOGS.length)
        setLogIndex(Math.min(logIdx, LOGS.length - 1))

        // ✅ 到达 100% 且 API 完成，准备跳转
        if (newProgress >= 100 && apiCallCompleted) {
          clearInterval(timer)
          console.log('🎬 平滑动画完成，准备跳转到 Report 页面');
          setTimeout(() => router.push("/detect/report"), 600)
        }

        return newProgress
      })
    }, interval)

    return () => clearInterval(timer)
  }, [router, apiCallCompleted])

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-300 font-mono flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 背景纹理：极简点阵 */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />
      
      {/* 顶部 HUD */}
      <div className="w-full max-w-sm px-6 mb-8 flex justify-between items-end animate-in fade-in slide-in-from-top duration-700">
        <div>
          <div className="text-[10px] text-slate-500 tracking-[0.2em] mb-1">SYSTEM</div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Scan className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-bold">DIGITAL TWIN</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 tracking-[0.2em] mb-1">MODE</div>
          <div className="text-sm font-bold text-slate-200">{currentScene.label}</div>
        </div>
      </div>

      {/* 核心视窗：战术符号化扫描 (Tactical Symbolic Scan) */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center group">
        
        {/* 外围光环装饰 */}
        <div className="absolute inset-0 border border-slate-800 rounded-full opacity-50 scale-110" />
        <div className="absolute inset-0 border border-dashed border-slate-800 rounded-full opacity-30 scale-125 animate-spin-slow" />

        {/* --- Layer 1: 底层轮廓 (暗淡) --- */}
        <MainIcon 
          strokeWidth={1} 
          className="w-48 h-48 md:w-56 md:h-56 text-slate-800 absolute transition-all duration-500" 
        />

        {/* --- Layer 2: 激活层 (高亮 + 填充) --- */}
        {/* 使用 clip-path 实现扫描揭示效果 */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-100 ease-linear"
          style={{ 
            clipPath: phase >= 2 
              ? `inset(0 0 ${100 - ((progress - 20) * 1.5)}% 0)` // 从上往下扫描
              : 'inset(100% 0 0 0)' 
          }}
        >
          <MainIcon 
            strokeWidth={1.5} 
            className="w-48 h-48 md:w-56 md:h-56 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
            fill="rgba(34,211,238,0.1)" // 半透明青色填充
          />
        </div>

        {/* --- 扫描光带 (Scanner Beam) --- */}
        {phase === 2 && (
          <div 
            className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-10"
            style={{ 
              top: `${(progress - 20) * 1.5}%`,
              opacity: (progress - 20) * 1.5 > 100 ? 0 : 1 // 超出范围隐藏
            }} 
          />
        )}

        {/* --- 盲区锁定 (Phase 3) --- */}
        {phase === 3 && (
          <div 
            className="absolute z-20"
            style={{ top: currentScene.blindSpot.top, left: currentScene.blindSpot.left }}
          >
            {/* 脉冲红点 */}
            <div className="relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
            </div>

            {/* 锁定框动画 */}
            <div className="absolute -top-3 -left-3 w-9 h-9 border border-red-500/50 rounded-sm animate-lock-in" />
            
            {/* 标签 */}
            <div className="absolute left-6 top-[-4px] bg-red-500/10 border-l-2 border-red-500 px-2 py-0.5 animate-fade-in-right">
              <span className="text-[9px] font-bold text-red-400 whitespace-nowrap">ANOMALY DETECTED</span>
            </div>
          </div>
        )}

        {/* 装饰子图标 */}
        <div className="absolute bottom-4 right-4 p-2 bg-slate-900/80 rounded-full border border-slate-700">
           <SubIcon className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* 底部控制台 */}
      <div className="w-full max-w-sm px-6 mt-12 space-y-5">
        
        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between items-end text-xs font-mono font-bold">
            <span className="text-cyan-500/70">ANALYSIS_PROGRESS</span>
            <span className="text-cyan-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 动态日志 */}
        <div className="h-8 flex items-center gap-3 text-[10px] md:text-xs font-mono text-slate-400 border-l-2 border-slate-800 pl-3 bg-slate-900/30 rounded-r-md">
          <span className="text-cyan-500 animate-pulse">{">"}</span>
          <span className="truncate tracking-tight">{LOGS[logIndex]}</span>
        </div>

        {/* 目标匹配 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 opacity-60">
           <div className="flex items-center gap-2 text-xs text-slate-500">
             <Search className="w-3 h-3" />
             <span>MATCHING TARGET:</span>
           </div>
           <div className="flex items-center gap-2">
             <Crosshair className="w-3 h-3 text-red-400" />
             <span className="text-xs font-bold text-slate-300">{itemName}</span>
           </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes lock-in {
          0% { transform: scale(2); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-lock-in {
          animation: lock-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fade-in-right {
          0% { transform: translateX(-10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
