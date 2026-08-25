import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getUsefulArticles } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Search, BookOpen } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.usefulInfo.title, description: dict.usefulInfo.subtitle };
}

export default async function UsefulInfoPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const articles = await getUsefulArticles(searchParams.q);

  return (
    <Section tone="cream">
      <Container className="max-w-3xl">
        <SectionHeading kicker={dict.nav.help} title={dict.usefulInfo.title} subtitle={dict.usefulInfo.subtitle} align="center" />

        <form method="get" className="relative mb-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite-400" />
          <input
            type="search"
            name="q"
            defaultValue={searchParams.q}
            placeholder={dict.usefulInfo.searchPlaceholder}
            className="w-full rounded-full border border-graphite-800/15 bg-white py-3.5 pl-12 pr-4 text-base focus:border-gold-500"
          />
        </form>

        {articles.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.usefulInfo.empty}</p>
        ) : (
          <ul className="space-y-3">
            {articles.map((a) => (
              <li key={a.id}>
                <a
                  href={`/${locale}/useful-info/${a.slug}`}
                  className="flex items-start gap-3 rounded-xl2 border border-graphite-800/10 bg-white p-5 shadow-card hover:border-terracotta-300"
                >
                  <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-500" />
                  <div>
                    <span className="mb-1 inline-block rounded-full bg-cream-200 px-2.5 py-0.5 text-xs font-semibold text-graphite-600">
                      {a.category}
                    </span>
                    <h3 className="font-display font-bold text-graphite-800">
                      {locale === "kz" ? a.titleKz : a.titleRu}
                    </h3>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex justify-center">
          <LinkButton href={`/${locale}/get-help`} size="lg">{dict.cta.needHelp}</LinkButton>
        </div>
      </Container>
    </Section>
  );
}
