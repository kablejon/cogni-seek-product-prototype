"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Plus, X, Check } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/shared"
import { useSearchStore } from "@/lib/store"
import { locationCategories } from "@/lib/data"

export default function Step3Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedCategory, setSelectedCategory] = useState(session.locationCategory)
  const [selectedLocation, setSelectedLocation] = useState(session.specificLocation)
  const [customLocation, setCustomLocation] = useState(session.locationCustom)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [visitedMultiple, setVisitedMultiple] = useState(session.visitedMultipleLocations)
  const [otherLocations, setOtherLocations] = useState<string[]>(session.otherVisitedLocations)
  const [newOtherLocation, setNewOtherLocation] = useState('')

  const isCustomLocation = selectedLocation.includes('other')
  const canProceed = selectedCategory && selectedLocation && (!isCustomLocation || customLocation.trim())

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
      setSelectedCategory(categoryId)
    }
  }

  const handleLocationSelect = (categoryId: string, locationId: string) => {
    setSelectedCategory(categoryId)
    setSelectedLocation(locationId)
  }

  const handleAddOtherLocation = () => {
    if (newOtherLocation.trim() && !otherLocations.includes(newOtherLocation.trim())) {
      setOtherLocations([...otherLocations, newOtherLocation.trim()])
      setNewOtherLocation('')
    }
  }

  const handleRemoveOtherLocation = (location: string) => {
    setOtherLocations(otherLocations.filter(l => l !== location))
  }

  const handleNext = () => {
    if (canProceed) {
      updateSession({
        locationCategory: selectedCategory,
        specificLocation: selectedLocation,
        locationCustom: customLocation,
        visitedMultipleLocations: visitedMultiple,
        otherVisitedLocations: otherLocations,
      })
      router.push("/detect/step-4")
    }
  }

  const getSelectedLocationLabel = () => {
    if (!selectedLocation) return ''
    const category = locationCategories.find(c => c.id === selectedCategory)
    const location = category?.subLocations.find(l => l.id === selectedLocation)
    if (isCustomLocation && customLocation) return customLocation
    return location?.label || ''
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentStep={3} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">空间原点</h1>
            <p className="text-muted-foreground text-lg">最后出现在什么地方？</p>
          </div>

          {/* Location Selection */}
          <div className="space-y-3">
            {locationCategories.map((category) => (
              <div 
                key={category.id} 
                className="bg-card rounded-2xl border border-border/50 overflow-hidden card-shadow transition-smooth hover:border-border"
              >
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full p-4 flex items-center justify-between transition-smooth ${
                    selectedCategory === category.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.label}</span>
                    {selectedCategory === category.id && selectedLocation && (
                      <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">
                        {getSelectedLocationLabel()}
                      </span>
                    )}
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {expandedCategory === category.id && (
                  <div className="border-t border-border/50 p-4 bg-secondary/30">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.subLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleLocationSelect(category.id, location.id)}
                          className={`p-3 rounded-xl text-sm text-left transition-smooth flex items-center justify-between ${
                            selectedLocation === location.id
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'bg-card hover:bg-card/80 border border-border/50'
                          }`}
                        >
                          <span>{location.label}</span>
                          {selectedLocation === location.id && <Check className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>

                    {selectedCategory === category.id && isCustomLocation && (
                      <div className="mt-4 p-4 rounded-xl bg-card border border-border/50 space-y-2">
                        <Label htmlFor="customLocation">请输入具体地点</Label>
                        <Input
                          id="customLocation"
                          placeholder="例如：宠物医院、剧本杀店、朋友家..."
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          className="h-11 rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Multiple Locations */}
          {selectedLocation && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">期间是否去过其他地方？</Label>
                  <p className="text-sm text-muted-foreground">物品可能遗落在中途经过的地方</p>
                </div>
                <div className="flex gap-2">
                  {[
                    { value: false, label: '没有' },
                    { value: true, label: '有' },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      onClick={() => setVisitedMultiple(option.value)}
                      className={`px-4 py-2 rounded-xl text-sm transition-smooth border ${
                        visitedMultiple === option.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border/50 hover:border-border'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {visitedMultiple && (
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <Label>还去过哪些地方？</Label>
                  
                  {otherLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {otherLocations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          <span>{location}</span>
                          <button
                            onClick={() => handleRemoveOtherLocation(location)}
                            className="hover:text-destructive transition-smooth"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="输入地点名称..."
                      value={newOtherLocation}
                      onChange={(e) => setNewOtherLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddOtherLocation()}
                      className="flex-1 rounded-xl"
                    />
                    <Button
                      variant="outline"
                      onClick={handleAddOtherLocation}
                      disabled={!newOtherLocation.trim()}
                      className="rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tip Box */}
          <div className="bg-chart-2/10 border border-chart-2/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-chart-2 font-medium">📍 提示：</span>
              不需要非常精确，大致的区域描述即可。如果你经过了多个地方，记得添加它们，这有助于我们全面分析。
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link href="/detect/step-2">
                <ArrowLeft className="mr-2 h-5 w-5" /> 上一步
              </Link>
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceed} 
              size="lg" 
              className="px-8 rounded-xl card-shadow"
            >
              下一步 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
