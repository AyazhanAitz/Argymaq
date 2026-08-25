import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getProjects } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/cards/ProjectCard";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.kids.title, description: dict.kids.subtitle };
}

export default async function KidsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const projects = await getProjects("KIDS");

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.nav.projects} title={dict.kids.title} subtitle={dict.kids.subtitle} align="center" />
        {projects.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.projects.empty}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} locale={locale} dict={dict} project={p} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
