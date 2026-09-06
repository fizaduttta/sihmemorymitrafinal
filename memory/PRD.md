# MemoryMitra — Product Requirements

## Original problem statement
Add 8 more North-Eastern Indian languages to the existing MemoryMitra game (Next.js + TS + localStorage) without touching existing gameplay, UI style, or the already-shipped English/Hindi/Assamese versions. Full-interface localization, no English placeholders after switching, centralized i18n, persistent selection.

## Users
Elderly / memory-engagement players in North-East India and their caregivers, often more comfortable in native scripts than English.

## Core Requirements
- Preserve all existing screens, animations, gameplay logic, memory data.
- Every user-facing string comes from a single translation dictionary keyed by locale.
- Language change persists across screens and app restarts (uses existing localStorage key `memorymitra.v1`).
- Language selector on Title + Settings screens shows flag + native script + English label.

## Architecture
- Next.js 16 app router (`/app`), TypeScript strict.
- `/app/locales/{en,hi,as,bn,brx,mni,kha,lus,nag,kok,ne}.ts` — one dictionary per language.
- `/app/lib/i18n.ts` — imports all dicts, exposes `translate(lang, key, vars)` (with English fallback) + `LANGUAGES` metadata array.
- `/app/lib/store.tsx` (unchanged) provides `t()` + `setLanguage()` via context, backed by localStorage.
- `/app/lib/companion.ts` — reactions + prompts extended to every language.
- `/app/lib/voice.ts` — BCP-47 codes for each new language (falls back to closest script).

## What's implemented (2026-01)
- ✅ 11 fully translated locales: English, Hindi, Assamese, Bengali, Bodo, Manipuri (Meitei), Khasi, Mizo, Nagamese, Kokborok (Tripuri), Nepali.
- ✅ Rewritten `/app/lib/i18n.ts` with `LANGUAGES` metadata (code / native / english / flag).
- ✅ Title-screen language picker converted to horizontally-scrollable pill row with flag + native name.
- ✅ Settings-screen language picker converted to responsive 2-column grid (flag + native + english).
- ✅ Companion AI reply generator has reactions + topical prompts for all 11 languages.
- ✅ Voice guidance codes mapped for all 11 languages.
- ✅ TypeScript compiles clean; localization tested via Playwright screenshots (English, Bengali, Hindi, Nagamese verified end-to-end).
- ✅ Existing English/Hindi/Assamese content preserved verbatim; game logic, memory data, progress, journal untouched.

## Backlog / Future
- P1: Add Meitei Mayek script rendering for Manipuri (currently Bengali script — the widely used everyday form).
- P2: Add locale-aware date/number formatting to journal timestamps and progress stats.
- P2: Text-to-speech voice review — several NE languages fall back to Hindi/Assamese/English TTS.
- P2: Human translator review pass for Bodo, Kokborok, Khasi, Mizo — currently AI-authored using common vocabulary.
