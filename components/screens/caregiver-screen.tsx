"use client"

import { useState } from "react"
import { LockKeyhole, ShieldCheck, KeyRound } from "lucide-react"
import { useStore, countGamesPlayed } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { GameButton } from "@/components/game-button"
import { languageNames } from "@/lib/i18n"

const DEFAULT_PIN = "1234"

function onlyDigits(v: string) {
  return v.replace(/\D/g, "").slice(0, 4)
}

export function CaregiverScreen({ onBack }: { onBack: () => void }) {
  const { t, caregiverPin, setCaregiverPin, progress, journal, accessibility, language } = useStore()
  const effectivePin = caregiverPin ?? DEFAULT_PIN

  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)

  // Change-PIN form
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [pinMsg, setPinMsg] = useState<string | null>(null)

  function submit() {
    if (pin === effectivePin) {
      setUnlocked(true)
      setError(false)
      setPin("")
    } else {
      setError(true)
    }
  }

  function savePin() {
    if (newPin.length !== 4) return
    if (newPin !== confirmPin) {
      setPinMsg(t("caregiver.pinMismatch"))
      return
    }
    setCaregiverPin(newPin)
    setNewPin("")
    setConfirmPin("")
    setPinMsg(t("common.done"))
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col gap-5">
        <ScreenHeader title={t("caregiver.title")} subtitle={t("caregiver.subtitle")} onBack={onBack} />

        <section className="pixel-panel flex flex-col items-center gap-4 bg-card p-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-wood text-white">
            <LockKeyhole className="h-8 w-8" strokeWidth={2.2} />
          </span>
          <label htmlFor="pin" className="text-xl font-extrabold text-foreground">
            {t("caregiver.enterPin")}
          </label>
          <input
            id="pin"
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => {
              setPin(onlyDigits(e.target.value))
              setError(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit()
            }}
            placeholder="••••"
            className="w-48 rounded-[14px] border-[3px] border-wood-dark bg-background px-4 py-4 text-center text-4xl font-extrabold tracking-[0.4em] outline-none focus:ring-4 focus:ring-primary/40"
          />
          {error && <p className="text-base font-bold text-destructive">{t("caregiver.wrongPin")}</p>}
          <div className="w-full max-w-xs">
            <GameButton
              label={t("caregiver.unlock")}
              icon="hand-heart"
              variant="primary"
              onClick={submit}
              disabled={pin.length !== 4}
            />
          </div>
          {!caregiverPin && (
            <p className="text-sm font-medium text-muted-foreground">{t("caregiver.defaultPinNote")}</p>
          )}
        </section>
      </div>
    )
  }

  const games = countGamesPlayed(progress)
  const sharedEntries = journal.filter((j) => j.shared)

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title={t("caregiver.title")} onBack={onBack} />

      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-foreground">
          <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={2.4} />
          {t("caregiver.summary")}
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat value={games} label={t("journey.gamesPlayed")} />
          <Stat value={progress.roundsCompleted} label={t("journey.roundsCompleted")} />
          <Stat value={progress.pairsMatched} label={t("journey.pairsMatched")} />
        </div>
      </section>

      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-2 text-lg font-extrabold text-foreground">{t("caregiver.preferences")}</h2>
        <ul className="flex flex-col gap-1 text-base font-medium text-foreground">
          <li className="flex justify-between">
            <span className="text-muted-foreground">{t("caregiver.language")}</span>
            <span className="font-bold">{languageNames[language]}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">{t("settings.textSize")}</span>
            <span className="font-bold">{t(`settings.${accessibility.textSize}`)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">{t("settings.reducedMotion")}</span>
            <span className="font-bold">{accessibility.reducedMotion ? t("settings.on") : t("settings.off")}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">{t("settings.highContrast")}</span>
            <span className="font-bold">{accessibility.highContrast ? t("settings.on") : t("settings.off")}</span>
          </li>
        </ul>
      </section>

      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-2 text-lg font-extrabold text-foreground">{t("caregiver.sharedJournal")}</h2>
        {sharedEntries.length === 0 ? (
          <p className="text-base font-medium text-muted-foreground">{t("caregiver.noShared")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sharedEntries.map((e) => (
              <li key={e.id} className="rounded-[10px] bg-muted p-3">
                <p className="font-bold text-foreground">{e.title}</p>
                {e.body && <p className="text-sm font-medium text-muted-foreground">{e.body}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pixel-panel bg-card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-foreground">
          <KeyRound className="h-5 w-5 text-primary" strokeWidth={2.4} />
          {t("caregiver.setPin")}
        </h2>
        <p className="mb-2 text-sm font-medium text-muted-foreground">{t("caregiver.setPinHint")}</p>
        <div className="flex flex-wrap gap-3">
          <input
            type="tel"
            inputMode="numeric"
            value={newPin}
            onChange={(e) => {
              setNewPin(onlyDigits(e.target.value))
              setPinMsg(null)
            }}
            placeholder={t("caregiver.setPin")}
            aria-label={t("caregiver.setPin")}
            className="w-32 rounded-[12px] border-[3px] border-wood-dark bg-background px-3 py-3 text-center text-2xl font-extrabold tracking-widest outline-none focus:ring-4 focus:ring-primary/40"
          />
          <input
            type="tel"
            inputMode="numeric"
            value={confirmPin}
            onChange={(e) => {
              setConfirmPin(onlyDigits(e.target.value))
              setPinMsg(null)
            }}
            placeholder={t("caregiver.confirmPin")}
            aria-label={t("caregiver.confirmPin")}
            className="w-32 rounded-[12px] border-[3px] border-wood-dark bg-background px-3 py-3 text-center text-2xl font-extrabold tracking-widest outline-none focus:ring-4 focus:ring-primary/40"
          />
        </div>
        {pinMsg && <p className="mt-2 text-base font-bold text-primary">{pinMsg}</p>}
        <div className="mt-3 max-w-xs">
          <GameButton
            label={t("caregiver.create")}
            icon="key-round"
            variant="sky"
            onClick={savePin}
            disabled={newPin.length !== 4 || confirmPin.length !== 4}
          />
        </div>
      </section>

      <GameButton label={t("caregiver.lock")} icon="lock" variant="soft" onClick={() => setUnlocked(false)} />
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[10px] bg-primary/10 p-3">
      <p className="text-2xl font-extrabold text-primary">{value}</p>
      <p className="text-xs font-bold leading-tight text-muted-foreground">{label}</p>
    </div>
  )
}
