import { InstagramIcon } from "@/components/icons/SocialIcons";
import { Section, SectionHeading } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import { CONTACTS } from "@/lib/contacts";
import type { Dictionary } from "@/i18n/getDictionary";

/**
 * TODO: подключить официальный Instagram Graph API (Instagram Basic
 * Display / Content Publishing API) для автоматического вывода последних
 * публикаций @analardy_qoldau_ortalygy, когда заказчик предоставит доступ
 * business-аккаунта. Сейчас — статичная витрина-заглушка со ссылкой на профиль.
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
          {Array.from({ length: 4 }).map((_, i) => (
            <Photo key={i} src={null} alt="Instagram" label="Instagram" ratio="aspect-square" className="rounded-xl" />
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
