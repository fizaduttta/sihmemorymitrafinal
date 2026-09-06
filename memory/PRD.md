# MemoryMitra — Product Requirements

## Original problem statement
Add 8 more North-Eastern Indian languages to the existing MemoryMitra game (Next.js + TS + localStorage) without touching existing gameplay, UI style, or the already-shipped English/Hindi/Assamese versions. Full-interface localization, no English placeholders after switching, centralized i18n, persistent selection.

## Users
Elderly / memory-engagement players in North-East India and their caregivers, often more comfortable in native scripts than English.

## Core Requirements
- Preserve all existing screens, animations, gameplay logic, memory data.
- Every user-facing string comes from a single translation dictionary keyed by locale.
- Language change persists across screens and app restarts (localStorage key `memorymitra.v1`).
- Language selector on Title, Settings, and Home shows flag + native script + English label.

## Architecture
- Next.js 16 app router (`/app`), TypeScript strict.
- `/app/locales/{en,hi,as,bn,brx,mni,mni_mtei,kha,lus,nag,kok,ne}.ts` — one dictionary per locale.
- `/app/lib/i18n.ts` — imports all dicts, exposes `translate(lang, key, vars)` with a per-locale fallback chain (`mni_mtei` → `mni` → `en`), plus a `LANGUAGES` metadata array (code / native / english / flag).
- `/app/lib/store.tsx` — provides `t()` + `setLanguage()` + `addTranslationSuggestion()` via context, backed by localStorage.
- `/app/lib/companion.ts` — reactions + prompts for every language (incl. Meetei Mayek variant).
- `/app/lib/voice.ts` — BCP-47 codes for each locale (falls back to closest script when native TTS voice is unavailable).
- `/app/components/language-chip.tsx` — compact home-header language switcher with dropdown.
- `/app/components/suggest-translation.tsx` — native-speaker suggestion capture, persisted per-locale.

## What's implemented (2026-01)
### Session 1
- ✅ 11 fully-translated locales: English, Hindi, Assamese, Bengali, Bodo, Manipuri (Bengali script), Khasi, Mizo, Nagamese, Kokborok (Tripuri), Nepali.
- ✅ Centralized i18n with `LANGUAGES` metadata, language pickers on Title + Settings.
- ✅ Companion AI replies + voice-guidance BCP-47 codes for every language.
- ✅ Existing English/Hindi/Assamese content preserved verbatim; game logic, memory data, progress untouched.

### Session 2 (next actions from user)
- ✅ **Language Flags Home Tile** — `<LanguageChip />` on home header (flag + native name + dropdown listing all 11 locales incl. Meetei Mayek variant).
- ✅ **Voice Read-Aloud** — 🔊 speaker button always visible in `ScreenHeader` (works regardless of voice-guidance toggle) + speaker on home greeting. Speaks title+subtitle in current locale's BCP-47 voice.
- ✅ **Meetei Mayek Script** — new `mni_mtei` locale added with core UI in traditional Meetei Mayek script; falls back to Bengali-script Manipuri (`mni`) then English so no English text leaks.
- ✅ **Human Translator Pass** — `<SuggestTranslation />` in Settings lets native speakers propose a better wording (original + suggestion + note), stored per-locale in `translationSuggestions` array on state, listed back with delete affordance. Fully localized in all 12 locales.
- ✅ TypeScript compiles clean; end-to-end verified via Playwright screenshots (English home + chip menu + Meetei Mayek switch + Settings grid + Suggest form).

## Backlog / Future
- P1: Export/share collected translation suggestions from Caregiver area (e.g. JSON download, email link).
- P1: Expand Meetei Mayek coverage to 100% of keys (currently ~40 hand-crafted core strings, rest inherit from `mni`).
- P2: Locale-aware date/number formatting in journal timestamps + progress stats.
- P2: Curated native-voice TTS files for languages with poor system-TTS support (Bodo, Kokborok, Khasi, Mizo).
