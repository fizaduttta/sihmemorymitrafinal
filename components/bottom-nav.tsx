"use client"

import { Home, Star, MountainSnow, LayoutGrid } from "lucide-react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { Screen } from "@/lib/navigation"

const items: { key: string; screen: Screen | "more"; labelKey: string; Icon: typeof Home }[] = [
  { key: "home", screen: "home", labelKey: "nav.home", Icon: Home },
  { key: "play", screen: "game", labelKey: "nav.play", Icon: Star },
  { key: "ne", screen: "northeast", labelKey: "nav.northeast", Icon: MountainSnow },
  { key: "more", screen: "more", labelKey: "nav.more", Icon: LayoutGrid },
]

export function BottomNav({
  current,
  onNavigate,
  onMore,
}: {
  current: Screen
  onNavigate: (s: Screen) => void
  onMore: () => void
}) {
  const { t } = useStore()
  return (
    <nav className="sticky bottom-0 z-20 mx-auto w-full max-w-md px-3 pb-3">
      <div className="pixel-panel flex items-stretch justify-around gap-1 bg-card p-2">
        {items.map(({ key, screen, labelKey, Icon }) => {
          const active = screen === current
          return (
            <button
              key={key}
              type="button"
              onClick={() => (screen === "more" ? onMore() : onNavigate(screen as Screen))}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-[12px] px-1 py-2 transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={2.4} />
              <span className="text-xs font-bold">{t(labelKey)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
