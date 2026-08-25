import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getAllGrants } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { GrantCard } from "@/components/cards/GrantCard";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.grants.title, description: dict.grants.subtitle };
}

export default async function GrantsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const grants = await getAllGrants();

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.nav.opportunities} title={dict.grants.title} subtitle={dict.grants.subtitle} align="center" />
        {grants.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.grants.empty}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grants.map((g) => (
              <GrantCard key={g.id} locale={locale} dict={dict} grant={g} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
