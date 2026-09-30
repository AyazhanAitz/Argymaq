import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LOGO } from "@/content/photos";

/**
 * Логотип — реальный официальный логотип, предоставленный заказчиком:
 * дерево/лист с силуэтом мамы и ребёнка и словесный знак «ARGYMAQ»,
 * встроенный в то же изображение (см. public/photos/logo). Показываем
 * знак и словесный знак целиком, обрезая только нижнюю строку с хэштегом
 * "@analardy_qoldau_ortalygy" — рядом уже стоит собственный текстовый
 * блок названия Центра.
 */
export function Logo({ locale, dark = false }: { locale: string; dark?: boolean }) {
  return (
    <Link href={`/${locale}`} className="flex shrink-0 items-center gap-3" aria-label="Argymaq — Аналарды қолдау орталығы">
      <div className="relative aspect-[5/4] h-14 shrink-0 overflow-hidden sm:h-16">
        <Image
          src={LOGO.center}
          alt="Argymaq — логотип Центра поддержки матерей «Аналарды қолдау орталығы»"
          fill
          sizes="80px"
          className="object-cover object-top"
          priority
        />
      </div>
      <span
        className={cn(
          "hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider sm:block",
          dark ? "text-cream-50/70" : "text-graphite-600/80"
        )}
      >
        {locale === "kz" ? "Аналарды қолдау орталығы" : "Центр поддержки матерей"}
      </span>
    </Link>
  );
}
