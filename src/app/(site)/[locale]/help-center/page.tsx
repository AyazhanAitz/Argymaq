import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { PaymentPanel } from "@/components/story/PaymentPanel";
import { Heart, Gift, HandHelping, Shirt, Users, Handshake } from "lucide-react";

const icons = [Heart, Gift, HandHelping, Shirt, Users, Handshake];

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.helpCenter.title, description: dict.helpCenter.subtitle };
}

export default function HelpCenterPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  const linkFor = (i: number) => {
    switch (i) {
      case 3: return `/${locale}/flea-market`;
      case 4: return `/${locale}/volunteers`;
      case 5: return `/${locale}/partners`;
      default: return null;
    }
  };

  return (
    <Section tone="cream">
      <Container className="max-w-4xl">
        <SectionHeading title={dict.helpCenter.title} subtitle={dict.helpCenter.subtitle} align="center" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dict.helpCenter.options.map((opt, i) => {
            const Icon = icons[i % icons.length];
            const href = linkFor(i);
            const card = (
              <div className="flex h-full flex-col items-start gap-3 rounded-xl2 bg-white p-6 shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-display text-lg font-bold text-graphite-800">{opt.title}</h3>
                <p className="flex-1 text-sm text-graphite-600">{opt.description}</p>
                {href && <span className="text-sm font-bold text-terracotta-500">{dict.cta.readMore} →</span>}
              </div>
            );
            return href ? (
              <a key={opt.title} href={href}>{card}</a>
            ) : (
              <div key={opt.title}>{card}</div>
            );
          })}
        </div>

        <div className="mt-10">
          <PaymentPanel dict={dict} />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <LinkButton href={`/${locale}/partners`} variant="secondary" size="lg">{dict.cta.proposeCooperation}</LinkButton>
          <LinkButton href={`/${locale}/volunteers`} variant="outline" size="lg">{dict.cta.becomeVolunteer}</LinkButton>
        </div>
      </Container>
    </Section>
  );
}
