"use client"

import { useEffect, useMemo, useState } from "react"
import { useStore } from "@/lib/store"

/**
 * Original pixel/voxel cozy scene rendered entirely with CSS blocks.
 * Supports smooth day <-> night transitions. Sits behind all content
 * and respects the user's reduced-motion preference.
 */
export function Scenery({
  compact = false,
  night: forcedNight,
  companion = false,
}: {
  compact?: boolean
  night?: boolean
  companion?: boolean
}) {
  const { accessibility } = useStore()
  const reducedMotion = accessibility.reducedMotion

  // Determine day/night from clock unless forced by prop or ?night=1|0.
  const [autoNight, setAutoNight] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    const params = new URLSearchParams(window.location.search)
    const p = params.get("night")
    if (p === "1") return true
    if (p === "0") return false
    const h = new Date().getHours()
    return h < 6 || h >= 19
  })
  useEffect(() => {
    if (forcedNight !== undefined) return
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("night") === "1" || params.get("night") === "0") return
    }
    const iv = setInterval(() => {
      const h = new Date().getHours()
      setAutoNight(h < 6 || h >= 19)
    }, 60_000)
    return () => clearInterval(iv)
  }, [forcedNight])
  const night = forcedNight ?? autoNight

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000"
    >
      {/* sky gradient — smooth day/night transition */}
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background: night
            ? "linear-gradient(to bottom, #12173a 0%, #2a2957 45%, #4a4478 75%, #6b5c80 100%)"
            : "linear-gradient(to bottom, var(--sky-deep) 0%, var(--sky) 55%, var(--background) 100%)",
        }}
      />

      {/* stars (night only) */}
      {night && <Stars reducedMotion={reducedMotion} />}

      {/* sun / moon */}
      {night ? (
        <Moon reducedMotion={reducedMotion} />
      ) : (
        <Sun reducedMotion={reducedMotion} />
      )}

      {/* clouds */}
      <Cloud className="left-[6%] top-[10%]" delay="0s" reducedMotion={reducedMotion} night={night} />
      <Cloud className="right-[18%] top-[22%] scale-75" delay="8s" reducedMotion={reducedMotion} night={night} />
      <Cloud className="left-[38%] top-[6%] scale-90" delay="16s" reducedMotion={reducedMotion} night={night} />

      {/* birds during day, fireflies at night */}
      {!compact && !reducedMotion && !night && <Birds />}
      {!compact && !reducedMotion && night && <Fireflies />}

      {/* far mountains */}
      <div className="absolute inset-x-0 bottom-[42%] h-32">
        <Mountain className="left-[-4%] h-32 w-64" tone={night ? "#2c2c46" : "#7d95a3"} />
        <Mountain className="right-[-8%] h-40 w-80" tone={night ? "#22223b" : "#6f8794"} />
        <Mountain className="left-[38%] h-28 w-60" tone={night ? "#2a2942" : "#88a0ac"} />
      </div>

      {/* rolling hills */}
      <div className="absolute inset-x-0 bottom-0 h-[46%]">
        <Hill className="left-[-6%] bottom-[26%] h-40 w-72" tone={night ? "#3b5a3b" : "var(--hill)"} opacity={0.6} />
        <Hill className="right-[-8%] bottom-[30%] h-48 w-80" tone={night ? "#345034" : "var(--hill)"} opacity={0.75} />
        <Hill className="left-1/3 bottom-[34%] h-36 w-64" tone={night ? "#2f4930" : "var(--hill)"} opacity={0.5} />
      </div>

      {/* ground */}
      <div
        className="absolute inset-x-0 bottom-0 h-[26%] transition-[background] duration-1000"
        style={{
          background: night
            ? "linear-gradient(to top, #1f3524 0%, #2c4a30 100%)"
            : "linear-gradient(to top, var(--hill-dark) 0%, var(--hill) 100%)",
        }}
      />
      {/* soil strip */}
      <div
        className="absolute inset-x-0 bottom-0 h-[9%]"
        style={{ background: night ? "#182518" : "var(--hill-dark)" }}
      />

      {/* pixel grass tufts along soil */}
      <GrassRow night={night} />

      {/* river ribbon */}
      <River night={night} />

      {!compact && (
        <>
          {/* trees left */}
          <VoxelTree className="left-[4%] bottom-[7%]" night={night} />
          <VoxelTree className="left-[15%] bottom-[5%] scale-[0.85]" night={night} />
          {/* trees right */}
          <VoxelTree className="right-[8%] bottom-[7%] scale-95" night={night} />
          <PineTree className="right-[18%] bottom-[6%]" night={night} />

          {/* bridge over river */}
          <Bridge className="left-1/2 -translate-x-1/2 bottom-[16%]" night={night} />

          {/* small houses */}
          <House className="left-[24%] bottom-[13%]" night={night} />
          <House className="right-[26%] bottom-[13%] scale-90" night={night} variant="cottage" />

          {/* lanterns */}
          <Lantern className="left-[42%] bottom-[19%]" night={night} reducedMotion={reducedMotion} />
          <Lantern className="right-[42%] bottom-[19%]" night={night} reducedMotion={reducedMotion} />

          {/* flowers */}
          <Flowers night={night} />

          {/* fence */}
          <Fence className="left-[8%] bottom-[9%]" night={night} />
          <Fence className="right-[10%] bottom-[9%]" night={night} />

          {/* mountain-top snow only during day */}
          {!night && <MountainSnow />}

          {/* companion pet */}
          {companion && <CompanionPet reducedMotion={reducedMotion} />}
        </>
      )}

      {/* subtle vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 30%, transparent 40%, rgba(0,0,0,0.12) 100%)" }}
      />

      <style jsx>{`
        @keyframes drift {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(30px); }
          100% { transform: translateX(0); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 1; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.9; box-shadow: 0 0 16px 4px rgba(255,200,90,0.55); }
          50%      { opacity: 1;   box-shadow: 0 0 24px 8px rgba(255,200,90,0.75); }
        }
        @keyframes fly {
          0%   { transform: translateX(-8vw) translateY(0); }
          50%  { transform: translateX(50vw) translateY(-14px); }
          100% { transform: translateX(110vw) translateY(4px); }
        }
        @keyframes firefly {
          0%   { transform: translate(0, 0); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }
        @keyframes hop {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes tailwag {
          0%, 100% { transform: rotate(-14deg); }
          50%      { transform: rotate(14deg); }
        }
      `}</style>
    </div>
  )
}

/* ---------- pieces ---------- */

function Sun({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      className="absolute right-[8%] top-[8%] h-16 w-16 rounded-[10px] bg-sun"
      style={{
        boxShadow: "0 0 60px 20px rgba(255,220,120,0.6)",
        animation: reducedMotion ? undefined : "gentle-bob 6s ease-in-out infinite",
      }}
    />
  )
}

function Moon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="absolute right-[10%] top-[8%]">
      <div
        className="h-14 w-14 rounded-[10px]"
        style={{
          background: "#f2ecd5",
          boxShadow: "0 0 40px 12px rgba(220,210,180,0.35), inset -6px -4px 0 rgba(0,0,0,0.08)",
          animation: reducedMotion ? undefined : "gentle-bob 8s ease-in-out infinite",
        }}
      />
      {/* moon craters */}
      <div className="absolute left-2 top-3 h-2 w-2 rounded-[3px] bg-black/10" />
      <div className="absolute right-3 top-6 h-2 w-3 rounded-[3px] bg-black/10" />
    </div>
  )
}

function Stars({ reducedMotion }: { reducedMotion: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        top: Math.random() * 45,
        left: Math.random() * 100,
        s: 1 + Math.random() * 1.5,
        d: Math.random() * 3,
      })),
    [],
  )
  return (
    <>
      {stars.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-[1px] bg-white"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.s}px`,
            height: `${p.s}px`,
            animation: reducedMotion ? undefined : `twinkle 3.5s ease-in-out ${p.d}s infinite`,
          }}
        />
      ))}
    </>
  )
}

function Cloud({
  className = "",
  delay = "0s",
  reducedMotion,
  night,
}: {
  className?: string
  delay?: string
  reducedMotion: boolean
  night: boolean
}) {
  const bg = night ? "rgba(200,200,220,0.35)" : "rgba(255,255,255,0.92)"
  return (
    <div
      className={`absolute ${className}`}
      style={{
        animation: reducedMotion ? undefined : `drift 22s ease-in-out ${delay} infinite`,
      }}
    >
      <div className="relative">
        <div className="h-5 w-24 rounded-[6px]" style={{ background: bg }} />
        <div className="absolute -top-3 left-3 h-7 w-10 rounded-[6px]" style={{ background: bg }} />
        <div className="absolute -top-2 left-12 h-6 w-9 rounded-[6px]" style={{ background: bg }} />
      </div>
    </div>
  )
}

function Mountain({ className, tone }: { className: string; tone: string }) {
  return (
    <div
      className={`absolute bottom-0 ${className}`}
      style={{
        background: tone,
        clipPath: "polygon(0% 100%, 25% 20%, 50% 60%, 75% 10%, 100% 100%)",
      }}
    />
  )
}

function MountainSnow() {
  // simple snow caps as small triangles overlaying
  return (
    <div className="absolute inset-x-0 bottom-[42%] h-32">
      <div
        className="absolute left-[16%] h-6 w-10"
        style={{
          background: "#fbfbfb",
          clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
        }}
      />
      <div
        className="absolute right-[10%] h-8 w-12"
        style={{
          background: "#fbfbfb",
          clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
        }}
      />
    </div>
  )
}

function Hill({
  className,
  tone,
  opacity = 1,
}: {
  className: string
  tone: string
  opacity?: number
}) {
  return (
    <div
      className={`absolute rounded-t-[50%] ${className}`}
      style={{ background: tone, opacity }}
    />
  )
}

function GrassRow({ night }: { night: boolean }) {
  const tufts = useMemo(
    () => Array.from({ length: 24 }).map((_, i) => ({ x: (i + 0.5) * (100 / 24), h: 4 + (i % 3) * 2 })),
    [],
  )
  return (
    <div className="absolute inset-x-0" style={{ bottom: "9%" }}>
      {tufts.map((t, i) => (
        <div
          key={i}
          className="absolute rounded-[2px]"
          style={{
            left: `${t.x}%`,
            bottom: 0,
            width: 4,
            height: t.h,
            background: night ? "#3d5b3d" : "#5f9d59",
          }}
        />
      ))}
    </div>
  )
}

function River({ night }: { night: boolean }) {
  return (
    <div
      className="absolute inset-x-0"
      style={{
        bottom: "9%",
        height: "6%",
        background: night
          ? "linear-gradient(to bottom, #2b3f66 0%, #223354 100%)"
          : "linear-gradient(to bottom, #a0d5e8 0%, #5fb3d1 100%)",
        borderTop: night ? "3px solid #3f5586" : "3px solid #7ec6dd",
        borderBottom: night ? "3px solid #1b2a4a" : "3px solid #4a8fa5",
      }}
    >
      {/* wave dashes */}
      <div className="absolute inset-x-0 top-[35%] flex justify-around opacity-70">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[3px] w-8 rounded-full"
            style={{ background: night ? "#6f89b8" : "#dff2fa" }}
          />
        ))}
      </div>
    </div>
  )
}

function VoxelTree({ className = "", night }: { className?: string; night: boolean }) {
  const foliage = night ? "#2e4d2e" : "#4c8f47"
  const foliageLight = night ? "#3a5c39" : "#67ab5e"
  const trunk = night ? "#3b2a1e" : "#5a3f2b"
  return (
    <div className={`absolute ${className}`}>
      <div className="relative mx-auto h-10 w-14">
        <div className="absolute inset-x-0 top-0 mx-auto h-4 w-10 rounded-[4px]" style={{ background: foliageLight }} />
        <div className="absolute inset-x-0 top-3 mx-auto h-6 w-14 rounded-[4px]" style={{ background: foliage }} />
      </div>
      <div className="mx-auto h-8 w-3" style={{ background: trunk }} />
    </div>
  )
}

function PineTree({ className = "", night }: { className?: string; night: boolean }) {
  const g = night ? "#213f26" : "#3b7f3b"
  const gL = night ? "#2c4f2c" : "#4d9a4d"
  return (
    <div className={`absolute ${className}`}>
      <div
        className="mx-auto h-6 w-10"
        style={{ background: gL, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
      <div
        className="mx-auto -mt-3 h-8 w-14"
        style={{ background: g, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
      <div className="mx-auto h-6 w-3" style={{ background: night ? "#3b2a1e" : "#5a3f2b" }} />
    </div>
  )
}

function Bridge({ className = "", night }: { className?: string; night: boolean }) {
  const wood = night ? "#4a3320" : "#8a5a2b"
  const dark = night ? "#2b1c10" : "#5a3d1e"
  return (
    <div className={`absolute ${className}`}>
      <div className="h-2 w-24 rounded-[3px]" style={{ background: wood }} />
      <div className="mt-0.5 h-1.5 w-24 rounded-[2px]" style={{ background: dark }} />
      <div className="mt-0.5 flex justify-between px-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-1.5" style={{ background: dark }} />
        ))}
      </div>
    </div>
  )
}

function House({
  className = "",
  night,
  variant = "cabin",
}: {
  className?: string
  night: boolean
  variant?: "cabin" | "cottage"
}) {
  const wall = variant === "cabin" ? (night ? "#6a4a2c" : "#c19464") : night ? "#8a6a4a" : "#e5b58a"
  const roof = variant === "cabin" ? (night ? "#3a2c26" : "#7a3d2a") : night ? "#3b3a52" : "#7d5aa0"
  const windowColor = night ? "#ffd479" : "#8bc7dd"
  return (
    <div className={`absolute ${className}`}>
      <div className="relative">
        {/* roof */}
        <div
          className="mx-auto h-4 w-16"
          style={{ background: roof, clipPath: "polygon(10% 100%, 50% 0%, 90% 100%)" }}
        />
        {/* body */}
        <div className="mx-auto -mt-0.5 h-8 w-12 rounded-[3px]" style={{ background: wall }}>
          <div className="mx-auto mt-1 flex justify-around px-1">
            <div className="h-2.5 w-2.5 rounded-[2px]" style={{ background: windowColor, boxShadow: night ? "0 0 8px 2px rgba(255,200,90,0.5)" : undefined }} />
            <div className="h-2.5 w-2.5 rounded-[2px]" style={{ background: windowColor, boxShadow: night ? "0 0 8px 2px rgba(255,200,90,0.5)" : undefined }} />
          </div>
          {/* door */}
          <div className="mx-auto mt-1 h-3 w-2 rounded-t-[2px]" style={{ background: night ? "#2a1a10" : "#4a3020" }} />
        </div>
      </div>
    </div>
  )
}

function Lantern({
  className,
  night,
  reducedMotion,
}: {
  className: string
  night: boolean
  reducedMotion: boolean
}) {
  return (
    <div className={`absolute ${className}`}>
      <div className="mx-auto h-4 w-[3px]" style={{ background: night ? "#2b1c10" : "#5a3d1e" }} />
      <div
        className="mx-auto -mt-1 h-3 w-3 rounded-[2px]"
        style={{
          background: night ? "#ffce7a" : "#f8b23b",
          animation: night && !reducedMotion ? "flicker 2.6s ease-in-out infinite" : undefined,
        }}
      />
    </div>
  )
}

function Flowers({ night }: { night: boolean }) {
  const spots = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        x: 4 + i * 9 + Math.random() * 3,
        color: ["#f36ba0", "#f8b23b", "#e75c5c", "#c86bef"][i % 4],
      })),
    [],
  )
  const dim = night ? 0.5 : 1
  return (
    <div className="absolute inset-x-0 bottom-[9%] h-4">
      {spots.map((s, i) => (
        <div key={i} className="absolute" style={{ left: `${s.x}%`, bottom: 0, opacity: dim }}>
          <div className="mx-auto h-2 w-[2px]" style={{ background: "#3f7a3f" }} />
          <div className="mx-auto h-2 w-2 rounded-full" style={{ background: s.color }} />
        </div>
      ))}
    </div>
  )
}

function Fence({ className, night }: { className: string; night: boolean }) {
  const wood = night ? "#3b2a1e" : "#8a6a3a"
  return (
    <div className={`absolute flex items-end gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-1.5 rounded-t-[2px]" style={{ background: wood, height: i % 2 ? 12 : 16 }} />
      ))}
    </div>
  )
}

function Birds() {
  return (
    <div
      className="absolute left-0 top-[18%]"
      style={{ animation: "fly 28s linear infinite" }}
    >
      <span className="text-lg" style={{ color: "#3b3b3b", filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.4))" }}>
        ᨈ
      </span>
    </div>
  )
}

function Fireflies() {
  const flies = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        left: Math.random() * 80 + 5,
        bottom: Math.random() * 25 + 12,
        dx: `${(Math.random() - 0.5) * 40}vw`,
        dy: `${-(Math.random() * 12 + 4)}vh`,
        d: (Math.random() * 4).toFixed(2) + "s",
        dur: (5 + Math.random() * 4).toFixed(2) + "s",
      })),
    [],
  )
  return (
    <>
      {flies.map((f, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${f.left}%`,
            bottom: `${f.bottom}%`,
            background: "#ffe58f",
            boxShadow: "0 0 8px 3px rgba(255,229,143,0.55)",
            animation: `firefly ${f.dur} ease-in-out ${f.d} infinite`,
            ["--dx" as string]: f.dx,
            ["--dy" as string]: f.dy,
          }}
        />
      ))}
    </>
  )
}

function CompanionPet({ reducedMotion }: { reducedMotion: boolean }) {
  // A small original pixel fox that sits by the fence and idles.
  return (
    <div
      className="absolute left-[13%] bottom-[10%]"
      style={{ animation: reducedMotion ? undefined : "hop 3.4s ease-in-out infinite" }}
      data-testid="scenery-companion"
    >
      <div className="relative">
        {/* body */}
        <div className="h-5 w-8 rounded-[3px]" style={{ background: "#e08447" }} />
        {/* white belly */}
        <div className="absolute bottom-0 left-1 h-2 w-6 rounded-[3px]" style={{ background: "#fff2df" }} />
        {/* head */}
        <div className="absolute -top-3 -right-1 h-4 w-4 rounded-[3px]" style={{ background: "#e08447" }} />
        {/* ears */}
        <div
          className="absolute -top-4 right-0 h-2 w-1.5"
          style={{ background: "#e08447", clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }}
        />
        <div
          className="absolute -top-4 right-2 h-2 w-1.5"
          style={{ background: "#e08447", clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }}
        />
        {/* eye */}
        <div className="absolute -top-2 right-0.5 h-1 w-1 rounded-[1px] bg-black" />
        {/* tail */}
        <div
          className="absolute -bottom-0.5 -left-2 h-2 w-3 origin-right rounded-[3px]"
          style={{
            background: "#e08447",
            animation: reducedMotion ? undefined : "tailwag 1.4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-1 -left-3 h-1.5 w-1.5 rounded-[2px]"
          style={{ background: "#fff2df" }}
        />
      </div>
    </div>
  )
}
