"use client"

import { Check, Lock } from "lucide-react"
import { useStore, countGamesPlayed } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { getIcon } from "@/lib/icons"

function deckLabel(id: string, t: (k: string, v?: Record<string, string>) => string): string {
  if (id === "classic") return t("game.classicDeck")
  if (id === "memories") return t("game.myMemoriesDeck")
  if (id.startsWith("ne:")) {
    const [, state, cat] = id.split(":")
    return `${t(`state.${state}`)} · ${t(`cat.${cat}`)}`
  }
  return id
}

export function JourneyScreen({ onBack }: { onBack: () => void }) {
  const { t, progress, journal } = useStore()
  const games = countGamesPlayed(progress)

  const favorites = Object.entries(progress.deckPlays)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const milestones = [
    { key: "journey.m.first", done: progress.roundsCompleted >= 1 },
    { key: "journey.m.five", done: progress.roundsCompleted >= 5 },
    { key: "journey.m.ten", done: progress.pairsMatched >= 10 },
    { key: "journey.m.explorer", done: progress.unlockedThemes.some((x) => x.startsWith("ne:")) },
    { key: "journey.m.journaler", done: journal.length > 0 },
  ]

  const stats = [
    { label: t("journey.gamesPlayed"), value: games, color: "#4a9d6b" },
    { label: t("journey.roundsCompleted"), value: progress.roundsCompleted, color: "#4a90c2" },
    { label: t("journey.pairsMatched"), value: progress.pairsMatched, color: "#d1793f" },
  ]

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title={t("journey.title")} subtitle={t("journey.subtitle")} onBack={onBack} />

      {games === 0 && progress.roundsCompleted === 0 ? (
        <p className="rounded-[12px] bg-muted p-5 text-center text-base font-medium text-muted-foreground">
          {t("journey.noData")}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="pixel-panel bg-card p-3 text-center">
            <p className="text-3xl font-extrabold" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs font-bold leading-tight text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("journey.milestones")}</h2>
        <ul className="flex flex-col gap-2">
          {milestones.map((m) => (
            <li
              key={m.key}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2 ${
                m.done ? "bg-primary/15" : "bg-muted"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  m.done ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                }`}
              >
                {m.done ? <Check className="h-5 w-5" strokeWidth={3} /> : <Lock className="h-4 w-4" />}
              </span>
              <span className={`text-base font-bold ${m.done ? "text-foreground" : "text-muted-foreground"}`}>
                {t(m.key)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {favorites.length > 0 && (
        <section className="pixel-panel bg-card p-4">
          <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("journey.favoriteDecks")}</h2>
          <ul className="flex flex-col gap-2">
            {favorites.map(([id, count]) => {
              const Icon = getIcon(id.startsWith("ne:") ? "mountain-snow" : id === "memories" ? "heart" : "star")
              return (
                <li key={id} className="flex items-center gap-3 rounded-[10px] bg-muted px-3 py-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" strokeWidth={2.4} />
                  </span>
                  <span className="flex-1 text-base font-bold text-foreground">{deckLabel(id, t)}</span>
                  <span className="text-sm font-bold text-muted-foreground">×{count}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <p className="text-center text-sm font-semibold text-primary">{t("journey.keepPlaying")}</p>
    </div>
  )
}
