import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getUsefulArticleBySlug } from "@/lib/queries";
import { Section, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const article = await getUsefulArticleBySlug(params.slug);
  if (!article || !article.published) return {};
  return {
    title: locale === "kz" ? article.titleKz : article.titleRu,
    description: locale === "kz" ? article.summaryKz : article.summaryRu,
  };
}

export default async function UsefulArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const article = await getUsefulArticleBySlug(params.slug);
  if (!article || !article.published) notFound();

  return (
    <Section tone="cream">
      <Container className="max-w-2xl">
        <LinkButton href={`/${locale}/useful-info`} variant="ghost" size="sm" className="mb-6">
          ← {dict.cta.back}
        </LinkButton>
        <span className="mb-2 inline-block rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-graphite-600">
          {article.category}
        </span>
        <h1 className="font-display text-3xl font-bold text-graphite-800">
          {locale === "kz" ? article.titleKz : article.titleRu}
        </h1>
        <div className="prose-content mt-6 whitespace-pre-line">
          {locale === "kz" ? article.bodyKz : article.bodyRu}
        </div>
      </Container>
    </Section>
  );
}
