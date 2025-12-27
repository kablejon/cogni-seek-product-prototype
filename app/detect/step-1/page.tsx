"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Key, Smartphone, FileText, Gem, Cat, Package, Check } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { itemCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 图标映射 - 线框风格
const CATEGORY_ICONS = {
  'key_valuables': Key,
  'digital': Smartphone,
  'documents': FileText,
  'jewelry': Gem,
  'pet': Cat,
  'other': Package,
}

// 色块配置 - 去重后的核心颜色（按丢失物品频率排序）
const COLOR_OPTIONS = [
  { id: 'black', label: '黑色', hex: '#1a1a1a' },      // 最高频：手机、钱包、包
  { id: 'white', label: '白色', hex: '#FFFFFF' },      // 最高频：手机、耳机
  { id: 'silver', label: '银灰', hex: '#C0C0C0' },     // 高频：手机、钥匙、首饰
  { id: 'gold', label: '金色', hex: '#D4AF37' },       // 高频：手机、首饰、钥匙
  { id: 'blue', label: '蓝色', hex: '#4169E1' },       // 中频：手机、包、证件
  { id: 'brown', label: '棕色', hex: '#8B4513' },      // 中频：钱包、皮具、包
  { id: 'red', label: '红色', hex: '#DC143C' },        // 中频：包、钥匙扣
  { id: 'pink', label: '粉色', hex: '#FF69B4' },       // 中频：手机、包
  { id: 'purple', label: '紫色', hex: '#9370DB' },     // 中频：手机、包
  { id: 'green', label: '绿色', hex: '#228B22' },      // 低频：包、配饰
  { id: 'orange', label: '橙色', hex: '#FF8C00' },     // 低频：包、配饰
  { id: 'other', label: '其他', hex: '#667788' },      // 自定义颜色
]

export default function Step1Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedCategory, setSelectedCategory] = useState<string>(session.itemCategory)
  const [selectedItem, setSelectedItem] = useState<string>(session.itemType)
  const [itemCustomName, setItemCustomName] = useState<string>(session.itemCustomName)
  const [itemColor, setItemColor] = useState<string>(session.itemColor)
  const [customColorText, setCustomColorText] = useState<string>('')
  const [itemFeatures, setItemFeatures] = useState<string>(session.itemFeatures || '')
  const [itemSize, setItemSize] = useState<'small' | 'medium' | 'large' | 'custom' | ''>(session.itemSize)
  const [customSizeText, setCustomSizeText] = useState<string>('')

  const canProceed = selectedCategory && selectedItem && itemColor && itemSize && 
    (selectedItem !== 'completely_other' || itemCustomName.trim()) &&
    (itemColor !== 'other' || customColorText.trim()) &&
    (itemSize !== 'custom' || customSizeText.trim())

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedItem('')
  }

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId)
  }

  const handleNext = () => {
    if (canProceed) {
      updateSession({
        itemCategory: selectedCategory,
        itemType: selectedItem,
        itemCustomName: itemCustomName,
        itemColor: itemColor === 'other' ? customColorText : itemColor,
        itemFeatures: itemFeatures,
        itemSize: itemSize === 'custom' ? customSizeText : itemSize,
      })
      router.push("/detect/step-2")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* 星空背景 - 固定定位 */}
      <div className="fixed inset-0 z-0">
        <InteractiveFog particleCount={80} color="30, 64, 175" />
      </div>

      <Header currentStep={2} showProgress />

      {/* 主容器 - 毛玻璃悬浮卡片 */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-5xl mx-auto scifi-container p-6 md:p-10 space-y-8">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">你丢失了什么？</h1>
            <p className="text-base md:text-lg text-white/70">选择物品类型，帮助我们精准分析</p>
          </div>

          {/* Grid 宫格 - 物品类别 */}
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-bold text-white/90">物品类别</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {itemCategories.map((category) => {
                const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] || Package
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
                    
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Icon className={`w-8 h-8 transition-all ${isSelected ? 'text-[var(--holo-blue)]' : 'text-white/70 group-hover:text-white'}`} strokeWidth={1.5} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                        {category.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 具体物品 */}
          {selectedCategory && (
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-base md:text-lg font-bold text-white/90">具体物品</h2>
              <div className="flex flex-wrap gap-2">
                {itemCategories.find(c => c.id === selectedCategory)?.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item.id)}
                    className={`chip ${selectedItem === item.id ? 'chip-selected' : ''}`}
                  >
                    {selectedItem === item.id && <Check className="w-3 h-3" />}
                    {item.label}
                  </button>
                ))}
              </div>

              {selectedItem === 'completely_other' && (
                <input
                  type="text"
                  value={itemCustomName}
                  onChange={(e) => setItemCustomName(e.target.value)}
                  placeholder="输入物品名称"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all"
                />
              )}
            </div>
          )}

          {/* 色块选择器 */}
          {selectedItem && (
            <div className="space-y-4 animate-fade-in-up delay-100">
              <h2 className="text-base md:text-lg font-bold text-white/90">物品颜色</h2>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setItemColor(color.id)}
                    className={`color-dot ${itemColor === color.id ? 'color-dot-selected' : ''} ${color.id === 'other' ? 'flex items-center justify-center' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  >
                    {color.id === 'other' && (
                      <span className="text-[11px] font-semibold text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        其他
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* 自定义颜色输入 */}
              {itemColor === 'other' && (
                <input
                  type="text"
                  value={customColorText}
                  onChange={(e) => setCustomColorText(e.target.value)}
                  placeholder="请输入颜色名称（如：墨绿色、香槟金、深紫色）"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all"
                />
              )}
            </div>
          )}

          {/* 特征指纹 */}
          {selectedItem && (
            <div className="space-y-3 animate-fade-in-up delay-200">
              <h2 className="text-base md:text-lg font-bold text-white/90">它有什么特殊记号？</h2>
              <p className="text-xs text-muted-foreground">例如：保护套样式、贴纸、划痕、损坏</p>
              <textarea
                value={itemFeatures}
                onChange={(e) => setItemFeatures(e.target.value)}
                placeholder="详细描述物品的独特特征..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm min-h-[80px] focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all resize-none"
              />
            </div>
          )}

          {/* 大小对比 */}
          {selectedItem && (
            <div className="space-y-3 animate-fade-in-up delay-300">
              <h2 className="text-base md:text-lg font-bold text-white/90">物品大小</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setItemSize('small')}
                  className={`card-option ${itemSize === 'small' ? 'card-option-selected' : ''} relative`}
                >
                  {itemSize === 'small' && (
                    <div className="check-glow">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-2 py-3">
                    <span className="text-2xl">🪙</span>
                    <span className="text-xs">硬币大小</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setItemSize('medium')}
                  className={`card-option ${itemSize === 'medium' ? 'card-option-selected' : ''} relative`}
                >
                  {itemSize === 'medium' && (
                    <div className="check-glow">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-2 py-3">
                    <span className="text-2xl">📱</span>
                    <span className="text-xs">手机大小</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setItemSize('large')}
                  className={`card-option ${itemSize === 'large' ? 'card-option-selected' : ''} relative`}
                >
                  {itemSize === 'large' && (
                    <div className="check-glow">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-2 py-3">
                    <span className="text-2xl">📚</span>
                    <span className="text-xs">书本大小</span>
                  </div>
                </button>

                <button
                  onClick={() => setItemSize('custom')}
                  className={`card-option ${itemSize === 'custom' ? 'card-option-selected' : ''} relative`}
                >
                  {itemSize === 'custom' && (
                    <div className="check-glow">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-2 py-3">
                    <span className="text-2xl">📏</span>
                    <span className="text-xs">其他大小</span>
                  </div>
                </button>
              </div>

              {/* 自定义大小输入 */}
              {itemSize === 'custom' && (
                <div className="space-y-2 animate-fade-in-up">
                  <input
                    type="text"
                    value={customSizeText}
                    onChange={(e) => setCustomSizeText(e.target.value)}
                    placeholder="请描述物品大小"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all"
                  />
                  <div className="flex items-start gap-2 px-2">
                    <span className="text-xs text-[var(--cyber-green)] mt-0.5">💡</span>
                    <p className="text-xs text-white/60 leading-relaxed">
                      建议：用具体物品对比描述（如"电脑主机大小"、"行李箱大小"），或直接说明尺寸（如"长30cm 宽20cm"）
                    </p>
                  </div>
                </div>
              )}
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
              onClick={() => router.push('/detect/step-0')}
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
