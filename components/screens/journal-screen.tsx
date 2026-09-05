"use client"

import { useState } from "react"
import { Trash2, Pencil, Share2, Lock } from "lucide-react"
import { useStore } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton } from "@/components/game-button"
import type { Mood } from "@/lib/types"

const MOODS: Mood[] = ["happy", "calm", "thoughtful", "grateful", "sad"]
const MOOD_COLOR: Record<Mood, string> = {
  happy: "#dda12b",
  calm: "#4a90c2",
  thoughtful: "#8267be",
  grateful: "#4a9d6b",
  sad: "#b0475a",
}

export function JournalScreen({ onBack }: { onBack: () => void }) {
  const { t, journal, addJournal, updateJournal, deleteJournal } = useStore()
  const [editing, setEditing] = useState<string | "new" | null>(null)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [mood, setMood] = useState<Mood | undefined>()
  const [shared, setShared] = useState(false)

  function openNew() {
    setEditing("new")
    setTitle("")
    setBody("")
    setMood(undefined)
    setShared(false)
  }

  function openEdit(id: string) {
    const e = journal.find((j) => j.id === id)
    if (!e) return
    setEditing(id)
    setTitle(e.title)
    setBody(e.body)
    setMood(e.mood)
    setShared(e.shared)
  }

  function save() {
    if (!title.trim() && !body.trim()) return
    if (editing === "new") {
      addJournal({ title: title.trim() || t("journal.new"), body: body.trim(), mood, shared })
    } else if (editing) {
      updateJournal(editing, { title: title.trim(), body: body.trim(), mood, shared })
    }
    setEditing(null)
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-4">
        <ScreenHeader title={t("journal.new")} onBack={() => setEditing(null)} />

        <div className="pixel-panel flex flex-col gap-4 bg-card p-4">
          <div>
            <label htmlFor="j-title" className="block text-base font-extrabold text-foreground">
              {t("journal.entryTitle")}
            </label>
            <input
              id="j-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("journal.titlePlaceholder")}
              className="mt-2 w-full rounded-[12px] border-[3px] border-wood-dark bg-background px-4 py-3 text-lg font-bold outline-none focus:ring-4 focus:ring-primary/40"
            />
          </div>
          <div>
            <label htmlFor="j-body" className="block text-base font-extrabold text-foreground">
              {t("journal.write")}
            </label>
            <textarea
              id="j-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("journal.writePlaceholder")}
              rows={6}
              className="mt-2 w-full rounded-[12px] border-[3px] border-wood-dark bg-background px-4 py-3 text-lg font-medium outline-none focus:ring-4 focus:ring-primary/40"
            />
          </div>
          <div>
            <p className="text-base font-extrabold text-foreground">{t("journal.mood")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(mood === m ? undefined : m)}
                  className={`pixel-btn px-4 py-2 text-base ${mood === m ? "text-white" : "bg-card text-foreground"}`}
                  style={mood === m ? { backgroundColor: MOOD_COLOR[m] } : undefined}
                >
                  {t(`journal.mood.${m}`)}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShared((s) => !s)}
            className={`flex items-center justify-between rounded-[12px] border-[3px] border-wood-dark px-4 py-3 ${
              shared ? "bg-primary/15" : "bg-background"
            }`}
          >
            <span className="flex items-center gap-2 text-base font-bold text-foreground">
              <Share2 className="h-5 w-5" strokeWidth={2.4} />
              {t("journal.share")}
            </span>
            <span className={`text-base font-extrabold ${shared ? "text-primary" : "text-muted-foreground"}`}>
              {shared ? t("settings.on") : t("settings.off")}
            </span>
          </button>

          <div className="flex gap-3">
            <GameButton label={t("common.save")} icon="feather" variant="primary" onClick={save} />
            <GameButton label={t("common.cancel")} variant="soft" onClick={() => setEditing(null)} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title={t("journal.title")} subtitle={t("journal.subtitle")} onBack={onBack} />

      <GameButton label={t("journal.new")} icon="feather" variant="primary" onClick={openNew} />

      {journal.length === 0 ? (
        <p className="rounded-[12px] bg-muted p-5 text-center text-base font-medium text-muted-foreground">
          {t("journal.empty")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {journal.map((e) => (
            <article key={e.id} className="pixel-panel bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="flex-1 text-lg font-extrabold text-foreground">{e.title}</h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                    e.shared ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {e.shared ? <Share2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {e.shared ? t("journal.shared") : t("journal.private")}
                </span>
              </div>
              {e.mood && (
                <span
                  className="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: MOOD_COLOR[e.mood] }}
                >
                  {t(`journal.mood.${e.mood}`)}
                </span>
              )}
              {e.body && <p className="mt-2 whitespace-pre-wrap text-base font-medium text-foreground">{e.body}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(e.id)}
                  className="pixel-btn flex items-center gap-1 bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2.4} />
                  {t("common.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => deleteJournal(e.id)}
                  className="pixel-btn flex items-center gap-1 bg-card px-3 py-2 text-sm text-destructive"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.4} />
                  {t("common.delete")}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
