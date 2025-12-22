"use client"

import Link from "next/link"
import { ArrowUpRight, Search, Brain, BarChart3, Clock, Star, CheckCircle2 } from "lucide-react"
import { NetworkAnimation } from "@/components/ui/network-animation"
import { InteractiveFog } from "@/components/ui/interactive-fog"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Interactive Fog Background */}
      <InteractiveFog color="56, 189, 248" particleCount={120} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-medium tracking-tight">CogniSeek</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-white transition-colors">工作原理</Link>
            <Link href="#stories" className="hover:text-white transition-colors">成功案例</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">定价</Link>
          </div>
          
          <Link 
            href="/detect/step-1" 
            className="btn-xai-primary text-xs"
          >
            开始寻物
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 z-10">
        {/* Network Animation Background */}
        <div className="absolute inset-0 z-0">
          <NetworkAnimation nodeCount={80} lineOpacity={0.15} />
        </div>
        
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-glow-pulse" />
        </div>
        
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
          <div className="bg-text-glow animate-text-reveal">CogniSeek</div>
        </div>
        
        {/* Light Beam */}
        <div className="absolute top-1/3 left-0 right-0 overflow-hidden z-0">
          <div className="light-beam" />
        </div>
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-fade-in-up">
              <span className="block text-white/90">找回</span>
              <span className="block gradient-text">遗失的物品</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200" style={{ opacity: 0 }}>
              物品往往没有真正"丢失"，它们只是滑入了你的视觉和记忆盲区。
              我们运用三维科学寻物系统，帮你科学地找回失物。
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up delay-400" style={{ opacity: 0 }}>
              <Link href="/detect/step-1" className="btn-xai-primary">
                开始寻物
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href="#features" className="btn-xai-secondary">
                了解原理
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm animate-fade-in-up delay-600" style={{ opacity: 0 }}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15,000+</div>
                <div className="text-muted-foreground">成功案例</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">87.3%</div>
                <div className="text-muted-foreground">找回率</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9/5</div>
                <div className="text-muted-foreground">用户评分</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-soft z-20">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">向下滚动</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section with Network Animation */}
      <section id="features" className="relative py-32 z-10">
        {/* Network Animation Background */}
        <div className="absolute inset-0 z-0">
          <NetworkAnimation nodeCount={60} lineOpacity={0.12} />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent z-0" />
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
              <span className="text-xs tracking-widest uppercase text-muted-foreground">[ 工作原理 ]</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">三维科学寻物系统</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              结合行为心理学、环境概率论与时空算法，提供精准的寻物指引
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Brain,
                title: "行为心理学",
                desc: "分析丢失时的心理状态与行为模式，推断可能的遗落场景",
              },
              {
                icon: BarChart3,
                title: "环境概率论",
                desc: "基于环境物理学与物品特性，计算最可能的隐藏位置",
              },
              {
                icon: Clock,
                title: "时空算法",
                desc: "整合时间因素与空间分布，构建多维度分析模型",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-xai p-8 group hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-white/80" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="stories" className="py-32 relative z-10">
        {/* Network Animation Background */}
        <div className="absolute inset-0 z-0">
          <NetworkAnimation nodeCount={70} lineOpacity={0.12} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
              <span className="text-xs tracking-widest uppercase text-muted-foreground">[ 成功案例 ]</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">真实用户反馈</h2>
            <p className="text-muted-foreground">看看其他用户是如何找回失物的</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { emoji: "🎧", name: "小王", city: "上海", item: "AirPods", location: "沙发缝隙", time: "3分钟前" },
              { emoji: "🔑", name: "Anna", city: "北京", item: "车钥匙", location: "玄关鞋柜", time: "12分钟前" },
              { emoji: "🪪", name: "李先生", city: "广州", item: "身份证", location: "书架夹层", time: "28分钟前" },
              { emoji: "👛", name: "Emma", city: "深圳", item: "钱包", location: "床头柜", time: "1小时前" },
              { emoji: "👓", name: "张姐", city: "杭州", item: "眼镜", location: "卫生间", time: "2小时前" },
              { emoji: "📺", name: "Mike", city: "成都", item: "遥控器", location: "被子里", time: "3小时前" },
            ].map((story, index) => (
              <div
                key={index}
                className="card-xai p-6 group hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                    {story.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-white">{story.name}</span>
                      <span>·</span>
                      <span>{story.city}</span>
                      <span>·</span>
                      <span>{story.time}</span>
                    </div>
                    <p className="text-sm">
                      成功找回 <span className="text-white font-medium">{story.item}</span>
                      <span className="text-chart-2"> · 在{story.location}发现</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-32 relative z-10">
        {/* Network Animation Background */}
        <div className="absolute inset-0 z-0">
          <NetworkAnimation nodeCount={60} lineOpacity={0.1} />
        </div>
        
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-[600px] h-[400px] bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-20 container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              准备好找回你的失物了吗？
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              只需 3 分钟，让科学帮你重建寻物路径
            </p>
            
            {/* Features List */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                "5步智能问答",
                "三维科学分析",
                "动态排查清单",
                "87.3%找回率",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                >
                  <CheckCircle2 className="w-4 h-4 text-chart-2" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Link href="/detect/step-1" className="btn-xai-primary text-base px-8 py-4">
              开始你的寻物之旅
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            
            <p className="text-sm text-muted-foreground mt-6">
              免费开始分析 · 完整报告仅需 $2.99
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                <span className="text-black font-bold text-xs">C</span>
              </div>
              <span className="text-sm text-muted-foreground">
                © 2025 CogniSeek. 基于科学的寻物服务。
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-white transition-colors">隐私政策</Link>
              <Link href="#" className="hover:text-white transition-colors">服务条款</Link>
              <Link href="#" className="hover:text-white transition-colors">联系我们</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
