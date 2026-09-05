"use client"

/**
 * Original pixel/voxel-inspired cozy North-East backdrop drawn entirely with CSS blocks.
 * Decorative only — sits behind all content.
 */
export function Scenery({ compact = false }: { compact?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-deep via-sky to-background" />

      {/* sun */}
      <div className="absolute right-8 top-10 h-16 w-16 rounded-[10px] bg-sun shadow-[0_0_60px_20px_var(--sun)] animate-bob" />

      {/* clouds */}
      <PixelCloud className="left-6 top-16" />
      <PixelCloud className="right-24 top-28 scale-75" />
      <PixelCloud className="left-1/3 top-8 scale-90" />

      {/* far hills */}
      <div className="absolute inset-x-0 bottom-0 h-[46%]">
        <Hill className="left-[-6%] bottom-[30%] h-40 w-64 bg-hill/70" />
        <Hill className="right-[-8%] bottom-[34%] h-48 w-72 bg-hill/60" />
        <Hill className="left-1/3 bottom-[38%] h-36 w-56 bg-hill/50" />
      </div>

      {/* near hills / ground */}
      <div className="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-t from-hill-dark to-hill" />
      <div className="absolute inset-x-0 bottom-0 h-[9%] bg-hill-dark" />

      {!compact && (
        <>
          <VoxelTree className="left-[6%] bottom-[7%]" />
          <VoxelTree className="left-[20%] bottom-[5%] scale-90" />
          <Bamboo className="right-[8%] bottom-[6%]" />
          <Bamboo className="right-[18%] bottom-[8%] scale-90" />
        </>
      )}
    </div>
  )
}

function PixelCloud({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative">
        <div className="h-6 w-24 rounded-[8px] bg-cloud/90" />
        <div className="absolute -top-3 left-4 h-8 w-10 rounded-[8px] bg-cloud/90" />
        <div className="absolute -top-2 left-12 h-7 w-9 rounded-[8px] bg-cloud/90" />
      </div>
    </div>
  )
}

function Hill({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-t-[50%] ${className}`} />
}

function VoxelTree({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="mx-auto h-10 w-10 rounded-[8px] bg-bamboo" />
      <div className="mx-auto -mt-2 h-8 w-14 rounded-[8px] bg-hill-dark/90" />
      <div className="mx-auto h-6 w-3 bg-wood-dark" />
    </div>
  )
}

function Bamboo({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute flex items-end gap-1 ${className}`}>
      <div className="h-24 w-2.5 rounded-full bg-bamboo" />
      <div className="h-32 w-2.5 rounded-full bg-bamboo" />
      <div className="h-20 w-2.5 rounded-full bg-bamboo" />
    </div>
  )
}
