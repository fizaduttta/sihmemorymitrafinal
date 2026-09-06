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

## Session 5 (delivery — Jan 2026)
- ✅ **Team Play Mode (2v2)** — new Play Mode toggle appears only when 4 players are selected. Free-for-all vs Teams (2v2). Teams: Team 1 = P1+P2, Team 2 = P3+P4 with editable team names (default localized "Team Sun" / "Team Moon" — auto-updates until user customizes).
- ✅ Player rows show colored team badge (primary tint for Team 1, accent for Team 2) so it's obvious who's on which side.
- ✅ In-game scoreboard shows a new team-totals grid above the individual scoreboard; the active player's team card is highlighted.
- ✅ Winner logic aggregates by team: shows "Winning team: {name}" with all winning-team avatars ringed, or "Both teams tied at N!" when totals are equal. Subtitle shows both team scores. Individual ranking still shown below with "of {team}" labels.
- ✅ Full localization: `multi.playMode`, `multi.modeFree`, `multi.modeTeams`, `multi.teams`, `multi.teamN`, `multi.team1Default`, `multi.team2Default`, `multi.teamOf`, `multi.teamScore`, `multi.teamWinner`, `multi.teamTie`, `multi.teamNamePlaceholder` added to every one of the 12 locales.
- ✅ TypeScript compiles clean; Playwright verified: 4P + Teams (2v2) + custom team names → in-game team scoreboard renders "Parents 0 / Kids 0" → played to 5-5 tie → winner screen showed "Both teams tied at 5!" with all 4 avatars ringed + team totals grid + individual ranking with "of Parents/of Kids" labels + confetti overlay.
- Existing free-for-all mode, single-player, and every other feature preserved unchanged.

## Session 6 (delivery — Jan 2026) — Cozy Pixel World home polish
- ✅ **Wooden pixel MEMORYMITRA title sign** (`components/memory-mitra-logo.tsx`) — chunky brown plank with grain, corner nails, drop-shadow depth and pixel-leaf decorations on each side. Uses localized `app.name` + `app.tagline`.
- ✅ **Cozy pixel/voxel background** (`components/scenery.tsx` rewritten) — sky gradient, rolling hills, distant mountains with snow caps (day), river ribbon with wave dashes, wooden bridge, two houses (cabin + cottage) with glowing windows at night, pine + broadleaf trees, fences, roadside flowers, pixel-grass tuft row, subtle vignette.
- ✅ **Day / Night atmosphere**: same layout, different atmosphere — automatic based on clock (19:00–06:00 = night) or overridable via `?night=1` / `?night=0` URL param. Night adds pixel moon with craters, twinkling stars, glowing fireflies, warm lantern flicker, lit house windows.
- ✅ **Cute pixel fox companion** parked by the fence with idle hop + tail-wag animation, respects reduced-motion.
- ✅ **Clean hierarchy** — top-left `LanguageChip`, top-right compact wooden **Sound / Music / Settings** cluster (`components/home-controls.tsx`), centered logo + tagline + greeting, then the 4 primary chunky pixel buttons (Single Player · Local Multiplayer · Memory Journey · My Memories) in a 2-column grid, then a smaller secondary row for My North-East / Journal / Companion / Caregiver, and a slim "Today's Activity" footer with read-aloud + games-played chip.
- ✅ **Sound + Music independent toggles**: new `accessibility.music` field wired into store + Settings; the sound/music/settings buttons on home toggle and play a soft click chime.
- ✅ **Accessibility preserved**: reduced-motion stops clouds, birds, tail wag, firefly drift, sun/moon bob; high-contrast, text-size, voice-guidance untouched. Cards / labels remain readable over the scene. Language chip preserves every existing locale — none removed or duplicated.
- ✅ **Responsive** — home container widens to `max-w-2xl` on desktop; primary grid stacks to single column on mobile; scene is fixed to viewport so it stays behind interactive UI.
- ✅ **Existing features preserved**: TitleScreen still handles first-visit name entry and returning-user Continue flow; every other screen (game, multiplayer, journey, memories, journal, companion, caregiver, settings, northeast) untouched. TypeScript clean. Playwright screenshots verified day + night + Hindi switch + reduced-motion + mobile viewport + Single Player navigation.

## Session 7 (delivery — user-controlled night mode + multiplayer memorization fix)
- ✅ Added centralized `themeMode` state (`day`/`night`) to the existing store with local persistence, defaulting to unchanged Day mode.
- ✅ Added a compact home Day/Night control and matching Settings selector; existing `?night=1|0` scenery overrides remain supported.
- ✅ Reused the existing scenery world for the night atmosphere: moon, stars, fireflies, darker terrain, warm lanterns, and lit homes remain intact.
- ✅ Fixed Local Multiplayer startup with a face-up `memorize` phase, 5-second countdown, disabled cards, then a synchronized face-down transition into the existing Player 1 turn logic.
- ✅ Existing match/mismatch protections, scoring, extra turns, timers, restart flow, languages, and screens remain unchanged. Added stable test IDs for Settings accessibility toggles.
- ✅ `yarn build` passes and local browser smoke tests verified theme switching/persistence plus multiplayer face-up countdown and Player 1 transition.

## Prioritized backlog
- P0: None for the requested scope.
- P1: Add localized translations for the three new theme/memorization labels in locale dictionaries where they currently fall back to English.
- P2: Add a small visual countdown progress indicator while preserving the current calm presentation.
