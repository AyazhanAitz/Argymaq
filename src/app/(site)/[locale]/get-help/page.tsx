import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { GetHelpForm } from "./GetHelpForm";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.getHelp.title, description: dict.getHelp.subtitle };
}

export default function GetHelpPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  return (
    <Section tone="cream">
      <Container className="max-w-2xl">
        <SectionHeading title={dict.getHelp.title} subtitle={dict.getHelp.subtitle} align="center" />
        <div className="rounded-xl2 bg-white p-6 shadow-card sm:p-8">
          <GetHelpForm dict={dict} />
        </div>
      </Container>
    </Section>
  );
}
