"use client";

/**
 * Обёртка над GA4 gtag для отслеживания ключевых CTA (п.39 ТЗ).
 * Работает только если задан NEXT_PUBLIC_GA_ID и скрипт gtag загружен
 * (см. GoogleAnalytics.tsx в корневом layout).
 */
type GtagEvent =
  | "cta_need_help"
  | "cta_book_consultation"
  | "cta_support_center"
  | "cta_propose_cooperation"
  | "click_whatsapp"
  | "click_call"
  | "click_instagram"
  | "click_facebook"
  | "click_threads"
  | "click_support_fundraiser"
  | "submit_help_request"
  | "submit_volunteer_form"
  | "submit_partner_form"
  | "event_registration";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: GtagEvent, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params ?? {});
}
