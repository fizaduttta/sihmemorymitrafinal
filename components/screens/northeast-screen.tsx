"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton, IconTile } from "@/components/game-button"
import { getIcon } from "@/lib/icons"
import { CATEGORIES, STATES, getNortheastDeck, getDeckId } from "@/lib/game-data"
import type { CategoryId, StateId } from "@/lib/types"
import type { GameConfig } from "@/lib/navigation"

export function NortheastScreen({
  onPlay,
  onBack,
}: {
  onPlay: (config: GameConfig) => void
  onBack: () => void
}) {
  const { t } = useStore()
  const [state, setState] = useState<StateId | null>(null)
  const [category, setCategory] = useState<CategoryId | null>(null)

  // Step 1: choose state
  if (!state) {
    return (
      <div className="flex flex-col gap-5">
        <ScreenHeader title={t("northeast.title")} subtitle={t("northeast.chooseState")} onBack={onBack} />
        <div className="grid grid-cols-2 gap-3">
          {STATES.map((s) => (
            <IconTile
              key={s.id}
              label={t(`state.${s.id}`)}
              icon={s.icon}
              color="#4a9d6b"
              onClick={() => setState(s.id)}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{t("northeast.respectNote")}</p>
      </div>
    )
  }

  // Step 2: choose category + preview
  const deck = category ? getNortheastDeck(state, category) : null

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader
        title={t(`state.${state}`)}
        subtitle={t("northeast.chooseCategory")}
        onBack={() => (category ? setCategory(null) : setState(null))}
      />

      <div className="grid grid-cols-1 gap-3">
        {CATEGORIES.map((c) => (
          <GameButton
            key={c.id}
            label={t(`cat.${c.id}`)}
            icon={c.icon}
            variant={category === c.id ? "primary" : "soft"}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>

      {deck && category && (
        <section className="pixel-panel bg-card p-4">
          <h2 className="mb-3 text-lg font-extrabold text-foreground">{t(`cat.${category}`)}</h2>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {deck.map((card) => {
              const Icon = getIcon(card.icon)
              return (
                <div
                  key={card.id}
                  className="flex flex-col items-center gap-1 rounded-[10px] p-2"
                  style={{ backgroundColor: `color-mix(in oklch, ${card.color} 14%, white)` }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[8px] text-white"
                    style={{ backgroundColor: card.color }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.4} />
                  </span>
                  <span className="text-center text-[0.65rem] font-bold leading-tight text-foreground">
                    {card.label}
                  </span>
                </div>
              )
            })}
          </div>
          <GameButton
            label={t("northeast.startGame")}
            icon="star"
            variant="primary"
            onClick={() =>
              onPlay({
                deck,
                deckId: getDeckId(state, category),
                deckName: `${t(`state.${state}`)} · ${t(`cat.${category}`)}`,
              })
            }
          />
        </section>
      )}
    </div>
  )
}
