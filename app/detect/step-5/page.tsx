"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Search, Plus, Phone, Users, X, Check, CheckCircle2 } from "lucide-react"
import { Header } from "@/components/shared/header"
import { useSearchStore } from "@/lib/store"
import { searchDurationOptions, locationCategories } from "@/lib/data"
import { InteractiveFog } from "@/components/ui/interactive-fog"

export default function Step5Page() {
  const router = useRouter()
  const { session, updateSession } = useSearchStore()
  
  const [hasSearched, setHasSearched] = useState(session.hasSearched)
  const [searchedLocations, setSearchedLocations] = useState<string[]>(session.searchedLocations)
  const [customSearchedLocations, setCustomSearchedLocations] = useState<string[]>(session.searchedCustomLocations)
  const [newCustomLocation, setNewCustomLocation] = useState('')
  const [searchDuration, setSearchDuration] = useState(session.searchDuration)
  const [askedOthers, setAskedOthers] = useState(session.askedOthers)
  const [triedFindMy, setTriedFindMy] = useState(session.triedFindMy)

  const relevantLocations = locationCategories
    .find(c => c.id === session.locationCategory)
    ?.subLocations.filter(l => !l.id.includes('other')) || []

  const supportsFindMy = ['phone', 'airpods', 'tablet', 'laptop', 'watch'].includes(session.itemType)

  const handleToggleLocation = (locationId: string) => {
    if (searchedLocations.includes(locationId)) {
      setSearchedLocations(searchedLocations.filter(l => l !== locationId))
    } else {
      setSearchedLocations([...searchedLocations, locationId])
    }
  }

  const handleAddCustomLocation = () => {
    if (newCustomLocation.trim() && !customSearchedLocations.includes(newCustomLocation.trim())) {
      setCustomSearchedLocations([...customSearchedLocations, newCustomLocation.trim()])
      setNewCustomLocation('')
    }
  }

  const handleRemoveCustomLocation = (location: string) => {
    setCustomSearchedLocations(customSearchedLocations.filter(l => l !== location))
  }

  const handleNext = () => {
    updateSession({
      hasSearched,
      searchedLocations,
      searchedCustomLocations: customSearchedLocations,
      searchDuration,
      askedOthers,
      triedFindMy,
    })
    router.push("/detect/loading")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* 星空背景 - 固定定位 */}
      <div className="fixed inset-0 z-0">
        <InteractiveFog color="34, 211, 238" />
      </div>
      
      <Header currentStep={6} showProgress />

      {/* 主容器 - 毛玻璃悬浮卡片 */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-4xl mx-auto scifi-container p-6 md:p-10 space-y-8">
          
          {/* 标题区 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">已排查信息</h1>
            <p className="text-base md:text-lg text-white/70">告诉我们你已经找过哪些地方，避免重复建议</p>
          </div>

          {/* 是否已搜索 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" style={{ color: 'var(--holo-blue)' }} />
              <h2 className="font-bold text-base">你已经找过了吗？</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: false, label: '刚发现丢了', icon: '🔍' },
                { value: true, label: '已经找过', icon: '✅' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => setHasSearched(option.value)}
                  className={`card-option ${hasSearched === option.value ? 'card-option-selected' : ''} relative`}
                >
                  {hasSearched === option.value && (
                    <div className="check-glow">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                  
                  <div className="text-center py-2">
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 搜索详情 */}
          {hasSearched && (
            <div className="space-y-6 animate-fade-in-up">
              {/* 搜索时长 */}
              <div className="space-y-4">
                <h2 className="font-bold text-base text-muted-foreground">找了多久了？</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {searchDurationOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSearchDuration(option.id)}
                      className={`chip ${searchDuration === option.id ? 'chip-selected' : ''}`}
                    >
                      {searchDuration === option.id && <Check className="w-3 h-3" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 已搜索位置 */}
              <div className="space-y-4">
                <h2 className="font-bold text-base text-muted-foreground">已经找过哪些地方？（可多选）</h2>
                
                {relevantLocations.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      基于你选择的「{locationCategories.find(c => c.id === session.locationCategory)?.label}」：
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relevantLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleToggleLocation(location.id)}
                          className={`chip ${searchedLocations.includes(location.id) ? 'chip-selected' : ''}`}
                        >
                          {searchedLocations.includes(location.id) && <Check className="w-3 h-3" />}
                          {location.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 自定义位置 */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <p className="text-xs text-muted-foreground">还找过其他地方？</p>
                  
                  {customSearchedLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customSearchedLocations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                          style={{
                            backgroundColor: 'rgba(0, 255, 157, 0.1)',
                            borderColor: 'var(--cyber-green)',
                            color: 'var(--cyber-green)',
                          }}
                        >
                          <span className="text-xs font-medium">{location}</span>
                          <button
                            onClick={() => handleRemoveCustomLocation(location)}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      placeholder="输入其他找过的地方..."
                      value={newCustomLocation}
                      onChange={(e) => setNewCustomLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCustomLocation()}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[var(--holo-blue)] focus:ring-2 focus:ring-[var(--holo-blue)]/20 transition-all"
                    />
                    <button
                      onClick={handleAddCustomLocation}
                      disabled={!newCustomLocation.trim()}
                      className="btn-scifi-secondary px-4 disabled:opacity-40"
                      style={{ width: 'auto', maxWidth: 'fit-content' }}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 其他尝试 */}
          <div className="space-y-6">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <h2 className="font-bold text-base text-muted-foreground">其他尝试</h2>

            {/* 是否问过他人 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">是否问过同住的人/同事？</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: false, label: '没有' },
                  { value: true, label: '问过了' },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    onClick={() => setAskedOthers(option.value)}
                    className={`chip ${askedOthers === option.value ? 'chip-selected' : ''}`}
                  >
                    {askedOthers === option.value && <Check className="w-3 h-3" />}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 查找功能 */}
            {supportsFindMy && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">是否尝试过"查找"功能？</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: false, label: '没有' },
                    { value: true, label: '试过了' },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      onClick={() => setTriedFindMy(option.value)}
                      className={`chip ${triedFindMy === option.value ? 'chip-selected' : ''}`}
                    >
                      {triedFindMy === option.value && <Check className="w-3 h-3" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 提示框 */}
          <div className="p-4 rounded-xl border-2"
               style={{
                 backgroundColor: 'rgba(45, 225, 252, 0.08)',
                 borderColor: 'var(--holo-blue)',
               }}>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium" style={{ color: 'var(--holo-blue)' }}>💡 AI 提示：</span>
              <br />
              了解你已经排查过的区域，可以帮助我们避免重复建议，并聚焦于那些容易被忽视的"视觉和记忆盲区"。
            </p>
          </div>

          {/* 底部按钮 */}
          <div className="flex flex-col items-center gap-4 pt-6">
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
