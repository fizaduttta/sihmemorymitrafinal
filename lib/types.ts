export type Language = "en" | "hi" | "as"

export type TextSize = "small" | "medium" | "large"

export type Difficulty = "easy" | "medium" | "hard"

export type Mood = "happy" | "calm" | "thoughtful" | "grateful" | "sad"

export type StateId =
  | "arunachal"
  | "assam"
  | "manipur"
  | "meghalaya"
  | "mizoram"
  | "nagaland"
  | "sikkim"
  | "tripura"

export type CategoryId = "nature" | "places" | "arts" | "cultural" | "food"

export interface CardContent {
  id: string
  /** i18n key for the label, or raw label for custom memories */
  labelKey?: string
  label?: string
  /** lucide icon name */
  icon: string
  /** image data url for personalized memories */
  image?: string
  color: string
}

export interface JournalEntry {
  id: string
  title: string
  body: string
  mood?: Mood
  shared: boolean
  createdAt: number
  updatedAt: number
}

export interface CustomMemory {
  id: string
  label: string
  image?: string
  icon: string
  color: string
  createdAt: number
}

export interface ChatMessage {
  id: string
  from: "user" | "companion"
  text: string
  at: number
}

export interface AccessibilitySettings {
  textSize: TextSize
  reducedMotion: boolean
  highContrast: boolean
  voiceGuidance: boolean
}

export interface Progress {
  gamesPlayed: number
  roundsCompleted: number
  pairsMatched: number
  deckPlays: Record<string, number>
  unlockedThemes: string[]
}

export interface AppState {
  name: string | null
  language: Language
  accessibility: AccessibilitySettings
  progress: Progress
  journal: JournalEntry[]
  memories: CustomMemory[]
  chat: ChatMessage[]
  caregiverPin: string | null
}
