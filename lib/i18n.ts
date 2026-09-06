import type { Language } from "./types"
import { en } from "@/locales/en"
import { hi } from "@/locales/hi"
import { as } from "@/locales/as"
import { bn } from "@/locales/bn"
import { brx } from "@/locales/brx"
import { mni } from "@/locales/mni"
import { kha } from "@/locales/kha"
import { lus } from "@/locales/lus"
import { nag } from "@/locales/nag"
import { kok } from "@/locales/kok"
import { ne } from "@/locales/ne"

type Dict = Record<string, string>

const dicts: Record<Language, Dict> = { en, hi, as, bn, brx, mni, kha, lus, nag, kok, ne }

export function translate(lang: Language, key: string, vars?: Record<string, string>): string {
  let value = dicts[lang]?.[key] ?? en[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, "g"), v)
    }
  }
  return value
}

/** Metadata for language selector UI — native name is primary label */
export interface LanguageInfo {
  code: Language
  native: string
  english: string
  flag: string
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", native: "English", english: "English", flag: "🇬🇧" },
  { code: "hi", native: "हिन्दी", english: "Hindi", flag: "🇮🇳" },
  { code: "as", native: "অসমীয়া", english: "Assamese", flag: "🇮🇳" },
  { code: "bn", native: "বাংলা", english: "Bengali", flag: "🇮🇳" },
  { code: "brx", native: "बड़ो", english: "Bodo", flag: "🇮🇳" },
  { code: "mni", native: "মৈতৈলোন্", english: "Manipuri (Meitei)", flag: "🇮🇳" },
  { code: "kha", native: "Khasi", english: "Khasi", flag: "🇮🇳" },
  { code: "lus", native: "Mizo ṭawng", english: "Mizo", flag: "🇮🇳" },
  { code: "nag", native: "Nagamese", english: "Nagamese", flag: "🇮🇳" },
  { code: "kok", native: "Kokborok", english: "Kokborok (Tripuri)", flag: "🇮🇳" },
  { code: "ne", native: "नेपाली", english: "Nepali", flag: "🇳🇵" },
]

/** Legacy compatibility — short name map keyed by code */
export const languageNames: Record<Language, string> = LANGUAGES.reduce(
  (acc, l) => {
    acc[l.code] = l.native
    return acc
  },
  {} as Record<Language, string>,
)
