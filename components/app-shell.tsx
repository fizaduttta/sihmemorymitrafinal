"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useStore } from "@/lib/store"
import { Scenery } from "@/components/scenery"
import { BottomNav } from "@/components/bottom-nav"
import { IconTile } from "@/components/game-button"
import { TitleScreen } from "@/components/screens/title-screen"
import { HomeScreen } from "@/components/screens/home-screen"
import { GameScreen } from "@/components/screens/game-screen"
import { MultiplayerSetupScreen } from "@/components/screens/multiplayer-setup-screen"
import { MultiplayerGameScreen } from "@/components/screens/multiplayer-game-screen"
import { NortheastScreen } from "@/components/screens/northeast-screen"
import { JourneyScreen } from "@/components/screens/journey-screen"
import { MemoriesScreen } from "@/components/screens/memories-screen"
import { JournalScreen } from "@/components/screens/journal-screen"
import { CompanionScreen } from "@/components/screens/companion-screen"
import { CaregiverScreen } from "@/components/screens/caregiver-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"
import type { Screen, GameConfig } from "@/lib/navigation"
import type { MultiplayerConfig } from "@/lib/multiplayer"

const MORE_ITEMS: { screen: Screen; labelKey: string; icon: string; color: string }[] = [
  { screen: "journey", labelKey: "home.myJourney", icon: "footprints", color: "#8267be" },
  { screen: "memories", labelKey: "home.myMemories", icon: "heart", color: "#b0475a" },
  { screen: "journal", labelKey: "home.journal", icon: "feather", color: "#3fa79a" },
  { screen: "companion", labelKey: "home.companion", icon: "smile", color: "#d1793f" },
  { screen: "caregiver", labelKey: "home.caregiver", icon: "hand-heart", color: "#a9743f" },
  { screen: "settings", labelKey: "home.settings", icon: "sun", color: "#dda12b" },
]

export function AppShell() {
  const { ready, t } = useStore()
  const [entered, setEntered] = useState(false)
  const [screen, setScreen] = useState<Screen>("home")
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)
  const [multiConfig, setMultiConfig] = useState<MultiplayerConfig | null>(null)
  const [multiSession, setMultiSession] = useState(0)
  const [showMore, setShowMore] = useState(false)

  if (!ready) {
    return <div className="min-h-dvh bg-background" />
  }

  if (!entered) {
    return <TitleScreen onEnter={() => setEntered(true)} />
  }

  function navigate(s: Screen) {
    if (s === "game") setGameConfig(null)
    if (s === "multiplayer") setMultiConfig(null)
    setScreen(s)
    setShowMore(false)
  }

  function playDeck(config: GameConfig) {
    setGameConfig(config)
    setScreen("game")
  }

  function startMultiplayer(cfg: MultiplayerConfig) {
    setMultiConfig(cfg)
    setMultiSession((n) => n + 1)
  }

  function restartMultiplayer() {
    setMultiSession((n) => n + 1)
  }

  function renderScreen() {
    switch (screen) {
      case "home":
        return <HomeScreen navigate={navigate} />
      case "game":
        return <GameScreen config={gameConfig} onExit={() => navigate("home")} />
      case "multiplayer":
        if (!multiConfig) {
          return (
            <MultiplayerSetupScreen
              onStart={startMultiplayer}
              onBack={() => navigate("home")}
            />
          )
        }
        return (
          <MultiplayerGameScreen
            key={multiSession}
            config={multiConfig}
            onExit={() => {
              setMultiConfig(null)
              navigate("home")
            }}
            onRestart={restartMultiplayer}
          />
        )
      case "northeast":
        return <NortheastScreen onPlay={playDeck} onBack={() => navigate("home")} />
      case "journey":
        return <JourneyScreen onBack={() => navigate("home")} />
      case "memories":
        return <MemoriesScreen onBack={() => navigate("home")} />
      case "journal":
        return <JournalScreen onBack={() => navigate("home")} />
      case "companion":
        return <CompanionScreen onBack={() => navigate("home")} />
      case "caregiver":
        return <CaregiverScreen onBack={() => navigate("home")} />
      case "settings":
        return <SettingsScreen onBack={() => navigate("home")} />
      default:
        return <HomeScreen navigate={navigate} />
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      <Scenery compact />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-4">{renderScreen()}</main>

      <BottomNav current={screen} onNavigate={navigate} onMore={() => setShowMore(true)} />

      {showMore && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={() => setShowMore(false)}>
          <div
            className="pixel-panel mx-3 mb-3 w-full max-w-md bg-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">{t("nav.more")}</h2>
              <button
                type="button"
                onClick={() => setShowMore(false)}
                aria-label={t("common.close")}
                className="pixel-btn flex h-10 w-10 items-center justify-center bg-card"
              >
                <X className="h-5 w-5" strokeWidth={2.6} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {MORE_ITEMS.map((item) => (
                <IconTile
                  key={item.screen}
                  label={t(item.labelKey)}
                  icon={item.icon}
                  color={item.color}
                  onClick={() => navigate(item.screen)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
