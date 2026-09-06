/**
 * Lightweight Web-Audio synthesized chimes.
 * No external assets, no dependencies — creates short soft tones on demand.
 * Silently no-ops on unsupported environments (SSR, older browsers).
 */

type ChimeKind = "match" | "miss" | "winner" | "turn"

let ctx: AudioContext | null = null
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (ctx) return ctx
  const Ctor =
    (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  try {
    ctx = new Ctor()
  } catch {
    return null
  }
  return ctx
}

function tone(freq: number, startAt: number, durationSec: number, gain = 0.14) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = "sine"
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, c.currentTime + startAt)
  g.gain.linearRampToValueAtTime(gain, c.currentTime + startAt + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + startAt + durationSec)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(c.currentTime + startAt)
  osc.stop(c.currentTime + startAt + durationSec + 0.02)
}

const NOTES = {
  E5: 659.25,
  G5: 783.99,
  B5: 987.77,
  C6: 1046.5,
  A4: 440,
  F4: 349.23,
}

/** Play a small chime. Pass `enabled=false` to opt out (respects settings). */
export function playChime(kind: ChimeKind, enabled: boolean) {
  if (!enabled) return
  const c = getCtx()
  if (!c) return
  // Some browsers require a user gesture; if suspended, try resume().
  if (c.state === "suspended") {
    c.resume().catch(() => {})
  }
  switch (kind) {
    case "match":
      tone(NOTES.E5, 0, 0.18)
      tone(NOTES.G5, 0.09, 0.22)
      break
    case "miss":
      tone(NOTES.A4, 0, 0.14, 0.1)
      tone(NOTES.F4, 0.08, 0.16, 0.1)
      break
    case "winner":
      tone(NOTES.E5, 0, 0.18)
      tone(NOTES.G5, 0.12, 0.18)
      tone(NOTES.B5, 0.24, 0.22)
      tone(NOTES.C6, 0.36, 0.35, 0.16)
      break
    case "turn":
      tone(NOTES.G5, 0, 0.1, 0.08)
      break
  }
}
