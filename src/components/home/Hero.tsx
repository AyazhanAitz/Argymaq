import { CheckCircle2, MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";
import { HERO_PHOTO } from "@/content/photos";

const HELP_LIST: Record<Locale, string[]> = {
  ru: [
    "Женщинам с детьми в трудной жизненной ситуации",
    "Юридическая и социальная поддержка",
    "Психологическая помощь и сопровождение",
    "Работа, профориентация и предпринимательство",
  ],
  kz: [
    "Қиын өмірлік жағдайдағы балалы әйелдерге",
    "Заңгерлік және әлеуметтік қолдау",
    "Психологиялық көмек және сүйемелдеу",
    "Жұмыс, кәсіби бағдар және кәсіпкерлік",
  ],
};

/**
 * Hero-блок (п.5 и п.51 ТЗ).
 *
 * Композиция приближена к референс-макету заказчика: слева — заголовок,
 * подзаголовок, чек-лист «Мы помогаем» и кнопки действий; справа —
 * фотография Центра. Фото реальное — из архива мероприятий Центра
 * (src/photos/Мастерклассы), см. src/content/photos.ts.
 */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const helpList = HELP_LIST[locale];

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

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {helpList.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-medium text-graphite-700">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-forest-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

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
            src={HERO_PHOTO}
            alt="Мастер-класс и выставка «Одно село — один продукт» — Центр поддержки матерей"
            ratio="aspect-[4/3] lg:aspect-[16/11]"
            className="rounded-xl2 shadow-soft"
            priority
          />
        </div>
      </div>
    </section>
  );
}
