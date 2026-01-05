"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  opacity: number
}

interface InteractiveFogProps {
  className?: string
  particleCount?: number
  color?: string
}

export function InteractiveFog({
  className = "",
  particleCount = 100,
  color = "100, 150, 255",
}: InteractiveFogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false })
  const lastMouseRef = useRef({ x: 0, y: 0 })

  const createParticle = useCallback((width: number, height: number, fromMouse = false): Particle => {
    const baseX = fromMouse ? mouseRef.current.x : Math.random() * width
    const baseY = fromMouse ? mouseRef.current.y : Math.random() * height
    
    return {
      x: baseX + (Math.random() - 0.5) * 50,
      y: baseY + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: 0,
      maxLife: 200 + Math.random() * 200,
      size: 50 + Math.random() * 100,
      opacity: 0.1 + Math.random() * 0.2,
    }
  }, [])

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

    // Initialize particles
    const initParticles = () => {
      const rect = canvas.getBoundingClientRect()
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(rect.width, rect.height)
        particle.life = Math.random() * particle.maxLife // Start at random life stages
        particlesRef.current.push(particle)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const newX = e.clientX - rect.left
      const newY = e.clientY - rect.top
      
      // Check if mouse actually moved
      const dx = newX - lastMouseRef.current.x
      const dy = newY - lastMouseRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      mouseRef.current = { x: newX, y: newY, isMoving: distance > 2 }
      lastMouseRef.current = { x: newX, y: newY }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isMoving = false
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      particles.forEach((particle, index) => {
        // Update life
        particle.life++
        
        // Reset particle if it's dead
        if (particle.life >= particle.maxLife) {
          particlesRef.current[index] = createParticle(rect.width, rect.height)
          return
        }

        // Mouse interaction - repel particles
        if (mouse.isMoving) {
          const dx = particle.x - mouse.x
          const dy = particle.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 3
            particle.vx += (dx / distance) * force
            particle.vy += (dy / distance) * force
          }
        }

        // Apply velocity with damping
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Add subtle drift
        particle.vx += (Math.random() - 0.5) * 0.1
        particle.vy += (Math.random() - 0.5) * 0.1

        // Wrap around edges
        if (particle.x < -particle.size) particle.x = rect.width + particle.size
        if (particle.x > rect.width + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = rect.height + particle.size
        if (particle.y > rect.height + particle.size) particle.y = -particle.size

        // Calculate opacity based on life
        const lifeRatio = particle.life / particle.maxLife
        let opacity = particle.opacity
        if (lifeRatio < 0.1) {
          opacity *= lifeRatio * 10 // Fade in
        } else if (lifeRatio > 0.9) {
          opacity *= (1 - lifeRatio) * 10 // Fade out
        }

        // Draw particle as gradient blob
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        )
        gradient.addColorStop(0, `rgba(${color}, ${opacity * 0.8})`)
        gradient.addColorStop(0.4, `rgba(${color}, ${opacity * 0.4})`)
        gradient.addColorStop(1, `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Draw center glow
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, rect.width / 2
      )
      centerGradient.addColorStop(0, `rgba(${color}, 0.15)`)
      centerGradient.addColorStop(0.5, `rgba(${color}, 0.05)`)
      centerGradient.addColorStop(1, "transparent")
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, rect.width / 2, 0, Math.PI * 2)
      ctx.fillStyle = centerGradient
      ctx.fill()

      animationRef.current = requestAnimationFrame(draw)
    }

    resize()
    initParticles()
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, color, createParticle])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full z-0 ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}

