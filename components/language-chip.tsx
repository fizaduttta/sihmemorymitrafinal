"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Languages } from "lucide-react"
import { useStore } from "@/lib/store"
import { LANGUAGES } from "@/lib/i18n"

/**
 * Compact language chip. Renders the current language's flag + native name.
 * Tap opens a small popover listing every locale.
 */
export function LanguageChip({ variant = "solid" }: { variant?: "solid" | "ghost" }) {
  const { language, setLanguage } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  return (
    <div className="relative" ref={ref} data-testid="language-chip">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-testid="language-chip-trigger"
        className={`pixel-btn flex items-center gap-1.5 px-3 py-1.5 text-sm font-extrabold ${
          variant === "solid"
            ? "bg-card text-foreground"
            : "border-transparent bg-transparent text-foreground/80 shadow-none"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Languages className="h-4 w-4 shrink-0" strokeWidth={2.4} />
        <span aria-hidden className="text-base leading-none">{current.flag}</span>
        <span className="max-w-[6.5rem] truncate">{current.native}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          data-testid="language-chip-menu"
          className="pixel-panel absolute right-0 top-full z-40 mt-2 w-64 max-h-[70dvh] overflow-y-auto bg-card p-2"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={language === lang.code}
              data-testid={`chip-lang-${lang.code}`}
              onClick={() => {
                setLanguage(lang.code)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left transition-colors ${
                language === lang.code
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span aria-hidden className="text-lg leading-none">{lang.flag}</span>
              <span className="flex-1">
                <span className="block text-sm font-extrabold leading-tight">{lang.native}</span>
                <span className="block text-[11px] font-semibold leading-tight opacity-70">
                  {lang.english}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
