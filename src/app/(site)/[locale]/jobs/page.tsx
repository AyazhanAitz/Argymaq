import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getActiveVacancies } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { VacancyCard } from "@/components/cards/VacancyCard";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.jobs.title, description: dict.jobs.subtitle };
}

export default async function JobsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { city?: string; format?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const all = await getActiveVacancies();

  const cities = Array.from(new Set(all.map((v) => v.city)));
  const filtered = all.filter((v) => {
    if (searchParams.city && v.city !== searchParams.city) return false;
    if (searchParams.format && v.format !== searchParams.format) return false;
    return true;
  });

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.services.items.employment.title} title={dict.jobs.title} subtitle={dict.jobs.subtitle} align="center" />

        {all.length > 0 && (
          <form className="mb-8 flex flex-wrap justify-center gap-3" method="get">
            <select name="city" defaultValue={searchParams.city ?? ""} className="rounded-full border border-graphite-800/15 bg-white px-4 py-2 text-sm">
              <option value="">{dict.jobs.filters.city}</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select name="format" defaultValue={searchParams.format ?? ""} className="rounded-full border border-graphite-800/15 bg-white px-4 py-2 text-sm">
              <option value="">{dict.jobs.filters.format}</option>
              <option value="OFFICE">Офис</option>
              <option value="REMOTE">Удалённо</option>
              <option value="HYBRID">Гибрид</option>
            </select>
            <button type="submit" className="rounded-full bg-graphite-800 px-5 py-2 text-sm font-bold text-white">
              OK
            </button>
          </form>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.jobs.empty}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <VacancyCard key={v.id} locale={locale} vacancy={v} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
