import type { Difficulty, CardContent } from "./types"

export type PlayerCount = 2 | 3 | 4

/** Centralized pair counts — change here to tune the game. */
export const MULTI_PAIR_CONFIG: Record<PlayerCount, Record<Difficulty, number>> = {
  2: { easy: 6, medium: 10, hard: 15 },
  3: { easy: 8, medium: 12, hard: 18 },
  4: { easy: 10, medium: 15, hard: 21 },
}

/** How long non-matching cards stay revealed (ms) before flipping back. */
export const NON_MATCH_REVEAL_MS = 1100
/** Delay before applying the "matched" state (ms). */
export const MATCH_APPLY_MS = 550

export interface Player {
  name: string
  pairs: number
  avatarId: string
}

export interface MultiplayerConfig {
  playerCount: PlayerCount
  playerNames: string[]
  playerAvatars: string[]
  difficulty: Difficulty
  useMemoriesDeck: boolean
  timerEnabled: boolean
  turnSeconds: number
}

/** Default duration for the optional per-turn timer (seconds). */
export const DEFAULT_TURN_SECONDS = 20

export function pairsFor(playerCount: PlayerCount, difficulty: Difficulty): number {
  return MULTI_PAIR_CONFIG[playerCount][difficulty]
}

/** Choose a responsive column count that keeps cards tap-friendly. */
export function multiplayerGridCols(total: number): { mobile: number; tablet: number; desktop: number } {
  if (total <= 12) return { mobile: 3, tablet: 4, desktop: 4 }
  if (total <= 20) return { mobile: 4, tablet: 5, desktop: 5 }
  if (total <= 30) return { mobile: 5, tablet: 6, desktop: 6 }
  if (total <= 36) return { mobile: 5, tablet: 6, desktop: 7 }
  return { mobile: 6, tablet: 7, desktop: 7 }
}

/** Pick `pairs` random contents from a deck, doubled and shuffled. */
export function buildMultiplayerBoard(deck: CardContent[], pairs: number) {
  const shuffled = [...deck].sort(() => Math.random() - 0.5)
  const chosen = shuffled.slice(0, Math.min(pairs, deck.length))
  const doubled = chosen.flatMap((content, i) => [
    { key: `${content.id}-a-${i}`, contentId: content.id, content, faceUp: false, matched: false },
    { key: `${content.id}-b-${i}`, contentId: content.id, content, faceUp: false, matched: false },
  ])
  return doubled.sort(() => Math.random() - 0.5)
}
