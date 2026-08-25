import { MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";

/**
 * Hero-блок (п.5 и п.51 ТЗ).
 *
 * TODO: требуется AI-сгенерированное фото по промпту из п.51 ТЗ
 * (photorealistic editorial photograph, молодая казахская мама с ребёнком,
 * профиль, справа на кадре, слева — свободное пространство под текст).
 * Инструмент генерации изображений недоступен в этой среде разработки —
 * до тех пор используется декоративная заглушка в стилистике сайта.
 * Файл нужно сохранить как /public/hero/mother-child.jpg (16:9, а также
 * версии для tablet/mobile без обрезки лиц) и подключить через <Photo src=.../>.
 */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-cream-100">
      <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:py-24">
        <div className="order-2 lg:order-1">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-terracotta-50 px-4 py-1.5 text-sm font-bold text-terracotta-600">
            {dict.hero.tagline}
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-graphite-800 sm:text-5xl lg:text-[3.25rem]">
            {dict.hero.title}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-graphite-600">
            {dict.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={`/${locale}/get-help`} size="lg">
              {dict.cta.needHelp}
            </LinkButton>
            <LinkButton href={`/${locale}/contacts`} variant="outline" size="lg">
              {dict.cta.bookConsultation}
            </LinkButton>
          </div>
          <a
            href={CONTACTS.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-forest-700"
          >
            <MessageCircle className="h-4 w-4" /> {CONTACTS.phone} · WhatsApp
          </a>
        </div>
        <div className="order-1 lg:order-2">
          <Photo
            src={null}
            alt="Мама с ребёнком — Центр поддержки матерей"
            label="AI-фото: казахская мама с ребёнком (см. TODO в коде)"
            ratio="aspect-[4/3] lg:aspect-[16/11]"
            className="rounded-xl2 shadow-soft"
            priority
          />
        </div>
      </div>
    </section>
  );
}
