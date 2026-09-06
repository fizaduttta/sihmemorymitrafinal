"use client"

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react"
import type {
  AppState,
  Language,
  AccessibilitySettings,
  Progress,
  JournalEntry,
  CustomMemory,
  ChatMessage,
  TranslationSuggestion,
} from "./types"
import { translate } from "./i18n"

const STORAGE_KEY = "memorymitra.v1"

const defaultState: AppState = {
  name: null,
  language: "en",
  accessibility: {
    textSize: "medium",
    reducedMotion: false,
    highContrast: false,
    voiceGuidance: false,
  },
  progress: {
    gamesPlayed: 0,
    roundsCompleted: 0,
    pairsMatched: 0,
    deckPlays: {},
    unlockedThemes: [],
  },
  journal: [],
  memories: [],
  chat: [],
  caregiverPin: null,
  translationSuggestions: [],
}

interface StoreContextValue extends AppState {
  ready: boolean
  t: (key: string, vars?: Record<string, string>) => string
  setName: (name: string) => void
  setLanguage: (lang: Language) => void
  setAccessibility: (patch: Partial<AccessibilitySettings>) => void
  recordRound: (pairs: number, deckId: string) => void
  addJournal: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void
  updateJournal: (id: string, patch: Partial<JournalEntry>) => void
  deleteJournal: (id: string) => void
  addMemory: (memory: Omit<CustomMemory, "id" | "createdAt">) => void
  deleteMemory: (id: string) => void
  addChat: (msg: Omit<ChatMessage, "id" | "at">) => void
  unlockTheme: (theme: string) => void
  setCaregiverPin: (pin: string) => void
  addTranslationSuggestion: (
    entry: Omit<TranslationSuggestion, "id" | "createdAt">,
  ) => void
  deleteTranslationSuggestion: (id: string) => void
  resetProgress: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setState({
          ...defaultState,
          ...parsed,
          accessibility: { ...defaultState.accessibility, ...parsed.accessibility },
          progress: { ...defaultState.progress, ...parsed.progress },
          translationSuggestions: parsed.translationSuggestions ?? [],
        })
      }
    } catch {
      // ignore corrupt storage
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage may be full or unavailable
    }
  }, [state, ready])

  // apply accessibility to <html>
  useEffect(() => {
    if (!ready) return
    const el = document.documentElement
    el.dataset.textSize = state.accessibility.textSize
    el.classList.toggle("reduce-motion", state.accessibility.reducedMotion)
    el.classList.toggle("high-contrast", state.accessibility.highContrast)
    el.lang = state.language
  }, [state.accessibility, state.language, ready])

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => translate(state.language, key, vars),
    [state.language],
  )

  const value = useMemo<StoreContextValue>(() => {
    return {
      ...state,
      ready,
      t,
      setName: (name) => setState((s) => ({ ...s, name: name.trim() || s.name })),
      setLanguage: (language) => setState((s) => ({ ...s, language })),
      setAccessibility: (patch) =>
        setState((s) => ({ ...s, accessibility: { ...s.accessibility, ...patch } })),
      recordRound: (pairs, deckId) =>
        setState((s) => {
          const unlocked = new Set(s.progress.unlockedThemes)
          if (deckId.startsWith("ne:")) unlocked.add(deckId)
          return {
            ...s,
            progress: {
              ...s.progress,
              roundsCompleted: s.progress.roundsCompleted + 1,
              pairsMatched: s.progress.pairsMatched + pairs,
              deckPlays: {
                ...s.progress.deckPlays,
                [deckId]: (s.progress.deckPlays[deckId] ?? 0) + 1,
              },
              unlockedThemes: Array.from(unlocked),
            },
          }
        }),
      addJournal: (entry) =>
        setState((s) => ({
          ...s,
          journal: [
            { ...entry, id: uid(), createdAt: Date.now(), updatedAt: Date.now() },
            ...s.journal,
          ],
        })),
      updateJournal: (id, patch) =>
        setState((s) => ({
          ...s,
          journal: s.journal.map((j) =>
            j.id === id ? { ...j, ...patch, updatedAt: Date.now() } : j,
          ),
        })),
      deleteJournal: (id) =>
        setState((s) => ({ ...s, journal: s.journal.filter((j) => j.id !== id) })),
      addMemory: (memory) =>
        setState((s) => ({
          ...s,
          memories: [{ ...memory, id: uid(), createdAt: Date.now() }, ...s.memories],
        })),
      deleteMemory: (id) =>
        setState((s) => ({ ...s, memories: s.memories.filter((m) => m.id !== id) })),
      addChat: (msg) =>
        setState((s) => ({ ...s, chat: [...s.chat, { ...msg, id: uid(), at: Date.now() }] })),
      unlockTheme: (theme) =>
        setState((s) => ({
          ...s,
          progress: {
            ...s.progress,
            unlockedThemes: Array.from(new Set([...s.progress.unlockedThemes, theme])),
          },
        })),
      setCaregiverPin: (pin) => setState((s) => ({ ...s, caregiverPin: pin })),
      addTranslationSuggestion: (entry) =>
        setState((s) => ({
          ...s,
          translationSuggestions: [
            { ...entry, id: uid(), createdAt: Date.now() },
            ...(s.translationSuggestions ?? []),
          ],
        })),
      deleteTranslationSuggestion: (id) =>
        setState((s) => ({
          ...s,
          translationSuggestions: (s.translationSuggestions ?? []).filter(
            (x) => x.id !== id,
          ),
        })),
      resetProgress: () =>
        setState((s) => ({ ...s, progress: { ...defaultState.progress } })),
    }
  }, [state, ready, t])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

export function countGamesPlayed(progress: Progress) {
  return Object.values(progress.deckPlays).reduce((a, b) => a + b, 0)
}
