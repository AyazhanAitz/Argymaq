import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { services } from "@/content/services";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import {
  Scale, HeartHandshake, Heart, Home, Briefcase, Rocket, PiggyBank, Award, Users, type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  legal: Scale,
  social: HeartHandshake,
  psychological: Heart,
  "crisis-home": Home,
  employment: Briefcase,
  business: Rocket,
  finance: PiggyBank,
  grants: Award,
  networking: Users,
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.services.title, description: dict.services.subtitle };
}

export default function ServicesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.nav.services} title={dict.services.title} subtitle={dict.services.subtitle} align="center" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = icons[s.slug];
            return (
              <div key={s.slug} className="flex flex-col rounded-xl2 border border-graphite-800/5 bg-white p-6 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-graphite-800">
                  {locale === "kz" ? s.titleKz : s.titleRu}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-600">
                  {locale === "kz" ? s.shortKz : s.shortRu}
                </p>
                <LinkButton href={`/${locale}/services/${s.slug}`} variant="outline" size="sm" className="mt-4 w-full">
                  {dict.cta.readMore}
                </LinkButton>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
