"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Search, Plus, Phone, Users, X, Check } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/shared"
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
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <InteractiveFog color="139, 92, 246" />
      <Header currentStep={5} showProgress />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">已排查信息</h1>
            <p className="text-muted-foreground text-lg">告诉我们你已经找过哪些地方，避免重复搜索</p>
          </div>

          {/* Has Searched */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label className="text-base">你已经找过了吗？</Label>
                  <p className="text-sm text-muted-foreground">了解你的搜索历史有助于优化建议</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { value: false, label: '刚发现丢了' },
                  { value: true, label: '已经找过' },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    onClick={() => setHasSearched(option.value)}
                    className={`px-4 py-2 rounded-xl text-sm transition-smooth border ${
                      hasSearched === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border/50 hover:border-border'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Details */}
          {hasSearched && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Duration */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-4">
                <Label className="text-base">找了多久了？</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {searchDurationOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSearchDuration(option.id)}
                      className={`p-3 rounded-xl text-sm text-center transition-smooth border ${
                        searchDuration === option.id
                          ? 'bg-primary text-primary-foreground border-primary font-medium'
                          : 'bg-background border-border/50 hover:border-border'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Searched Locations */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-4">
                <Label className="text-base">已经找过哪些地方？（可多选）</Label>
                
                {relevantLocations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      基于你选择的「{locationCategories.find(c => c.id === session.locationCategory)?.label}」：
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relevantLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleToggleLocation(location.id)}
                          className={`px-3 py-2 rounded-xl text-sm transition-smooth border flex items-center gap-2 ${
                            searchedLocations.includes(location.id)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border/50 hover:border-border'
                          }`}
                        >
                          {searchedLocations.includes(location.id) && <Check className="h-3 w-3" />}
                          {location.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">还找过其他地方？</p>
                  
                  {customSearchedLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customSearchedLocations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          <span>{location}</span>
                          <button
                            onClick={() => handleRemoveCustomLocation(location)}
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
                      placeholder="输入其他找过的地方..."
                      value={newCustomLocation}
                      onChange={(e) => setNewCustomLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCustomLocation()}
                      className="flex-1 rounded-xl"
                    />
                    <Button
                      variant="outline"
                      onClick={handleAddCustomLocation}
                      disabled={!newCustomLocation.trim()}
                      className="rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Actions */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 card-shadow space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <span className="text-xl">📋</span>
              <span className="font-semibold">其他尝试</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-base">是否问过同住的人/同事？</Label>
                  <p className="text-sm text-muted-foreground">他们可能看到或移动过物品</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { value: false, label: '没有' },
                  { value: true, label: '问过了' },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    onClick={() => setAskedOthers(option.value)}
                    className={`px-4 py-2 rounded-xl text-sm transition-smooth border ${
                      askedOthers === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border/50 hover:border-border'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {supportsFindMy && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base">是否尝试过"查找"功能？</Label>
                    <p className="text-sm text-muted-foreground">如响铃、定位等功能</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { value: false, label: '没有' },
                    { value: true, label: '试过了' },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      onClick={() => setTriedFindMy(option.value)}
                      className={`px-4 py-2 rounded-xl text-sm transition-smooth border ${
                        triedFindMy === option.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border/50 hover:border-border'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tip Box */}
          <div className="bg-chart-2/10 border border-chart-2/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-chart-2 font-medium">💡 提示：</span>
              了解你已经排查过的区域，可以帮助我们避免重复建议，并聚焦于那些容易被忽视的"视觉和记忆盲区"。
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link href="/detect/step-4">
                <ArrowLeft className="mr-2 h-5 w-5" /> 上一步
              </Link>
            </Button>
            <Button onClick={handleNext} size="lg" className="px-8 rounded-xl card-shadow">
              开始分析 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
