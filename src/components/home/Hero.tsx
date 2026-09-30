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

/** Мягкая маска, «растворяющая» край фотографии в фон hero — без рамки и обрезки. */
const FADE_RIGHT =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_22%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_22%)]";
const FADE_TOP =
  "[mask-image:linear-gradient(to_bottom,transparent_0%,black_14%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_14%)]";

/**
 * Hero-блок (п.5 и п.51 ТЗ).
 *
 * Структура, тексты, кнопки и навигация не менялись — переработана только
 * визуальная композиция: фотография мамы с детьми (HERO_PHOTO, см.
 * src/content/photos.ts) больше не лежит в отдельной карточке/рамке, а
 * становится частью фона hero — без обрезки (object-contain, пропорции
 * контейнера точно равны пропорциям кадра), с плавным растворением края
 * в общий кремовый фон секции (mask-image) и без видимых границ/теней.
 * На мобильных фото идёт отдельным блоком под текстом, тоже целиком и
 * без рамки.
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
      {/* Фото — фон правой части hero на десктопе/планшете, edge-to-edge, без карточки.
          Ширина зафиксирована в % от секции, а не от её высоты — чтобы фото не
          разрасталось и не наезжало на текст, если текст переносится на
          дополнительную строку на более узких экранах. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block"
      >
        <Image
          src={HERO_PHOTO}
          alt=""
          fill
          sizes="50vw"
          className={`object-contain object-bottom ${FADE_RIGHT}`}
          priority
        />
      </div>
      <MotherChildOrnament className="pointer-events-none absolute right-6 top-6 hidden h-40 w-40 text-terracotta-400/20 md:block lg:h-52 lg:w-52" />

      <div className="container-page relative z-10 grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[1.05fr_1fr] md:gap-8 lg:py-20">
        <div>
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

        {/* Пустая колонка-распорка под фото-фон на md+, чтобы текст не заходил под фотографию */}
        <div className="hidden md:block" aria-hidden />
      </div>

      {/* Плавающая карточка «Поддержать фонд» — реальные данные открытых сборов.
          На md+ лежит поверх фото в правом нижнем углу секции; на мобильных — обычным блоком после фото. */}
      <div className="hidden md:block">
        <div className="absolute bottom-10 right-6 z-10 w-60 rounded-xl2 bg-cream-50 p-5 text-center shadow-soft lg:right-10">
          <DonationCardContent
            locale={locale}
            dict={dict}
            raisedTotal={raisedTotal}
            openFundraisersCount={openFundraisersCount}
          />
        </div>
      </div>

      {/* Фото на мобильных — отдельным блоком под текстом, целиком, без рамки, edge-to-edge по ширине */}
      <div className="relative -mx-4 mt-2 sm:-mx-6 md:hidden">
        <div className={`relative aspect-[1155/1284] w-full ${FADE_TOP}`}>
          <Image
            src={HERO_PHOTO}
            alt="Мама несёт спящих детей в национальном костюме — Центр поддержки матерей"
            fill
            sizes="100vw"
            className="object-contain object-top"
          />
        </div>
        <div className="container-page -mt-8 relative z-10">
          <div className="mx-auto max-w-xs rounded-xl2 bg-cream-50 p-5 text-center shadow-soft">
            <DonationCardContent
              locale={locale}
              dict={dict}
              raisedTotal={raisedTotal}
              openFundraisersCount={openFundraisersCount}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DonationCardContent({
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
  return (
    <>
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
    </>
  );
}
