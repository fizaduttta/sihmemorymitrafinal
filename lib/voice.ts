import type { Language } from "./types"

const langCodes: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  as: "as-IN",
  bn: "bn-IN",
  brx: "hi-IN",
  mni: "bn-IN",
  kha: "en-IN",
  lus: "en-IN",
  nag: "as-IN",
  kok: "en-IN",
  ne: "ne-NP",
}

export function speak(text: string, lang: Language, enabled: boolean) {
  if (!enabled) return
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = langCodes[lang] ?? "en-IN"
    u.rate = 0.92
    u.pitch = 1
    window.speechSynthesis.speak(u)
  } catch {
    // speech synthesis unavailable
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    // ignore
  }
}
