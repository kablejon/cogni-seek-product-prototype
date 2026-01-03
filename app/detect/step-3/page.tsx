"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Check, X } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { InteractiveFog } from "@/components/ui/interactive-fog"

// 全息玻璃图标组件
function HoloHomeIcon({ isSelected }: { isSelected: boolean }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className={`transition-all duration-500 ${isSelected ? 'drop-shadow-[0_0_15px_rgba(45,225,252,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`}>
      <defs>
        <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? 'rgba(45,225,252,0.6)' : 'rgba(255,255,255,0.4)'} />
          <stop offset="100%" stopColor={isSelected ? 'rgba(45,225,252,0.2)' : 'rgba(255,255,255,0.1)'} />
        </linearGradient>
        <linearGradient id="homeWarmLight" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? 'rgba(255,200,100,0.8)' : 'rgba(255,200,100,0.4)'} />
          <stop offset="100%" stopColor="rgba(255,150,50,0.2)" />
        </linearGradient>
      </defs>
      {/* 房屋主体 */}
      <path 
        d="M28 8 L48 24 L48 48 L8 48 L8 24 Z" 
        fill="url(#homeGradient)"
        stroke={isSelected ? 'rgba(45,225,252,0.8)' : 'rgba(255,255,255,0.3)'}
        strokeWidth="1.5"
      />
      {/* 屋顶 */}
      <path 
        d="M28 8 L48 24 L8 24 Z" 
        fill={isSelected ? 'rgba(45,225,252,0.4)' : 'rgba(255,255,255,0.25)'}
        stroke={isSelected ? 'rgba(45,225,252,0.9)' : 'rgba(255,255,255,0.4)'}
        strokeWidth="1"
      />
      {/* 窗户 - 暖光 */}
      <rect x="18" y="30" width="8" height="10" rx="1" fill="url(#homeWarmLight)" />
      <rect x="30" y="30" width="8" height="10" rx="1" fill="url(#homeWarmLight)" />
      {/* 门 */}
      <rect x="23" y="36" width="10" height="12" rx="1" fill={isSelected ? 'rgba(45,225,252,0.5)' : 'rgba(255,255,255,0.2)'} />
      {/* 烟囱 */}
      <rect x="38" y="12" width="5" height="10" rx="1" fill={isSelected ? 'rgba(45,225,252,0.3)' : 'rgba(255,255,255,0.15)'} />
    </svg>
  )
}

function HoloBuildingIcon({ isSelected }: { isSelected: boolean }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className={`transition-all duration-500 ${isSelected ? 'drop-shadow-[0_0_15px_rgba(45,225,252,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`}>
      <defs>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? 'rgba(45,225,252,0.5)' : 'rgba(255,255,255,0.35)'} />
          <stop offset="100%" stopColor={isSelected ? 'rgba(45,225,252,0.15)' : 'rgba(255,255,255,0.08)'} />
        </linearGradient>
      </defs>
      {/* 主楼 */}
      <rect x="16" y="12" width="18" height="40" rx="2" fill="url(#buildingGradient)" stroke={isSelected ? 'rgba(45,225,252,0.8)' : 'rgba(255,255,255,0.3)'} strokeWidth="1.5" />
      {/* 副楼 */}
      <rect x="36" y="24" width="12" height="28" rx="2" fill={isSelected ? 'rgba(45,225,252,0.35)' : 'rgba(255,255,255,0.2)'} stroke={isSelected ? 'rgba(45,225,252,0.6)' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
      {/* 窗户网格 - 主楼 */}
      {[0, 1, 2, 3].map((row) => (
        [0, 1].map((col) => (
          <rect 
            key={`main-${row}-${col}`}
            x={20 + col * 6} 
            y={16 + row * 9} 
            width="4" 
            height="6" 
            rx="0.5"
            fill={isSelected ? 'rgba(45,225,252,0.6)' : 'rgba(255,255,255,0.3)'}
          />
        ))
      ))}
      {/* 窗户 - 副楼 */}
      {[0, 1, 2].map((row) => (
        <rect 
          key={`sub-${row}`}
          x={40} 
          y={28 + row * 8} 
          width="4" 
          height="5" 
          rx="0.5"
          fill={isSelected ? 'rgba(45,225,252,0.5)' : 'rgba(255,255,255,0.25)'}
        />
      ))}
      {/* 天线 */}
      <line x1="25" y1="12" x2="25" y2="6" stroke={isSelected ? 'rgba(45,225,252,0.8)' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
      <circle cx="25" cy="5" r="2" fill={isSelected ? 'rgba(45,225,252,0.9)' : 'rgba(255,255,255,0.5)'} />
    </svg>
  )
}

function HoloTransitIcon({ isSelected }: { isSelected: boolean }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className={`transition-all duration-500 ${isSelected ? 'drop-shadow-[0_0_15px_rgba(45,225,252,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`}>
      <defs>
        <linearGradient id="transitGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={isSelected ? 'rgba(45,225,252,0.6)' : 'rgba(255,255,255,0.4)'} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* 流光轨迹 */}
      <path 
        d="M6 36 Q20 28, 28 32 Q36 36, 50 28" 
        fill="none" 
        stroke="url(#transitGradient)" 
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={isSelected ? "none" : "6 4"}
      />
      {/* 车辆流线体 */}
      <ellipse 
        cx="28" cy="32" rx="14" ry="8" 
        fill={isSelected ? 'rgba(45,225,252,0.35)' : 'rgba(255,255,255,0.2)'}
        stroke={isSelected ? 'rgba(45,225,252,0.8)' : 'rgba(255,255,255,0.4)'}
        strokeWidth="1.5"
      />
      {/* 车窗 */}
      <ellipse 
        cx="28" cy="30" rx="8" ry="4" 
        fill={isSelected ? 'rgba(45,225,252,0.5)' : 'rgba(255,255,255,0.3)'}
      />
      {/* 尾迹粒子 */}
      <circle cx="10" cy="35" r="2" fill={isSelected ? 'rgba(45,225,252,0.6)' : 'rgba(255,255,255,0.3)'} />
      <circle cx="14" cy="33" r="1.5" fill={isSelected ? 'rgba(45,225,252,0.5)' : 'rgba(255,255,255,0.25)'} />
      <circle cx="18" cy="31" r="1" fill={isSelected ? 'rgba(45,225,252,0.4)' : 'rgba(255,255,255,0.2)'} />
      {/* 前方光点 */}
      <circle cx="44" cy="30" r="2" fill={isSelected ? 'rgba(45,225,252,0.8)' : 'rgba(255,255,255,0.4)'} />
      <circle cx="48" cy="29" r="1" fill={isSelected ? 'rgba(45,225,252,0.6)' : 'rgba(255,255,255,0.3)'} />
    </svg>
  )
}

function HoloOutdoorIcon({ isSelected }: { isSelected: boolean }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className={`transition-all duration-500 ${isSelected ? 'drop-shadow-[0_0_15px_rgba(45,225,252,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`}>
      <defs>
        <linearGradient id="pinGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={isSelected ? 'rgba(45,225,252,0.8)' : 'rgba(255,255,255,0.5)'} />
          <stop offset="100%" stopColor={isSelected ? 'rgba(45,225,252,0.3)' : 'rgba(255,255,255,0.15)'} />
        </linearGradient>
      </defs>
      {/* 网格地面 */}
      <path 
        d="M4 44 L28 52 L52 44" 
        fill="none" 
        stroke={isSelected ? 'rgba(45,225,252,0.4)' : 'rgba(255,255,255,0.2)'}
        strokeWidth="1"
      />
      <path 
        d="M10 42 L28 48 L46 42" 
        fill="none" 
        stroke={isSelected ? 'rgba(45,225,252,0.3)' : 'rgba(255,255,255,0.15)'}
        strokeWidth="1"
      />
      {/* 纵向网格线 */}
      <line x1="20" y1="40" x2="20" y2="50" stroke={isSelected ? 'rgba(45,225,252,0.25)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
      <line x1="28" y1="38" x2="28" y2="52" stroke={isSelected ? 'rgba(45,225,252,0.3)' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
      <line x1="36" y1="40" x2="36" y2="50" stroke={isSelected ? 'rgba(45,225,252,0.25)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
      {/* 地图图钉 */}
      <path 
        d="M28 6 C20 6 14 12 14 20 C14 30 28 40 28 40 C28 40 42 30 42 20 C42 12 36 6 28 6 Z" 
        fill="url(#pinGradient)"
        stroke={isSelected ? 'rgba(45,225,252,0.9)' : 'rgba(255,255,255,0.4)'}
        strokeWidth="1.5"
      />
      {/* 图钉中心点 */}
      <circle cx="28" cy="20" r="6" fill={isSelected ? 'rgba(45,225,252,0.6)' : 'rgba(255,255,255,0.3)'} />
      <circle cx="28" cy="20" r="3" fill={isSelected ? '#2DE1FC' : 'rgba(255,255,255,0.6)'} />
    </svg>
  )
}

// 主场景卡片配置
const SCENE_CARDS = [
  { 
    id: 'home', 
    IconComponent: HoloHomeIcon,
    label: '家里', 
    desc: '住所、房间',
    subAreas: ['客厅', '卧室', '厨房', '卫生间', '玄关/门口', '阳台', '书房'],
    placeholder: '例如：沙发缝隙里、床头柜上、洗衣机里...'
  },
  { 
    id: 'work', 
    IconComponent: HoloBuildingIcon,
    label: '公司/学校', 
    desc: '工作/学习场所',
    subAreas: ['办公桌', '会议室', '茶水间', '洗手间', '食堂', '休息区', '停车场', '教室'],
    placeholder: '例如：前台桌面上、老王办公位旁、3号会议室白板前...'
  },
  { 
    id: 'transit', 
    IconComponent: HoloTransitIcon,
    label: '车/通勤路上', 
    desc: '交通工具',
    subAreasGrouped: {
      '私有空间': ['车内座位', '后备箱', '车门侧袋'],
      '公共流动': ['地铁/公交', '出租车/网约车', '路边', '加油站', '停车场']
    },
    subAreas: ['车内座位', '后备箱', '车门侧袋', '地铁/公交', '出租车/网约车', '路边', '加油站', '停车场'],
    placeholder: '例如：网约车后座缝隙、地铁1号线车厢连接处...'
  },
  { 
    id: 'public', 
    IconComponent: HoloOutdoorIcon,
    label: '户外/公共场所', 
    desc: '商场、餐厅等',
    subAreas: ['商场/超市', '餐厅', '咖啡厅', '健身房', '公园', '医院', '银行'],
    placeholder: '例如：公园长椅下、收银台旁边、试衣间...'
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
  
  // 自定义区域管理（按场景+分组隔离）
  const [customAreasBySceneAndGroup, setCustomAreasBySceneAndGroup] = useState<Record<string, Record<string, string[]>>>({})
  const [showCustomAreaInput, setShowCustomAreaInput] = useState<string | false>(false) // 存储当前正在输入的分组名
  const [customAreaText, setCustomAreaText] = useState('')
  
  // 获取指定场景和分组的自定义区域
  const getCustomAreasForGroup = (groupName: string) => {
    return customAreasBySceneAndGroup[selectedScene]?.[groupName] || []
  }

  const currentScene = SCENE_CARDS.find(s => s.id === selectedScene)

  // 获取缺少的必填项提示（按优先级）
  const getMissingRequirement = (): string | null => {
    if (!selectedScene) {
      return "请选择一个场景"
    }
    if (selectedSubAreas.length === 0) {
      return "请至少选择一个具体区域"
    }
    return null
  }

  const handleSceneSelect = (sceneId: string) => {
    setSelectedScene(sceneId)
    if (sceneId !== selectedScene) {
      setSelectedSubAreas([])
      setShowCustomAreaInput(false)
      setCustomAreaText('')
    }
  }

  const handleSubAreaToggle = (area: string) => {
    if (selectedSubAreas.includes(area)) {
      setSelectedSubAreas(selectedSubAreas.filter(a => a !== area))
    } else {
      setSelectedSubAreas([...selectedSubAreas, area])
    }
  }

  // 添加自定义区域（按当前场景和分组）
  const addCustomArea = (groupName: string) => {
    if (customAreaText.trim() && selectedScene) {
      const newArea = customAreaText.trim()
      const sceneData = customAreasBySceneAndGroup[selectedScene] || {}
      const currentGroupAreas = sceneData[groupName] || []
      
      setCustomAreasBySceneAndGroup({
        ...customAreasBySceneAndGroup,
        [selectedScene]: {
          ...sceneData,
          [groupName]: [...currentGroupAreas, newArea]
        }
      })
      
      // 自动选中新添加的区域
      setSelectedSubAreas([...selectedSubAreas, newArea])
      setCustomAreaText('')
      setShowCustomAreaInput(false)
    }
  }

  // 删除自定义区域
  const removeCustomArea = (area: string, groupName: string) => {
    if (selectedScene) {
      const sceneData = customAreasBySceneAndGroup[selectedScene] || {}
      const currentGroupAreas = sceneData[groupName] || []
      
      setCustomAreasBySceneAndGroup({
        ...customAreasBySceneAndGroup,
        [selectedScene]: {
          ...sceneData,
          [groupName]: currentGroupAreas.filter(a => a !== area)
        }
      })
      
      // 同时从选中列表中移除
      setSelectedSubAreas(selectedSubAreas.filter(a => a !== area))
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

          {/* 场景大卡片 - 全息玻璃风格 */}
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-bold text-white/90">选择场景</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {SCENE_CARDS.map((scene, index) => {
                const isSelected = selectedScene === scene.id
                const IconComponent = scene.IconComponent
                
                return (
                  <button
                    key={scene.id}
                    onClick={() => handleSceneSelect(scene.id)}
                    className={`group relative rounded-2xl transition-all duration-400 overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[var(--cyber-green)]/20 to-[var(--holo-blue)]/10 border-2 border-[var(--cyber-green)]/60 shadow-[0_0_30px_rgba(45,225,252,0.25),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                        : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.1] hover:from-white/[0.08] hover:to-white/[0.04] hover:border-white/20'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--cyber-green)] flex items-center justify-center shadow-[0_0_12px_rgba(45,225,252,0.8)]">
                        <Check className="w-3.5 h-3.5 text-black" />
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-3 py-6 px-4">
                      <div className={`transition-all duration-400 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                        <IconComponent isSelected={isSelected} />
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold text-sm transition-colors duration-300 ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                          {scene.label}
                        </div>
                        <div className={`text-xs mt-1 transition-colors duration-300 ${isSelected ? 'text-white/60' : 'text-white/40 group-hover:text-white/50'}`}>
                          {scene.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 路径补全 - 磨砂玻璃容器 */}
          {selectedScene && currentScene && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--cyber-green)]/30 to-transparent" />

              {/* 磨砂玻璃容器 */}
              <div className="relative rounded-3xl overflow-hidden">
                {/* 背景 - 深色玻璃 */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />
                {/* 边框发光 */}
                <div className="absolute inset-0 rounded-3xl border border-[var(--cyber-green)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" />
                
                <div className="relative p-6 space-y-5">
                  {/* 标题行 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cyber-green)]/20 to-[var(--holo-blue)]/10 border border-[var(--cyber-green)]/30 flex items-center justify-center">
                      <currentScene.IconComponent isSelected={true} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">
                        你在 <span className="text-[var(--cyber-green)]">{currentScene.label}</span> 的具体区域？
                      </h3>
                      <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-green)] shadow-[0_0_6px_rgba(45,225,252,0.8)]" />
                        勾选您停留过的区域，协助AI完整重构行动轨迹与视觉盲区
                      </p>
                    </div>
                  </div>

                  {/* 标签云 - 分组显示 (仅车/通勤路上) */}
                  {'subAreasGrouped' in currentScene && currentScene.subAreasGrouped ? (
                    <div className="space-y-4">
                      {Object.entries(currentScene.subAreasGrouped).map(([groupName, areas], groupIndex, allGroups) => (
                        <div key={groupName} className="space-y-2">
                          <div className="text-[10px] text-white/30 font-medium tracking-wider uppercase pl-1">
                            [ {groupName} ]
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {/* 预设区域 */}
                            {areas.map((area) => {
                              const isAreaSelected = selectedSubAreas.includes(area)
                              return (
                                <button
                                  key={area}
                                  onClick={() => handleSubAreaToggle(area)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    isAreaSelected 
                                      ? 'bg-transparent border-2 border-[var(--cyber-green)] text-[var(--cyber-green)] shadow-[0_0_15px_rgba(45,225,252,0.3),inset_0_0_10px_rgba(45,225,252,0.1)]' 
                                      : 'bg-white/[0.03] border border-white/10 text-white/60 hover:bg-white/[0.06] hover:border-white/20 hover:text-white/80'
                                  }`}
                                >
                                  {isAreaSelected && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                                  {area}
                                </button>
                              )
                            })}
                            
                            {/* 自定义区域（每个分组显示自己的） */}
                            {getCustomAreasForGroup(groupName).map((area, idx) => {
                              const isAreaSelected = selectedSubAreas.includes(area)
                              return (
                                <button
                                  key={`custom_${groupName}_${idx}`}
                                  onClick={() => handleSubAreaToggle(area)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group ${
                                    isAreaSelected 
                                      ? 'bg-transparent border-2 border-[var(--cyber-green)] text-[var(--cyber-green)] shadow-[0_0_15px_rgba(45,225,252,0.3),inset_0_0_10px_rgba(45,225,252,0.1)]' 
                                      : 'bg-white/[0.03] border border-white/10 text-white/60 hover:bg-white/[0.06] hover:border-white/20 hover:text-white/80'
                                  }`}
                                >
                                  {isAreaSelected && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                                  <span>{area}</span>
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeCustomArea(area, groupName)
                                    }}
                                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-400 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </span>
                                </button>
                              )
                            })}
                            
                            {/* + 其他按钮/输入框（每个分组都显示） */}
                            {showCustomAreaInput !== groupName ? (
                              <button
                                onClick={() => setShowCustomAreaInput(groupName)}
                                className="px-4 py-2 rounded-full text-sm font-medium border-2 border-dashed border-white/30 text-white/60 hover:border-[var(--cyber-green)]/50 hover:text-white/80 transition-all"
                              >
                                <span className="text-base mr-1">+</span>其他
                              </button>
                            ) : (
                              <input
                                type="text"
                                value={customAreaText}
                                onChange={(e) => setCustomAreaText(e.target.value)}
                                placeholder="输入区域..."
                                autoFocus
                                className="px-4 py-2 rounded-full text-sm bg-[var(--cyber-green)]/10 border-2 border-[var(--cyber-green)] focus:outline-none w-32 placeholder:text-white/40"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') addCustomArea(groupName)
                                  if (e.key === 'Escape') {
                                    setShowCustomAreaInput(false)
                                    setCustomAreaText('')
                                  }
                                }}
                                onBlur={() => {
                                  if (customAreaText.trim()) {
                                    addCustomArea(groupName)
                                  } else {
                                    setShowCustomAreaInput(false)
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* 标签云 - 普通显示 */
                    <div className="flex flex-wrap gap-2">
                      {/* 预设区域 */}
                      {currentScene.subAreas.map((area) => {
                        const isAreaSelected = selectedSubAreas.includes(area)
                        return (
                          <button
                            key={area}
                            onClick={() => handleSubAreaToggle(area)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                              isAreaSelected 
                                ? 'bg-transparent border-2 border-[var(--cyber-green)] text-[var(--cyber-green)] shadow-[0_0_15px_rgba(45,225,252,0.3),inset_0_0_10px_rgba(45,225,252,0.1)]' 
                                : 'bg-white/[0.03] border border-white/10 text-white/60 hover:bg-white/[0.06] hover:border-white/20 hover:text-white/80'
                            }`}
                          >
                            {isAreaSelected && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                            {area}
                          </button>
                        )
                      })}
                      
                      {/* 自定义区域 */}
                      {getCustomAreasForGroup('default').map((area, idx) => {
                        const isAreaSelected = selectedSubAreas.includes(area)
                        return (
                          <button
                            key={`custom_default_${idx}`}
                            onClick={() => handleSubAreaToggle(area)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group ${
                              isAreaSelected 
                                ? 'bg-transparent border-2 border-[var(--cyber-green)] text-[var(--cyber-green)] shadow-[0_0_15px_rgba(45,225,252,0.3),inset_0_0_10px_rgba(45,225,252,0.1)]' 
                                : 'bg-white/[0.03] border border-white/10 text-white/60 hover:bg-white/[0.06] hover:border-white/20 hover:text-white/80'
                            }`}
                          >
                            {isAreaSelected && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                            <span>{area}</span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation()
                                removeCustomArea(area, 'default')
                              }}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-400 cursor-pointer"
                            >
                              ×
                            </span>
                          </button>
                        )
                      })}
                      
                      {/* + 其他按钮/输入框 */}
                      {showCustomAreaInput !== 'default' ? (
                        <button
                          onClick={() => setShowCustomAreaInput('default')}
                          className="px-4 py-2 rounded-full text-sm font-medium border-2 border-dashed border-white/30 text-white/60 hover:border-[var(--cyber-green)]/50 hover:text-white/80 transition-all"
                        >
                          <span className="text-base mr-1">+</span>其他
                        </button>
                      ) : (
                        <input
                          type="text"
                          value={customAreaText}
                          onChange={(e) => setCustomAreaText(e.target.value)}
                          placeholder="输入区域..."
                          autoFocus
                          className="px-4 py-2 rounded-full text-sm bg-[var(--cyber-green)]/10 border-2 border-[var(--cyber-green)] focus:outline-none w-32 placeholder:text-white/40"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addCustomArea('default')
                            if (e.key === 'Escape') {
                              setShowCustomAreaInput(false)
                              setCustomAreaText('')
                            }
                          }}
                          onBlur={() => {
                            if (customAreaText.trim()) {
                              addCustomArea('default')
                            } else {
                              setShowCustomAreaInput(false)
                            }
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* 已选择计数 */}
                  {selectedSubAreas.length > 0 && (
                    <div className="p-3 rounded-xl bg-[var(--cyber-green)]/5 border border-[var(--cyber-green)]/20">
                      <p className="text-sm text-center">
                        <span className="font-bold text-[var(--cyber-green)]">已选择 {selectedSubAreas.length} 个区域</span>
                        <span className="text-white/50 ml-2">
                          {selectedSubAreas.slice(0, 3).join('、')}
                          {selectedSubAreas.length > 3 && '...'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 智能追问输入框 - 动态提示语 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/40 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  还有其他特殊位置？（选填）
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder={currentScene.placeholder}
                    className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/10 text-sm text-white placeholder:text-white/25 focus:border-[var(--cyber-green)]/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(45,225,252,0.1)] transition-all duration-300"
                  />
                  {/* 底部发光线 */}
                  <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[var(--cyber-green)]/30 to-transparent" />
                </div>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex flex-col items-center gap-4 pt-6">
            {/* 主按钮容器 - 带hover提示 */}
            <div className="relative group/btn">
              <button
                onClick={handleNext}
                disabled={!selectedScene || selectedSubAreas.length === 0}
                className="btn-scifi-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                继续下一步
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* 缺少必填项提示 - 仅在禁用时显示 */}
              {(!selectedScene || selectedSubAreas.length === 0) && getMissingRequirement() && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-all duration-300 pointer-events-none z-50">
                  <div className="px-4 py-2 bg-gradient-to-r from-amber-500/95 to-orange-500/95 text-white text-sm font-medium rounded-xl whitespace-nowrap shadow-[0_4px_20px_rgba(245,158,11,0.4)] backdrop-blur-sm border border-amber-400/30">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {getMissingRequirement()}
                    </span>
                    {/* 箭头指向按钮 */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-amber-500/95 to-orange-500/95 rotate-45 border-r border-b border-amber-400/30" />
                  </div>
                </div>
              )}
            </div>
            
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
