"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PartyPopper, Trophy, Timer as TimerIcon } from "lucide-react"
import { useStore } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton } from "@/components/game-button"
import { MemoryCard, type GameCard } from "@/components/memory-card"
import { AvatarBadge } from "@/components/avatar"
import { Confetti } from "@/components/confetti"
import { CLASSIC_DECK, MULTI_DECK } from "@/lib/game-data"
import { speak } from "@/lib/voice"
import { playChime } from "@/lib/sounds"
import {
  buildMultiplayerBoard,
  multiplayerGridCols,
  pairsFor,
  type MultiplayerConfig,
  type Player,
  NON_MATCH_REVEAL_MS,
  MATCH_APPLY_MS,
  INITIAL_MEMORIZE_SECONDS,
} from "@/lib/multiplayer"
import { defaultAvatarFor } from "@/lib/avatars"
import type { CardContent } from "@/lib/types"

type Phase = "memorize" | "play" | "complete"

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

  const [phase, setPhase] = useState<Phase>("memorize")
  const [cards, setCards] = useState<GameCard[]>(() =>
    buildMultiplayerBoard(sourceDeck, totalPairs).map((card) => ({ ...card, faceUp: true })),
  )
  const [players, setPlayers] = useState<Player[]>(() =>
    config.playerNames.map((name, i) => ({
      name,
      pairs: 0,
      avatarId: config.playerAvatars?.[i] ?? defaultAvatarFor(i),
      teamIndex: config.teamMode && config.playerCount === 4 ? ((i < 2 ? 0 : 1) as 0 | 1) : undefined,
    })),
  )
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [lock, setLock] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(config.turnSeconds)
  const [memorizeLeft, setMemorizeLeft] = useState(INITIAL_MEMORIZE_SECONDS)

  const cardsRef = useRef<GameCard[]>([])
  cardsRef.current = cards
  const selectedRef = useRef<number[]>([])
  selectedRef.current = selected

  const currentPlayer = players[currentIdx]
  const remainingPairs = totalPairs - players.reduce((sum, p) => sum + p.pairs, 0)

  // Keep every card visible during the initial memory window, then begin Player 1's turn.
  useEffect(() => {
    if (phase !== "memorize") return
    const iv = setInterval(() => {
      setMemorizeLeft((seconds) => {
        if (seconds <= 1) {
          clearInterval(iv)
          setCards((cur) => cur.map((card) => ({ ...card, faceUp: false })))
          setPhase("play")
          return 0
        }
        return seconds - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [phase])

  const showBanner = useCallback((msg: string, ttl = 1400) => {
    setBanner(msg)
    setTimeout(() => setBanner((prev) => (prev === msg ? null : prev)), ttl)
  }, [])

  const advanceTurn = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % players.length)
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
        showBanner(t("multi.matchTurnAgain", { name: currentPlayer.name }))
        playChime("match", accessibility.soundEffects)
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
      playChime("miss", accessibility.soundEffects)
      if (accessibility.voiceGuidance)
        speak(t("multi.noMatch", { next: nextName }), language, true)
      advanceTurn()
    }, NON_MATCH_REVEAL_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // Per-turn countdown timer
  useEffect(() => {
    if (!config.timerEnabled || phase !== "play") return
    setTimeLeft(config.turnSeconds)
    const iv = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(iv)
          // Auto-advance if user hasn't completed their turn yet
          if (selectedRef.current.length < 2) {
            const nextName = players[(currentIdx + 1) % players.length]?.name ?? ""
            // Flip any face-up unmatched card back
            setCards((cur) =>
              cur.map((c) => (c.faceUp && !c.matched ? { ...c, faceUp: false } : c)),
            )
            setSelected([])
            setLock(false)
            showBanner(t("multi.timeUp", { next: nextName }))
            playChime("miss", accessibility.soundEffects)
            advanceTurn()
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(iv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, config.timerEnabled, config.turnSeconds, phase])

  // Complete detection
  useEffect(() => {
    if (phase !== "play") return
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setPhase("complete")
      recordRound(totalPairs, `multi:${config.difficulty}:${config.playerCount}`)
      playChime("winner", accessibility.soundEffects)
      if (accessibility.voiceGuidance) speak(t("multi.gameComplete"), language, true)
    }
  }, [cards, phase, totalPairs, config, recordRound, accessibility.soundEffects, accessibility.voiceGuidance, language, t])

  const cols = multiplayerGridCols(cards.length)

  const teamTotals: [number, number] = config.teamMode
    ? [
        players.filter((p) => p.teamIndex === 0).reduce((s, p) => s + p.pairs, 0),
        players.filter((p) => p.teamIndex === 1).reduce((s, p) => s + p.pairs, 0),
      ]
    : [0, 0]

  // ---------- COMPLETE ----------
  if (phase === "complete") {
    const maxPairs = Math.max(...players.map((p) => p.pairs))
    const winners = players.filter((p) => p.pairs === maxPairs)
    const isTie = winners.length > 1

    let winnerHeading: string
    let winnerSubtitle: string | undefined
    let winnerAvatars: string[]

    if (config.teamMode) {
      const [t1, t2] = teamTotals
      const teamTie = t1 === t2
      const winTeamIdx = t1 >= t2 ? 0 : 1
      const winTeamName = config.teamNames[winTeamIdx]
      winnerHeading = teamTie
        ? t("multi.teamTie", { score: String(t1) })
        : t("multi.teamWinner", { name: winTeamName })
      winnerSubtitle = `${config.teamNames[0]}: ${t1} · ${config.teamNames[1]}: ${t2}`
      winnerAvatars = teamTie
        ? players.map((p) => p.avatarId)
        : players.filter((p) => p.teamIndex === winTeamIdx).map((p) => p.avatarId)
    } else {
      winnerHeading = isTie
        ? t("multi.tie", { names: winners.map((w) => w.name).join(" · ") })
        : t("multi.winner", { name: winners[0].name })
      winnerAvatars = winners.map((w) => w.avatarId)
    }

    const rankSorted = [...players].sort((a, b) => b.pairs - a.pairs)

    return (
      <div className="flex flex-col gap-5">
        <Confetti active durationMs={3200} count={70} />
        <ScreenHeader
          title={t("multi.gameComplete")}
          subtitle={winnerSubtitle ?? winnerHeading}
          onBack={onExit}
        />

        <section className="pixel-panel flex flex-col items-center gap-3 bg-card p-6 text-center">
          <div className="flex items-center gap-3">
            {winnerAvatars.map((av, i) => (
              <AvatarBadge key={`${av}-${i}`} id={av} size={56} ring />
            ))}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-primary text-primary-foreground pixel-panel animate-bob">
            <PartyPopper className="h-7 w-7" strokeWidth={2.2} />
          </div>
          <p className="text-xl font-extrabold text-foreground" data-testid="multi-winner-name">
            {winnerHeading}
          </p>
        </section>

        {config.teamMode && (
          <ul className="grid grid-cols-2 gap-2" data-testid="multi-team-scoreboard">
            {[0, 1].map((tIdx) => {
              const total = teamTotals[tIdx]
              const isTop = total === Math.max(...teamTotals)
              return (
                <li
                  key={tIdx}
                  className={`pixel-panel flex flex-col items-center gap-1 px-3 py-3 text-center ${
                    isTop ? "bg-primary/15" : "bg-card"
                  }`}
                  data-testid={`multi-team-total-${tIdx + 1}`}
                >
                  <p className="text-sm font-extrabold text-foreground">
                    {config.teamNames[tIdx]}
                  </p>
                  <p className="text-2xl font-extrabold text-primary">{total}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    {t("multi.pairs")}
                  </p>
                </li>
              )
            })}
          </ul>
        )}

        <ul className="flex flex-col gap-2" data-testid="multi-scoreboard-final">
          {rankSorted.map((p, i) => {
            const isMaxScorer = p.pairs === maxPairs
            const teamLabel =
              p.teamIndex !== undefined ? config.teamNames[p.teamIndex] : null
            return (
              <li
                key={`${p.name}-${i}`}
                className={`pixel-panel flex items-center gap-3 px-4 py-3 ${
                  isMaxScorer ? "bg-primary/15" : "bg-card"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground text-sm font-extrabold">
                  {i + 1}
                </span>
                <AvatarBadge id={p.avatarId} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold text-foreground">{p.name}</p>
                  {teamLabel && (
                    <p className="truncate text-[11px] font-semibold text-muted-foreground">
                      {t("multi.teamOf", { team: teamLabel })}
                    </p>
                  )}
                </div>
                {isMaxScorer && !config.teamMode && (
                  <Trophy className="h-5 w-5 text-primary" strokeWidth={2.6} />
                )}
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
  const timerLow = config.timerEnabled && timeLeft <= 5

  return (
    <div className="flex flex-col gap-3">
      <ScreenHeader
        title={t("multi.title")}
        subtitle={t("multi.instructions")}
        onBack={onExit}
      />

      {/* Team totals — only in team mode */}
      {config.teamMode && (
        <ul
          className="grid grid-cols-2 gap-2"
          data-testid="multi-team-scores"
        >
          {[0, 1].map((tIdx) => {
            const total = teamTotals[tIdx]
            const teamActive =
              players[currentIdx]?.teamIndex === tIdx
            return (
              <li
                key={tIdx}
                data-testid={`multi-team-score-${tIdx + 1}`}
                className={`pixel-panel flex items-center justify-between gap-2 px-3 py-2 ${
                  teamActive ? "bg-primary/20" : "bg-card"
                }`}
              >
                <span className="truncate text-sm font-extrabold text-foreground">
                  {config.teamNames[tIdx]}
                </span>
                <span className="rounded-[8px] bg-primary/15 px-2 py-0.5 text-sm font-extrabold text-primary">
                  {total}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {/* Scoreboard with avatars */}
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
              className={`pixel-panel flex shrink-0 min-w-[7rem] items-center gap-2 px-2.5 py-2 ${
                active ? "bg-primary text-primary-foreground animate-pop" : "bg-card text-foreground"
              }`}
            >
              <AvatarBadge id={p.avatarId} size={32} ring={active} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold leading-tight">{p.name}</p>
                <p className="text-[11px] font-semibold opacity-85">
                  {p.pairs} {t("multi.pairs")}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Current turn banner (with timer) */}
      <div className="min-h-[2.5rem]">
        {phase === "memorize" ? (
          <div className="animate-pop rounded-[12px] bg-primary/15 px-4 py-2 text-center text-base font-extrabold text-primary" data-testid="multi-memorize-banner">
            {t("multi.memorizeCards")} {t("multi.cardsFlipIn", { seconds: String(memorizeLeft) })}
          </div>
        ) : banner ? (
          <div
            className="animate-pop rounded-[12px] bg-primary/15 px-4 py-2 text-center text-base font-extrabold text-primary"
            data-testid="multi-banner"
          >
            {banner}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-[12px] bg-muted px-3 py-2">
            <span className="flex items-center gap-2 text-base font-extrabold text-foreground">
              <AvatarBadge id={currentPlayer.avatarId} size={28} />
              <span data-testid="multi-current-player">
                {t("multi.yourTurn", { name: currentPlayer.name })}
              </span>
            </span>
            <div className="flex items-center gap-3">
              {config.timerEnabled && (
                <span
                  data-testid="multi-timer"
                  className={`flex items-center gap-1 rounded-[8px] px-2 py-0.5 text-sm font-extrabold ${
                    timerLow ? "bg-destructive/15 text-destructive" : "bg-card text-foreground"
                  }`}
                >
                  <TimerIcon className="h-4 w-4" strokeWidth={2.6} />
                  {timeLeft}s
                </span>
              )}
              <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">
                {t("multi.remainingPairs")}: {remainingPairs}
              </span>
            </div>
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
            disabled={phase !== "play" || lock || card.faceUp || card.matched}
          />
        ))}
      </div>

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
