import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getProjectBySlug } from "@/lib/queries";
import { Section, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ProjectDetail } from "@/components/story/ProjectDetail";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: locale === "kz" ? project.titleKz : project.titleRu,
    description: locale === "kz" ? project.descriptionKz : project.descriptionRu,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const project = await getProjectBySlug(params.slug);
  if (!project || project.category !== "PROJECT" || !project.published) notFound();

  return (
    <Section tone="cream">
      <Container className="max-w-3xl">
        <LinkButton href={`/${locale}/projects`} variant="ghost" size="sm" className="mb-6">
          ← {dict.cta.back}
        </LinkButton>
        <ProjectDetail locale={locale} project={project} />
      </Container>
    </Section>
  );
}
