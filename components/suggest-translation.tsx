"use client"

import { useState } from "react"
import { Send, Trash2, MessageSquarePlus } from "lucide-react"
import { useStore } from "@/lib/store"
import { LANGUAGES } from "@/lib/i18n"

/**
 * Lets native speakers (or caregivers on their behalf) suggest a better
 * translation for any string. Suggestions are stored locally so they persist
 * across sessions and can later be exported/reviewed for a translator pass.
 */
export function SuggestTranslation() {
  const { t, language, translationSuggestions, addTranslationSuggestion, deleteTranslationSuggestion } =
    useStore()
  const [original, setOriginal] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [note, setNote] = useState("")
  const [saved, setSaved] = useState(false)

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  function submit() {
    if (!suggestion.trim()) return
    addTranslationSuggestion({
      language,
      original: original.trim(),
      suggestion: suggestion.trim(),
      note: note.trim() || undefined,
    })
    setOriginal("")
    setSuggestion("")
    setNote("")
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const mine = (translationSuggestions ?? []).filter((s) => s.language === language)

  return (
    <section className="pixel-panel bg-card p-4" data-testid="suggest-translation-section">
      <div className="mb-1 flex items-center gap-2">
        <MessageSquarePlus className="h-5 w-5 text-primary" strokeWidth={2.4} />
        <h2 className="text-lg font-extrabold text-foreground">{t("suggest.title")}</h2>
      </div>
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        {t("suggest.subtitle", { language: `${currentLang.flag} ${currentLang.native}` })}
      </p>

      <label className="mb-1 block text-sm font-bold text-foreground">
        {t("suggest.original")}
      </label>
      <input
        value={original}
        onChange={(e) => setOriginal(e.target.value)}
        data-testid="suggest-original-input"
        placeholder={t("suggest.originalPlaceholder")}
        className="mb-3 w-full rounded-[10px] border-[3px] border-wood-dark bg-background px-3 py-2 text-base font-medium outline-none focus:ring-4 focus:ring-primary/40"
      />

      <label className="mb-1 block text-sm font-bold text-foreground">
        {t("suggest.better")}
      </label>
      <textarea
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        data-testid="suggest-better-input"
        placeholder={t("suggest.betterPlaceholder")}
        rows={2}
        className="mb-3 w-full rounded-[10px] border-[3px] border-wood-dark bg-background px-3 py-2 text-base font-medium outline-none focus:ring-4 focus:ring-primary/40"
      />

      <label className="mb-1 block text-sm font-bold text-foreground">
        {t("suggest.note")}
      </label>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        data-testid="suggest-note-input"
        placeholder={t("suggest.notePlaceholder")}
        className="mb-3 w-full rounded-[10px] border-[3px] border-wood-dark bg-background px-3 py-2 text-base font-medium outline-none focus:ring-4 focus:ring-primary/40"
      />

      <button
        type="button"
        onClick={submit}
        data-testid="suggest-submit"
        disabled={!suggestion.trim()}
        className="pixel-btn flex items-center gap-2 bg-primary px-5 py-2.5 text-primary-foreground disabled:opacity-50"
      >
        <Send className="h-4 w-4" strokeWidth={2.6} />
        {t("suggest.submit")}
      </button>

      {saved && (
        <p className="mt-3 rounded-[10px] bg-primary/15 px-3 py-2 text-sm font-bold text-primary" data-testid="suggest-saved">
          {t("suggest.saved")}
        </p>
      )}

      {mine.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-bold text-foreground">
            {t("suggest.mine")} ({mine.length})
          </p>
          <ul className="flex flex-col gap-2">
            {mine.map((s) => (
              <li
                key={s.id}
                className="flex items-start gap-2 rounded-[10px] bg-muted px-3 py-2"
              >
                <div className="flex-1">
                  {s.original && (
                    <p className="text-xs font-semibold text-muted-foreground line-through">
                      {s.original}
                    </p>
                  )}
                  <p className="text-sm font-extrabold text-foreground">{s.suggestion}</p>
                  {s.note && (
                    <p className="text-xs font-medium text-muted-foreground">— {s.note}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteTranslationSuggestion(s.id)}
                  aria-label={t("common.delete")}
                  data-testid={`suggest-delete-${s.id}`}
                  className="pixel-btn flex h-8 w-8 items-center justify-center bg-card text-foreground"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
