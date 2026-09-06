# MemoryMitra — Product Requirements

## Original problem statement
Extend the existing MemoryMitra Next.js game with (a) offline local multiplayer for 2–4 players, (b) scaled difficulty (more pairs), (c) complete localization for every existing locale, (d) subtle cozy-pixel visual polish. **Preserve every existing feature verbatim**: English/Hindi/Assamese + all NE-language files, Single Player, Memory Journey, My Memories, animations, progress, navigation.

## Users
Elderly / memory-engagement players in North-East India + friends and family gathered around one device.

## Architecture (unchanged core + additive additions)
- Next.js 16 app router, TypeScript strict.
- `/app/locales/{en,hi,as,bn,brx,mni,mni_mtei,kha,lus,nag,kok,ne}.ts` — one dictionary per locale (12 total).
- `/app/lib/i18n.ts` — centralized `translate()` with per-locale fallback chain (`mni_mtei` → `mni` → `en`) + `LANGUAGES` metadata.
- `/app/lib/multiplayer.ts` — types, `MULTI_PAIR_CONFIG` (single source of truth for pair counts), grid-cols helper, `buildMultiplayerBoard`.
- `/app/lib/game-data.ts` — existing `CLASSIC_DECK` untouched; new `MULTI_DECK` combines classic + unique items from every state (30+ unique items) to support up to 21 pairs.
- `/app/components/screens/multiplayer-setup-screen.tsx` + `multiplayer-game-screen.tsx` — new screens, reuse existing `MemoryCard`, `ScreenHeader`, `GameButton`.
- `/app/components/app-shell.tsx` — routes to a new `"multiplayer"` screen alongside all existing screens; single-player `GameScreen` untouched.
- `/app/components/screens/home-screen.tsx` — new tile + primary CTA for Local Multiplayer (existing tiles unchanged).
- `/app/app/globals.css` — added `.animate-match` sparkle and subtle blocky checker pattern on `.tile-back`; existing tokens & animations untouched.

## Multiplayer specification
- **Players**: 2, 3, or 4 (locally, no backend).
- **Pair counts** (centralized in `MULTI_PAIR_CONFIG`):
  - 2P: easy 6 / medium 10 / hard 15 pairs
  - 3P: easy 8 / medium 12 / hard 18 pairs
  - 4P: easy 10 / medium 15 / hard 21 pairs
- **Turn logic**: player picks 2 cards → match keeps their turn + increments their pair count; no match reveals briefly then flips back and advances turn.
- **Guards**: cannot re-click a matched or face-up card, cannot select 3 during resolution, `lock` state blocks rapid clicks.
- **Winner screen**: ranked scoreboard, single winner or joint tie, Play Again (fresh shuffled board) + Back to Menu.
- **Deck**: `MULTI_DECK` by default; My Memories deck available when the user has ≥ required unique memories.
- **Grid**: `multiplayerGridCols(count)` returns responsive mobile/tablet/desktop column counts (3→7 depending on card total).

## Localization
All new UI strings live under `multi.*` and `home.multi` keys in every one of the 12 locale files (including Meetei Mayek). No hard-coded English in any new component. Existing English/Hindi/Assamese/NE files preserved verbatim.

## What's implemented
- ✅ 12 locales; Voice Read-Aloud speaker; Language chip on home; Suggest-a-translation feature (from prior sessions).
- ✅ **Session 3 (this delivery)**:
  - Offline Local Multiplayer (2/3/4 players) — setup flow + gameplay + winner screen.
  - Centralized pair config; scaled difficulty (up to 21 pairs / 42 cards).
  - Responsive card grid across phone/tablet/desktop breakpoints.
  - Larger multi-deck combining classic + NE items so higher pair counts always have unique cards.
  - Subtle pixel-polish: blocky checker on card back, sparkle animation on match, existing pixel-panel shadows retained.
  - Full localization of every new string in all 12 locales.
  - TypeScript compiles clean; Playwright screenshots verify: 4P Hard → 42 cards ✓, turn switching ✓, extra turn on match ✓, Hindi full-UI ✓, Single Player regression clean ✓.

## Backlog / Future
- P1: Animate the active-player badge transition & card flip more prominently in pixel style.
- P1: Sound effects for match / turn / winner (respecting existing voice-guidance toggle).
- P2: Export translation suggestions from Caregiver area.
- P2: Complete Meetei Mayek dictionary coverage.
- P2: Curated native TTS voice packs for Bodo, Kokborok, Khasi, Mizo.

## Session 4 (delivery — Jan 2026)
- ✅ **Player Avatars** — 8 cute pixel avatars (leaf, flower, bird, fish, star, sun, cloud, heart) picked during multiplayer setup, shown on the in-game scoreboard, active-player ring, and celebrated on the winner card. `lib/avatars.ts` + `components/avatar.tsx`.
- ✅ **Match Sound Chime** — `lib/sounds.ts` uses the Web Audio API (no assets) to synthesize a 2-note happy chime on match, softer 2-note descending tone on miss, and a 4-note arpeggio on winner. Respects a new `accessibility.soundEffects` toggle (default on) exposed in Settings for every locale.
- ✅ **Round Timer Option** — optional per-turn countdown (default 20s) with Off/On toggle in setup. When enabled the current-turn banner shows a `⏱ 19s` badge that turns red under 5s and auto-advances to the next player with a localized "Time's up!" banner.
- ✅ **Winner Celebration** — `<Confetti/>` component renders a 70-piece pixel-block confetti burst over the winner screen for ~3.2s (custom CSS keyframe, no dependency). Winner name displayed in the current locale.
- All new UI strings added to every one of the 12 locale files (`multi.avatar`, `multi.chooseAvatar`, `multi.timer`, `multi.timerOn/Off`, `multi.timeUp`, `settings.soundEffects`).
- TypeScript compiles clean. Playwright verified end-to-end: setup avatars picked → gameplay scoreboard shows correct avatars + timer counting down → match/miss/winner chimes played → game completed → confetti overlay present → winner text "Winner: A".
