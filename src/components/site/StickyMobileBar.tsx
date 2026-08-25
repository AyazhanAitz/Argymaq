"use client";

import Link from "next/link";
import { HandHeart, MessageCircle, Phone, Menu } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";
import { trackEvent } from "@/lib/analytics";

/**
 * Фиксированная нижняя панель для мобильной версии (п.32-33 ТЗ):
 * Помощь | WhatsApp | Позвонить | Меню — всегда доступны, крупные зоны нажатия.
 */
export function StickyMobileBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <nav
      aria-label="Быстрые действия"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-graphite-800/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <Link
        href={`/${locale}/get-help`}
        onClick={() => trackEvent("cta_need_help")}
        className="flex min-h-[64px] flex-col items-center justify-center gap-1 text-terracotta-600"
      >
        <HandHeart className="h-6 w-6" />
        <span className="text-[11px] font-bold leading-none">{dict.cta.needHelp.split(" ")[0]}</span>
      </Link>
      <a
        href={CONTACTS.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("click_whatsapp")}
        className="flex min-h-[64px] flex-col items-center justify-center gap-1 text-[#25D366]"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="text-[11px] font-bold leading-none">WhatsApp</span>
      </a>
      <a
        href={CONTACTS.phoneHref}
        onClick={() => trackEvent("click_call")}
        className="flex min-h-[64px] flex-col items-center justify-center gap-1 text-forest-500"
      >
        <Phone className="h-6 w-6" />
        <span className="text-[11px] font-bold leading-none">{dict.cta.call}</span>
      </a>
      <a
        href="#main-menu-anchor"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector<HTMLButtonElement>("header button[aria-label]")?.click();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex min-h-[64px] flex-col items-center justify-center gap-1 text-graphite-700"
      >
        <Menu className="h-6 w-6" />
        <span className="text-[11px] font-bold leading-none">{dict.nav.menu}</span>
      </a>
    </nav>
  );
}
