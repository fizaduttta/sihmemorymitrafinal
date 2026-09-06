"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { useStore } from "@/lib/store"
import { Scenery } from "@/components/scenery"
import { GameButton } from "@/components/game-button"
import { LANGUAGES } from "@/lib/i18n"

export function TitleScreen({ onEnter }: { onEnter: () => void }) {
  const { name, language, setLanguage, setName, t } = useStore()
  const [draft, setDraft] = useState("")

  const isReturning = Boolean(name)

  function handleBegin() {
    const trimmed = draft.trim()
    if (!trimmed) return
    setName(trimmed)
    onEnter()
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <Scenery />

      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* Logo mark */}
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[20px] bg-primary text-primary-foreground pixel-panel animate-bob">
          <Sparkles className="h-12 w-12" strokeWidth={2.2} />
        </div>

        <h1 className="font-display text-5xl font-extrabold text-foreground text-shadow-soft">
          {t("app.name")}
        </h1>
        <p className="mt-2 text-lg font-semibold text-muted-foreground">{t("app.tagline")}</p>

        {/* Language quick pick — horizontal scroll on small screens */}
        <div
          className="mt-6 flex w-full max-w-full snap-x snap-mandatory gap-2 overflow-x-auto pb-2"
          data-testid="title-language-picker"
          style={{ scrollbarWidth: "thin" }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              data-testid={`title-lang-${lang.code}`}
              onClick={() => setLanguage(lang.code)}
              className={`pixel-btn shrink-0 snap-start px-3 py-2 text-sm ${
                language === lang.code ? "bg-accent text-accent-foreground" : "bg-card text-foreground"
              }`}
              title={lang.english}
            >
              <span className="mr-1" aria-hidden>{lang.flag}</span>
              <span className="font-extrabold">{lang.native}</span>
            </button>
          ))}
        </div>

        {isReturning ? (
          <div className="mt-8 w-full pixel-panel bg-card p-6">
            <p className="text-2xl font-extrabold text-foreground">
              {t("title.welcomeBack", { name: name as string })}
            </p>
            <p className="mt-2 text-base font-medium text-muted-foreground">
              {t("title.readyJourney")}
            </p>
            <div className="mt-5">
              <GameButton
                label={t("common.continue")}
                icon="heart"
                variant="primary"
                onClick={onEnter}
                fullWidth
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 w-full pixel-panel bg-card p-6">
            <label htmlFor="name" className="block text-xl font-extrabold text-foreground">
              {t("title.enterName")}
            </label>
            <input
              id="name"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  handleBegin()
                }
              }}
              placeholder={t("title.namePlaceholder")}
              autoComplete="name"
              className="mt-4 w-full rounded-[12px] border-[3px] border-wood-dark bg-background px-4 py-4 text-center text-2xl font-bold text-foreground outline-none focus:ring-4 focus:ring-primary/40"
            />
            <div className="mt-5">
              <GameButton
                label={t("title.begin")}
                icon="sprout"
                variant="primary"
                onClick={handleBegin}
                disabled={!draft.trim()}
                fullWidth
              />
            </div>
          </div>
        )}

        <p className="mt-6 max-w-sm text-xs font-medium leading-relaxed text-muted-foreground">
          {t("app.disclaimer")}
        </p>
      </div>
    </main>
  )
}
