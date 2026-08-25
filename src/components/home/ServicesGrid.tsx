import Link from "next/link";
import { Scale, HeartHandshake, Heart, Briefcase, PiggyBank, Rocket, type LucideIcon } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

const icons: Record<string, LucideIcon> = {
  legal: Scale,
  social: HeartHandshake,
  psychological: Heart,
  employment: Briefcase,
  finance: PiggyBank,
  business: Rocket,
};

export function ServicesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cards = [
    { slug: "legal", ...dict.services.items.legal },
    { slug: "social", ...dict.services.items.social },
    { slug: "psychological", ...dict.services.items.psychological },
    { slug: "employment", ...dict.services.items.employment },
    { slug: "finance", ...dict.services.items.finance },
    { slug: "business", ...dict.services.items.business },
  ];

  return (
    <Section tone="cream" id="services">
      <div className="container-page">
        <SectionHeading kicker={dict.services.kicker} title={dict.services.title} subtitle={dict.services.subtitle} align="center" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = icons[card.slug];
            return (
              <Reveal key={card.slug} delay={i * 0.05}>
                <Link
                  href={`/${locale}/services/${card.slug}`}
                  className="group flex h-full flex-col rounded-xl2 border border-graphite-800/5 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500 transition-colors group-hover:bg-terracotta-500 group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-graphite-800">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-600">{card.description}</p>
                  <span className="mt-4 text-sm font-bold text-terracotta-500 group-hover:underline">
                    {dict.cta.readMore} →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
