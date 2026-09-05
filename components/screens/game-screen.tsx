"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Timer, PartyPopper } from "lucide-react"
import { useStore } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton } from "@/components/game-button"
import { MemoryCard, type GameCard } from "@/components/memory-card"
import { CLASSIC_DECK, DIFFICULTIES, DIFFICULTY_ROUNDS } from "@/lib/game-data"
import { getIcon } from "@/lib/icons"
import type { CardContent, Difficulty } from "@/lib/types"
import type { GameConfig } from "@/lib/navigation"
import { speak } from "@/lib/voice"

type Phase = "setup" | "preview" | "play" | "complete"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound(deck: CardContent[], pairs: number): GameCard[] {
  const chosen = shuffle(deck).slice(0, Math.min(pairs, deck.length))
  const doubled = chosen.flatMap((content, i) => [
    { key: `${content.id}-a-${i}`, contentId: content.id, content, faceUp: true, matched: false },
    { key: `${content.id}-b-${i}`, contentId: content.id, content, faceUp: true, matched: false },
  ])
  return shuffle(doubled)
}

function gridCols(count: number): number {
  if (count <= 6) return 3
  if (count % 3 === 0) return 3
  return 4
}

export function GameScreen({
  config,
  onExit,
}: {
  config: GameConfig | null
  onExit: () => void
}) {
  const { t, name, language, accessibility, recordRound, memories } = useStore()

  const [phase, setPhase] = useState<Phase>("setup")
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [deckSource, setDeckSource] = useState<{ deck: CardContent[]; id: string; nameLabel: string } | null>(null)
  const [roundIndex, setRoundIndex] = useState(0)
  const [cards, setCards] = useState<GameCard[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [lock, setLock] = useState(false)
  const [moves, setMoves] = useState(0)
  const [previewLeft, setPreviewLeft] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)

  const cardsRef = useRef<GameCard[]>([])
  cardsRef.current = cards
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rounds = difficulty ? DIFFICULTY_ROUNDS[difficulty] : []
  const round = rounds[roundIndex]

  const memoriesDeck: CardContent[] = memories.map((m) => ({
    id: m.id,
    label: m.label,
    icon: m.icon,
    image: m.image,
    color: m.color,
  }))

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg)
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => setFeedback(null), 1400)
  }, [])

  const startRound = useCallback(
    (deck: CardContent[], diff: Difficulty, idx: number) => {
      const cfg = DIFFICULTY_ROUNDS[diff][idx]
      setCards(buildRound(deck, cfg.pairs))
      setSelected([])
      setLock(false)
      setMoves(0)
      setPreviewLeft(cfg.preview)
      setPhase("preview")
      if (accessibility.voiceGuidance) speak(t("game.memorize"), language, true)
    },
    [accessibility.voiceGuidance, language, t],
  )

  // Auto-pick deck from config
  useEffect(() => {
    if (config) {
      setDeckSource({ deck: config.deck ?? CLASSIC_DECK, id: config.deckId, nameLabel: config.deckName })
    }
  }, [config])

  // Preview countdown
  useEffect(() => {
    if (phase !== "preview") return
    if (previewLeft <= 0) {
      setCards((cur) => cur.map((c) => ({ ...c, faceUp: false })))
      setPhase("play")
      if (accessibility.voiceGuidance) speak(t("game.findPairs"), language, true)
      return
    }
    const id = setTimeout(() => setPreviewLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, previewLeft, accessibility.voiceGuidance, language, t])

  // Resolve a pair
  useEffect(() => {
    if (selected.length !== 2) return
    setLock(true)
    setMoves((m) => m + 1)
    const [a, b] = selected
    const match = cardsRef.current[a]?.contentId === cardsRef.current[b]?.contentId
    if (match) {
      const id = setTimeout(() => {
        setCards((cur) => cur.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)))
        setSelected([])
        setLock(false)
        showFeedback(t("game.greatMatch"))
        if (accessibility.voiceGuidance) speak(t("game.greatMatch"), language, true)
      }, 650)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => {
      setCards((cur) => cur.map((c, i) => (i === a || i === b ? { ...c, faceUp: false } : c)))
      setSelected([])
      setLock(false)
      showFeedback(t("game.almost"))
    }, 1000)
    return () => clearTimeout(id)
  }, [selected, showFeedback, t, accessibility.voiceGuidance, language])

  // Round completion
  useEffect(() => {
    if (phase !== "play") return
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setPhase("complete")
      if (deckSource && round) recordRound(round.pairs, deckSource.id)
      if (accessibility.voiceGuidance)
        speak(t("game.wellDone", { name: name ?? "" }), language, true)
    }
  }, [cards, phase, deckSource, round, recordRound, name, language, accessibility.voiceGuidance, t])

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    }
  }, [])

  function handleFlip(i: number) {
    if (lock || phase !== "play") return
    const c = cards[i]
    if (!c || c.matched || c.faceUp) return
    setCards((cur) => cur.map((x, idx) => (idx === i ? { ...x, faceUp: true } : x)))
    setSelected((s) => [...s, i])
  }

  function chooseDifficulty(diff: Difficulty) {
    setDifficulty(diff)
    setRoundIndex(0)
    if (deckSource) startRound(deckSource.deck, diff, 0)
  }

  function chooseDeck(deck: CardContent[], id: string, nameLabel: string) {
    setDeckSource({ deck, id, nameLabel })
    if (difficulty) startRound(deck, difficulty, 0)
  }

  function nextRound() {
    if (!difficulty || !deckSource) return
    const next = roundIndex + 1
    if (next < rounds.length) {
      setRoundIndex(next)
      startRound(deckSource.deck, difficulty, next)
    } else {
      // journey through all rounds complete -> back to setup
      setPhase("setup")
      setDifficulty(null)
      setRoundIndex(0)
      if (!config) setDeckSource(null)
    }
  }

  function playAgain() {
    if (!difficulty || !deckSource) return
    startRound(deckSource.deck, difficulty, roundIndex)
  }

  const deckTitle = deckSource?.nameLabel ?? t("game.title")

  // ---------- SETUP ----------
  if (phase === "setup") {
    return (
      <div className="flex flex-col gap-6">
        <ScreenHeader title={t("game.title")} subtitle={t("game.chooseDifficulty")} onBack={onExit} />

        <section className="flex flex-col gap-3">
          {DIFFICULTIES.map(({ id, icon }) => (
            <GameButton
              key={id}
              label={t(`game.${id}`)}
              description={t(`game.${id}Desc`)}
              icon={icon}
              variant={difficulty === id ? "primary" : "soft"}
              onClick={() => chooseDifficulty(id)}
            />
          ))}
        </section>

        {!config && (
          <section>
            <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("game.chooseDeck")}</h2>
            <div className="flex flex-col gap-3">
              <GameButton
                label={t("game.classicDeck")}
                description={t("game.classicDeckDesc")}
                icon="star"
                variant="sky"
                onClick={() => chooseDeck(CLASSIC_DECK, "classic", t("game.classicDeck"))}
              />
              <GameButton
                label={t("game.myMemoriesDeck")}
                description={
                  memoriesDeck.length >= 3
                    ? t("game.myMemoriesDeckDesc")
                    : t("game.notEnoughMemories")
                }
                icon="heart"
                variant="accent"
                disabled={memoriesDeck.length < 3}
                onClick={() => chooseDeck(memoriesDeck, "memories", t("game.myMemoriesDeck"))}
              />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              {t("game.chooseDifficulty")}
            </p>
          </section>
        )}
      </div>
    )
  }

  // ---------- COMPLETE ----------
  if (phase === "complete") {
    const isLast = roundIndex >= rounds.length - 1
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[20px] bg-primary text-primary-foreground pixel-panel animate-bob">
          <PartyPopper className="h-12 w-12" strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            {t("game.roundComplete")}
          </h1>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {t("game.wellDone", { name: name ?? "" })}
          </p>
          <p className="mt-1 text-base font-medium text-muted-foreground">{t("game.keepGoing")}</p>
        </div>

        <div className="flex gap-3">
          <div className="pixel-panel bg-card px-5 py-3 text-center">
            <p className="text-2xl font-extrabold text-primary">{round?.pairs ?? 0}</p>
            <p className="text-xs font-bold text-muted-foreground">{t("game.pairsMatched")}</p>
          </div>
          <div className="pixel-panel bg-card px-5 py-3 text-center">
            <p className="text-2xl font-extrabold text-accent">{moves}</p>
            <p className="text-xs font-bold text-muted-foreground">{t("game.moves")}</p>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          {!isLast && (
            <GameButton
              label={t("game.nextRound")}
              icon="star"
              variant="primary"
              onClick={nextRound}
            />
          )}
          <GameButton label={t("game.playAgain")} icon="heart" variant="sky" onClick={playAgain} />
          <GameButton label={t("game.backHome")} icon="house" variant="soft" onClick={onExit} />
        </div>
      </div>
    )
  }

  // ---------- PREVIEW / PLAY ----------
  const cols = gridCols(cards.length)
  const isPreview = phase === "preview"

  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={deckTitle}
        subtitle={t("game.roundOf", { n: String(roundIndex + 1), total: String(rounds.length) })}
        onBack={onExit}
      />

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3">
        <div
          className={`pixel-panel flex items-center gap-2 px-4 py-2 ${
            isPreview ? "bg-accent text-accent-foreground" : "bg-card text-foreground"
          }`}
        >
          <Timer className="h-5 w-5" strokeWidth={2.6} />
          <span className="text-lg font-extrabold tabular-nums">
            {isPreview ? previewLeft : t("game.findPairs")}
          </span>
        </div>
        <div className="pixel-panel bg-card px-4 py-2 text-sm font-bold text-muted-foreground">
          {t("game.moves")}: <span className="text-foreground">{moves}</span>
        </div>
      </div>

      {/* Instruction / feedback banner */}
      <div className="min-h-[2.5rem]">
        {feedback ? (
          <div className="animate-pop rounded-[12px] bg-primary/15 px-4 py-2 text-center text-lg font-extrabold text-primary">
            {feedback}
          </div>
        ) : (
          <p className="text-center text-base font-semibold text-muted-foreground">
            {isPreview ? t("game.memorize") : t("game.tapToFlip")}
          </p>
        )}
      </div>

      {/* Board */}
      <div
        className="mx-auto grid w-full max-w-md gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card, i) => (
          <MemoryCard key={card.key} card={card} onFlip={() => handleFlip(i)} disabled={isPreview || lock} />
        ))}
      </div>
    </div>
  )
}
