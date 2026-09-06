"use client"

import { getIcon } from "@/lib/icons"
import { avatarById } from "@/lib/avatars"

export function AvatarBadge({
  id,
  size = 40,
  ring = false,
}: {
  id?: string | null
  size?: number
  ring?: boolean
}) {
  const a = avatarById(id)
  const Icon = getIcon(a.icon)
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[10px] text-white transition-transform ${
        ring ? "ring-4 ring-primary/60" : ""
      }`}
      style={{
        width: size,
        height: size,
        backgroundColor: a.color,
        boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.15), 0 3px 0 rgba(0,0,0,0.12)",
      }}
      data-testid={`avatar-${a.id}`}
      aria-hidden
    >
      <Icon style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2.6} />
    </span>
  )
}
