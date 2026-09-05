"use client"

import { useRef, useState } from "react"
import { Trash2, ImagePlus, Check } from "lucide-react"
import { useStore } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton } from "@/components/game-button"
import { getIcon } from "@/lib/icons"

const ICON_CHOICES = [
  "heart",
  "house",
  "flower",
  "tree-pine",
  "sun",
  "bird",
  "fish",
  "coffee",
  "gift",
  "music",
  "star",
  "sailboat",
]
const COLOR_CHOICES = ["#b0475a", "#4a90c2", "#4a9d6b", "#d1793f", "#dda12b", "#8267be"]

export function MemoriesScreen({ onBack }: { onBack: () => void }) {
  const { t, memories, addMemory, deleteMemory } = useStore()
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState("")
  const [icon, setIcon] = useState(ICON_CHOICES[0])
  const [color, setColor] = useState(COLOR_CHOICES[0])
  const [image, setImage] = useState<string | undefined>()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  function save() {
    if (!label.trim()) return
    addMemory({ label: label.trim(), icon, color, image })
    setLabel("")
    setIcon(ICON_CHOICES[0])
    setColor(COLOR_CHOICES[0])
    setImage(undefined)
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title={t("memories.title")} subtitle={t("memories.subtitle")} onBack={onBack} />

      {!adding && (
        <GameButton
          label={t("memories.add")}
          icon="heart"
          variant="primary"
          onClick={() => setAdding(true)}
        />
      )}

      {adding && (
        <section className="pixel-panel bg-card p-4">
          <label htmlFor="mem-label" className="block text-base font-extrabold text-foreground">
            {t("memories.label")}
          </label>
          <input
            id="mem-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t("memories.labelPlaceholder")}
            className="mt-2 w-full rounded-[12px] border-[3px] border-wood-dark bg-background px-4 py-3 text-lg font-bold outline-none focus:ring-4 focus:ring-primary/40"
          />

          {/* Image upload */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="pixel-btn flex items-center gap-2 bg-secondary px-4 py-2 text-base text-secondary-foreground"
            >
              <ImagePlus className="h-5 w-5" strokeWidth={2.4} />
              {t("memories.chooseImage")}
            </button>
            {image && (
              <img
                src={image || "/placeholder.svg"}
                alt=""
                className="h-14 w-14 rounded-[10px] border-[3px] border-wood-dark object-cover"
              />
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
          </div>

          {/* Icon picker (when no image) */}
          {!image && (
            <>
              <p className="mt-4 text-sm font-bold text-muted-foreground">{t("memories.pickIcon")}</p>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {ICON_CHOICES.map((ic) => {
                  const Icon = getIcon(ic)
                  return (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`flex aspect-square items-center justify-center rounded-[10px] border-[3px] text-white ${
                        icon === ic ? "border-wood-dark" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.4} />
                    </button>
                  )
                })}
              </div>
              <div className="mt-3 flex gap-2">
                {COLOR_CHOICES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={`h-9 w-9 rounded-full border-[3px] ${
                      color === c ? "border-wood-dark" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </>
          )}

          <div className="mt-5 flex gap-3">
            <GameButton label={t("common.save")} icon="heart" variant="primary" onClick={save} />
            <GameButton
              label={t("common.cancel")}
              variant="soft"
              onClick={() => setAdding(false)}
            />
          </div>
        </section>
      )}

      {/* List */}
      {memories.length === 0 ? (
        <p className="rounded-[12px] bg-muted p-5 text-center text-base font-medium text-muted-foreground">
          {t("memories.empty")}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {memories.map((m) => {
            const Icon = getIcon(m.icon)
            return (
              <div key={m.id} className="pixel-panel relative flex flex-col items-center gap-2 bg-card p-3">
                {m.image ? (
                  <img
                    src={m.image || "/placeholder.svg"}
                    alt={m.label}
                    className="h-16 w-16 rounded-[10px] object-cover"
                  />
                ) : (
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-[10px] text-white"
                    style={{ backgroundColor: m.color }}
                  >
                    <Icon className="h-8 w-8" strokeWidth={2.4} />
                  </span>
                )}
                <span className="line-clamp-2 text-center text-xs font-bold leading-tight">
                  {m.label}
                </span>
                <button
                  type="button"
                  onClick={() => deleteMemory(m.id)}
                  aria-label={t("common.delete")}
                  className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-wood-dark bg-destructive text-white"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {memories.length >= 3 && (
        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
          <Check className="h-4 w-4" strokeWidth={3} />
          {t("game.myMemoriesDeckDesc")}
        </p>
      )}
    </div>
  )
}
