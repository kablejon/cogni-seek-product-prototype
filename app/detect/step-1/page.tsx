"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ChevronDown, ChevronUp, Check } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/shared"
import { useSearchStore } from "@/lib/store"
import { itemCategories, itemColorOptions, itemSizeOptions } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

export default function Step1Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedCategory, setSelectedCategory] = useState(session.itemCategory)
  const [selectedItem, setSelectedItem] = useState(session.itemType)
  const [customName, setCustomName] = useState(session.itemCustomName)
  const [selectedColor, setSelectedColor] = useState(session.itemColor)
  const [selectedSize, setSelectedSize] = useState(session.itemSize)
  const [hasSound, setHasSound] = useState<boolean | null>(session.hasSound)
  const [hasCase, setHasCase] = useState<boolean | null>(session.hasCase)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const needsSoundOption = ['phone', 'airpods', 'tablet', 'laptop', 'watch'].includes(selectedItem)
  const needsCaseOption = ['phone', 'airpods', 'tablet', 'keys'].includes(selectedItem)
  const isCustomItem = selectedItem.includes('other')
  const canProceed = selectedCategory && selectedItem && (!isCustomItem || customName.trim())

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
      setSelectedCategory(categoryId)
    }
  }

  const handleItemSelect = (categoryId: string, itemId: string) => {
    setSelectedCategory(categoryId)
    setSelectedItem(itemId)
    setShowDetails(true)
  }

  const handleNext = () => {
    if (canProceed) {
      updateSession({
        itemCategory: selectedCategory,
        itemType: selectedItem,
        itemCustomName: customName,
        itemColor: selectedColor,
        itemSize: selectedSize as 'small' | 'medium' | 'large' | '',
        hasSound,
        hasCase,
      })
      router.push("/detect/step-2")
    }
  }

  const getSelectedItemLabel = () => {
    if (!selectedItem) return ''
    const category = itemCategories.find(c => c.id === selectedCategory)
    const item = category?.items.find(i => i.id === selectedItem)
    if (isCustomItem && customName) return customName
    return item?.label || ''
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="bg-text-glow opacity-50">CogniSeek</div>
      </div>
      
      {/* Interactive Fog Effect */}
      <div className="absolute inset-0 z-0">
        <InteractiveFog particleCount={80} color="80, 130, 220" />
      </div>
      
      <Header currentStep={1} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">你丢失了什么？</h1>
            <p className="text-muted-foreground text-lg">选择物品类型，帮助我们更精准地分析</p>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            {itemCategories.map((category) => (
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
                    {selectedCategory === category.id && selectedItem && (
                      <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">
                        {getSelectedItemLabel()}
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
                      {category.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemSelect(category.id, item.id)}
                          className={`p-3 rounded-xl text-sm text-left transition-smooth flex items-center justify-between ${
                            selectedItem === item.id
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'bg-card hover:bg-card/80 border border-border/50'
                          }`}
                        >
                          <span>{item.label}</span>
                          {selectedItem === item.id && <Check className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>

                    {selectedCategory === category.id && isCustomItem && (
                      <div className="mt-4 p-4 rounded-xl bg-card border border-border/50 space-y-2">
                        <Label htmlFor="customName">请输入物品名称</Label>
                        <Input
                          id="customName"
                          placeholder="例如：蓝牙音箱、平衡车..."
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="h-11 rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Item Details */}
          {selectedItem && showDetails && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                <span className="text-xl">📝</span>
                <span className="font-semibold">补充信息</span>
                <span className="text-sm text-muted-foreground">（可选，提高准确率）</span>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <Label>物品颜色</Label>
                <div className="flex flex-wrap gap-2">
                  {itemColorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-smooth ${
                        selectedColor === color.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border/50 hover:border-border bg-card'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-border/50"
                        style={{ 
                          backgroundColor: color.color === 'transparent' ? undefined : color.color,
                          background: color.color === 'transparent' 
                            ? 'linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd), linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd)'
                            : undefined,
                          backgroundSize: '8px 8px',
                          backgroundPosition: '0 0, 4px 4px'
                        }}
                      />
                      <span className="text-sm">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <Label>物品大小</Label>
                <div className="grid grid-cols-3 gap-3">
                  {itemSizeOptions.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id as 'small' | 'medium' | 'large')}
                      className={`p-4 rounded-xl text-center transition-smooth border ${
                        selectedSize === size.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border/50 hover:border-border'
                      }`}
                    >
                      <div className="font-medium">{size.label}</div>
                      <div className={`text-xs mt-1 ${selectedSize === size.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {size.description}
                      </div>
                    </button>
                  ))}
                </div>
                    </div>

              {needsSoundOption && (
                <div className="space-y-3">
                  <Label>是否有声音/查找功能？</Label>
                  <p className="text-sm text-muted-foreground">如手机可响铃、AirPods 有"查找"功能</p>
                  <div className="flex gap-3">
                    {[
                      { value: true, label: '有' },
                      { value: false, label: '没有' },
                    ].map((option) => (
                      <button
                        key={String(option.value)}
                        onClick={() => setHasSound(option.value)}
                        className={`flex-1 p-3 rounded-xl text-center transition-smooth border ${
                          hasSound === option.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card border-border/50 hover:border-border'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                    </div>
                  )}

              {needsCaseOption && (
                <div className="space-y-3">
                  <Label>是否有保护套/挂绑？</Label>
                  <p className="text-sm text-muted-foreground">有保护套的物品更不容易滑落</p>
                  <div className="flex gap-3">
                    {[
                      { value: true, label: '有' },
                      { value: false, label: '没有' },
                    ].map((option) => (
                      <button
                        key={String(option.value)}
                        onClick={() => setHasCase(option.value)}
                        className={`flex-1 p-3 rounded-xl text-center transition-smooth border ${
                          hasCase === option.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card border-border/50 hover:border-border'
                        }`}
                      >
                        {option.label}
                </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
          )}

          {/* Tip Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">💡 提示：</span>
              详细的物品信息有助于我们进行更精准的分析。颜色和大小会影响物品被发现的概率。
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link href="/">返回首页</Link>
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
