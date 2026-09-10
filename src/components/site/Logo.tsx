import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LOGO } from "@/content/photos";

/**
 * Логотип Центра — реальный официальный логотип (дерево/лист с силуэтом
 * мамы и ребёнка), предоставленный заказчиком. Показываем только верхнюю
 * часть изображения (сам знак), обрезая нижнюю часть с текстом
 * "@analardy_qoldau_ortalygy", так как рядом уже стоит собственный
 * текстовый блок названия Центра.
 */
export function Logo({ locale, dark = false }: { locale: string; dark?: boolean }) {
  return (
    <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5" aria-label="Аналарды қолдау орталығы">
      <div
        className={cn(
          "relative aspect-[4/3] h-10 shrink-0 overflow-hidden rounded-xl border",
          dark ? "border-cream-50/15 bg-white" : "border-graphite-800/10 bg-white"
        )}
      >
        <Image
          src={LOGO.center}
          alt="Логотип Центра поддержки матерей «Аналарды қолдау орталығы»"
          fill
          sizes="56px"
          className="object-cover object-top"
          priority
        />
      </div>
      <span className={cn("leading-tight", dark ? "text-cream-50" : "text-graphite-800")}>
        <span className="block font-display text-sm font-bold sm:text-base">Аналарды қолдау</span>
        <span className="block text-[11px] font-medium tracking-wide opacity-70 sm:text-xs">
          орталығы · Арғымақ
        </span>
      </span>
    </Link>
  );
}
