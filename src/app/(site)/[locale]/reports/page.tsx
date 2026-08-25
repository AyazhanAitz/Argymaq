import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getAllFundraisers } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LinkButton } from "@/components/ui/Button";
import { FileText } from "lucide-react";
import { formatTenge } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.reports.title, description: dict.reports.subtitle };
}

export default async function ReportsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const fundraisers = await getAllFundraisers();

  const open = fundraisers.filter((f) => f.status === "OPEN");
  const closed = fundraisers.filter((f) => f.status === "CLOSED");

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker="Прозрачность" title={dict.reports.title} subtitle={dict.reports.subtitle} align="center" />

        <h2 className="mb-4 font-display text-xl font-bold text-graphite-800">{dict.fundraisers.statusOpen}</h2>
        {open.length === 0 ? (
          <p className="mb-10 text-graphite-500">{dict.fundraisers.empty}</p>
        ) : (
          <div className="mb-12 grid gap-4 sm:grid-cols-2">
            {open.map((f) => (
              <div key={f.id} className="rounded-xl2 border border-graphite-800/10 bg-white p-5">
                <h3 className="font-display font-bold text-graphite-800">{locale === "kz" ? f.titleKz : f.titleRu}</h3>
                <div className="mt-3"><ProgressBar raised={f.raisedAmount} goal={f.goalAmount} /></div>
                <p className="mt-2 text-sm text-graphite-600">
                  {dict.fundraisers.raised}: {formatTenge(f.raisedAmount, locale)} / {formatTenge(f.goalAmount, locale)}
                </p>
              </div>
            ))}
          </div>
        )}

        <h2 className="mb-4 font-display text-xl font-bold text-graphite-800">Завершённые сборы и отчёты</h2>
        {closed.length === 0 ? (
          <p className="text-graphite-500">Пока нет завершённых сборов с опубликованным отчётом.</p>
        ) : (
          <div className="space-y-6">
            {closed.map((f) => {
              const spent = f.expenses.reduce((sum, e) => sum + e.amount, 0);
              const balance = f.raisedAmount - spent;
              return (
                <div key={f.id} className="rounded-xl2 border border-graphite-800/10 bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-graphite-800">
                      {locale === "kz" ? f.titleKz : f.titleRu}
                    </h3>
                    <FileText className="h-5 w-5 text-graphite-400" />
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                    <div><dt className="text-graphite-500">{dict.reports.received}</dt><dd className="font-bold">{formatTenge(f.raisedAmount, locale)}</dd></div>
                    <div><dt className="text-graphite-500">{dict.reports.spent}</dt><dd className="font-bold text-terracotta-600">{formatTenge(spent, locale)}</dd></div>
                    <div><dt className="text-graphite-500">{dict.reports.balance}</dt><dd className="font-bold text-forest-600">{formatTenge(balance, locale)}</dd></div>
                  </dl>
                  {f.expenses.length > 0 && (
                    <>
                      <h4 className="mt-5 text-sm font-bold uppercase tracking-wide text-graphite-500">{dict.reports.expenses}</h4>
                      <ul className="mt-2 divide-y divide-graphite-800/10">
                        {f.expenses.map((e) => (
                          <li key={e.id} className="flex justify-between py-2 text-sm">
                            <span>{locale === "kz" ? e.titleKz : e.titleRu}</span>
                            <span className="font-bold">{formatTenge(e.amount, locale)}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {f.story && (
                    <LinkButton href={`/${locale}/stories/${f.story.slug}`} variant="outline" size="sm" className="mt-4">
                      {dict.cta.viewStory}
                    </LinkButton>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-10 rounded-xl bg-cream-100 p-4 text-xs text-graphite-500">
          {dict.common.todoContent}: сканы чеков и документов, а также фотографии «до / после» публикуются
          администратором Центра по каждому завершённому сбору отдельно, при наличии согласия на публикацию.
        </p>
      </Container>
    </Section>
  );
}
