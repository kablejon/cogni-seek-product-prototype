"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, MapPin, Check } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { locationCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 主场景卡片配置
const SCENE_CARDS = [
  { 
    id: 'home', 
    icon: '🏠', 
    label: '家里', 
    desc: '住所、房间',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    subAreas: ['客厅', '卧室', '厨房', '卫生间', '玄关/门口', '阳台', '书房', '其他房间']
  },
  { 
    id: 'work', 
    icon: '🏢', 
    label: '公司/学校', 
    desc: '工作/学习场所',
    gradient: 'from-purple-500/20 to-pink-500/20',
    subAreas: ['办公桌', '会议室', '茶水间', '洗手间', '食堂', '休息区', '停车场', '教室']
  },
  { 
    id: 'transit', 
    icon: '🚗', 
    label: '车/通勤路上', 
    desc: '交通工具',
    gradient: 'from-orange-500/20 to-red-500/20',
    subAreas: ['车内座位', '后备箱', '车门侧袋', '地铁/公交', '出租车', '路边', '加油站', '停车场']
  },
  { 
    id: 'public', 
    icon: '🌳', 
    label: '户外/公共场所', 
    desc: '商场、餐厅等',
    gradient: 'from-green-500/20 to-teal-500/20',
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
    // 清空之前选择的子区域
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
      specificLocation: selectedSubAreas[0], // 主要位置
      locationCustom: customLocation,
      visitedMultipleLocations: selectedSubAreas.length > 1,
      otherVisitedLocations: selectedSubAreas,
    })

    router.push('/detect/step-4')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <InteractiveFog color="14, 165, 233" />
      </div>
      
      <Header currentStep={3} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Step 3 of 5</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">最后目击</h1>
            <p className="text-muted-foreground text-lg">
              你<span className="text-primary font-semibold">最后一次看见它</span>是在哪里？
            </p>
          </div>

          {/* 场景大卡片 - 4选1 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SCENE_CARDS.map((scene) => (
              <button
                key={scene.id}
                onClick={() => handleSceneSelect(scene.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedScene === scene.id
                    ? 'border-primary shadow-lg scale-105 bg-primary/10'
                    : 'border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card hover:scale-102'
                }`}
              >
                {/* 选中标记 */}
                {selectedScene === scene.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`text-5xl transition-transform duration-300 ${
                    selectedScene === scene.id ? 'scale-110' : ''
                  }`}>
                    {scene.icon}
                  </div>
                  <div>
                    <div className="font-bold text-base">{scene.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{scene.desc}</div>
                  </div>
                </div>

                {/* 渐变装饰 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient} rounded-2xl opacity-0 transition-opacity duration-300 ${
                  selectedScene === scene.id ? 'opacity-100' : ''
                }`} style={{ zIndex: -1 }} />
              </button>
            ))}
          </div>

          {/* 路径补全 - 标签云多选 */}
          {selectedScene && currentScene && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="h-px bg-border/50" />

              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/20 rounded-3xl p-6 md:p-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{currentScene.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">
                      你在 <span className="text-primary">{currentScene.label}</span> 的具体区域？
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
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
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? 'bg-primary text-white shadow-md scale-105'
                                : 'bg-background/80 hover:bg-background border border-border/50 hover:border-primary/30 hover:scale-105'
                            }`}
                          >
                            {isSelected && <Check className="inline-block h-3 w-3 mr-1" />}
                            {area}
                          </button>
                        )
                      })}
                    </div>

                    {/* 已选择计数 */}
                    {selectedSubAreas.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-sm text-center">
                          <span className="font-bold text-primary">已选择 {selectedSubAreas.length} 个区域</span>
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

              {/* 自定义补充（选填） */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  还有其他特殊位置？（选填）
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="例如：朋友家、酒店大堂、展览馆..."
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              上一步
            </Button>

            <Button
              size="lg"
              onClick={handleNext}
              className="rounded-full px-8"
              disabled={!selectedScene || selectedSubAreas.length === 0}
            >
              继续下一步
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* 当前选择提示 */}
          {selectedScene && selectedSubAreas.length > 0 && (
            <div className="text-center p-4 rounded-xl bg-secondary/30 border border-border/50 animate-in fade-in duration-500">
              <p className="text-sm text-muted-foreground">
                当前选择：
                <span className="font-semibold text-foreground ml-2">
                  {currentScene?.label} - {selectedSubAreas.join('、')}
                </span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
