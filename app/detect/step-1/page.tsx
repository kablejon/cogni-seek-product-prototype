"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { itemCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"
import {
  DailyItemsIcon,
  DigitalIcon,
  DocumentsIcon,
  ValuablesIcon,
  PetIcon,
  OtherItemsIcon
} from "@/components/ui/holographic-icons"

// 全息图标映射
const HOLOGRAPHIC_ICONS = {
  'daily': DailyItemsIcon,
  'digital': DigitalIcon,
  'documents': DocumentsIcon,
  'valuables': ValuablesIcon,
  'pets': PetIcon,
  'other': OtherItemsIcon,
}

// 能量球颜色选择器（3D Orbs）- 14个颜色
const COLOR_ORBS = [
  { 
    id: 'black', 
    label: '黑色', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #3a3a3a, #0a0a0a)'
  },
  { 
    id: 'white', 
    label: '白色', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #ffffff, #e8e8e8)'
  },
  { 
    id: 'silver', 
    label: '银/灰', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #d4d4d8, #71717a), linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.8) 50%, transparent 55%)'
  },
  { 
    id: 'gold', 
    label: '金/黄', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #fbbf24, #b45309), linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.5) 48%, rgba(255,255,255,0.7) 50%, transparent 52%)'
  },
  { 
    id: 'red', 
    label: '红色', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #f87171, #991b1b)'
  },
  { 
    id: 'pink', 
    label: '粉色', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #fda4af, #be185d)'
  },
  { 
    id: 'orange', 
    label: '橙色', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #fb923c, #c2410c)'
  },
  { 
    id: 'brown', 
    label: '棕/咖', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #a16207, #451a03)'
  },
  { 
    id: 'green', 
    label: '绿色', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #4ade80, #15803d)'
  },
  { 
    id: 'blue', 
    label: '蓝色', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #60a5fa, #1e3a8a)'
  },
  { 
    id: 'purple', 
    label: '紫色', 
    type: 'solid',
    gradient: 'radial-gradient(circle at 30% 30%, #a78bfa, #5b21b6)'
  },
  { 
    id: 'multicolor', 
    label: '多色', 
    type: 'nebula'
  },
  { 
    id: 'transparent', 
    label: '透明', 
    type: 'glass'
  },
  { 
    id: 'other', 
    label: '其他', 
    type: 'custom'
  },
]

// ========== 全量数据映射配置（38场景） ==========
interface ItemConfig {
  tags: string[]
  hideSize: boolean
  hideColor: boolean
  defaultSize?: string
}

const ITEM_MAPPING_CONFIG: Record<string, ItemConfig> = {
  // 1. 日常必需品
  'keys': {
    tags: ['一大串', '带门禁卡', '有公仔挂件', '车钥匙', '单把钥匙'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'wallet': {
    tags: ['长款', '短款折叠', '鼓鼓的', '带拉链', '名片夹'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'glasses': {
    tags: ['有眼镜盒', '镜腿折断', '金属框', '黑框', '隐形眼镜'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'watch': {
    tags: ['智能手表', '机械表', '表带断裂', '没电了', '屏幕碎了'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'umbrella': {
    tags: ['长柄伞', '折叠伞', '透明伞', '便利店伞', '很旧'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'medium'
  },
  'daily_other': {
    tags: ['刚买的', '借来的', '有特殊包装'],
    hideSize: false,
    hideColor: false,
  },

  // 2. 数码产品
  'phone': {
    tags: ['🔕 静音/震动', '🔋 没电关机', '💥 屏幕碎裂', '📲 戴手机壳'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'medium'
  },
  'airpods': {
    tags: ['🎧 头戴式', '💊 仅耳机仓', '👂 仅左耳', '👂 仅右耳', '带保护套'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'tablet': {
    tags: ['带键盘套', '有贴纸', '屏幕碎裂', '手写笔也在'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'medium'
  },
  'laptop': {
    tags: ['装在内胆包', '贴满贴纸', '电源线也在', '休眠状态'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'large'
  },
  'powerbank': {
    tags: ['自带线', '很重/大砖头', '磁吸式', '借用共享的'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'medium'
  },
  'cable': {
    tags: ['一团乱', '带插头', '很长', '原装白色'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'usb': {
    tags: ['带盖子', '挂在绳上', '有很多重要数据', '金属外壳'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'remote': {
    tags: ['电视遥控', '空调遥控', '车库遥控', '按键失灵'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'camera': {
    tags: ['单反/微单', '卡片机', '镜头盖没盖', '在相机包里'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'medium'
  },
  'digital_other': {
    tags: ['有指示灯', '正在运行', '刚买的'],
    hideSize: false,
    hideColor: false,
  },

  // 3. 证件文件
  'id_card': {
    tags: ['💳 有卡套', '👜 在钱包里', '🗂 和其他证件一起', '临时身份证'],
    hideSize: true,
    hideColor: true, // 隐藏颜色
    defaultSize: 'card'
  },
  'passport': {
    tags: ['📕 带护照夹', '🎫 夹着机票', '很旧'],
    hideSize: true,
    hideColor: true, // 隐藏颜色
    defaultSize: 'booklet'
  },
  'driver_license': {
    tags: ['⚫️ 黑色皮套', '📑 副页也在', '即将过期'],
    hideSize: true,
    hideColor: true, // 隐藏颜色
    defaultSize: 'booklet'
  },
  'bank_card': {
    tags: ['💳 信用卡', '🏦 储蓄卡', '装在卡套里'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'card'
  },
  'membership_card': {
    tags: ['🔑 蓝色小扣', '💳 白卡', '带有贴纸', '挂在手机上'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'important_docs': {
    tags: ['📄 A4纸', '📁 在文件夹里', '🟤 牛皮纸袋', '多页订书钉'],
    hideSize: true,
    hideColor: true, // 隐藏颜色
    defaultSize: 'large'
  },
  'docs_other': {
    tags: ['带照片', '塑封', '公章'],
    hideSize: false,
    hideColor: false,
  },

  // 4. 贵重物品
  'ring': {
    tags: ['💍 钻戒', '🟡 黄金', '⚪️ 铂金/银', '在首饰盒里'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'tiny'
  },
  'necklace': {
    tags: ['打结了', '吊坠很大', '断裂', '很细'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'earrings': {
    tags: ['只丢了一只', '长款耳线', '耳钉'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'tiny'
  },
  'bracelet': {
    tags: ['珠串', '玉镯', '金属链', '很松容易掉'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'cash': {
    tags: ['🧧 在红包里', '✉️ 在信封里', '💵 一整沓', '散钱'],
    hideSize: true,
    hideColor: true, // 隐藏颜色
    defaultSize: 'small'
  },
  'valuables_other': {
    tags: ['有证书', '祖传', '易碎'],
    hideSize: false,
    hideColor: false,
  },

  // 5. 宠物
  'cat': {
    tags: ['🔔 戴项圈', '🏠 室内猫(怕人)', '🍖 贪吃', '🤕 生病/受伤'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'dynamic'
  },
  'dog': {
    tags: ['🐕 戴牵引绳', '🔊 叫名字有反应', '🐶 幼犬', '👵 老年犬'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'dynamic'
  },
  'bird': {
    tags: ['🦜 会说话', '🪶 剪了羽', '笼子一起丢'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'hamster': {
    tags: ['跑得很快', '胆小', '在笼子里'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'small'
  },
  'pets_other': {
    tags: ['冷血动物', '有毒', '需要特殊环境'],
    hideSize: false,
    hideColor: false,
  },

  // 6. 其他物品
  'bag': {
    tags: ['👜 拉链没拉', '🎒 鼓鼓的', '🛍 购物纸袋', '帆布袋'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'large'
  },
  'clothes': {
    tags: ['🧥 外套', '🧣 围巾/帽子', '👕 刚脱下的', '脏衣物'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'medium'
  },
  'medicine': {
    tags: ['💊 药瓶', '📦 药盒', '急救药', '袋装'],
    hideSize: true,
    hideColor: true, // 隐藏颜色
    defaultSize: 'small'
  },
  'toys': {
    tags: ['🧸 毛绒公仔', '🏎 模型', '很大', '零件散落'],
    hideSize: false, // 显示尺寸选择
    hideColor: false,
  },
  'book': {
    tags: ['📚 厚书', '📖 杂志', '借书馆的', '精装'],
    hideSize: true,
    hideColor: false,
    defaultSize: 'medium'
  },

  // 默认配置（其他自定义）
  'completely_other': {
    tags: ['刚买的', '借来的', '有特殊包装', '易碎', '液体'],
    hideSize: false,
    hideColor: false,
  }
}

export default function Step1Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [selectedCategory, setSelectedCategory] = useState<string>(session.itemCategory || '')
  const [selectedItem, setSelectedItem] = useState<string>(session.itemType || '')
  const [itemCustomName, setItemCustomName] = useState<string>(session.itemCustomName || '')
  const [itemColor, setItemColor] = useState<string>(session.itemColor || '')
  const [customColorText, setCustomColorText] = useState<string>('')
  const [itemFeatures, setItemFeatures] = useState<string>(session.itemFeatures || '')
  const [selectedFeatureTags, setSelectedFeatureTags] = useState<string[]>([])
  const [itemSize, setItemSize] = useState<string>('')
  const [customSizeText, setCustomSizeText] = useState<string>('')
  
  // 自定义物品管理（按类别隔离）
  const [customItemsByCategory, setCustomItemsByCategory] = useState<Record<string, string[]>>({})
  const [showCustomItemInput, setShowCustomItemInput] = useState(false)
  const [customItemText, setCustomItemText] = useState('')
  
  // 获取当前类别的自定义物品
  const currentCategoryCustomItems = customItemsByCategory[selectedCategory] || []

  // 获取当前物品的配置
  const currentConfig = ITEM_MAPPING_CONFIG[selectedItem] || ITEM_MAPPING_CONFIG['completely_other']

  // 当选择物品时，自动处理尺寸和颜色
  useEffect(() => {
    if (selectedItem && currentConfig) {
      // 处理尺寸自动赋值
      if (currentConfig.hideSize && currentConfig.defaultSize) {
        setItemSize(currentConfig.defaultSize)
      } else if (!currentConfig.hideSize) {
        setItemSize('')
      }
      
      // 清空特征标签选择
      setSelectedFeatureTags([])
      setItemFeatures('')
    }
  }, [selectedItem, currentConfig])

  // 获取当前物品的特征标签
  const getFeatureTags = () => {
    return currentConfig?.tags || []
  }

  // 处理特征标签点击
  const handleTagClick = (tag: string) => {
    if (!itemFeatures.includes(tag)) {
      setItemFeatures(itemFeatures ? `${itemFeatures} ${tag}` : tag)
    }
    if (!selectedFeatureTags.includes(tag)) {
      setSelectedFeatureTags([...selectedFeatureTags, tag])
    }
  }

  // 添加自定义物品（按当前类别）
  const addCustomItem = () => {
    if (customItemText.trim() && selectedCategory) {
      const newItem = customItemText.trim()
      const currentItems = customItemsByCategory[selectedCategory] || []
      
      setCustomItemsByCategory({
        ...customItemsByCategory,
        [selectedCategory]: [...currentItems, newItem]
      })
      
      setItemCustomName(newItem)
      setSelectedItem('custom_item')
      setCustomItemText('')
      setShowCustomItemInput(false)
    }
  }

  // 删除自定义物品（按当前类别）
  const removeCustomItem = (item: string) => {
    if (selectedCategory) {
      const currentItems = customItemsByCategory[selectedCategory] || []
      
      setCustomItemsByCategory({
        ...customItemsByCategory,
        [selectedCategory]: currentItems.filter(i => i !== item)
      })
      
      if (itemCustomName === item) {
        setItemCustomName('')
        setSelectedItem('')
      }
    }
  }

  // 是否显示尺寸选择器
  const showSizeSelector = !currentConfig?.hideSize
  
  // 是否显示颜色选择器
  const showColorSelector = !currentConfig?.hideColor

  // 验证是否可以继续
  const canProceed = selectedCategory && selectedItem &&
    ((!selectedItem.endsWith('_other') && selectedItem !== 'completely_other') || (itemCustomName && itemCustomName.trim())) &&
    (!showColorSelector || (itemColor && (itemColor !== 'other' || (customColorText && customColorText.trim())))) &&
    (!showSizeSelector || (itemSize && (itemSize !== 'custom' || (customSizeText && customSizeText.trim()))))

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedItem('')
  }

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId)
    setItemColor('')
    setCustomColorText('')
  }

  const handleNext = () => {
    if (canProceed) {
      updateSession({
        itemCategory: selectedCategory,
        itemType: selectedItem,
        itemCustomName: itemCustomName,
        itemColor: showColorSelector ? (itemColor === 'other' ? customColorText : itemColor) : 'N/A',
        itemFeatures: itemFeatures,
        itemSize: showSizeSelector && itemSize === 'custom' ? customSizeText : itemSize,
      })
      router.push("/detect/step-2")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* 星空背景 */}
      <div className="fixed inset-0 z-0">
        <InteractiveFog particleCount={80} color="30, 64, 175" />
      </div>

      <Header currentStep={2} showProgress />

      {/* 主容器 */}
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
                const HolographicIcon = HOLOGRAPHIC_ICONS[category.id as keyof typeof HOLOGRAPHIC_ICONS] || OtherItemsIcon
                const isSelected = selectedCategory === category.id
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      relative overflow-hidden rounded-2xl
                      transition-all duration-500 ease-out
                      ${isSelected 
                        ? 'bg-gradient-to-br from-[#2DE1FC]/20 to-[#0EA5E9]/10 border-2 border-[var(--holo-blue)] shadow-[0_0_30px_rgba(45,225,252,0.4)] -translate-y-1.5' 
                        : 'bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20'
                      }
                      group backdrop-blur-md
                    `}
                    style={{
                      boxShadow: isSelected 
                        ? '0 0 30px rgba(45,225,252,0.4), inset 0 0 20px rgba(45,225,252,0.1)' 
                        : 'none'
                    }}
                  >
                    {/* 背景光晕层 */}
                    {isSelected && (
                      <div 
                        className="absolute inset-0 bg-gradient-radial from-[#2DE1FC]/10 via-transparent to-transparent opacity-60 animate-pulse"
                        style={{
                          background: 'radial-gradient(circle at 50% 50%, rgba(45,225,252,0.15), transparent 70%)'
                        }}
                      />
                    )}
                    
                    {isSelected && (
                      <div className="check-glow">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                    
                    <div className="relative flex flex-col items-center gap-3 py-6 px-4">
                      {/* 全息毛玻璃图标 */}
                      <div className={`
                        w-20 h-20 transition-all duration-500
                        ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(45,225,252,0.6)]' : 'group-hover:scale-105'}
                      `}>
                        <HolographicIcon 
                          isSelected={isSelected} 
                          className="w-full h-full"
                        />
                      </div>
                      
                      {/* 文字标签 */}
                      <span className={`
                        text-sm font-medium transition-all duration-300
                        ${isSelected 
                          ? 'text-white drop-shadow-[0_0_8px_rgba(45,225,252,0.8)]' 
                          : 'text-white/80 group-hover:text-white'
                        }
                      `}>
                        {category.label}
                      </span>
                    </div>
                    
                    {/* 边缘高光 */}
                    {isSelected && (
                      <div 
                        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2DE1FC] to-transparent opacity-60"
                      />
                    )}
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
                {/* 先显示所有非"其他"的预设选项 */}
                {itemCategories.find(c => c.id === selectedCategory)?.items.filter(item => 
                  !item.id.endsWith('_other') && item.id !== 'completely_other'
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item.id)}
                    className={`chip ${selectedItem === item.id ? 'chip-selected' : ''}`}
                  >
                    {selectedItem === item.id && <Check className="w-3 h-3" />}
                    {item.label}
                  </button>
                ))}

                {/* 然后显示已添加的自定义物品（仅当前类别） */}
                {currentCategoryCustomItems.map((item, idx) => (
                  <button
                    key={`custom_${idx}`}
                    onClick={() => {
                      setSelectedItem('custom_item')
                      setItemCustomName(item)
                    }}
                    className={`chip ${itemCustomName === item ? 'chip-selected' : ''} relative group`}
                  >
                    {itemCustomName === item && <Check className="w-3 h-3" />}
                    <span>{item}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeCustomItem(item)
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-400"
                    >
                      ×
                    </button>
                  </button>
                ))}

                {/* 最后显示"其他"选项（输入框或按钮），始终在最右边 */}
                {itemCategories.find(c => c.id === selectedCategory)?.items.filter(item => 
                  item.id.endsWith('_other') || item.id === 'completely_other'
                ).map((item) => {
                  // 如果是"其他"选项，检查是否应该显示输入框
                  if (showCustomItemInput) {
                    return (
                      <input
                        key={item.id}
                        type="text"
                        value={customItemText}
                        onChange={(e) => setCustomItemText(e.target.value)}
                        placeholder="输入物品名称..."
                        autoFocus
                        className="px-4 py-2 rounded-full text-sm bg-[var(--holo-blue)]/10 border-2 border-[var(--holo-blue)] focus:outline-none w-40 placeholder:text-white/40"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addCustomItem()
                          if (e.key === 'Escape') {
                            setShowCustomItemInput(false)
                            setCustomItemText('')
                          }
                        }}
                        onBlur={() => {
                          if (customItemText.trim()) {
                            addCustomItem()
                          } else {
                            setShowCustomItemInput(false)
                          }
                        }}
                      />
                    )
                  }
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setShowCustomItemInput(true)}
                      className="chip border-dashed"
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 物品颜色（3D能量球） */}
          {selectedItem && showColorSelector && (
            <div className="space-y-4 animate-fade-in-up delay-100">
              <h2 className="text-base md:text-lg font-bold text-white/90">物品颜色</h2>
              
              {/* 横向滑动容器 */}
              <div 
                className="overflow-x-auto overflow-y-visible py-3 pb-2 hide-scrollbar"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div className="flex gap-4 min-w-max px-1">
                  {COLOR_ORBS.map((orb) => {
                    const isSelected = itemColor === orb.id
                    
                    return (
                      <div 
                        key={orb.id} 
                        className="flex flex-col items-center gap-1 flex-shrink-0"
                        style={{ minHeight: '80px' }}
                      >
                        {/* 能量球 */}
                        <button
                          onClick={() => setItemColor(orb.id)}
                          className={`
                            relative w-12 h-12 rounded-full
                            transition-all duration-500 ease-out
                            ${isSelected 
                              ? 'scale-105 -translate-y-0.5' 
                              : 'hover:scale-105'
                            }
                            ${orb.type === 'custom' ? 'flex items-center justify-center' : ''}
                          `}
                          style={
                            orb.type === 'solid' 
                              ? { 
                                  background: orb.gradient,
                                  boxShadow: isSelected 
                                    ? '0 0 0 2px #2DE1FC, 0 0 20px rgba(45, 225, 252, 0.5), inset 0 2px 8px rgba(255,255,255,0.3)' 
                                    : 'inset 0 2px 8px rgba(255,255,255,0.2)',
                                }
                              : orb.type === 'nebula'
                                ? {
                                    background: `
                                      radial-gradient(circle at 30% 30%, rgba(255, 100, 100, 0.8), transparent 50%),
                                      radial-gradient(circle at 70% 70%, rgba(100, 100, 255, 0.8), transparent 50%),
                                      radial-gradient(circle at 30% 70%, rgba(255, 255, 100, 0.8), transparent 50%),
                                      radial-gradient(circle at 70% 30%, rgba(255, 0, 255, 0.8), transparent 50%),
                                      #222
                                    `,
                                    filter: 'blur(0.5px)',
                                    border: isSelected ? '2px solid #2DE1FC' : '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: isSelected ? '0 0 20px rgba(45, 225, 252, 0.5)' : 'none',
                                  }
                                : orb.type === 'glass'
                                  ? {
                                      background: 'rgba(255, 255, 255, 0.05)',
                                      border: isSelected ? '2px solid #2DE1FC' : '1.5px solid rgba(255, 255, 255, 0.6)',
                                      boxShadow: isSelected 
                                        ? 'inset 2px 2px 6px rgba(255, 255, 255, 0.3), 0 0 20px rgba(45, 225, 252, 0.5)' 
                                        : 'inset 2px 2px 6px rgba(255, 255, 255, 0.3)',
                                      position: 'relative' as const,
                                    }
                                  : {
                                      background: 'transparent',
                                      border: isSelected ? '2px solid #2DE1FC' : '2px dashed rgba(255, 255, 255, 0.4)',
                                      boxShadow: isSelected ? '0 0 20px rgba(45, 225, 252, 0.5)' : 'none',
                                    }
                          }
                        >
                          {/* 玻璃高光 */}
                          {orb.type === 'glass' && (
                            <div 
                              className="absolute rounded-full bg-white"
                              style={{
                                top: '15%',
                                left: '15%',
                                width: '25%',
                                height: '15%',
                                opacity: 0.8,
                                filter: 'blur(1px)',
                                transform: 'rotate(-45deg)',
                              }}
                            />
                          )}
                          
                          {/* 自定义加号 */}
                          {orb.type === 'custom' && (
                            <div className="text-white/70 text-xl font-light">+</div>
                          )}
                        </button>
                        
                        {/* 文字标签 (仅选中时显示) */}
                        {isSelected && (
                          <span 
                            className="text-[11px] text-white/90 mt-1 animate-fade-in-up whitespace-nowrap"
                            style={{
                              textShadow: '0 0 8px rgba(45, 225, 252, 0.8)'
                            }}
                          >
                            {orb.label}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
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

          {/* 特征指纹（智能标签云） */}
          {selectedItem && (
            <div className="space-y-3 animate-fade-in-up delay-200">
              <h2 className="text-base md:text-lg font-bold text-white/90">它有什么特殊记号？</h2>
              
              {/* 智能特征标签云 */}
              <div className="flex flex-wrap gap-2 pb-2">
                {getFeatureTags().map((tag, index) => {
                  const isSelected = selectedFeatureTags.includes(tag)
                  return (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-medium
                        border transition-all duration-300
                        ${isSelected
                          ? 'bg-[var(--holo-blue)]/30 border-[var(--holo-blue)] text-white shadow-[0_0_15px_rgba(45,225,252,0.3)] scale-105'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15 hover:border-white/30'
                        }
                      `}
                      style={{ height: '32px' }}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>

              {/* 输入框 */}
              <textarea
                value={itemFeatures}
                onChange={(e) => setItemFeatures(e.target.value)}
                placeholder={`例如：${getFeatureTags().slice(0, 2).join('，')}...`}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm min-h-[80px] focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all resize-none"
              />
            </div>
          )}

          {/* 物品大小（条件显示）- 全息能量块/磨砂玻璃几何体 */}
          {selectedItem && showSizeSelector && (
            <div className="space-y-4 animate-slide-up">
              <h2 className="text-base md:text-lg font-bold text-white/90">物品大小</h2>
              <div className="grid grid-cols-4 gap-3">
                
                {/* 微型 - 实心发光晶体珠子 */}
                <button
                  onClick={() => setItemSize('small')}
                  className={`group relative h-[90px] rounded-2xl transition-all duration-400 overflow-hidden ${
                    itemSize === 'small' 
                      ? 'bg-gradient-to-br from-[var(--cyber-green)]/25 to-[var(--holo-blue)]/15 border-2 border-[var(--cyber-green)]/70 shadow-[0_0_25px_rgba(45,225,252,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] hover:from-white/[0.08] hover:to-white/[0.04] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    {/* 晶体珠子 - 3D球体效果 */}
                    <div className={`relative transition-all duration-400 ${itemSize === 'small' ? 'scale-115' : 'group-hover:scale-110'}`}>
                      <div className={`w-7 h-7 rounded-full relative transition-all duration-400 ${
                        itemSize === 'small'
                          ? 'bg-gradient-to-br from-white via-[var(--cyber-green)]/60 to-[var(--holo-blue)]/80 shadow-[0_0_20px_rgba(45,225,252,0.8),0_0_40px_rgba(45,225,252,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.3),inset_3px_3px_6px_rgba(255,255,255,0.4)]'
                          : 'bg-gradient-to-br from-white/50 via-white/30 to-white/10 shadow-[0_0_12px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.2),inset_2px_2px_4px_rgba(255,255,255,0.3)]'
                      }`}>
                        {/* 高光点 */}
                        <div className="absolute top-1 left-1.5 w-2 h-1.5 bg-white/80 rounded-full blur-[1px]" />
                      </div>
                    </div>
                    <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${itemSize === 'small' ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                      微型
                    </span>
                  </div>
                </button>
                
                {/* 小型 - 半透明玻璃手机板 */}
                <button
                  onClick={() => setItemSize('medium')}
                  className={`group relative h-[90px] rounded-2xl transition-all duration-400 overflow-hidden ${
                    itemSize === 'medium' 
                      ? 'bg-gradient-to-br from-[var(--cyber-green)]/25 to-[var(--holo-blue)]/15 border-2 border-[var(--cyber-green)]/70 shadow-[0_0_25px_rgba(45,225,252,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] hover:from-white/[0.08] hover:to-white/[0.04] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    {/* 玻璃手机板 - 有厚度 */}
                    <div className={`relative transition-all duration-400 ${itemSize === 'medium' ? 'scale-115' : 'group-hover:scale-110'}`}>
                      <div className={`w-6 h-10 rounded-lg relative transition-all duration-400 ${
                        itemSize === 'medium'
                          ? 'bg-gradient-to-br from-white/60 via-[var(--cyber-green)]/40 to-[var(--holo-blue)]/50 shadow-[0_0_20px_rgba(45,225,252,0.6),4px_4px_0_rgba(45,225,252,0.3),inset_0_1px_2px_rgba(255,255,255,0.5)]'
                          : 'bg-gradient-to-br from-white/40 via-white/20 to-white/10 shadow-[0_0_10px_rgba(255,255,255,0.15),3px_3px_0_rgba(255,255,255,0.08),inset_0_1px_2px_rgba(255,255,255,0.3)]'
                      }`}>
                        {/* 屏幕内发光 */}
                        <div className={`absolute inset-1 rounded-md transition-all duration-400 ${
                          itemSize === 'medium' 
                            ? 'bg-gradient-to-b from-[var(--cyber-green)]/30 to-transparent' 
                            : 'bg-gradient-to-b from-white/20 to-transparent'
                        }`} />
                        {/* Home键指示 */}
                        <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full transition-all duration-400 ${
                          itemSize === 'medium' ? 'bg-[var(--cyber-green)]' : 'bg-white/40'
                        }`} />
                      </div>
                    </div>
                    <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${itemSize === 'medium' ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                      小型
                    </span>
                  </div>
                </button>
                
                {/* 中型 - 实心磨砂玻璃方块 */}
                <button
                  onClick={() => setItemSize('large')}
                  className={`group relative h-[90px] rounded-2xl transition-all duration-400 overflow-hidden ${
                    itemSize === 'large' 
                      ? 'bg-gradient-to-br from-[var(--cyber-green)]/25 to-[var(--holo-blue)]/15 border-2 border-[var(--cyber-green)]/70 shadow-[0_0_25px_rgba(45,225,252,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] hover:from-white/[0.08] hover:to-white/[0.04] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    {/* 3D立方体 - 磨砂玻璃质感 */}
                    <div className={`relative transition-all duration-400 ${itemSize === 'large' ? 'scale-115' : 'group-hover:scale-110'}`}>
                      <svg width="36" height="36" viewBox="0 0 36 36" className="transition-all duration-400">
                        {/* 立方体顶面 - 最亮 */}
                        <path 
                          d="M18 6 L30 12 L18 18 L6 12 Z" 
                          fill={itemSize === 'large' ? 'rgba(45,225,252,0.5)' : 'rgba(255,255,255,0.35)'}
                          className="transition-all duration-400"
                        />
                        {/* 立方体左面 - 中等亮度 */}
                        <path 
                          d="M6 12 L18 18 L18 30 L6 24 Z" 
                          fill={itemSize === 'large' ? 'rgba(45,225,252,0.35)' : 'rgba(255,255,255,0.2)'}
                          className="transition-all duration-400"
                        />
                        {/* 立方体右面 - 暗面 */}
                        <path 
                          d="M18 18 L30 12 L30 24 L18 30 Z" 
                          fill={itemSize === 'large' ? 'rgba(45,225,252,0.2)' : 'rgba(255,255,255,0.1)'}
                          className="transition-all duration-400"
                        />
                        {/* 边缘高光 */}
                        <path 
                          d="M18 6 L30 12 M18 6 L6 12 M18 18 L18 30" 
                          stroke={itemSize === 'large' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'}
                          strokeWidth="1"
                          fill="none"
                          className="transition-all duration-400"
                        />
                        {/* 外发光 */}
                        <defs>
                          <filter id="cubeGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation={itemSize === 'large' ? '3' : '1'} result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                      </svg>
                    </div>
                    <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${itemSize === 'large' ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                      中型
                    </span>
                  </div>
                </button>

                {/* 大型 - 展开的空间网格/旅行箱 */}
                <button
                  onClick={() => setItemSize('custom')}
                  className={`group relative h-[90px] rounded-2xl transition-all duration-400 overflow-hidden ${
                    itemSize === 'custom' 
                      ? 'bg-gradient-to-br from-[var(--cyber-green)]/25 to-[var(--holo-blue)]/15 border-2 border-[var(--cyber-green)]/70 shadow-[0_0_25px_rgba(45,225,252,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] hover:from-white/[0.08] hover:to-white/[0.04] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    {/* 大号旅行箱轮廓 - 有能量填充 */}
                    <div className={`relative transition-all duration-400 ${itemSize === 'custom' ? 'scale-115' : 'group-hover:scale-110'}`}>
                      <svg width="40" height="36" viewBox="0 0 40 36" className="transition-all duration-400">
                        {/* 箱体主体 - 3D效果 */}
                        <rect 
                          x="4" y="6" width="32" height="24" rx="4"
                          fill={itemSize === 'custom' ? 'rgba(45,225,252,0.25)' : 'rgba(255,255,255,0.15)'}
                          stroke={itemSize === 'custom' ? 'rgba(45,225,252,0.8)' : 'rgba(255,255,255,0.3)'}
                          strokeWidth="1.5"
                          className="transition-all duration-400"
                        />
                        {/* 箱体顶部高亮 */}
                        <rect 
                          x="4" y="6" width="32" height="8" rx="4"
                          fill={itemSize === 'custom' ? 'rgba(45,225,252,0.4)' : 'rgba(255,255,255,0.25)'}
                          className="transition-all duration-400"
                        />
                        {/* 把手 */}
                        <rect 
                          x="15" y="2" width="10" height="5" rx="2"
                          fill={itemSize === 'custom' ? 'rgba(45,225,252,0.5)' : 'rgba(255,255,255,0.25)'}
                          stroke={itemSize === 'custom' ? 'rgba(45,225,252,0.8)' : 'rgba(255,255,255,0.3)'}
                          strokeWidth="1"
                          className="transition-all duration-400"
                        />
                        {/* 能量条纹 */}
                        <line x1="10" y1="18" x2="30" y2="18" stroke={itemSize === 'custom' ? 'rgba(45,225,252,0.6)' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
                        <line x1="10" y1="22" x2="30" y2="22" stroke={itemSize === 'custom' ? 'rgba(45,225,252,0.4)' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
                        {/* 轮子 */}
                        <circle cx="10" cy="32" r="2" fill={itemSize === 'custom' ? 'rgba(45,225,252,0.7)' : 'rgba(255,255,255,0.3)'} />
                        <circle cx="30" cy="32" r="2" fill={itemSize === 'custom' ? 'rgba(45,225,252,0.7)' : 'rgba(255,255,255,0.3)'} />
                      </svg>
                    </div>
                    <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${itemSize === 'custom' ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                      大型
                    </span>
                  </div>
                </button>
              </div>

              {/* 自定义大小输入 - 融合感设计 */}
              {itemSize === 'custom' && (
                <div className="space-y-3 animate-fade-in-up">
                  <div className="relative">
                    <input
                      type="text"
                      value={customSizeText}
                      onChange={(e) => setCustomSizeText(e.target.value)}
                      placeholder="请描述物品大小，如：电脑主机大小、行李箱大小..."
                      className="w-full px-5 py-4 rounded-xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] backdrop-blur-sm border border-white/10 text-sm text-white placeholder:text-white/30 focus:border-[var(--cyber-green)]/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(45,225,252,0.1)] transition-all duration-300"
                    />
                    {/* 底部发光线 */}
                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[var(--cyber-green)]/40 to-transparent" />
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1 h-1 rounded-full bg-[var(--cyber-green)] shadow-[0_0_6px_rgba(45,225,252,0.8)]" />
                    <p className="text-[11px] text-white/40">
                      提示：可用具体物品对比（如"笔记本电脑大小"）或直接说明尺寸（如"长30cm × 宽20cm"）
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 底部按钮区 */}
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

      {/* 滑入动画样式 */}
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
