"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, switchLocalePath, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ current, dark = false }: { current: Locale; dark?: boolean }) {
  const pathname = usePathname() || `/${current}`;

  return (
    <div
      className={cn(
        "flex items-center rounded-full border p-0.5 text-sm font-bold",
        dark ? "border-cream-50/25" : "border-graphite-800/15"
      )}
      role="group"
      aria-label="Выбор языка / Тілді таңдау"
    >
      {locales.map((loc) => {
        const active = loc === current;
        return (
          <Link
            key={loc}
            href={switchLocalePath(pathname, loc)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-3 py-1 transition-colors duration-200",
              active
                ? "bg-terracotta-500 text-cream-50"
                : dark
                ? "text-cream-100 hover:bg-cream-50/10"
                : "text-graphite-600 hover:bg-cream-200"
            )}
          >
            {localeNames[loc]}
          </Link>
        );
      })}
    </div>
  );
}
