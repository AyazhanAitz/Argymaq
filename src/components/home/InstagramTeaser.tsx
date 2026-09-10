import { InstagramIcon } from "@/components/icons/SocialIcons";
import { Section, SectionHeading } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import { CONTACTS } from "@/lib/contacts";
import type { Dictionary } from "@/i18n/getDictionary";
import { MASTERCLASS_PHOTOS, CONSULTATION_PHOTOS, CHARITY_PHOTOS, ECO_REUSE_PHOTOS } from "@/content/photos";

const SHOWCASE = [
  { src: MASTERCLASS_PHOTOS[1], alt: "Мастер-класс для мам Центра" },
  { src: CONSULTATION_PHOTOS[2], alt: "Консультация услугополучателя" },
  { src: CHARITY_PHOTOS[2], alt: "Благотворительная помощь семье" },
  { src: ECO_REUSE_PHOTOS[4], alt: "Дармарка — сбор вещей" },
];

/**
 * TODO: подключить официальный Instagram Graph API (Instagram Basic
 * Display / Content Publishing API) для автоматического вывода последних
 * публикаций @analardy_qoldau_ortalygy, когда заказчик предоставит доступ
 * business-аккаунта. Пока показываем подборку реальных фото Центра из
 * src/photos (см. src/content/photos.ts) со ссылкой на профиль.
 */
export function InstagramTeaser({ dict }: { dict: Dictionary }) {
  return (
    <Section tone="cream">
      <div className="container-page">
        <SectionHeading
          kicker="Мы в соцсетях"
          title={CONTACTS.instagramHandle}
          subtitle="Реальные фотографии мероприятий, консультаций, Дармарок и проектов Центра."
          align="center"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SHOWCASE.map((item) => (
            <Photo key={item.src} src={item.src} alt={item.alt} ratio="aspect-square" className="rounded-xl" />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <LinkButton href={CONTACTS.instagram} size="lg">
            <InstagramIcon className="h-5 w-5" /> {dict.cta.instagram}
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
