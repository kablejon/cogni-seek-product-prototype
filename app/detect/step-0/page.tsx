"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 六大搜索扇区
const SECTOR_OPTIONS = [
  { 
    id: 'Home', 
    label: '家里', 
    labelEn: 'Home',
    desc: '微缩房屋，透出暖光',
    icon: '🏠',
    sectorType: 'safe_zone_static',
    aiHint: '静态安全区 - 物品一定在，只是被遮挡',
  },
  { 
    id: 'Work', 
    label: '办公/学校', 
    labelEn: 'Work/School',
    desc: '写字楼或课桌一角',
    icon: '🏢',
    sectorType: 'semi_public_zone',
    aiHint: '半公共区 - 可能被同事/保洁移动',
  },
  { 
    id: 'Vehicle', 
    label: '交通工具', 
    labelEn: 'Vehicle',
    desc: '汽车或地铁车厢',
    icon: '🚗',
    sectorType: 'transit_zone',
    aiHint: '封闭移动区 - 座椅缝隙概率极高',
  },
  { 
    id: 'Public', 
    label: '公共场所', 
    labelEn: 'Public Place',
    desc: '商场、餐厅、电影院',
    icon: '🛍️',
    sectorType: 'high_traffic_zone',
    aiHint: '高危流动区 - 盲区遗忘或被拿走',
  },
  { 
    id: 'Outdoors', 
    label: '户外', 
    labelEn: 'Outdoors',
    desc: '公园、街道、广场',
    icon: '🌳',
    sectorType: 'open_environment',
    aiHint: '开放环境 - 需检查沿途掉落点',
  },
  { 
    id: 'Unsure', 
    label: '路途/不确定', 
    labelEn: 'Unsure',
    desc: '启动轨迹分析模式',
    icon: '❓',
    sectorType: 'trajectory_analysis',
    aiHint: '轨迹回溯 - 分析A点到B点全过程',
    isSpecial: true,
  },
]

export default function Step0Page() {
  const router = useRouter()
  const { updateSession } = useSearchStore()
  
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [confidence, setConfidence] = useState<number>(80)

  // 获取选中的扇区配置
  const selectedConfig = SECTOR_OPTIONS.find(s => s.id === selectedSector)
  
  // 是否为不确定模式
  const isUnsureMode = selectedSector === 'Unsure'

  // 是否可以继续
  const canProceed = selectedSector !== ''

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSector(sectorId)
    // 重置置信度为默认80%
    setConfidence(80)
  }

  const handleNext = () => {
    if (!canProceed) return

    updateSession({
      lossLocationCategory: selectedSector,
      lossLocationSubCategory: selectedConfig?.sectorType || '',
      lossLocationCustom: '',
    })
    router.push("/detect/step-1")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* 深空星背景 */}
      <div className="fixed inset-0 z-0">
        <InteractiveFog particleCount={100} color="56, 189, 248" />
      </div>

      <Header currentStep={1} showProgress />

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-5xl mx-auto scifi-container p-6 md:p-10 space-y-8">
          
          {/* 标题区 */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              大概在什么场所丢失？
            </h1>
            <p className="text-sm md:text-base text-white/60">
              锁定最后一次出现的区域，帮助AI建立空间模型
            </p>
          </div>

          {/* 六大扇区 - 2行×3列 */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTOR_OPTIONS.map((sector, index) => {
              const isSelected = selectedSector === sector.id
              const isOtherSelected = selectedSector && !isSelected
              const isSpecial = sector.isSpecial
              
              return (
                <button
                  key={sector.id}
                  onClick={() => handleSectorSelect(sector.id)}
                  className={`
                    relative p-5 rounded-2xl transition-all duration-500 group
                    ${isSpecial ? 'border-2 border-dashed' : 'border'}
                    ${isSelected 
                      ? 'border-[#2DE1FC] bg-[#2DE1FC]/15 shadow-[0_0_30px_rgba(45,225,252,0.5),0_0_60px_rgba(45,225,252,0.2)]' 
                      : isSpecial
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 bg-white/10'
                    }
                    ${isOtherSelected ? 'opacity-40' : 'opacity-100'}
                    hover:border-white/40 hover:bg-white/15
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* 选中勾选标记 */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--cyber-green)] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.5)] z-10">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}

                  {/* 特殊选项的雷达脉冲效果 */}
                  {isSpecial && !isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl">
                      <div className="w-20 h-20 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '2s' }} />
                    </div>
                  )}

                  <div className={`
                    relative z-10 flex flex-col items-center gap-3 py-2
                    transition-transform duration-300
                    ${isSelected ? 'transform -translate-y-1' : 'group-hover:-translate-y-0.5'}
                  `}>
                    {/* 3D等距风格图标 */}
                    <div className={`
                      text-4xl md:text-5xl transition-all duration-300
                      ${isSelected ? 'transform scale-110 drop-shadow-[0_0_20px_rgba(45,225,252,0.8)]' : ''}
                    `}>
                      {sector.icon}
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-bold text-sm md:text-base ${isSelected ? 'text-white' : 'text-white/90'}`}>
                        {sector.label}
                      </div>
                      <div className="text-xs text-white/50 mt-0.5">{sector.labelEn}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 底部交互栏 - 置信度滑杆（选中后滑出） */}
          {selectedSector && (
            <div className="space-y-4 animate-slide-up">
              {isUnsureMode ? (
                /* 不确定模式 - 显示轨迹回溯提示 */
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔍</div>
                    <div>
                      <h3 className="font-bold text-amber-400">轨迹回溯模式已激活</h3>
                      <p className="text-sm text-white/70 mt-1">
                        AI将启动「轨迹回溯模式」，分析你在不同地点之间的移动路径，
                        逐一排查可能的丢失节点。
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* 正常模式 - 显示置信度滑杆 */
                <div className="p-5 rounded-2xl bg-[#2DE1FC]/5 border border-[#2DE1FC]/20">
                  <div className="space-y-4">
                    {/* 问题标题 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base text-white">
                          你确定它在这个区域吗？
                        </h3>
                        <p className="text-xs text-white/50 mt-1">
                          {selectedConfig?.aiHint}
                        </p>
                      </div>
                      <div className="text-3xl font-bold font-mono text-[#2DE1FC]">
                        {confidence}%
                      </div>
                    </div>

                    {/* 置信度滑杆 */}
                    <div className="space-y-2">
                      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                        {/* 进度条 */}
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2DE1FC] to-[var(--cyber-green)] rounded-full transition-all duration-200"
                          style={{ width: `${(confidence - 50) / 50 * 100}%` }}
                        />
                        {/* 滑块输入 */}
                        <input
                          type="range"
                          min={50}
                          max={100}
                          step={5}
                          value={confidence}
                          onChange={(e) => setConfidence(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {/* 滑块指示器 */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_10px_rgba(45,225,252,0.8)] transition-all duration-200 pointer-events-none"
                          style={{ left: `calc(${(confidence - 50) / 50 * 100}% - 10px)` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>50% 存疑</span>
                        <span>100% 肯定</span>
                      </div>
                    </div>

                    {/* AI策略提示 */}
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <p className="text-xs text-white/70">
                        {confidence >= 90 
                          ? '🎯 AI将在此区域进行深度层次式搜索'
                          : confidence >= 70
                            ? '🔍 AI将优先搜索此区域，同时排查周边过渡地带'
                            : '🌐 AI将扩大搜索半径，检查上一个地点及途中'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 下一步按钮 */}
              <div className="flex flex-col items-center gap-4 pt-2">
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="btn-scifi-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isUnsureMode ? '启动轨迹分析' : '锁定区域'}
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="text-xs text-muted-foreground hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  返回首页
                </Button>
              </div>
            </div>
          )}

          {/* 未选择时的提示 */}
          {!selectedSector && (
            <div className="text-center py-4">
              <p className="text-sm text-white/40">
                👆 请选择一个区域开始分析
              </p>
            </div>
          )}

        </div>
      </main>

      {/* 添加滑入动画样式 */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
