"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, Info } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { itemCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

export default function Step1Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(session.itemCategory || '')
  const [selectedItem, setSelectedItem] = useState<string>(session.itemType || '')
  const [itemName, setItemName] = useState(session.itemCustomName || '')
  const [itemColor, setItemColor] = useState(session.itemColor || '')
  const [itemFeatures, setItemFeatures] = useState(session.itemFeatures || '')
  const [itemSize, setItemSize] = useState(session.itemSize || 'medium')

  useEffect(() => {
    if (selectedCategory && !expandedCategory) {
      setExpandedCategory(selectedCategory)
    }
  }, [selectedCategory, expandedCategory])

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
    
    // 如果选择了"其他"，自动聚焦到自定义输入框
    if (itemId.includes('other')) {
      setTimeout(() => {
        document.getElementById('item-name-input')?.focus()
      }, 300)
    }
  }

  const handleContinue = () => {
    if (!selectedItem) {
      alert('请选择物品类型')
      return
    }

    // 如果选择了"其他"但没有填写名称
    if (selectedItem.includes('other') && !itemName.trim()) {
      alert('请输入物品名称')
      return
    }

    updateSession({
      itemCategory: selectedCategory,
      itemType: selectedItem,
      itemCustomName: itemName,
      itemColor: itemColor,
      itemFeatures: itemFeatures,
      itemSize: itemSize,
    })

    router.push('/detect/step-2')
  }

  const category = itemCategories.find(c => c.id === selectedCategory)
  const item = category?.items.find(i => i.id === selectedItem)
  const displayName = itemName || item?.label || ''

  // 大小对比图标
  const sizeIcons = {
    small: { icon: '🪙', label: '小型', desc: '硬币大小' },
    medium: { icon: '📱', label: '中型', desc: '手机大小' },
    large: { icon: '📚', label: '大型', desc: '书本大小' },
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Interactive Fog Effect */}
      <div className="absolute inset-0 z-0">
        <InteractiveFog particleCount={80} color="30, 64, 175" />
      </div>
      
      <Header currentStep={1} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <span className="text-sm font-medium text-primary">Step 1 of 5</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">你丢失了什么？</h1>
            <p className="text-muted-foreground text-lg">点击大图标选择类别，然后选择具体物品</p>
          </div>

          {/* Visual Index - 大图标网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {itemCategories.map((category) => {
              const isExpanded = expandedCategory === category.id
              const isSelected = selectedCategory === category.id

              return (
                <div
                  key={category.id}
                  className={`relative transition-all duration-300 ${
                    isExpanded ? 'md:col-span-3' : ''
                  }`}
                >
                  {/* Category Card */}
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg scale-105'
                        : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`text-5xl transition-transform duration-300 ${isExpanded ? 'scale-110' : ''}`}>
                        {category.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-base">{category.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {category.items.length} 种物品
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Items */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 animate-in slide-in-from-top-4 duration-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleItemSelect(category.id, item.id)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                              selectedItem === item.id
                                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                : 'bg-background/50 hover:bg-background border border-border/50 hover:border-primary/30'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 详细信息区域 - 只在选择后显示 */}
          {selectedItem && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="h-px bg-border/50" />

              {/* 物品名称（如果是"其他"类别） */}
              {selectedItem.includes('other') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    物品名称
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="item-name-input"
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="例如：蓝牙耳机、项链、背包..."
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              )}

              {/* 特征指纹输入框 - 核心新功能 */}
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">🔍 特征指纹 <span className="text-xs font-normal text-muted-foreground">(选填但强烈推荐)</span></h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      这些细节能让 AI 更准确地推断位置！光知道"白色耳机"是不够的。
                    </p>

                    {/* 颜色 */}
                    <div className="space-y-2 mb-4">
                      <label className="text-sm font-medium">颜色/外观</label>
                      <input
                        type="text"
                        value={itemColor}
                        onChange={(e) => setItemColor(e.target.value)}
                        placeholder="例如：白色、黑色、玫瑰金..."
                        className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background/80 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    {/* 特殊记号 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">特殊记号或状态</label>
                      <textarea
                        value={itemFeatures}
                        onChange={(e) => setItemFeatures(e.target.value)}
                        placeholder="例如：&#10;• 保护套是皮卡丘图案&#10;• 左上角有明显划痕&#10;• 贴了一张彩虹贴纸&#10;• 左耳机丢失了"
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background/80 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                      <p className="text-xs text-muted-foreground">💡 提示：保护套、贴纸、划痕、损坏部位等细节会直接影响 AI 推断</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 大小对比图 - 滑块式选择 */}
              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center gap-2">
                  物品大小
                  <span className="text-xs text-muted-foreground font-normal">(帮助判断可能掉落的位置)</span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(sizeIcons).map(([size, info]) => (
                    <button
                      key={size}
                      onClick={() => setItemSize(size as 'small' | 'medium' | 'large')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        itemSize === size
                          ? 'border-primary bg-primary/10 shadow-md scale-105'
                          : 'border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card'
                      }`}
                    >
                      <div className="text-4xl mb-2">{info.icon}</div>
                      <div className="font-semibold text-sm">{info.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{info.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          {selectedItem && (
            <div className="flex justify-end pt-4 animate-in slide-in-from-bottom-2 duration-500">
              <Button
                size="lg"
                onClick={handleContinue}
                className="rounded-full px-8"
                disabled={selectedItem.includes('other') && !itemName.trim()}
              >
                继续下一步
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* 底部提示 */}
          {displayName && (
            <div className="text-center p-4 rounded-xl bg-secondary/30 border border-border/50 animate-in fade-in duration-500">
              <p className="text-sm text-muted-foreground">
                当前选择：<span className="font-semibold text-foreground">{displayName}</span>
                {itemColor && <span className="text-primary"> · {itemColor}</span>}
                {itemSize && <span> · {sizeIcons[itemSize as keyof typeof sizeIcons].label}</span>}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
