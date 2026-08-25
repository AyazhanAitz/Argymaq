"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LinkButton } from "@/components/ui/Button";
import type { NavItem } from "@/content/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function Header({
  locale,
  dict,
  nav,
}: {
  locale: Locale;
  dict: Dictionary;
  nav: NavItem[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-graphite-800/5 bg-cream-50/95 backdrop-blur">
      <a href="#main-content" className="skip-link">
        Перейти к содержимому / Мазмұнға өту
      </a>
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo locale={locale} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {nav.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.href)}
              onMouseLeave={() => item.children && setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-graphite-700 transition-colors hover:bg-cream-200 hover:text-terracotta-600"
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
              </Link>
              {item.children && (
                <div
                  className={cn(
                    "absolute left-0 top-full min-w-[240px] rounded-2xl border border-graphite-800/5 bg-white p-2 shadow-soft transition-all duration-150",
                    openDropdown === item.href
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-graphite-700 hover:bg-cream-100 hover:text-terracotta-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${CONTACTS.phoneHref.replace("tel:", "")}`}
            onClick={() => trackEvent("click_call")}
            className="flex items-center gap-1.5 text-sm font-semibold text-graphite-700 hover:text-terracotta-600"
          >
            <Phone className="h-4 w-4" /> {CONTACTS.phone}
          </a>
          <LanguageSwitcher current={locale} />
          <LinkButton
            href={`/${locale}/get-help`}
            size="sm"
            onClick={() => trackEvent("cta_need_help")}
          >
            {dict.cta.needHelp}
          </LinkButton>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher current={locale} />
          <button
            type="button"
            aria-label={mobileOpen ? dict.nav.close : dict.nav.menu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-graphite-800 text-cream-50"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <MobileMenu
          nav={nav}
          locale={locale}
          dict={dict}
          onNavigate={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}

function MobileMenu({
  nav,
  locale,
  dict,
  onNavigate,
}: {
  nav: NavItem[];
  locale: Locale;
  dict: Dictionary;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-graphite-800/10 bg-cream-50 pb-28 lg:hidden">
      <nav className="container-page flex flex-col py-4" aria-label="Мобильная навигация">
        {nav.map((item) => (
          <div key={item.href} className="border-b border-graphite-800/5 py-1">
            <div className="flex items-center justify-between">
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex-1 py-3 text-base font-semibold text-graphite-800"
              >
                {item.label}
              </Link>
              {item.children && (
                <button
                  type="button"
                  aria-label="Развернуть подменю"
                  onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                  className="flex h-11 w-11 items-center justify-center"
                >
                  <ChevronDown
                    className={cn("h-5 w-5 transition-transform", expanded === item.href && "rotate-180")}
                  />
                </button>
              )}
            </div>
            {item.children && expanded === item.href && (
              <div className="mb-2 flex flex-col gap-1 pl-3">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-graphite-600 hover:bg-cream-200"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <LinkButton
          href={`/${locale}/get-help`}
          className="mt-5 w-full"
          size="lg"
          onClick={() => {
            trackEvent("cta_need_help");
            onNavigate();
          }}
        >
          {dict.cta.needHelp}
        </LinkButton>
        <LinkButton
          href={CONTACTS.whatsappHref}
          variant="whatsapp"
          className="mt-3 w-full"
          size="lg"
          onClick={() => trackEvent("click_whatsapp")}
        >
          WhatsApp
        </LinkButton>
      </nav>
    </div>
  );
}
