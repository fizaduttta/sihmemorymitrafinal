"use client"

import { useEffect, useMemo, useState } from "react"

/**
 * Pixel-block confetti burst overlay. Fixed to viewport, non-interactive.
 * Automatically disappears after `durationMs`. Uses only inline styles + a
 * single keyframe so it stays cheap on mobile.
 */
export function Confetti({
  active,
  durationMs = 3200,
  count = 60,
}: {
  active: boolean
  durationMs?: number
  count?: number
}) {
  const [visible, setVisible] = useState(active)

  useEffect(() => {
    if (!active) {
      setVisible(false)
      return
    }
    setVisible(true)
    const id = setTimeout(() => setVisible(false), durationMs)
    return () => clearTimeout(id)
  }, [active, durationMs])

  const pieces = useMemo(() => {
    const colors = [
      "#4a9d6b",
      "#4a90c2",
      "#dda12b",
      "#b0475a",
      "#3fa79a",
      "#8267be",
      "#d1793f",
      "#a9743f",
    ]
    return Array.from({ length: count }).map((_, i) => ({
      key: i,
      left: Math.random() * 100,
      size: 8 + Math.floor(Math.random() * 10),
      color: colors[i % colors.length],
      delay: Math.random() * 0.9,
      dur: 2.4 + Math.random() * 1.4,
      rotate: Math.floor(Math.random() * 360),
      drift: (Math.random() - 0.5) * 40,
    }))
  }, [count])

  if (!visible) return null

  return (
    <div
      aria-hidden
      data-testid="confetti-overlay"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.key}
          className="absolute block"
          style={{
            left: `${p.left}%`,
            top: `-${p.size + 4}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: "0 3px 0 rgba(0,0,0,0.15)",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.dur}s linear ${p.delay}s forwards`,
            // custom-prop consumed by keyframes for lateral drift
            ["--drift" as string]: `${p.drift}vw`,
            borderRadius: "2px",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translate(var(--drift), 110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
