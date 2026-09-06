"use client"

import { Sparkles } from "lucide-react"
import { getIcon } from "@/lib/icons"
import type { CardContent } from "@/lib/types"
import { cn } from "@/lib/utils"

export interface GameCard {
  key: string
  contentId: string
  content: CardContent
  faceUp: boolean
  matched: boolean
}

export function MemoryCard({
  card,
  onFlip,
  disabled,
}: {
  card: GameCard
  onFlip: () => void
  disabled: boolean
}) {
  const Icon = getIcon(card.content.icon)
  const showFace = card.faceUp || card.matched

  return (
    <button
      type="button"
      onClick={onFlip}
      disabled={disabled}
      aria-label={showFace ? card.content.label : "Hidden card"}
      className={cn(
        "relative aspect-square w-full [perspective:800px]",
        disabled ? "cursor-default" : "cursor-pointer",
      )}
    >
      <div
        className="relative h-full w-full transition-transform duration-300 [transform-style:preserve-3d]"
        style={{ transform: showFace ? "rotateY(0deg)" : "rotateY(180deg)" }}
      >
        {/* Front — content face */}
        <div
          className={cn(
            "pixel-panel absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden p-1 [backface-visibility:hidden]",
            card.matched && "ring-4 ring-primary/60 animate-match",
          )}
          style={{ backgroundColor: `color-mix(in oklch, ${card.content.color} 16%, white)` }}
        >
          {card.content.image ? (
            <img
              src={card.content.image || "/placeholder.svg"}
              alt={card.content.label ?? ""}
              className="h-full w-full rounded-[8px] object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <>
              <span
                className="flex h-[54%] w-[64%] items-center justify-center rounded-[10px] text-white"
                style={{ backgroundColor: card.content.color }}
              >
                <Icon className="h-[62%] w-[62%]" strokeWidth={2.2} />
              </span>
              <span className="line-clamp-2 px-0.5 text-center text-[0.7rem] font-bold leading-tight text-foreground">
                {card.content.label}
              </span>
            </>
          )}
        </div>

        {/* Back — tile pattern */}
        <div
          className="pixel-panel tile-back absolute inset-0 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <span className="flex h-[46%] w-[46%] items-center justify-center rounded-[10px] bg-white/25 text-white">
            <Sparkles className="h-[60%] w-[60%]" strokeWidth={2} />
          </span>
        </div>
      </div>
    </button>
  )
}
