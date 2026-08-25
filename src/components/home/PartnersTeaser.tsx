import { Section } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function PartnersTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section tone="white">
      <div className="container-page">
        <div className="flex flex-col items-center gap-6 rounded-xl2 border-2 border-dashed border-forest-300 bg-forest-50/40 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-graphite-800 sm:text-3xl">
            {dict.partners.subtitle}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton href={`/${locale}/partners`} variant="secondary" size="lg">
              {dict.cta.proposeCooperation}
            </LinkButton>
            <LinkButton href={`/${locale}/volunteers`} variant="outline" size="lg">
              {dict.cta.becomeVolunteer}
            </LinkButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
