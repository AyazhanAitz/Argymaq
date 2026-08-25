import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getProjects, getSiteStats } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Shirt, Sofa, Recycle, Leaf } from "lucide-react";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.fleaMarket.title, description: dict.fleaMarket.subtitle };
}

export default async function FleaMarketPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const [projects, stats] = await Promise.all([getProjects("FLEA_MARKET"), getSiteStats()]);
  const clothesStat = stats.find((s) => s.key === "CLOTHES_TONS");

  const categories = [
    { icon: Shirt, label: locale === "kz" ? "Киім" : "Одежда" },
    { icon: Sofa, label: locale === "kz" ? "Жиһаз" : "Мебель" },
    { icon: Recycle, label: locale === "kz" ? "Техника мен ыдыс-аяқ" : "Техника и утварь" },
    { icon: Leaf, label: locale === "kz" ? "Экоакциялар" : "Экологические акции" },
  ];

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.nav.projects} title={dict.fleaMarket.title} subtitle={dict.fleaMarket.subtitle} align="center" />

        {clothesStat && (
          <div className="mx-auto mb-10 max-w-md rounded-xl2 bg-forest-500 p-8 text-center text-cream-50 shadow-soft">
            <p className="font-display text-5xl font-extrabold">
              {clothesStat.value}{clothesStat.suffix}
            </p>
            <p className="mt-2 text-cream-100">{locale === "kz" ? clothesStat.labelKz : clothesStat.labelRu}</p>
          </div>
        )}

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-2 rounded-xl2 bg-white p-5 text-center shadow-card">
              <c.icon className="h-7 w-7 text-terracotta-500" />
              <span className="text-sm font-semibold text-graphite-700">{c.label}</span>
            </div>
          ))}
        </div>

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
