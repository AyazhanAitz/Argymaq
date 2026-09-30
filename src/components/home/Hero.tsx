import Image from "next/image";
import { Heart, MessageCircle, Scale, HandHeart, Brain, Gift } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { MotherChildOrnament } from "./MotherChildOrnament";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";
import { HERO_PHOTO } from "@/content/photos";
import { formatTenge } from "@/lib/utils";

/**
 * «Чем мы помогаем» — короткий ряд из 4 пунктов под hero-кнопками,
 * композиция и иконки повторяют референс-макет заказчика.
 */
function getHowWeHelp(locale: Locale, dict: Dictionary) {
  return [
    { icon: Scale, label: dict.services.items.legal.title, href: `/${locale}/services/legal` },
    { icon: HandHeart, label: dict.services.items.social.title, href: `/${locale}/services/social` },
    { icon: Brain, label: dict.services.items.psychological.title, href: `/${locale}/services/psychological` },
    { icon: Gift, label: dict.quickCards.humanitarianHelp, href: `/${locale}/help-center` },
  ];
}

/**
 * Hero-блок (п.5 и п.51 ТЗ).
 *
 * Композиция приближена к референс-макету заказчика: слева — заголовок,
 * подзаголовок, две CTA-кнопки и ряд «чем мы помогаем»; справа — фотография
 * мамы с детьми (референсный кадр, см. HERO_PHOTO в src/content/photos.ts)
 * с декоративным орнаментом и плавающей карточкой «Поддержать фонд»,
 * привязанной к реальным данным открытых сборов (без выдуманных цифр).
 */
export function Hero({
  locale,
  dict,
  raisedTotal,
  openFundraisersCount,
}: {
  locale: Locale;
  dict: Dictionary;
  raisedTotal: number;
  openFundraisersCount: number;
}) {
  const howWeHelp = getHowWeHelp(locale, dict);

  return (
    <section className="relative overflow-hidden bg-cream-100">
      <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-20">
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-graphite-900 sm:text-5xl lg:text-[3.1rem]">
            {dict.hero.title}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-graphite-600">
            {dict.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={`/${locale}/get-help`} size="lg">
              {dict.cta.needHelp}
              <Heart className="h-4.5 w-4.5" />
            </LinkButton>
            <LinkButton href={`/${locale}/about`} variant="outline" size="lg">
              {dict.cta.learnMore}
            </LinkButton>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            {howWeHelp.map((item) => (
              <a key={item.label} href={item.href} className="group flex flex-col items-center text-center sm:items-start sm:text-left">
                <item.icon className="h-9 w-9 text-olive-500 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                <span className="mt-2 text-xs font-bold leading-tight text-graphite-700">{item.label}</span>
              </a>
            ))}
          </div>

          <a
            href={CONTACTS.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-forest-700"
          >
            <MessageCircle className="h-4 w-4" /> {CONTACTS.phone} · WhatsApp
          </a>
        </div>

        <div className="relative order-1 lg:order-2">
          <MotherChildOrnament className="pointer-events-none absolute -right-2 -top-6 h-40 w-40 text-terracotta-400/25 sm:h-52 sm:w-52 lg:-right-6 lg:-top-8 lg:h-64 lg:w-64" />

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl2 shadow-soft sm:aspect-[4/4.5] lg:aspect-[4/5]">
            <Image
              src={HERO_PHOTO}
              alt="Мама несёт спящих детей в национальном костюме — Центр поддержки матерей"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Плавающая карточка «Поддержать фонд» — реальные данные открытых сборов.
              Закреплена снизу, чтобы не перекрывать лицо на фото ни на одном брейкпоинте. */}
          <div className="absolute -bottom-6 left-4 right-4 rounded-xl2 bg-cream-50 p-5 text-center shadow-soft sm:bottom-4 sm:left-auto sm:right-4 sm:w-60">
            <p className="text-xs font-bold uppercase tracking-wide text-graphite-700">{dict.cta.supportFund}</p>
            <Heart className="mx-auto mt-2 h-6 w-6 fill-terracotta-500 text-terracotta-500" />
            {openFundraisersCount > 0 ? (
              <>
                <p className="mt-2 font-display text-2xl font-extrabold text-graphite-900">
                  {formatTenge(raisedTotal, locale)}
                </p>
                <p className="mt-0.5 text-xs text-graphite-500">{dict.quickCards.donationRaised}</p>
              </>
            ) : (
              <p className="mt-2 text-xs leading-snug text-graphite-500">{dict.quickCards.donationEmpty}</p>
            )}
            <LinkButton href={`/${locale}/${openFundraisersCount > 0 ? "fundraisers" : "help-center"}`} size="sm" className="mt-4 w-full">
              {dict.cta.helpNow}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
