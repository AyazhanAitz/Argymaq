import type { Locale } from "./config";
import { ru } from "./dictionaries/ru";
import { kz } from "./dictionaries/kz";
import type { Dictionary } from "./dictionaries/types";

const dictionaries: Record<Locale, Dictionary> = { ru, kz };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.ru;
}

export type { Dictionary };
