"use client"

import { useStore } from "@/lib/store"

/**
 * Original pixel/voxel-style branded title for "Memory Mitra".
 * Rendered as a wooden game-world sign with cozy pixel decorations.
 * The name text itself uses the localized `app.name` so translations still apply.
 */
export function MemoryMitraLogo({
  compact = false,
}: {
  compact?: boolean
}) {
  const { t } = useStore()

  return (
    <div
      className="relative flex flex-col items-center gap-1"
      data-testid="memory-mitra-logo"
    >
      {/* leaves decoration */}
      <div className="absolute -left-6 -top-2 text-2xl select-none" aria-hidden>
        <PixelLeaf />
      </div>
      <div className="absolute -right-6 -top-2 text-2xl select-none scale-x-[-1]" aria-hidden>
        <PixelLeaf />
      </div>

      {/* wooden sign */}
      <div
        className="relative rounded-[14px] px-6 py-3 sm:px-10 sm:py-4"
        style={{
          background: "linear-gradient(180deg, #b0793f 0%, #9b6631 40%, #8a5828 100%)",
          border: "4px solid #5f3f1c",
          boxShadow:
            "inset 0 -4px 0 rgba(0,0,0,0.18), inset 0 3px 0 rgba(255,255,255,0.18), 0 6px 0 #5f3f1c, 0 12px 24px rgba(0,0,0,0.25)",
        }}
      >
        {/* plank grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2 rounded-[10px]"
          style={{
            background:
              "repeating-linear-gradient(180deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 8px)",
          }}
        />
        {/* nails */}
        <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-[#3d2810]" aria-hidden />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#3d2810]" aria-hidden />
        <span className="absolute left-2 bottom-2 h-1.5 w-1.5 rounded-full bg-[#3d2810]" aria-hidden />
        <span className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full bg-[#3d2810]" aria-hidden />

        <h1
          className={`relative font-display font-extrabold uppercase tracking-[0.08em] ${
            compact ? "text-3xl" : "text-4xl sm:text-5xl"
          }`}
          style={{
            color: "#fff4d6",
            textShadow: "2px 2px 0 #4a2f14, 0 4px 0 rgba(0,0,0,0.25)",
          }}
        >
          {t("app.name")}
        </h1>
      </div>

      {/* tagline sign hangs below */}
      {!compact && (
        <p
          className="mt-2 rounded-[10px] px-3 py-1 text-sm font-extrabold tracking-wide sm:text-base"
          style={{
            background: "rgba(255,244,214,0.86)",
            color: "#5a3d1c",
            border: "3px solid #8a5a2b",
            boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.08)",
          }}
        >
          {t("app.tagline")}
        </p>
      )}
    </div>
  )
}

function PixelLeaf() {
  return (
    <span aria-hidden className="inline-block">
      <span className="relative inline-block h-6 w-6">
        <span
          className="absolute inset-0"
          style={{
            background: "#5da95a",
            clipPath:
              "polygon(50% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)",
            boxShadow: "inset -2px -2px 0 rgba(0,0,0,0.2), inset 2px 2px 0 rgba(255,255,255,0.2)",
          }}
        />
        <span
          className="absolute left-1/2 top-1 h-4 w-[2px] -translate-x-1/2"
          style={{ background: "#3f7a3d" }}
        />
      </span>
    </span>
  )
}
