import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { PartnerForm } from "./PartnerForm";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.partners.title, description: dict.partners.subtitle };
}

export default function PartnersPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  return (
    <Section tone="cream">
      <Container className="max-w-2xl">
        <SectionHeading title={dict.partners.title} subtitle={dict.partners.subtitle} align="center" />
        <div className="rounded-xl2 bg-white p-6 shadow-card sm:p-8">
          <PartnerForm locale={locale} dict={dict} />
        </div>
      </Container>
    </Section>
  );
}
