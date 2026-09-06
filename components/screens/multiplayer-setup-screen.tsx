"use client"

import { useState } from "react"
import { Users, Timer } from "lucide-react"
import { useStore } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton } from "@/components/game-button"
import { AvatarBadge } from "@/components/avatar"
import { DIFFICULTIES } from "@/lib/game-data"
import {
  MULTI_PAIR_CONFIG,
  DEFAULT_TURN_SECONDS,
  type PlayerCount,
  type MultiplayerConfig,
} from "@/lib/multiplayer"
import { AVATARS, defaultAvatarFor } from "@/lib/avatars"
import type { Difficulty } from "@/lib/types"

const PLAYER_COUNTS: PlayerCount[] = [2, 3, 4]

export function MultiplayerSetupScreen({
  onStart,
  onBack,
}: {
  onStart: (config: MultiplayerConfig) => void
  onBack: () => void
}) {
  const { t, memories } = useStore()

  const [playerCount, setPlayerCount] = useState<PlayerCount>(2)
  const [names, setNames] = useState<string[]>(["", "", "", ""])
  const [avatars, setAvatars] = useState<string[]>(() => [0, 1, 2, 3].map(defaultAvatarFor))
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [useMemoriesDeck, setUseMemoriesDeck] = useState(false)
  const [timerEnabled, setTimerEnabled] = useState(false)

  const activeNames = names.slice(0, playerCount)
  const allNamed = activeNames.every((n) => n.trim().length > 0)
  const pairsPreview = MULTI_PAIR_CONFIG[playerCount][difficulty]

  function submit() {
    if (!allNamed) return
    onStart({
      playerCount,
      playerNames: activeNames.map((n, i) => n.trim() || t("multi.playerN", { n: String(i + 1) })),
      playerAvatars: avatars.slice(0, playerCount),
      difficulty,
      useMemoriesDeck,
      timerEnabled,
      turnSeconds: DEFAULT_TURN_SECONDS,
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title={t("multi.title")} subtitle={t("multi.subtitle")} onBack={onBack} />

      {/* Player count */}
      <section className="pixel-panel bg-card p-4" data-testid="multi-players-section">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-foreground">
          <Users className="h-5 w-5 text-primary" strokeWidth={2.6} />
          {t("multi.playersHeading")}
        </h2>
        <div className="flex gap-2">
          {PLAYER_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              data-testid={`multi-player-count-${n}`}
              onClick={() => setPlayerCount(n)}
              className={`pixel-btn flex-1 py-3 text-lg ${
                playerCount === n ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {/* Names + Avatars */}
      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("multi.namesHeading")}</h2>
        <div className="flex flex-col gap-3">
          {Array.from({ length: playerCount }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AvatarBadge id={avatars[i]} size={40} />
                <span className="w-16 shrink-0 text-sm font-bold text-muted-foreground">
                  {t("multi.playerN", { n: String(i + 1) })}
                </span>
                <input
                  value={names[i]}
                  onChange={(e) =>
                    setNames((s) => s.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                  placeholder={t("multi.playerNamePlaceholder")}
                  data-testid={`multi-player-name-${i + 1}`}
                  className="flex-1 rounded-[10px] border-[3px] border-wood-dark bg-background px-3 py-2 text-base font-bold outline-none focus:ring-4 focus:ring-primary/40"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pl-12" data-testid={`multi-avatar-row-${i + 1}`}>
                {AVATARS.map((a) => {
                  const selected = avatars[i] === a.id
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() =>
                        setAvatars((s) => s.map((v, idx) => (idx === i ? a.id : v)))
                      }
                      aria-label={a.id}
                      data-testid={`multi-avatar-${i + 1}-${a.id}`}
                      className={`rounded-[10px] border-[3px] p-0.5 transition-transform ${
                        selected
                          ? "border-primary scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <AvatarBadge id={a.id} size={30} />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Difficulty */}
      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("multi.difficulty")}</h2>
        <div className="flex gap-2">
          {DIFFICULTIES.map(({ id, color }) => {
            const on = difficulty === id
            return (
              <button
                key={id}
                type="button"
                data-testid={`multi-difficulty-${id}`}
                onClick={() => setDifficulty(id)}
                className={`pixel-btn flex-1 py-3 text-base font-extrabold ${
                  on ? "text-white" : "bg-card text-foreground"
                }`}
                style={on ? { backgroundColor: color } : undefined}
              >
                {t(`game.${id}`)}
              </button>
            )
          })}
        </div>
        <p className="mt-3 rounded-[10px] bg-muted px-3 py-2 text-center text-sm font-bold text-muted-foreground">
          {pairsPreview} × 2 = {pairsPreview * 2} {t("multi.pairs")}
        </p>
      </section>

      {/* Timer */}
      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-foreground">
          <Timer className="h-5 w-5 text-secondary" strokeWidth={2.6} />
          {t("multi.timer")}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTimerEnabled(false)}
            data-testid="multi-timer-off"
            className={`pixel-btn flex-1 py-3 text-sm font-extrabold ${
              !timerEnabled ? "bg-secondary text-secondary-foreground" : "bg-card text-foreground"
            }`}
          >
            {t("multi.timerOff")}
          </button>
          <button
            type="button"
            onClick={() => setTimerEnabled(true)}
            data-testid="multi-timer-on"
            className={`pixel-btn flex-1 py-3 text-sm font-extrabold ${
              timerEnabled ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
            }`}
          >
            {t("multi.timerOn", { seconds: String(DEFAULT_TURN_SECONDS) })}
          </button>
        </div>
      </section>

      {/* Deck toggle */}
      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("multi.deckHeading")}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUseMemoriesDeck(false)}
            data-testid="multi-deck-classic"
            className={`pixel-btn flex-1 py-3 text-sm font-extrabold ${
              !useMemoriesDeck ? "bg-secondary text-secondary-foreground" : "bg-card text-foreground"
            }`}
          >
            {t("multi.deckClassic")}
          </button>
          <button
            type="button"
            disabled={memories.length < pairsPreview}
            onClick={() => setUseMemoriesDeck(true)}
            data-testid="multi-deck-memories"
            className={`pixel-btn flex-1 py-3 text-sm font-extrabold disabled:opacity-50 ${
              useMemoriesDeck ? "bg-accent text-accent-foreground" : "bg-card text-foreground"
            }`}
          >
            {t("multi.deckMemories")}
          </button>
        </div>
        {memories.length < pairsPreview && (
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {t("game.notEnoughMemories")}
          </p>
        )}
      </section>

      <GameButton
        label={allNamed ? t("multi.start") : t("multi.startDisabled")}
        icon="star"
        variant="primary"
        disabled={!allNamed}
        onClick={submit}
      />
    </div>
  )
}
