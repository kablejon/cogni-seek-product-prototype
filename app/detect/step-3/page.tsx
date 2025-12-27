"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, MapPin, Check } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 主场景卡片配置
const SCENE_CARDS = [
  { 
    id: 'home', 
    icon: '🏠', 
    label: '家里', 
    desc: '住所、房间',
    subAreas: ['客厅', '卧室', '厨房', '卫生间', '玄关/门口', '阳台', '书房', '其他房间']
  },
  { 
    id: 'work', 
    icon: '🏢', 
    label: '公司/学校', 
    desc: '工作/学习场所',
    subAreas: ['办公桌', '会议室', '茶水间', '洗手间', '食堂', '休息区', '停车场', '教室']
  },
  { 
    id: 'transit', 
    icon: '🚗', 
    label: '车/通勤路上', 
    desc: '交通工具',
    subAreas: ['车内座位', '后备箱', '车门侧袋', '地铁/公交', '出租车', '路边', '加油站', '停车场']
  },
  { 
    id: 'public', 
    icon: '🌳', 
    label: '户外/公共场所', 
    desc: '商场、餐厅等',
    subAreas: ['商场/超市', '餐厅', '咖啡厅', '健身房', '公园', '医院', '银行', '其他场所']
  },
]

export default function Step3Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedScene, setSelectedScene] = useState<string>(session.locationCategory || '')
  const [selectedSubAreas, setSelectedSubAreas] = useState<string[]>(
    session.otherVisitedLocations || []
  )
  const [customLocation, setCustomLocation] = useState(session.locationCustom || '')

  const currentScene = SCENE_CARDS.find(s => s.id === selectedScene)

  const handleSceneSelect = (sceneId: string) => {
    setSelectedScene(sceneId)
    if (sceneId !== selectedScene) {
      setSelectedSubAreas([])
    }
  }

  const handleSubAreaToggle = (area: string) => {
    if (selectedSubAreas.includes(area)) {
      setSelectedSubAreas(selectedSubAreas.filter(a => a !== area))
    } else {
      setSelectedSubAreas([...selectedSubAreas, area])
    }
  }

  const handleNext = () => {
    if (!selectedScene) {
      alert('请选择场景')
      return
    }

    if (selectedSubAreas.length === 0) {
      alert('请至少选择一个具体区域')
      return
    }

    updateSession({
      locationCategory: selectedScene,
      specificLocation: selectedSubAreas[0],
      locationCustom: customLocation,
      visitedMultipleLocations: selectedSubAreas.length > 1,
      otherVisitedLocations: selectedSubAreas,
    })

    router.push('/detect/step-4')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="fixed inset-0 z-0">
        <InteractiveFog color="14, 165, 233" />
      </div>
      
      <Header currentStep={4} showProgress />

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-5xl mx-auto scifi-container p-6 md:p-10 space-y-8">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">最后目击</h1>
            <p className="text-base md:text-lg text-white/70">
              你<span className="text-[var(--cyber-green)] font-semibold">最后一次看见它</span>是在哪里？
            </p>
          </div>

          {/* 场景大卡片 - 4选1 */}
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-bold text-white/90">选择场景</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {SCENE_CARDS.map((scene) => {
                const isSelected = selectedScene === scene.id
                
                return (
                  <button
                    key={scene.id}
                    onClick={() => handleSceneSelect(scene.id)}
                    className={`card-option ${isSelected ? 'card-option-selected' : ''} relative animate-card-float`}
                    style={{ animationDelay: `${SCENE_CARDS.indexOf(scene) * 0.1}s` }}
                  >
                    {isSelected && (
                      <div className="check-glow">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-2 py-3">
                      <div className={`text-4xl transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
                        {scene.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{scene.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{scene.desc}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 路径补全 - 标签云多选 */}
          {selectedScene && currentScene && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="bg-gradient-to-r from-[var(--holo-blue)]/10 to-[var(--cyber-green)]/10 border-2 border-[var(--holo-blue)]/20 rounded-3xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{currentScene.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      你在 <span style={{ color: 'var(--cyber-green)' }}>{currentScene.label}</span> 的具体区域？
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      💡 多选可以帮助 AI 穷举你可能去过但忘记的地方
                    </p>

                    {/* 标签云 */}
                    <div className="flex flex-wrap gap-2">
                      {currentScene.subAreas.map((area) => {
                        const isSelected = selectedSubAreas.includes(area)
                        return (
                          <button
                            key={area}
                            onClick={() => handleSubAreaToggle(area)}
                            className={`chip ${isSelected ? 'chip-selected' : ''}`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {area}
                          </button>
                        )
                      })}
                    </div>

                    {/* 已选择计数 */}
                    {selectedSubAreas.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-[var(--cyber-green)]/10 border border-[var(--cyber-green)]/20">
                        <p className="text-sm text-center">
                          <span className="font-bold" style={{ color: 'var(--cyber-green)' }}>已选择 {selectedSubAreas.length} 个区域</span>
                          <span className="text-muted-foreground ml-2">
                            {selectedSubAreas.slice(0, 3).join('、')}
                            {selectedSubAreas.length > 3 && '...'}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 自定义补充 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  还有其他特殊位置？（选填）
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="例如：朋友家、酒店大堂、展览馆..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              onClick={handleNext}
              disabled={!selectedScene || selectedSubAreas.length === 0}
              className="btn-scifi-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              继续下一步
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-xs text-muted-foreground hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一步
            </Button>
          </div>

        </div>
      </main>
    </div>
  )
}
