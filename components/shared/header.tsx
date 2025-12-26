"use client"

import Link from "next/link"
import { useSearchStore } from "@/lib/store"

interface HeaderProps {
  currentStep?: number
  totalSteps?: number
  showProgress?: boolean
}

export function Header({ currentStep, totalSteps = 6, showProgress = false }: HeaderProps) {
  const { resetSession } = useSearchStore()

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group"
            onClick={() => resetSession()}
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-smooth group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold">CogniSeek</span>
          </Link>
          
          {showProgress && currentStep && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-smooth ${
                      i + 1 <= currentStep ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {currentStep}/{totalSteps}
              </span>
            </div>
          )}
        </div>
      </header>
      
      {showProgress && currentStep && (
        <div className="h-1 bg-border/50">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      )}
    </>
  )
}












