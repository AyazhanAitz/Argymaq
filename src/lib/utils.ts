import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTenge(amount: number, locale: "ru" | "kz" = "ru") {
  const formatted = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "kk-KZ").format(amount);
  return `${formatted} ₸`;
}

export function formatDate(date: Date | string, locale: "ru" | "kz" = "ru") {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "kk-KZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function percent(raised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));
}

/** AO-2026-00124 — номер обращения (п.13 ТЗ) */
export function formatTicketNumber(year: number, sequence: number) {
  return `AO-${year}-${String(sequence).padStart(5, "0")}`;
}
