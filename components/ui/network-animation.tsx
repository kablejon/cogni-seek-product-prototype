"use client"

import { useEffect, useRef, useMemo } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

interface NetworkAnimationProps {
  className?: string
  nodeCount?: number
  lineOpacity?: number
  nodeColor?: string
  lineColor?: string
}

export function NetworkAnimation({
  className = "",
  nodeCount = 50,
  lineOpacity = 0.15,
  nodeColor = "rgba(100, 150, 255, 0.6)",
  lineColor = "rgba(100, 150, 255, 0.2)",
}: NetworkAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])

  // Initialize nodes
  const initNodes = useMemo(() => {
    const nodes: Node[] = []
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }
    return nodes
  }, [nodeCount])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    nodesRef.current = [...initNodes]

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const nodes = nodesRef.current
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Update and draw nodes
      nodes.forEach((node) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > 100) node.vx *= -1
        if (node.y < 0 || node.y > 100) node.vy *= -1

        // Keep in bounds
        node.x = Math.max(0, Math.min(100, node.x))
        node.y = Math.max(0, Math.min(100, node.y))
      })

      // Draw lines from center
      nodes.forEach((node) => {
        const x = (node.x / 100) * rect.width
        const y = (node.y / 100) * rect.height
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2))
        const opacity = (1 - distance / maxDistance) * lineOpacity

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${opacity})`)
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Draw connections between nearby nodes
      nodes.forEach((nodeA, i) => {
        nodes.slice(i + 1).forEach((nodeB) => {
          const ax = (nodeA.x / 100) * rect.width
          const ay = (nodeA.y / 100) * rect.height
          const bx = (nodeB.x / 100) * rect.width
          const by = (nodeB.y / 100) * rect.height
          const distance = Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2))

          if (distance < 100) {
            const opacity = (1 - distance / 100) * lineOpacity * 0.5
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${opacity})`)
            ctx.lineWidth = 0.3
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        const x = (node.x / 100) * rect.width
        const y = (node.y / 100) * rect.height

        ctx.beginPath()
        ctx.arc(x, y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor.replace(/[\d.]+\)$/, `${node.opacity})`)
        ctx.fill()
      })

      // Draw center glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50)
      gradient.addColorStop(0, "rgba(100, 150, 255, 0.3)")
      gradient.addColorStop(1, "transparent")
      ctx.beginPath()
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      animationRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener("resize", resize)
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initNodes, lineOpacity, nodeColor, lineColor])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}


