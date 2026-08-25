import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getStoryBySlug } from "@/lib/queries";
import { Section, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { StoryDetail } from "@/components/story/StoryDetail";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const story = await getStoryBySlug(params.slug);
  if (!story || !story.published) return {};
  return {
    title: locale === "kz" ? story.titleKz : story.titleRu,
    description: locale === "kz" ? story.summaryKz : story.summaryRu,
  };
}

export default async function StoryPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const story = await getStoryBySlug(params.slug);
  if (!story || !story.published) notFound();

  return (
    <Section tone="cream">
      <Container className="max-w-3xl">
        <LinkButton href={`/${locale}/stories`} variant="ghost" size="sm" className="mb-6">
          ← {dict.cta.back}
        </LinkButton>
        <StoryDetail locale={locale} dict={dict} story={story} />
      </Container>
    </Section>
  );
}
