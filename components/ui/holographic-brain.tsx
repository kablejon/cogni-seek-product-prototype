"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface HolographicBrainProps {
  keywords?: string[]
  className?: string
}

export function HolographicBrain({ keywords = [], className = "" }: HolographicBrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const keywordIndexRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    // 初始化粒子
    const centerX = canvas.getBoundingClientRect().width / 2
    const centerY = canvas.getBoundingClientRect().height / 2

    // 创建球形粒子分布
    const createBrainParticles = () => {
      particlesRef.current = []
      const particleCount = 100
      const radius = 80

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        
        const x = centerX + radius * Math.sin(phi) * Math.cos(theta)
        const y = centerY + radius * Math.sin(phi) * Math.sin(theta) * 0.6 // 扁球形

        particlesRef.current.push({
          x: centerX,
          y: centerY,
          targetX: x,
          targetY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.5,
          color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.5})`
        })
      }
    }

    createBrainParticles()

    // 创建飞入的关键词粒子
    const createKeywordParticle = () => {
      if (keywords.length === 0) return

      const keyword = keywords[keywordIndexRef.current % keywords.length]
      keywordIndexRef.current++

      const rect = canvas.getBoundingClientRect()
      const angle = Math.random() * Math.PI * 2
      const distance = 300
      const startX = centerX + Math.cos(angle) * distance
      const startY = centerY + Math.sin(angle) * distance

      // 创建文字粒子群
      for (let i = 0; i < 10; i++) {
        particlesRef.current.push({
          x: startX + (Math.random() - 0.5) * 50,
          y: startY + (Math.random() - 0.5) * 50,
          targetX: centerX + (Math.random() - 0.5) * 20,
          targetY: centerY + (Math.random() - 0.5) * 20,
          vx: 0,
          vy: 0,
          size: Math.random() * 4 + 2,
          opacity: 1,
          color: `rgba(34, 211, 238, ${Math.random() * 0.3 + 0.7})`
        })
      }
    }

    // 关键词粒子定时生成
    const keywordInterval = setInterval(createKeywordParticle, 1500)

    // 动画循环
    let animationId: number
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // 更新和绘制粒子
      particlesRef.current.forEach((particle, index) => {
        // 向目标移动（弹性动画）
        const dx = particle.targetX - particle.x
        const dy = particle.targetY - particle.y
        particle.vx += dx * 0.02
        particle.vy += dy * 0.02
        particle.vx *= 0.9
        particle.vy *= 0.9

        particle.x += particle.vx
        particle.y += particle.vy

        // 轻微旋转运动
        const time = Date.now() * 0.001
        particle.x += Math.sin(time + index) * 0.5
        particle.y += Math.cos(time + index) * 0.5

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // 如果是飞入的粒子，到达中心后淡出并删除
        const distToCenter = Math.sqrt(dx * dx + dy * dy)
        if (distToCenter < 10 && particle.color.includes('34, 211, 238')) {
          particle.opacity -= 0.02
          if (particle.opacity <= 0) {
            particlesRef.current.splice(index, 1)
          }
        }
      })

      // 绘制连接线
      ctx.globalAlpha = 0.15
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      // 绘制中心光晕
      ctx.globalAlpha = 0.4
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)")
      gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.1)")
      gradient.addColorStop(1, "transparent")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      clearInterval(keywordInterval)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [keywords])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: "300px" }}
    />
  )
}









