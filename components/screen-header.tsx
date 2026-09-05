"use client"

import { ArrowLeft, Volume2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { speak } from "@/lib/voice"

export function ScreenHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string
  subtitle?: string
  onBack?: () => void
}) {
  const { accessibility, language } = useStore()
  return (
    <header className="mb-5 flex items-start gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="pixel-btn flex h-12 w-12 shrink-0 items-center justify-center bg-card text-foreground"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.6} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-extrabold leading-tight text-foreground text-shadow-soft">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-base font-medium text-muted-foreground">{subtitle}</p>}
      </div>
      {accessibility.voiceGuidance && (
        <button
          type="button"
          onClick={() => speak(`${title}. ${subtitle ?? ""}`, language, true)}
          aria-label="Read aloud"
          className="pixel-btn flex h-12 w-12 shrink-0 items-center justify-center bg-secondary text-secondary-foreground"
        >
          <Volume2 className="h-6 w-6" strokeWidth={2.4} />
        </button>
      )}
    </header>
  )
}
