"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Check, X } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { locationCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"
import { JustLostIcon, AlreadySearchedIcon } from "@/components/ui/search-status-icons"

// 寻找时长选项 - 迷你标签
const DURATION_OPTIONS = [
  { id: '10min', label: '10分钟内' },
  { id: '30min', label: '半小时左右' },
  { id: '1-2h', label: '1-2小时' },
  { id: 'half_day', label: '超过半天' },
]

// 智能设备关键词库
const SMART_KEYWORDS = [
  '智能', 'smart', '电', '充', '网', 'wifi', 'wlan',
  '蓝牙', 'bluetooth', 'bt', '定位', 'gps', '查找', 'find',
  '手机', 'phone', '华为', '小米', 'iphone', 'apple', 'oppo', 'vivo',
  '表', 'watch', '手环', 'band', '小天才',
  '耳机', 'airpods', 'buds', 'earbuds',
  '相机', 'gopro', 'insta360', '大疆', 'dji', 'camera',
  'switch', '游戏机', 'kindle', 'tag', 'airtag', 'ipad'
]

// 固定ID设备映射
const DEVICE_TEXT_MAP: Record<string, string> = {
  'phone': '已尝试"查找"或拨打电话',
  'tablet': '已尝试通过云服务定位设备',
  'laptop': '已尝试通过"查找"功能定位',
  'earbuds': '已尝试连接蓝牙或播放寻找音乐',
  'smartwatch': '已尝试定位或拨打手表电话',
  'camera': '已查看最后拍摄或连接记录',
  'drone': '已查看远程GPS轨迹',
}

export default function Step5Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [hasSearched, setHasSearched] = useState(session.hasSearched || false)
  const [searchDuration, setSearchDuration] = useState(session.searchDuration || '')
  const [searchedLocations, setSearchedLocations] = useState<string[]>(session.searchedLocations || [])
  const [customSearchZones, setCustomSearchZones] = useState<string[]>([])
  const [showCustomZoneInput, setShowCustomZoneInput] = useState(false)
  const [customZoneText, setCustomZoneText] = useState('')
  const [askedOthers, setAskedOthers] = useState(session.askedOthers || false)
  const [triedSmartFeature, setTriedSmartFeature] = useState(session.triedFindMy || false)

  // 中文子场景到英文ID的映射（Step 3 保存的是中文）
  const LOCATION_TO_ID_MAP: Record<string, string> = {
    '车内座位': 'private_car',
    '后备箱': 'trunk',
    '车门侧袋': 'door_pocket',
    '出租车/网约车': 'taxi',
    '地铁/公交': 'public_transport',
    '路边': 'roadside',
    '加油站': 'gas_station',
    '停车场': 'parking_lot',
  }

  // 交通通勤场景排查点映射表（Key 必须与 Step 3 的按钮 ID 对应）
  const COMMUTE_ZONE_DATA: Record<string, string[]> = {
    // 🚕 场景 1: 出租车/网约车
    'taxi': [
      '后排座椅缝隙', '前排背袋', '车门储物槽', '脚垫下/边缘', '下车点地面'
    ],

    // 🚗 场景 2: 私家车/车内座位
    'private_car': [
      '座椅缝隙/滑轨', '副驾手套箱', '中央扶手箱', '车门储物格', '脚垫下', '遮阳板夹层'
    ],

    // 🚙 场景 3: 后备箱
    'trunk': [
      '备胎槽', '两侧储物格', '后排座椅靠背缝隙', '地毯下方', '工具箱', '周边地面'
    ],

    // 🚪 场景 4: 车门侧袋
    'door_pocket': [
      '车门储物格', '门把手槽', '车窗按钮槽', '座椅侧边缝隙', '安全带卡扣处'
    ],

    // 🚌 场景 5: 地铁/公交
    'public_transport': [
      '座位下方', '座位缝隙', '安检/检票口', '候车椅', '车厢连接处', '售票机台面'
    ],

    // 🛣️ 场景 6: 路边
    'roadside': [
      '上下车位置', '路边花坛/草丛', '垃圾桶周边', '排水沟/井盖旁', '共享单车筐'
    ],

    // ⛽️ 场景 7: 加油站
    'gas_station': [
      '加油机旁', '便利店收银台', '洗手间台面', '休息区长椅'
    ],

    // 🅿️ 场景 8: 停车场
    'parking_lot': [
      '车位周边地面', '缴费机器', '电梯口', '后备箱取物处', '相邻车位下方'
    ],
  }

  // 获取相关位置配置 - 聚合多个子场景的排查点
  const locationConfig = useMemo(() => {
    const category = session.locationCategory
    const selectedSubLocations = session.otherVisitedLocations || [] // 读取所有选中的子场景数组
    
    // 如果是交通工具类别，聚合所有子场景的排查点
    if (category === 'transit') {
      let aggregatedZones: string[] = []
      let sceneTitles: string[] = []

      if (selectedSubLocations.length > 0) {
        // 1. 遍历所有选中的子场景，收集排查点
        selectedSubLocations.forEach((subLocation: string) => {
          // 将中文映射为英文ID
          const locationId = LOCATION_TO_ID_MAP[subLocation] || subLocation
          const zones = COMMUTE_ZONE_DATA[locationId]
          
          if (zones && zones.length > 0) {
            aggregatedZones = [...aggregatedZones, ...zones]
            sceneTitles.push(subLocation)
            console.log('✅ 加载交通场景:', subLocation, '→', locationId, '→', zones.length, '个排查点')
          } else {
            console.warn('⚠️ 未找到映射:', subLocation, '→', locationId)
          }
        })

        // 2. 去重（防止"地面"在多个场景里重复）
        aggregatedZones = [...new Set(aggregatedZones)]
      }

      // 3. 如果聚合后为空，使用兜底数据
      if (aggregatedZones.length === 0) {
        console.warn('⚠️ 交通场景排查点为空，使用兜底数据')
        aggregatedZones = ['座椅缝隙', '脚垫下', '地面/角落', '随身包袋', '后备箱']
      }

      // 4. 动态标题
      let title = '你在交通工具上排查过哪些位置？'
      if (sceneTitles.length === 1) {
        title = `你在${sceneTitles[0]}排查过哪些位置？`
      } else if (sceneTitles.length > 1) {
        title = `你在这些地方排查过哪些位置？`
      }

      return {
        title,
        zones: aggregatedZones.map((label, index) => ({
          id: `transport_zone_${index}`,
          label
        }))
      }
    }
    
    // 否则使用原有的子位置列表
    const categoryData = locationCategories.find(c => c.id === category)
    const zones = categoryData?.subLocations.filter(l => !l.id.includes('other')) || []
    
    return {
      title: '已经找过哪些地方？',
      zones
    }
  }, [session.locationCategory, session.otherVisitedLocations])

  // 智能判定逻辑
  const smartFeatureConfig = useMemo(() => {
    const itemType = session.itemType || ''
    const itemName = session.itemName || ''
    const itemCustomName = session.itemCustomName || ''
    const itemCategory = session.itemCategory || ''

    // 1. 检查固定ID
    if (DEVICE_TEXT_MAP[itemType]) {
      return {
        show: true,
        text: DEVICE_TEXT_MAP[itemType],
        icon: '📡'
      }
    }

    // 2. 检查宠物
    if (itemCategory === 'pet' || itemType === 'pet') {
      return {
        show: true,
        text: '已尝试呼唤名字或敲击食盆',
        icon: '🗣️'
      }
    }

    // 3. 检查关键词匹配
    const textToCheck = `${itemName} ${itemCustomName}`.toLowerCase()
    const hasSmartKeyword = SMART_KEYWORDS.some(keyword => 
      textToCheck.includes(keyword.toLowerCase())
    )

    if (hasSmartKeyword) {
      return {
        show: true,
        text: '已尝试通过配套APP或定位功能查找',
        icon: '📡'
      }
    }

    // 4. 普通物品 - 不显示
    return {
      show: false,
      text: '',
      icon: ''
    }
  }, [session.itemType, session.itemName, session.itemCustomName, session.itemCategory])

  const handleToggleLocation = (locationId: string) => {
    if (searchedLocations.includes(locationId)) {
      setSearchedLocations(searchedLocations.filter(l => l !== locationId))
    } else {
      setSearchedLocations([...searchedLocations, locationId])
    }
  }

  const handleAddCustomZone = () => {
    if (customZoneText.trim() && !customSearchZones.includes(customZoneText.trim())) {
      const newZone = customZoneText.trim()
      setCustomSearchZones([...customSearchZones, newZone])
      setSearchedLocations([...searchedLocations, `custom_${newZone}`])
      setCustomZoneText('')
      setShowCustomZoneInput(false)
    }
  }

  const handleRemoveCustomZone = (zone: string) => {
    setCustomSearchZones(customSearchZones.filter(z => z !== zone))
    setSearchedLocations(searchedLocations.filter(l => l !== `custom_${zone}`))
  }

  const handleNext = () => {
    updateSession({
      hasSearched,
      searchDuration: hasSearched ? searchDuration : '',
      searchedLocations: hasSearched ? searchedLocations : [],
      searchedCustomLocations: hasSearched ? customSearchZones : [],
      askedOthers,
      triedFindMy: smartFeatureConfig.show ? triedSmartFeature : false,
    })
    router.push("/detect/loading")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="fixed inset-0 z-0">
        <InteractiveFog color="34, 211, 238" />
      </div>
      
      <Header currentStep={6} showProgress />

      <main className="container mx-auto px-4 py-6 md:py-10 relative z-10">
        <div className="w-full max-w-4xl mx-auto scifi-container p-6 md:p-8 space-y-6">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">已排查信息</h1>
            <p className="text-base text-white/70">告诉我们你已经找过哪些地方，避免重复建议</p>
          </div>

          {/* ========== 区域一：核心状态卡片 ========== */}
          <div className="grid grid-cols-2 gap-4">
            {/* 刚发现丢了 */}
            <button
              onClick={() => setHasSearched(false)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-500
                flex flex-col items-center justify-center min-h-[140px]
                ${!hasSearched
                  ? 'border-[#FF9F0A] bg-[#FF9F0A]/15 shadow-[0_0_20px_rgba(255,159,10,0.3),0_0_40px_rgba(255,159,10,0.2)]' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                }
              `}
            >
              {!hasSearched && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FF9F0A] flex items-center justify-center shadow-lg animate-scale-in">
                  <Check className="w-3.5 h-3.5 text-black" />
                </div>
              )}
              <div className="w-16 h-16 mb-2">
                <JustLostIcon isSelected={!hasSearched} className="w-full h-full" />
              </div>
              <div className="font-bold text-sm" style={!hasSearched ? { color: '#FF9F0A' } : {}}>
                刚发现丢了
              </div>
            </button>

            {/* 已经找过 */}
            <button
              onClick={() => setHasSearched(true)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-500
                flex flex-col items-center justify-center min-h-[140px]
                ${hasSearched
                  ? 'border-[#2DE1FC] bg-[#2DE1FC]/15 shadow-[0_0_20px_rgba(45,225,252,0.3),0_0_40px_rgba(45,225,252,0.2)]' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                }
              `}
            >
              {hasSearched && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--cyber-green)] flex items-center justify-center shadow-lg animate-scale-in">
                  <Check className="w-3.5 h-3.5 text-black" />
                </div>
              )}
              <div className="w-16 h-16 mb-2">
                <AlreadySearchedIcon isSelected={hasSearched} className="w-full h-full" />
              </div>
              <div className="font-bold text-sm" style={hasSearched ? { color: '#2DE1FC' } : {}}>
                已经找过
              </div>
            </button>
          </div>

          {/* ========== 已搜索详情（仅在已经找过时显示） ========== */}
          {hasSearched && (
            <div className="space-y-5 animate-fade-in-up">
              
              {/* ========== 区域二：寻找时长 - 迷你标签（带打钩） ========== */}
              <div className="space-y-3">
                <h2 className="font-bold text-sm text-white/70">找了多久了？</h2>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((option) => {
                    const isSelected = searchDuration === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSearchDuration(option.id)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-medium
                          border transition-all duration-300 flex items-center gap-1.5
                          ${isSelected
                            ? 'bg-[#2DE1FC]/20 border-[#2DE1FC] text-[#2DE1FC] shadow-[0_0_10px_rgba(45,225,252,0.3)]' 
                            : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40'
                          }
                        `}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ========== 区域三：区域排除（含自定义输入，动态标题） ========== */}
              {/* 强制显示：只要进入已搜索模式，必须显示，至少显示 [+ 其他] 按钮 */}
              <div className="space-y-3">
                <h2 className="font-bold text-sm text-white/70">
                  {locationConfig.title}<span className="text-xs text-white/50 ml-2">（可多选，代表"已确认找过这里，没有"）</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {/* 预设区域 */}
                  {locationConfig.zones.map((location) => {
                      const isSelected = searchedLocations.includes(location.id)
                      return (
                        <button
                          key={location.id}
                          onClick={() => handleToggleLocation(location.id)}
                          className={`
                            px-3 py-1.5 rounded-full text-xs font-medium
                            border transition-all duration-300 flex items-center gap-1.5
                            ${isSelected
                              ? 'bg-[#2DE1FC]/20 border-[#2DE1FC]/50 text-white shadow-[0_0_10px_rgba(45,225,252,0.2)]' 
                              : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40'
                            }
                          `}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          {location.label}
                        </button>
                      )
                    })}

                    {/* 已添加的自定义区域 */}
                    {customSearchZones.map((zone, index) => (
                      <div
                        key={`custom_${index}`}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#2DE1FC]/20 border border-[#2DE1FC]/50 text-white shadow-[0_0_10px_rgba(45,225,252,0.2)] flex items-center gap-1.5 relative group"
                      >
                        <Check className="w-3 h-3" />
                        <span>{zone}</span>
                        <button
                          onClick={() => handleRemoveCustomZone(zone)}
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* 自定义输入按钮/输入框 */}
                    {!showCustomZoneInput ? (
                      <button
                        onClick={() => setShowCustomZoneInput(true)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border-2 border-dashed border-white/30 text-white/60 hover:border-[#2DE1FC]/50 hover:text-white/80 transition-all flex items-center gap-1"
                      >
                        <span className="text-sm">+</span>
                        <span>其他</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customZoneText}
                          onChange={(e) => setCustomZoneText(e.target.value)}
                          placeholder="输入区域..."
                          autoFocus
                          className="px-3 py-1.5 rounded-full text-xs bg-[#2DE1FC]/10 border-2 border-[#2DE1FC] focus:outline-none w-28 placeholder:text-white/40"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddCustomZone()
                            if (e.key === 'Escape') {
                              setShowCustomZoneInput(false)
                              setCustomZoneText('')
                            }
                          }}
                          onBlur={() => {
                            if (customZoneText.trim()) {
                              handleAddCustomZone()
                            } else {
                              setShowCustomZoneInput(false)
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

            </div>
          )}

          {/* ========== 区域四：辅助尝试 - iOS风格列表 ========== */}
          <div className="space-y-3 pt-4">
            <h2 className="font-bold text-sm text-white/70">其他尝试</h2>
            
            {/* iOS风格容器 */}
            <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 divide-y divide-white/5 overflow-hidden">
              
              {/* 第1行：已询问相关人员 - 常驻 */}
              <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👥</span>
                  <span className="text-sm">已询问相关人员（同事/家人）</span>
                </div>
                <button
                  onClick={() => setAskedOthers(!askedOthers)}
                  className={`
                    relative w-12 h-7 rounded-full transition-all duration-300
                    ${askedOthers ? 'bg-[var(--cyber-green)] shadow-[0_0_15px_rgba(0,255,157,0.4)]' : 'bg-white/20'}
                  `}
                >
                  <div 
                    className={`
                      absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg
                      transition-all duration-300
                      ${askedOthers ? 'left-6' : 'left-1'}
                    `}
                  />
                </button>
              </div>

              {/* 第2行：智能设备功能 - 条件触发 */}
              {smartFeatureConfig.show && (
                <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{smartFeatureConfig.icon}</span>
                    <span className="text-sm">{smartFeatureConfig.text}</span>
                  </div>
                  <button
                    onClick={() => setTriedSmartFeature(!triedSmartFeature)}
                    className={`
                      relative w-12 h-7 rounded-full transition-all duration-300
                      ${triedSmartFeature ? 'bg-[var(--cyber-green)] shadow-[0_0_15px_rgba(0,255,157,0.4)]' : 'bg-white/20'}
                    `}
                  >
                    <div 
                      className={`
                        absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg
                        transition-all duration-300
                        ${triedSmartFeature ? 'left-6' : 'left-1'}
                      `}
                    />
                  </button>
                </div>
              )}

            </div>

            {/* 说明文字 */}
            <p className="text-xs text-white/40 px-2">
              💡 开关<span className="text-[var(--cyber-green)] mx-1">开启</span>表示"已尝试过"，AI将不再建议；<span className="text-white/50 mx-1">关闭</span>表示"未尝试"，AI将为您提供相关建议
            </p>
          </div>

          {/* AI提示框 */}
          <div className="p-4 rounded-xl bg-[#2DE1FC]/5 backdrop-blur-lg border border-[#2DE1FC]/25">
            <p className="text-xs text-white/70">
              <span className="font-bold text-[#2DE1FC]">💡 AI 提示：</span>
              <span className="ml-2">
                了解您已经排查过的区域，可以帮助我们避免重复建议，并聚焦于那些容易被忽视的"视觉和记忆盲区"
              </span>
            </p>
          </div>

          {/* 底部按钮 */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <button
              onClick={handleNext}
              className="btn-scifi-primary"
            >
              开始 AI 分析
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
