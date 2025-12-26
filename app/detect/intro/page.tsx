"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

// 镜头配置 - 深空记忆聚集
const SCENES = [
  {
    id: 1,
    text: "请深呼吸，让情绪平静下来",
    startTime: 0,
    endTime: 4500,
    animation: "deepBreath",
    particles: 80,
  },
  {
    id: 2,
    text: "现在，回忆一下...回到你丢失物品时的场景",
    startTime: 4500,
    endTime: 9000,
    animation: "cosmicJourney",
    particles: 120,
  },
  {
    id: 3,
    text: "是在什么场所丢失的？当时周围的环境空间是怎么样的？",
    startTime: 9000,
    endTime: 13500,
    animation: "spatialEcho",
    particles: 100,
  },
  {
    id: 4,
    text: "周围有哪些人和事呢？",
    startTime: 13500,
    endTime: 18000,
    animation: "stardustBurst",
    particles: 200,
  },
]

export default function IntroPage() {
  const router = useRouter()
  const [currentScene, setCurrentScene] = useState(0)
  const [visibleScenes, setVisibleScenes] = useState<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 粒子系统
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      life: number
      targetX?: number
      targetY?: number
    }> = []

    // 创建粒子
    const createParticles = (count: number, scene: number) => {
      particles.length = 0
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < count; i++) {
        if (scene === 4) {
          // 镜头4：从中心聚集
          particles.push({
            x: centerX + (Math.random() - 0.5) * 50,
            y: centerY + (Math.random() - 0.5) * 50,
            vx: 0,
            vy: 0,
            size: Math.random() * 2 + 1,
            opacity: 1,
            life: 1,
          })
        } else {
          // 其他镜头：从边缘聚集
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * 500 + 200
          particles.push({
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            vx: -Math.cos(angle) * 2,
            vy: -Math.sin(angle) * 2,
            size: Math.random() * 2 + 0.5,
            opacity: 0,
            life: 0,
          })
        }
      }
    }

    // 绘制粒子
    const drawParticles = (sceneId: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // 粒子生命周期
        if (sceneId === 4 && particle.life > 0.5) {
          // 镜头4：炸裂效果
          const angle = (index / particles.length) * Math.PI * 2
          particle.vx = Math.cos(angle) * 8
          particle.vy = Math.sin(angle) * 8
          particle.life -= 0.015
        } else if (particle.life < 1) {
          particle.life += 0.02
        }

        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.95
        particle.vy *= 0.95

        // 计算透明度
        particle.opacity = Math.min(particle.life, 1 - particle.life) * 0.8

        // 绘制粒子（带辉光）
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, `rgba(56, 189, 248, ${particle.opacity})`)
        gradient.addColorStop(0.5, `rgba(45, 225, 252, ${particle.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(56, 189, 248, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // 核心亮点
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    let animationId: number
    const animate = () => {
      if (visibleScenes.length > 0) {
        drawParticles(visibleScenes[visibleScenes.length - 1])
      }
      animationId = requestAnimationFrame(animate)
    }

    // 监听场景变化，创建新粒子
    if (currentScene > 0) {
      const scene = SCENES[currentScene - 1]
      createParticles(scene.particles, scene.id)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [currentScene, visibleScenes])

  // 镜头切换逻辑
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    SCENES.forEach((scene, index) => {
      const showTimer = setTimeout(() => {
        setVisibleScenes(prev => [...prev, scene.id])
        setCurrentScene(index + 1)
      }, scene.startTime)
      timers.push(showTimer)

      const hideTimer = setTimeout(() => {
        setVisibleScenes(prev => prev.filter(id => id !== scene.id))
      }, scene.endTime)
      timers.push(hideTimer)
    })

    const finalTimer = setTimeout(() => {
      router.push('/detect/step-0')
    }, 18500)
    timers.push(finalTimer)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* 深空背景 - 多层星云 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-blue-950/20 to-black" />
      
      {/* 星云层1 - 远景 */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] animate-nebula-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] animate-nebula-2" />
      </div>

      {/* 星云层2 - 中景 */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-cyan-400/30 rounded-full blur-[80px] animate-nebula-3" />
      </div>

      {/* 粒子画布 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* 镜头容器 - 3D透视 */}
      <div className="relative z-20 w-full max-w-5xl px-6 perspective-2000">
        {SCENES.map((scene) => (
          <div
            key={scene.id}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
              visibleScenes.includes(scene.id) ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className={`text-center px-8 scene-${scene.animation}`}
              style={{
                animation: visibleScenes.includes(scene.id)
                  ? `${scene.animation} ${(scene.endTime - scene.startTime) / 1000}s ease-out forwards`
                  : 'none',
              }}
            >
              <h1 className={`text-4xl md:text-5xl lg:text-7xl font-bold leading-relaxed tracking-wide ${
                scene.id === 4 ? 'text-cyan-300' : 'text-white'
              }`}>
                {scene.text}
              </h1>

              {/* 镜头1：呼吸圆环 */}
              {scene.id === 1 && visibleScenes.includes(scene.id) && (
                <div className="mt-12 flex justify-center">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-breath-ring-1" />
                    <div className="absolute inset-2 rounded-full border-2 border-cyan-400/50 animate-breath-ring-2" />
                    <div className="absolute inset-4 rounded-full bg-cyan-400/20 animate-breath-core" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 光学镜头光晕（模拟相机景深） */}
      {currentScene === 4 && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute inset-0 bg-gradient-radial from-cyan-300/10 via-transparent to-transparent animate-lens-flare" />
          </div>
        </div>
      )}

      {/* 进度指示 - 量子点 */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {SCENES.map((scene, index) => (
          <div
            key={scene.id}
            className="relative"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index < currentScene 
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(45,225,252,0.8)]' 
                  : 'bg-white/20'
              }`}
            />
            {index < currentScene && (
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>
        ))}
      </div>

      {/* 跳过按钮 - 玻璃态 */}
      <button
        onClick={() => router.push('/detect/step-0')}
        className="absolute top-8 right-8 z-40 group"
      >
        <div className="px-6 py-2.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10 
                      hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300
                      shadow-lg hover:shadow-cyan-400/20">
          <span className="text-sm text-white/60 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
            跳过
            <span className="text-xs">→</span>
          </span>
        </div>
      </button>

      {/* 扫描线效果（可选） */}
      <div className="absolute inset-0 z-5 pointer-events-none opacity-5">
        <div className="scan-line-vertical" />
      </div>
    </div>
  )
}

