"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Home, Building2, Car, Store, Trees, MapPin, Check } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { locationCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 场所图标映射
const LOCATION_ICONS = {
  'home': Home,
  'work': Building2,
  'transport': Car,
  'public': Store,
  'outdoor': Trees,
  'location_other': MapPin,
}

export default function Step0Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedCategory, setSelectedCategory] = useState<string>(session.lossLocationCategory)
  const [selectedSubLocation, setSelectedSubLocation] = useState<string>(session.lossLocationSubCategory)
  const [customLocation, setCustomLocation] = useState<string>(session.lossLocationCustom)

  const canProceed = selectedCategory && selectedSubLocation && 
    (selectedSubLocation !== 'completely_other' || customLocation.trim())

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubLocation('')
  }

  const handleSubLocationSelect = (subLocationId: string) => {
    setSelectedSubLocation(subLocationId)
  }

  const handleNext = () => {
    if (canProceed) {
      updateSession({
        lossLocationCategory: selectedCategory,
        lossLocationSubCategory: selectedSubLocation,
        lossLocationCustom: customLocation,
      })
      router.push("/detect/step-1")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* 星空背景 - 固定定位 */}
      <div className="fixed inset-0 z-0">
        <InteractiveFog particleCount={100} color="56, 189, 248" />
      </div>

      <Header currentStep={1} showProgress />

      {/* 主容器 - 毛玻璃悬浮卡片 */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-5xl mx-auto scifi-container p-6 md:p-10 space-y-8">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">大概在什么场所丢失？</h1>
            <p className="text-base md:text-lg text-white/70">选择最后可能出现的场所类型</p>
          </div>

          {/* Grid 宫格 - 场所大类 */}
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-bold text-white/90">场所类型</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {locationCategories.map((category) => {
                const Icon = LOCATION_ICONS[category.id as keyof typeof LOCATION_ICONS] || MapPin
                const isSelected = selectedCategory === category.id
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`card-option ${isSelected ? 'card-option-selected' : ''} relative group`}
                  >
                    {isSelected && (
                      <div className="check-glow">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                    
                    <div className="flex flex-col items-center gap-1.5 py-5">
                      <div className="text-2xl">{category.icon}</div>
                      <Icon className={`w-5 h-5 transition-all ${isSelected ? 'text-[var(--holo-blue)]' : 'text-white/70 group-hover:text-white'}`} strokeWidth={1.5} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                        {category.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 具体位置 */}
          {selectedCategory && (
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-base md:text-lg font-bold text-white/90">具体位置</h2>
              <div className="flex flex-wrap gap-3">
                {locationCategories.find(c => c.id === selectedCategory)?.subLocations.map((subLoc) => (
                  <button
                    key={subLoc.id}
                    onClick={() => handleSubLocationSelect(subLoc.id)}
                    className={`
                      px-5 py-3 rounded-full text-sm font-medium
                      border transition-all duration-300
                      ${selectedSubLocation === subLoc.id 
                        ? 'bg-[var(--holo-blue)]/20 border-[var(--holo-blue)] text-white shadow-[0_0_20px_rgba(45,225,252,0.3)]' 
                        : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40'
                      }
                      flex items-center gap-2
                    `}
                  >
                    {selectedSubLocation === subLoc.id && <Check className="w-3.5 h-3.5" />}
                    {subLoc.label}
                  </button>
                ))}
              </div>

              {selectedSubLocation === 'completely_other' && (
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="输入具体场所名称（例如：朋友家、电影院、游泳馆）"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all"
                />
              )}
            </div>
          )}

          {/* 提示信息 */}
          {selectedSubLocation && selectedSubLocation !== 'completely_other' && (
            <div className="p-4 rounded-xl bg-[var(--holo-blue)]/5 border border-[var(--holo-blue)]/20 animate-fade-in-up delay-200">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 <span className="text-white">小提示：</span>
                如果不确定具体位置，选择最接近的选项即可。我们会在后续步骤中进一步细化分析。
              </p>
            </div>
          )}

          {/* 底部按钮区 - 居中全胶囊 */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="btn-scifi-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              继续下一步
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
      </main>
    </div>
  )
}

