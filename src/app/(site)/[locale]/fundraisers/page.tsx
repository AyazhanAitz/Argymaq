import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getAllFundraisers } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { FundraiserCard } from "@/components/cards/FundraiserCard";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.fundraisers.title, description: dict.fundraisers.subtitle };
}

export default async function FundraisersPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const fundraisers = await getAllFundraisers();

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.mamaOfWeek.kicker} title={dict.fundraisers.title} subtitle={dict.fundraisers.subtitle} align="center" />
        <p className="mx-auto mb-8 max-w-2xl rounded-xl bg-forest-50 p-4 text-center text-sm text-forest-700">
          {dict.fundraisers.paymentNotice}
        </p>
        {fundraisers.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.fundraisers.empty}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fundraisers.map((f) => (
              <FundraiserCard key={f.id} locale={locale} dict={dict} fundraiser={f} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
