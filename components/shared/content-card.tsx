"use client"

import { ReactNode } from "react"

interface ContentCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function ContentCard({ 
  children, 
  className = "", 
  hover = false,
  padding = 'md'
}: ContentCardProps) {
  const paddingClass = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }[padding]

  return (
    <div 
      className={`
        bg-card rounded-2xl border border-border/50 card-shadow
        ${hover ? 'transition-smooth hover:card-shadow-hover hover:border-border' : ''}
        ${paddingClass}
        ${className}
      `}
    >
      {children}
    </div>
  )
}















