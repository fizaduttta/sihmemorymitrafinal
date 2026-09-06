/**
 * Cute pixel-block avatars for local multiplayer.
 * Uses existing lucide icons + palette colors so the visual language matches
 * the rest of MemoryMitra.
 */
export interface Avatar {
  id: string
  icon: string
  color: string
}

export const AVATARS: Avatar[] = [
  { id: "leaf",   icon: "leaf",         color: "#4a9d6b" },
  { id: "flower", icon: "flower",       color: "#b0475a" },
  { id: "bird",   icon: "bird",         color: "#4a90c2" },
  { id: "fish",   icon: "fish",         color: "#3fa79a" },
  { id: "star",   icon: "star",         color: "#dda12b" },
  { id: "sun",    icon: "sun",          color: "#d1793f" },
  { id: "cloud",  icon: "cloud",        color: "#8267be" },
  { id: "heart",  icon: "heart",        color: "#a9743f" },
]

export function avatarById(id?: string | null): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0]
}

/** Default cycling picks so setup screens have friendly defaults. */
export function defaultAvatarFor(index: number): string {
  return AVATARS[index % AVATARS.length].id
}
