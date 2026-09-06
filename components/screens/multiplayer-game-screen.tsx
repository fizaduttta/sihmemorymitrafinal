"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PartyPopper, Trophy } from "lucide-react"
import { useStore } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton } from "@/components/game-button"
import { MemoryCard, type GameCard } from "@/components/memory-card"
import { CLASSIC_DECK, MULTI_DECK } from "@/lib/game-data"
import { speak } from "@/lib/voice"
import {
  buildMultiplayerBoard,
  multiplayerGridCols,
  pairsFor,
  type MultiplayerConfig,
  type Player,
  NON_MATCH_REVEAL_MS,
  MATCH_APPLY_MS,
} from "@/lib/multiplayer"
import type { CardContent } from "@/lib/types"

type Phase = "play" | "complete"

/**
 * Offline local multiplayer memory game.
 * Reuses <MemoryCard/> and the existing deck data. State is fully in-memory
 * (no backend). It integrates alongside single-player without touching it.
 */
export function MultiplayerGameScreen({
  config,
  onExit,
  onRestart,
}: {
  config: MultiplayerConfig
  onExit: () => void
  onRestart: () => void
}) {
  const { t, language, accessibility, memories, recordRound } = useStore()

  const totalPairs = pairsFor(config.playerCount, config.difficulty)

  // Choose deck source
  const memoriesDeck: CardContent[] = useMemo(
    () =>
      memories.map((m) => ({
        id: m.id,
        label: m.label,
        icon: m.icon,
        image: m.image,
        color: m.color,
      })),
    [memories],
  )
  const sourceDeck = config.useMemoriesDeck && memoriesDeck.length >= totalPairs ? memoriesDeck : MULTI_DECK

  const [phase, setPhase] = useState<Phase>("play")
  const [cards, setCards] = useState<GameCard[]>(() => buildMultiplayerBoard(sourceDeck, totalPairs))
  const [players, setPlayers] = useState<Player[]>(() =>
    config.playerNames.map((name) => ({ name, pairs: 0 })),
  )
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [lock, setLock] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [matchedThisTurn, setMatchedThisTurn] = useState(false)

  const cardsRef = useRef<GameCard[]>([])
  cardsRef.current = cards

  const currentPlayer = players[currentIdx]
  const remainingPairs = totalPairs - players.reduce((sum, p) => sum + p.pairs, 0)

  const showBanner = useCallback((msg: string, ttl = 1400) => {
    setBanner(msg)
    setTimeout(() => setBanner((prev) => (prev === msg ? null : prev)), ttl)
  }, [])

  const advanceTurn = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % players.length)
    setMatchedThisTurn(false)
  }, [players.length])

  function handleFlip(i: number) {
    if (lock || phase !== "play") return
    if (selected.length >= 2) return
    const c = cards[i]
    if (!c || c.matched || c.faceUp) return
    if (selected.includes(i)) return
    setCards((cur) => cur.map((x, idx) => (idx === i ? { ...x, faceUp: true } : x)))
    setSelected((s) => [...s, i])
  }

  // Resolve pair
  useEffect(() => {
    if (selected.length !== 2) return
    setLock(true)
    const [a, b] = selected
    const match = cardsRef.current[a]?.contentId === cardsRef.current[b]?.contentId

    if (match) {
      const id = setTimeout(() => {
        setCards((cur) =>
          cur.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)),
        )
        setPlayers((ps) =>
          ps.map((p, idx) => (idx === currentIdx ? { ...p, pairs: p.pairs + 1 } : p)),
        )
        setSelected([])
        setLock(false)
        setMatchedThisTurn(true)
        showBanner(t("multi.matchTurnAgain", { name: currentPlayer.name }))
        if (accessibility.voiceGuidance)
          speak(t("multi.matchTurnAgain", { name: currentPlayer.name }), language, true)
      }, MATCH_APPLY_MS)
      return () => clearTimeout(id)
    }

    const nextName = players[(currentIdx + 1) % players.length]?.name ?? ""
    const id = setTimeout(() => {
      setCards((cur) => cur.map((c, i) => (i === a || i === b ? { ...c, faceUp: false } : c)))
      setSelected([])
      setLock(false)
      showBanner(t("multi.noMatch", { next: nextName }))
      if (accessibility.voiceGuidance)
        speak(t("multi.noMatch", { next: nextName }), language, true)
      advanceTurn()
    }, NON_MATCH_REVEAL_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // Complete detection
  useEffect(() => {
    if (phase !== "play") return
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setPhase("complete")
      // Record for progress: each player counts as one deck play
      recordRound(totalPairs, `multi:${config.difficulty}:${config.playerCount}`)
      if (accessibility.voiceGuidance) speak(t("multi.gameComplete"), language, true)
    }
  }, [cards, phase, totalPairs, config, recordRound, accessibility.voiceGuidance, language, t])

  const cols = multiplayerGridCols(cards.length)

  // ---------- COMPLETE ----------
  if (phase === "complete") {
    const maxPairs = Math.max(...players.map((p) => p.pairs))
    const winners = players.filter((p) => p.pairs === maxPairs)
    const isTie = winners.length > 1
    const rankSorted = [...players].sort((a, b) => b.pairs - a.pairs)

    return (
      <div className="flex flex-col gap-5">
        <ScreenHeader
          title={t("multi.gameComplete")}
          subtitle={
            isTie
              ? t("multi.tie", { names: winners.map((w) => w.name).join(" · ") })
              : t("multi.winner", { name: winners[0].name })
          }
          onBack={onExit}
        />

        <section className="pixel-panel flex flex-col items-center gap-3 bg-card p-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[16px] bg-primary text-primary-foreground pixel-panel animate-bob">
            <PartyPopper className="h-10 w-10" strokeWidth={2.2} />
          </div>
          <p className="text-lg font-extrabold text-foreground">
            {isTie
              ? t("multi.tie", { names: winners.map((w) => w.name).join(" · ") })
              : t("multi.winner", { name: winners[0].name })}
          </p>
        </section>

        <ul className="flex flex-col gap-2" data-testid="multi-scoreboard-final">
          {rankSorted.map((p, i) => {
            const isWinner = p.pairs === maxPairs
            return (
              <li
                key={`${p.name}-${i}`}
                className={`pixel-panel flex items-center gap-3 px-4 py-3 ${
                  isWinner ? "bg-primary/15" : "bg-card"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground text-sm font-extrabold">
                  {i + 1}
                </span>
                <span className="flex-1 text-base font-extrabold text-foreground">{p.name}</span>
                {isWinner && <Trophy className="h-5 w-5 text-primary" strokeWidth={2.6} />}
                <span className="rounded-[10px] bg-primary/15 px-3 py-1 text-sm font-extrabold text-primary">
                  {p.pairs} {t("multi.pairs")}
                </span>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-col gap-3">
          <GameButton
            label={t("multi.playAgain")}
            icon="star"
            variant="primary"
            onClick={onRestart}
          />
          <GameButton
            label={t("multi.backToMenu")}
            icon="house"
            variant="soft"
            onClick={onExit}
          />
        </div>
      </div>
    )
  }

  // ---------- PLAY ----------
  return (
    <div className="flex flex-col gap-3">
      <ScreenHeader
        title={t("multi.title")}
        subtitle={t("multi.instructions")}
        onBack={onExit}
      />

      {/* Scoreboard */}
      <ul
        className="flex gap-2 overflow-x-auto pb-1"
        data-testid="multi-scoreboard"
        style={{ scrollbarWidth: "thin" }}
      >
        {players.map((p, idx) => {
          const active = idx === currentIdx
          return (
            <li
              key={`${p.name}-${idx}`}
              data-testid={`multi-score-${idx}`}
              className={`pixel-panel shrink-0 min-w-[6.5rem] px-3 py-2 text-center ${
                active ? "bg-primary text-primary-foreground animate-pop" : "bg-card text-foreground"
              }`}
            >
              <p className="truncate text-sm font-extrabold leading-tight">{p.name}</p>
              <p className="text-[11px] font-semibold opacity-80">
                {p.pairs} {t("multi.pairs")}
              </p>
            </li>
          )
        })}
      </ul>

      {/* Current turn banner */}
      <div className="min-h-[2.5rem]">
        {banner ? (
          <div
            className="animate-pop rounded-[12px] bg-primary/15 px-4 py-2 text-center text-base font-extrabold text-primary"
            data-testid="multi-banner"
          >
            {banner}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-[12px] bg-muted px-3 py-2">
            <span
              className="text-base font-extrabold text-foreground"
              data-testid="multi-current-player"
            >
              {t("multi.yourTurn", { name: currentPlayer.name })}
            </span>
            <span className="text-sm font-bold text-muted-foreground">
              {t("multi.remainingPairs")}: {remainingPairs}
            </span>
          </div>
        )}
      </div>

      {/* Board */}
      <div
        className="mx-auto grid w-full max-w-4xl gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${cols.mobile}, minmax(0, 1fr))`,
        }}
        data-testid="multi-board"
      >
        {cards.map((card, i) => (
          <MemoryCard
            key={card.key}
            card={card}
            onFlip={() => handleFlip(i)}
            disabled={lock || card.faceUp || card.matched}
          />
        ))}
      </div>

      {/* Responsive column overrides for larger screens */}
      <style jsx>{`
        @media (min-width: 640px) {
          [data-testid="multi-board"] {
            grid-template-columns: repeat(${cols.tablet}, minmax(0, 1fr)) !important;
          }
        }
        @media (min-width: 1024px) {
          [data-testid="multi-board"] {
            grid-template-columns: repeat(${cols.desktop}, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  )
}
