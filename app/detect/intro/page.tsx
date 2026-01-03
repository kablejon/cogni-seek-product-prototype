"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchStore } from "@/lib/store"

export default function IntroPage() {
  const router = useRouter()
  const { resetSession } = useSearchStore()

  useEffect(() => {
    // 每次进入 intro 页面时，清空上一次的分析数据
    resetSession()
    
    // 18秒后自动跳转到下一步
    const timer = setTimeout(() => {
      router.push('/detect/step-0')
    }, 18000)

    return () => clearTimeout(timer)
  }, [router, resetSession])

  return (
    <div className="cinematic-intro-page">
      {/* 星尘粒子背景 */}
      <div className="stars" />

      {/* 电影镜头容器 */}
      <div className="cinematic-container">
        {/* 镜头1: 呼吸 (0s - 5s) - 平静 */}
        <div className="movie-text scene-1">
          请深呼吸
          <span>让情绪平静下来</span>
        </div>

        {/* 镜头2: 回忆穿越 (4.5s - 9.5s) - 唤起 */}
        <div className="movie-text scene-2">
          现在，回忆一下...
          <br />
          回到你丢失物品时的场景
        </div>

        {/* 镜头3: 环境追问 (9s - 14s) - 聚焦 */}
        <div className="movie-text scene-3">
          是在什么场所丢失的？
          <br />
          当时周围的环境空间是怎么样的？
        </div>

        {/* 镜头4: 最终聚焦与炸裂 (13.5s - 18s) - 释放 */}
        <div className="movie-text scene-4">
          周围有哪些人和事呢？
        </div>
      </div>

      {/* 跳过按钮 */}
      <button
        onClick={() => router.push('/detect/step-0')}
        className="skip-button"
      >
        <span>跳过 →</span>
      </button>
    </div>
  )
}

