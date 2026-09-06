"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Moon, Sun } from "lucide-react"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton } from "@/components/game-button"
import { SuggestTranslation } from "@/components/suggest-translation"
import { LANGUAGES } from "@/lib/i18n"
import type { TextSize } from "@/lib/types"

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const { t, name, setName, language, setLanguage, themeMode, setThemeMode, accessibility, setAccessibility, resetProgress } =
    useStore()
  const [nameDraft, setNameDraft] = useState(name ?? "")

  const textSizes: TextSize[] = ["small", "medium", "large"]

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title={t("settings.title")} subtitle={t("settings.subtitle")} onBack={onBack} />

      {/* Text size */}
      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("settings.textSize")}</h2>
        <div className="flex gap-2">
          {textSizes.map((ts) => (
            <button
              key={ts}
              type="button"
              data-testid={`text-size-${ts}`}
              onClick={() => setAccessibility({ textSize: ts })}
              className={`pixel-btn flex-1 py-3 ${
                accessibility.textSize === ts ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
              style={{ fontSize: ts === "small" ? "0.9rem" : ts === "medium" ? "1.05rem" : "1.25rem" }}
            >
              {t(`settings.${ts}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="pixel-panel bg-card p-4" data-testid="settings-theme-section">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("settings.themeMode")}</h2>
        <div className="flex gap-2">
          <button type="button" data-testid="settings-day-mode" onClick={() => setThemeMode("day")} className={`pixel-btn flex flex-1 items-center justify-center gap-2 py-3 ${themeMode === "day" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>
            <Sun className="h-5 w-5" /> {t("settings.dayMode")}
          </button>
          <button type="button" data-testid="settings-night-mode" onClick={() => setThemeMode("night")} className={`pixel-btn flex flex-1 items-center justify-center gap-2 py-3 ${themeMode === "night" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>
            <Moon className="h-5 w-5" /> {t("settings.nightMode")}
          </button>
        </div>
      </section>

      {/* Language */}
      <section className="pixel-panel bg-card p-4" data-testid="settings-language-section">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">{t("settings.language")}</h2>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              data-testid={`language-option-${lang.code}`}
              onClick={() => setLanguage(lang.code)}
              className={`pixel-btn flex flex-col items-start gap-0.5 px-3 py-2.5 text-left ${
                language === lang.code ? "bg-accent text-accent-foreground" : "bg-card text-foreground"
              }`}
            >
              <span className="flex items-center gap-2 text-base font-extrabold leading-tight">
                <span aria-hidden>{lang.flag}</span>
                <span>{lang.native}</span>
              </span>
              <span className="text-[11px] font-semibold leading-tight opacity-75">
                {lang.english}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Toggles */}
      <section className="pixel-panel flex flex-col gap-3 bg-card p-4">
        <Toggle
          label={t("settings.reducedMotion")}
          testid="settings-toggle-reduced-motion"
          on={accessibility.reducedMotion}
          onToggle={() => setAccessibility({ reducedMotion: !accessibility.reducedMotion })}
          t={t}
        />
        <Toggle
          label={t("settings.highContrast")}
          testid="settings-toggle-high-contrast"
          on={accessibility.highContrast}
          onToggle={() => setAccessibility({ highContrast: !accessibility.highContrast })}
          t={t}
        />
        <Toggle
          label={t("settings.voiceGuidance")}
          testid="settings-toggle-voice-guidance"
          on={accessibility.voiceGuidance}
          onToggle={() => setAccessibility({ voiceGuidance: !accessibility.voiceGuidance })}
          t={t}
        />
        <Toggle
          label={t("settings.soundEffects")}
          testid="settings-toggle-sound-effects"
          on={accessibility.soundEffects}
          onToggle={() => setAccessibility({ soundEffects: !accessibility.soundEffects })}
          t={t}
        />
        <Toggle
          label={t("settings.music")}
          testid="settings-toggle-music"
          on={accessibility.music}
          onToggle={() => setAccessibility({ music: !accessibility.music })}
          t={t}
        />
      </section>

      {/* Name */}
      <section className="pixel-panel bg-card p-4">
        <label htmlFor="set-name" className="block text-lg font-extrabold text-foreground">
          {t("settings.changeName")}
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="set-name"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            className="flex-1 rounded-[12px] border-[3px] border-wood-dark bg-background px-4 py-3 text-lg font-bold outline-none focus:ring-4 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={() => nameDraft.trim() && setName(nameDraft.trim())}
            className="pixel-btn bg-primary px-5 text-primary-foreground"
          >
            {t("common.save")}
          </button>
        </div>
      </section>

      {/* Suggest a better translation */}
      <SuggestTranslation />

      {/* Reset */}
      <GameButton
        label={t("settings.resetProgress")}
        variant="soft"
        onClick={() => {
          if (confirm(t("settings.resetConfirm"))) resetProgress()
        }}
      />

      <p className="max-w-md text-xs font-medium leading-relaxed text-muted-foreground">
        {t("app.disclaimer")}
      </p>
    </div>
  )
}

function Toggle({
  label,
  testid,
  on,
  onToggle,
  t,
}: {
  label: string
  testid: string
  on: boolean
  onToggle: () => void
  t: (k: string) => string
}) {
  return (
    <button
      type="button"
      data-testid={testid}
      onClick={onToggle}
      className="flex items-center justify-between rounded-[12px] border-[3px] border-wood-dark bg-background px-4 py-3"
    >
      <span className="text-base font-bold text-foreground">{label}</span>
      <span
        className={`flex h-8 w-16 items-center rounded-full border-[3px] border-wood-dark p-0.5 transition-colors ${
          on ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-8" : ""}`}
        />
      </span>
    </button>
  )
}
