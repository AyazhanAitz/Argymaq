import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Типографический логотип-заглушка.
 * TODO: заменить на официальный логотип Центра/Фонда «Арғымақ», когда
 * заказчик предоставит файл (SVG/PNG с прозрачным фоном).
 */
export function Logo({ locale, dark = false }: { locale: string; dark?: boolean }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0" aria-label="Аналарды қолдау орталығы">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="19" className={dark ? "fill-cream-50/10" : "fill-terracotta-50"} stroke="#C29435" strokeWidth="1.2" />
        <path
          d="M20 8c0 6-6 6-6 12s6 6 6 12c0-6 6-6 6-12s-6-6-6-12Z"
          className="fill-terracotta-500"
        />
        <circle cx="20" cy="20" r="2.4" className="fill-gold-400" />
      </svg>
      <span className={cn("leading-tight", dark ? "text-cream-50" : "text-graphite-800")}>
        <span className="block font-display text-sm font-bold sm:text-base">Аналарды қолдау</span>
        <span className="block text-[11px] font-medium tracking-wide opacity-70 sm:text-xs">
          орталығы · Арғымақ
        </span>
      </span>
    </Link>
  );
}
