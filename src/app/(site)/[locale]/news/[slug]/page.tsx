import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getNewsBySlug } from "@/lib/queries";
import { Section, Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import { ShareButtons } from "@/components/site/ShareButtons";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const post = await getNewsBySlug(params.slug);
  if (!post || !post.published) return {};
  return {
    title: locale === "kz" ? post.titleKz : post.titleRu,
    description: locale === "kz" ? post.excerptKz : post.excerptRu,
    openGraph: { images: post.coverImage ? [post.coverImage] : [] },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const post = await getNewsBySlug(params.slug);
  if (!post || !post.published) notFound();

  const title = locale === "kz" ? post.titleKz : post.titleRu;
  const body = locale === "kz" ? post.bodyKz : post.bodyRu;

  return (
    <Section tone="cream">
      <Container className="max-w-3xl">
        <LinkButton href={`/${locale}/news`} variant="ghost" size="sm" className="mb-6">
          ← {dict.cta.back}
        </LinkButton>
        <Photo src={post.coverImage} alt={title} label={title} ratio="aspect-[16/8]" className="rounded-xl2" priority />
        <p className="mt-6 text-sm font-bold text-terracotta-500">{formatDate(post.publishedAt, locale)}</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-graphite-800 sm:text-4xl">{title}</h1>
        <div className="prose-content mt-6 whitespace-pre-line">{body}</div>
        <div className="mt-8">
          <ShareButtons title={title} label={dict.news.share} />
        </div>
      </Container>
    </Section>
  );
}
