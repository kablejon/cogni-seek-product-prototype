"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InteractiveFog } from "@/components/ui/interactive-fog"
import { 
  ArrowRight, 
  Scan, 
  Brain, 
  Zap, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Smartphone, 
  EyeOff, 
  Fingerprint,
  Lock,
  FileSignature,
  Radio,
  Copy,
  Check,
  AlertTriangle,
  ChevronRight
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- [核心组件] 全息雷达扫描仪 (保持视觉不动) ---
const HoloScanner = () => (
  <div className="relative w-full max-w-[400px] md:max-w-[500px] aspect-square mx-auto select-none pointer-events-none">
    {/* 1. 外部装饰环 */}
    <div className="absolute inset-0 rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]" />
    <div className="absolute inset-[10%] rounded-full border border-dashed border-cyan-500/10 animate-[spin_60s_linear_infinite]" />
    
    {/* 2. 内部扫描网格 */}
    <div className="absolute inset-[20%] rounded-full bg-cyan-950/10 border border-cyan-500/30 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute inset-[-50%] top-[-50%] left-[-50%] w-[200%] h-[200%] origin-center animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(6,182,212,0.5)_360deg)]" />
    </div>

    {/* 3. 动态光点 */}
    <div className="absolute top-[35%] left-[35%] w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-ping" />
    <div className="absolute top-[35%] left-[35%] w-1.5 h-1.5 bg-white rounded-full" />
    
    {/* 4. 浮动数据面板 */}
    <div className="absolute top-[25%] right-[0%] md:-right-[10%] bg-slate-900/80 border border-emerald-500/30 p-3 rounded-lg backdrop-blur-md animate-bounce-slow shadow-xl">
      <div className="flex items-center gap-2 mb-1.5">
        <Scan className="w-3 h-3 text-emerald-400" />
        <span className="text-[10px] font-mono text-emerald-400 tracking-wider">TARGET_DETECTED</span>
      </div>
      <div className="space-y-1">
        <div className="h-1 w-24 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-[92%] animate-pulse" />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-slate-400">
          <span>MATCH: 92%</span>
          <span>ID: #992A</span>
        </div>
      </div>
    </div>

    {/* 5. 中心准星 */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-4 border border-cyan-400/50 rounded-full flex items-center justify-center">
        <div className="w-0.5 h-full bg-cyan-400/50" />
        <div className="h-0.5 w-full bg-cyan-400/50 absolute" />
      </div>
    </div>
  </div>
)

// --- [组件] 滚动档案卡片 ---
const CaseFile = ({ id, title, reason, icon: Icon, colorClass }: any) => (
  <div className="flex-shrink-0 w-72 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-300 group cursor-default">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2 rounded-lg bg-opacity-10 ${colorClass.bg} ${colorClass.text}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[10px] font-mono text-slate-500">CASE #{id}</span>
    </div>
    <h4 className="font-bold text-slate-200 text-sm mb-1">{title}</h4>
    <p className="text-xs text-slate-400 leading-relaxed">{reason}</p>
    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="text-[10px] text-emerald-500 font-mono">RECOVERED</span>
    </div>
  </div>
)

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [copied, setCopied] = useState(false)

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 平滑滚动锚点函数
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 减去导航栏高度
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  // 复制邮箱功能
  const copyEmail = () => {
    navigator.clipboard.writeText("kablejon@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      {/* A. 背景层：保持不变 */}
      <InteractiveFog color="6, 182, 212" />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-20" />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-[#020617]/30 to-[#020617]/80 pointer-events-none" />

      {/* B. 导航栏 (功能修复) */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#020617]/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo - 点击回顶部 */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors">
              <span className="font-bold text-lg tracking-tight text-white">C</span>
            </div>
            <span className="font-bold text-lg tracking-tight">CogniSeek</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('theory')}
              className="text-sm text-slate-400 hover:text-white transition-all relative group py-2"
            >
              科学原理
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full" />
            </button>
            <button 
              onClick={() => scrollToSection('cases')}
              className="text-sm text-slate-400 hover:text-white transition-all relative group py-2"
            >
              成功案例
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full" />
            </button>
            <Link href="/detect/intro">
              <Button className="rounded-full bg-white text-black hover:bg-cyan-50 hover:text-cyan-900 font-bold px-6 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                免费开始诊断 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* C. 首屏 Hero Section (增加免责声明) */}
        <section className="container mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 text-center md:text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase">System Online V3.0</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              你的物品<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                并没有消失。
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl mx-auto md:mx-0 leading-relaxed">
              它只是躲进了你的<strong className="text-slate-200">"认知盲区"</strong>。CogniSeek 就像你的**数字侦探**，利用<strong className="text-slate-200">行为心理学</strong>与<strong className="text-slate-200">环境概率论</strong>，在 3 分钟内帮你找回那些"明明就在手边"的东西。
            </p>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Link href="/detect/intro" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] text-lg font-bold border border-cyan-400/20 group transition-all hover:scale-[1.02]">
                    <Fingerprint className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    启动侦探程序
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono py-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>隐私加密 · 无需注册</span>
                </div>
              </div>
              {/* [修改] 软化免责声明，强调系统价值 */}
              <p className="text-[10px] text-slate-600 md:text-left">
                * 系统基于概率模型提供**搜寻策略**。我们无法改变物品被盗等物理事实，但能帮你排除 90% 的记忆干扰。
              </p>
            </div>
          </div>

          <div className="flex-1 w-full relative animate-float-slow">
            <HoloScanner />
            <p className="text-center font-mono text-[10px] text-cyan-500/40 mt-8 tracking-[0.3em] uppercase">
              // Initiating Neural Search Pattern
            </p>
          </div>
        </section>

        {/* D. 痛点：非注意盲视 (Diagnosis) */}
        <section className="border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-6 py-24 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">为什么你翻了三遍还是找不到？</h2>
              <p className="text-slate-400 text-lg">
                因为你的大脑在"撒谎"。这在心理学上被称为<br className="hidden md:block"/>
                <span className="text-white font-bold border-b border-purple-500/50">"非注意盲视 (Inattentional Blindness)"</span>。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: EyeOff, color: "text-purple-400", bg: "bg-purple-500/10", title: "视觉收窄", desc: "焦虑状态下，人的视野会物理性收窄 40%。物品就在视网膜上，但大脑拒绝处理。" },
                { icon: Smartphone, color: "text-red-400", bg: "bg-red-500/10", title: "认知断片", desc: "如果你当时在看手机或打电话，你的大脑根本没有点击'保存'按钮。我们帮你恢复数据。" },
                { icon: Brain, color: "text-cyan-400", bg: "bg-cyan-500/10", title: "记忆篡改", desc: "你会把'上周把钥匙放在桌上'的记忆，错误地嫁接到今天。这是大脑的节能机制。" }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/30 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-colors">
                  <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-6`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* E. 解决方案：三维模型 (Technology) - [ID修复] */}
        <section id="theory" className="container mx-auto px-6 py-24 scroll-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-cyan-500 font-mono text-xs tracking-wider uppercase mb-2 block">Our Methodology</span>
              <h2 className="text-3xl md:text-4xl font-bold">不靠运气，靠算法</h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm md:text-right">
              CogniSeek 是你的"第二双冷静的眼睛"。<br/>我们用算法填补你的记忆真空。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-800/30 to-transparent backdrop-blur-md border border-white/10 hover:border-cyan-500/50 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity text-cyan-500"><Brain className="w-20 h-20" /></div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-cyan-950 flex items-center justify-center mb-6 border border-cyan-500/20"><span className="font-mono font-bold text-cyan-400">01</span></div>
                <h3 className="text-xl font-bold mb-3">行为心理学</h3>
                <p className="text-sm text-slate-400">提取潜意识触觉记忆，还原你"无意识随手一放"的那个瞬间状态。</p>
              </div>
            </div>
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-800/30 to-transparent backdrop-blur-md border border-white/10 hover:border-emerald-500/50 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity text-emerald-500"><Scan className="w-20 h-20" /></div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center mb-6 border border-emerald-500/20"><span className="font-mono font-bold text-emerald-400">02</span></div>
                <h3 className="text-xl font-bold mb-3">环境概率论</h3>
                <p className="text-sm text-slate-400">计算物体滑落、滚动的物理落点，破解"黑色物体在阴影中"的视觉伪装。</p>
              </div>
            </div>
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-800/30 to-transparent backdrop-blur-md border border-white/10 hover:border-purple-500/50 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity text-purple-500"><Clock className="w-20 h-20" /></div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-purple-950 flex items-center justify-center mb-6 border border-purple-500/20"><span className="font-mono font-bold text-purple-400">03</span></div>
                <h3 className="text-xl font-bold mb-3">时空回溯</h3>
                <p className="text-sm text-slate-400">基于你的行动轨迹，填补你在 A 点到 B 点之间"断片"的 10 秒钟。</p>
              </div>
            </div>
          </div>
        </section>

        {/* F. 信任背书：案件档案 (Social Proof) - [ID修复] */}
        <section id="cases" className="py-20 border-t border-white/5 scroll-mt-20">
          <div className="container mx-auto px-6 mb-10 flex items-center justify-between">
            <h3 className="font-bold text-xl">最近结案记录</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-emerald-500">LIVE UPDATING</span>
            </div>
          </div>
          
          <div className="relative w-full overflow-hidden mask-linear-fade">
            <div className="flex gap-6 animate-scroll-left w-max hover:[animation-play-state:paused] px-6">
              {[
                { id: "9821", title: "黑色皮夹", reason: "位置：沙发坐垫夹缝深处（视觉盲区）", icon: FileText, colorClass: { bg: "bg-blue-500/10", text: "text-blue-400" } },
                { id: "9822", title: "AirPods Pro", reason: "位置：牛仔裤小口袋，洗衣机旁（无意识遗留）", icon: Brain, colorClass: { bg: "bg-purple-500/10", text: "text-purple-400" } },
                { id: "9823", title: "身份证", reason: "位置：打印机进纸口下方（环境伪装）", icon: Scan, colorClass: { bg: "bg-emerald-500/10", text: "text-emerald-400" } },
                { id: "9824", title: "车钥匙", reason: "位置：玄关鞋柜最下层鞋内（行为惯性）", icon: Zap, colorClass: { bg: "bg-yellow-500/10", text: "text-yellow-400" } },
                { id: "9825", title: "近视眼镜", reason: "位置：挂在领口/头顶（触觉失敏）", icon: Brain, colorClass: { bg: "bg-pink-500/10", text: "text-pink-400" } },
                // 重复以实现无缝滚动
                { id: "9821", title: "黑色皮夹", reason: "位置：沙发坐垫夹缝深处（视觉盲区）", icon: FileText, colorClass: { bg: "bg-blue-500/10", text: "text-blue-400" } },
                { id: "9822", title: "AirPods Pro", reason: "位置：牛仔裤小口袋，洗衣机旁（无意识遗留）", icon: Brain, colorClass: { bg: "bg-purple-500/10", text: "text-purple-400" } },
                { id: "9823", title: "身份证", reason: "位置：打印机进纸口下方（环境伪装）", icon: Scan, colorClass: { bg: "bg-emerald-500/10", text: "text-emerald-400" } },
              ].map((c, i) => (
                <CaseFile key={i} {...c} />
              ))}
            </div>
          </div>
        </section>

        {/* G. Footer (重构：弹窗与风险提示) */}
        <footer className="border-t border-white/10 pt-20 pb-32 md:pb-10">
          <div className="container mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">C</div>
                <span className="font-bold text-slate-200">CogniSeek</span>
              </div>
              {/* [修复] 动态年份 */}
              <p className="text-xs text-slate-500">© {new Date().getFullYear()} CogniSeek Systems. All Neural Networks Active.</p>
              <p className="text-[10px] text-slate-700 max-w-xs mx-auto md:mx-0">
                Data Incineration Protocol Active. Local Storage Only.
              </p>
            </div>
            
            <div className="flex gap-8 text-sm text-slate-500">
              {/* 隐私协议弹窗 */}
              <Dialog>
                <DialogTrigger className="hover:text-white transition-colors">隐私协议</DialogTrigger>
                <DialogContent className="bg-slate-950 border border-white/10 text-slate-200 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-400 mb-2">
                      <Lock className="w-5 h-5" /> 
                      数据安全协议 (Level 5)
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                      Subject: Data Incineration Protocol
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] pr-4 text-sm leading-relaxed space-y-4 text-slate-300">
                    <p><strong>1. 本地加密 (Local Encryption):</strong><br/>系统采用 AES-256 标准对您的所有输入进行本地加密。您的"记忆碎片"仅在当前会话的内存中短暂存活。</p>
                    <p><strong>2. 数字焚烧 (Digital Incineration):</strong><br/>这是 CogniSeek 的核心承诺。一旦您关闭页面或点击"结案"，系统将立即执行不可逆的删除指令。我们不存储您的数据，也不将其上传至云端数据库。您的隐私是绝对的。</p>
                    <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300 font-mono">
                      // PROTOCOL STATUS: ACTIVE <br/>
                      // NO SERVER LOGS DETECTED
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              {/* 使用条款弹窗 - [修复] 风险规避与免责 */}
              <Dialog>
                <DialogTrigger className="hover:text-white transition-colors">使用条款</DialogTrigger>
                <DialogContent className="bg-slate-950 border border-white/10 text-slate-200 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-cyan-400 mb-2">
                      <FileSignature className="w-5 h-5" />
                      探员行动准则 (Guidelines)
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] pr-4 text-sm leading-relaxed space-y-4 text-slate-300">
                    {/* [修改] 核心免责声明: 增加"外置大脑"概念 */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded mb-4 text-blue-300 text-xs">
                      <strong className="flex items-center gap-2 text-blue-400 mb-1 text-sm"><Brain className="w-4 h-4"/> 这是一个"外置大脑"</strong>
                      CogniSeek 无法通过魔法让物品凭空出现。我们的价值在于：在你慌乱得像无头苍蝇时，提供一份**绝对冷静、符合逻辑的排查清单**。按照概率论行动，总比盲目寻找效率高 10 倍。
                    </div>
                    <p><strong>1. 角色定义:</strong><br/>CogniSeek 是您的战术辅助系统。您是"现场探员"，AI 是"指挥部"。我们提供高概率盲区坐标，您负责执行物理搜寻。</p>
                    <p><strong>2. 知识服务性质:</strong><br/>付费报告解锁的是"思维盲区"和"战术指令"。这属于数字内容服务，一旦生成报告，即视为服务交付完成。如同医生问诊，我们提供最优方案，助您对抗遗忘。</p>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              {/* 联系指挥部弹窗 - [修复] 替换算法介绍，去侦探化 */}
              <Dialog>
                <DialogTrigger className="hover:text-white transition-colors">联系指挥部</DialogTrigger>
                <DialogContent className="bg-slate-950 border border-white/10 text-slate-200">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-400 mb-2">
                      <Radio className="w-5 h-5" />
                      呼叫指挥中心 (Command Uplink)
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      发现系统故障？有功能建议？或需商务对接？
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 space-y-4">
                    <div className="p-4 bg-slate-900 rounded-lg border border-white/5 flex items-center justify-between group">
                      <code className="text-cyan-400 font-mono">kablejon@gmail.com</code>
                      <Button size="icon" variant="ghost" onClick={copyEmail} className="h-8 w-8 hover:bg-slate-800">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500 text-center space-y-1">
                      <p>技术支持 · 产品反馈 · 商务合作</p>
                      <p className="text-slate-600 italic">（注：本通道不提供人工寻物服务）</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </footer>

      </main>

      {/* H. [移动端] 底部悬浮按钮 */}
      <div className="fixed bottom-0 left-0 w-full p-4 z-50 md:hidden bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent pb-8 pt-10 pointer-events-none">
        <Link href="/detect/intro" className="pointer-events-auto">
          <Button size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 animate-pulse-subtle border border-cyan-400/20">
            立即开始寻物
          </Button>
        </Link>
      </div>

      {/* 样式注入 */}
      <style jsx global>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .mask-linear-fade {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
