"use client"

import type { ReactNode } from "react"
import { getIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

type Variant = "primary" | "sky" | "accent" | "wood" | "soft"

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground",
  sky: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  wood: "bg-wood text-white",
  soft: "bg-card text-foreground",
}

export function GameButton({
  label,
  description,
  icon,
  variant = "primary",
  onClick,
  className,
  disabled,
  fullWidth = true,
}: {
  label: string
  description?: string
  icon?: string
  variant?: Variant
  onClick?: () => void
  className?: string
  disabled?: boolean
  fullWidth?: boolean
}) {
  const Icon = icon ? getIcon(icon) : null
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "pixel-btn flex items-center gap-4 px-5 py-4 text-left",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        fullWidth && "w-full",
        className,
      )}
    >
      {Icon && (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-white/25">
          <Icon className="h-7 w-7" strokeWidth={2.4} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold leading-tight">{label}</span>
        {description && (
          <span className="block truncate text-sm font-medium opacity-85">{description}</span>
        )}
      </span>
    </button>
  )
}

export function IconTile({
  label,
  icon,
  color,
  onClick,
  children,
  compact = false,
}: {
  label?: string
  icon?: string
  color?: string
  onClick?: () => void
  children?: ReactNode
  compact?: boolean
}) {
  const Icon = icon ? getIcon(icon) : null
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pixel-panel flex flex-col items-center gap-1.5 transition-transform active:translate-y-1",
        compact ? "p-2" : "p-4",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-[12px] text-white",
          compact ? "h-11 w-11" : "h-16 w-16",
        )}
        style={{ backgroundColor: color ?? "var(--primary)" }}
      >
        {Icon && <Icon className={compact ? "h-6 w-6" : "h-8 w-8"} strokeWidth={2.4} />}
        {children}
      </span>
      {label && (
        <span
          className={cn(
            "text-center font-bold leading-tight",
            compact ? "text-[11px]" : "text-sm",
          )}
        >
          {label}
        </span>
      )}
    </button>
  )
}
