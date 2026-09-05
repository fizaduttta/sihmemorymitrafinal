"use client"

import { useStore, countGamesPlayed } from "@/lib/store"
import { GameButton, IconTile } from "@/components/game-button"
import type { Screen } from "@/lib/navigation"

export function HomeScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const { name, t, progress } = useStore()
  const games = countGamesPlayed(progress)

  const tiles: { screen: Screen; labelKey: string; icon: string; color: string }[] = [
    { screen: "journey", labelKey: "home.myJourney", icon: "footprints", color: "#8267be" },
    { screen: "memories", labelKey: "home.myMemories", icon: "heart", color: "#b0475a" },
    { screen: "journal", labelKey: "home.journal", icon: "feather", color: "#3fa79a" },
    { screen: "companion", labelKey: "home.companion", icon: "smile", color: "#d1793f" },
    { screen: "caregiver", labelKey: "home.caregiver", icon: "hand-heart", color: "#a9743f" },
    { screen: "settings", labelKey: "home.settings", icon: "sun", color: "#dda12b" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-2">
        <p className="text-lg font-semibold text-muted-foreground">
          {t("home.greeting", { name: name ?? "" })}
        </p>
        <h1 className="font-display text-3xl font-extrabold text-foreground text-shadow-soft">
          {t("home.subtitle")}
        </h1>
      </header>

      {/* Today's activity */}
      <section className="pixel-panel bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">{t("home.todayActivity")}</h2>
            <p className="text-sm font-medium text-muted-foreground">{t("home.todaySubtitle")}</p>
          </div>
          <span className="rounded-[10px] bg-primary/15 px-3 py-2 text-center text-sm font-bold text-primary">
            {games}
            <span className="block text-xs">{t("journey.gamesPlayed")}</span>
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <GameButton
            label={t("home.playGame")}
            icon="star"
            variant="primary"
            onClick={() => navigate("game")}
          />
          <GameButton
            label={t("home.myNortheast")}
            description={t("northeast.subtitle")}
            icon="mountain-snow"
            variant="sky"
            onClick={() => navigate("northeast")}
          />
        </div>
      </section>

      {/* Locations grid */}
      <section>
        <div className="grid grid-cols-3 gap-3">
          {tiles.map((tile) => (
            <IconTile
              key={tile.screen}
              label={t(tile.labelKey)}
              icon={tile.icon}
              color={tile.color}
              onClick={() => navigate(tile.screen)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
