"use client"

import { Volume2, VolumeX, Music, Music2, Settings2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { playChime } from "@/lib/sounds"

/**
 * Compact wooden pixel-style top-right cluster: sound, music, settings.
 * Toggles read/write directly to the global accessibility store.
 */
export function HomeControls({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { accessibility, setAccessibility, t } = useStore()

  return (
    <div className="flex items-center gap-1.5" data-testid="home-controls">
      <IconToggle
        on={accessibility.soundEffects}
        onIcon={<Volume2 className="h-5 w-5" strokeWidth={2.6} />}
        offIcon={<VolumeX className="h-5 w-5" strokeWidth={2.6} />}
        label={t("settings.soundEffects")}
        testid="home-toggle-sound"
        onClick={() => {
          const next = !accessibility.soundEffects
          setAccessibility({ soundEffects: next })
          if (next) playChime("turn", true)
        }}
      />
      <IconToggle
        on={accessibility.music}
        onIcon={<Music className="h-5 w-5" strokeWidth={2.6} />}
        offIcon={<Music2 className="h-5 w-5 opacity-70" strokeWidth={2.6} />}
        label={t("settings.music")}
        testid="home-toggle-music"
        onClick={() => {
          const next = !accessibility.music
          setAccessibility({ music: next })
          if (next && accessibility.soundEffects) playChime("turn", true)
        }}
      />
      <button
        type="button"
        onClick={() => {
          if (accessibility.soundEffects) playChime("turn", true)
          onOpenSettings()
        }}
        aria-label={t("home.settings")}
        data-testid="home-open-settings"
        className="woody-btn"
      >
        <Settings2 className="h-5 w-5" strokeWidth={2.6} />
      </button>
      <style jsx>{`
        .woody-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(180deg, #c89159 0%, #a76d31 100%);
          color: #fff4d6;
          border: 3px solid #5f3f1c;
          box-shadow: inset 0 -3px 0 rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.15), 0 3px 0 #5f3f1c;
          transition: transform 0.08s ease, box-shadow 0.08s ease;
        }
        .woody-btn:hover { transform: translateY(-1px); }
        .woody-btn:active { transform: translateY(2px); box-shadow: inset 0 -1px 0 rgba(0,0,0,0.2), 0 1px 0 #5f3f1c; }
      `}</style>
    </div>
  )
}

function IconToggle({
  on,
  onIcon,
  offIcon,
  label,
  testid,
  onClick,
}: {
  on: boolean
  onIcon: React.ReactNode
  offIcon: React.ReactNode
  label: string
  testid: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      data-testid={testid}
      onClick={onClick}
      className="woody-btn"
      style={{
        opacity: on ? 1 : 0.7,
      }}
    >
      {on ? onIcon : offIcon}
      <style jsx>{`
        .woody-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(180deg, #c89159 0%, #a76d31 100%);
          color: #fff4d6;
          border: 3px solid #5f3f1c;
          box-shadow: inset 0 -3px 0 rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.15), 0 3px 0 #5f3f1c;
          transition: transform 0.08s ease, box-shadow 0.08s ease;
        }
        .woody-btn:hover { transform: translateY(-1px); }
        .woody-btn:active { transform: translateY(2px); box-shadow: inset 0 -1px 0 rgba(0,0,0,0.2), 0 1px 0 #5f3f1c; }
      `}</style>
    </button>
  )
}
