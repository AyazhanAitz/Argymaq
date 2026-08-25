import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getNews } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/cards/NewsCard";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.news.title, description: dict.news.subtitle };
}

export default async function NewsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const posts = await getNews();

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.nav.news} title={dict.news.title} subtitle={dict.news.subtitle} align="center" />
        {posts.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.news.empty}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <NewsCard key={p.id} locale={locale} dict={dict} post={p} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
