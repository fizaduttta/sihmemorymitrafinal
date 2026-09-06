"use client"

import { Volume2 } from "lucide-react"
import { useStore, countGamesPlayed } from "@/lib/store"
import { GameButton, IconTile } from "@/components/game-button"
import { LanguageChip } from "@/components/language-chip"
import { HomeControls } from "@/components/home-controls"
import { MemoryMitraLogo } from "@/components/memory-mitra-logo"
import { Scenery } from "@/components/scenery"
import { speak } from "@/lib/voice"
import { playChime } from "@/lib/sounds"
import type { Screen } from "@/lib/navigation"

export function HomeScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const { name, t, progress, language, accessibility } = useStore()
  const games = countGamesPlayed(progress)
  const greeting = t("home.greeting", { name: name ?? "" })

  // Primary adventure choices — clearly centered
  const primary: {
    screen: Screen
    labelKey: string
    icon: string
    variant: "primary" | "accent" | "sky" | "soft"
  }[] = [
    { screen: "game",        labelKey: "home.singlePlayer", icon: "star",        variant: "primary" },
    { screen: "multiplayer", labelKey: "home.multi",        icon: "users",       variant: "accent" },
    { screen: "journey",     labelKey: "home.myJourney",    icon: "footprints",  variant: "sky" },
    { screen: "memories",    labelKey: "home.myMemories",   icon: "heart",       variant: "soft" },
  ]

  // Secondary tiles — remain accessible but visually smaller
  const secondary: { screen: Screen; labelKey: string; icon: string; color: string }[] = [
    { screen: "northeast", labelKey: "home.myNortheast", icon: "mountain-snow", color: "#4a90c2" },
    { screen: "journal",   labelKey: "home.journal",     icon: "feather",       color: "#3fa79a" },
    { screen: "companion", labelKey: "home.companion",   icon: "smile",         color: "#d1793f" },
    { screen: "caregiver", labelKey: "home.caregiver",   icon: "hand-heart",    color: "#a9743f" },
  ]

  function withClick(fn: () => void) {
    return () => {
      playChime("turn", accessibility.soundEffects)
      fn()
    }
  }

  return (
    <>
      {/* Cozy pixel world sits behind everything */}
      <Scenery companion />

      <div className="relative flex flex-col gap-6" data-testid="home-screen">
        {/* Top corners: language (left) + controls (right) */}
        <header className="flex items-start justify-between gap-3 pt-1">
          <div className="shrink-0" data-testid="home-language-slot">
            <LanguageChip />
          </div>
          <HomeControls onOpenSettings={withClick(() => navigate("settings"))} />
        </header>

        {/* Centered logo + tagline */}
        <section className="flex flex-col items-center gap-1 pt-2 sm:pt-4">
          <MemoryMitraLogo />
          <p
            className="mt-2 text-center text-sm font-bold text-muted-foreground sm:text-base"
            data-testid="home-greeting"
          >
            {greeting}
          </p>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
            {t("home.chooseAdventure")}
          </p>
        </section>

        {/* Four primary choices — chunky pixel buttons */}
        <section
          className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2"
          data-testid="home-primary-grid"
        >
          {primary.map((p) => (
            <GameButton
              key={p.screen}
              label={t(p.labelKey)}
              icon={p.icon}
              variant={p.variant}
              onClick={withClick(() => navigate(p.screen))}
            />
          ))}
        </section>

        {/* Secondary tiles — smaller row, kept accessible */}
        <section className="mx-auto w-full max-w-lg">
          <div className="grid grid-cols-4 gap-2" data-testid="home-secondary-grid">
            {secondary.map((tile) => (
              <IconTile
                key={tile.screen}
                label={t(tile.labelKey)}
                icon={tile.icon}
                color={tile.color}
                compact
                onClick={withClick(() => navigate(tile.screen))}
              />
            ))}
          </div>
        </section>

        {/* Today's activity — small footer stat */}
        <section className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 rounded-[12px] bg-card/85 px-4 py-2 pixel-panel backdrop-blur-sm">
          <div>
            <p className="text-sm font-extrabold text-foreground">{t("home.todayActivity")}</p>
            <p className="text-xs font-medium text-muted-foreground">{t("home.todaySubtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => speak(`${greeting}. ${t("home.chooseAdventure")}`, language, true)}
              aria-label={t("common.readAloud")}
              data-testid="home-read-aloud"
              className="pixel-btn flex h-9 w-9 items-center justify-center bg-secondary text-secondary-foreground"
            >
              <Volume2 className="h-4 w-4" strokeWidth={2.4} />
            </button>
            <span className="rounded-[10px] bg-primary/15 px-3 py-1.5 text-center text-sm font-extrabold text-primary">
              {games}
              <span className="ml-1 text-xs font-bold">{t("journey.gamesPlayed")}</span>
            </span>
          </div>
        </section>
      </div>
    </>
  )
}
