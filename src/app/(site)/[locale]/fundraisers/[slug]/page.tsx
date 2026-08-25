import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getFundraiserBySlug } from "@/lib/queries";
import { Section, Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LinkButton } from "@/components/ui/Button";
import { PaymentPanel } from "@/components/story/PaymentPanel";
import { formatTenge, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const fundraiser = await getFundraiserBySlug(params.slug);
  if (!fundraiser || !fundraiser.published) return {};
  return {
    title: locale === "kz" ? fundraiser.titleKz : fundraiser.titleRu,
    description: locale === "kz" ? fundraiser.descriptionKz : fundraiser.descriptionRu,
  };
}

export default async function FundraiserDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const fundraiser = await getFundraiserBySlug(params.slug);
  if (!fundraiser || !fundraiser.published) notFound();

  const title = locale === "kz" ? fundraiser.titleKz : fundraiser.titleRu;
  const description = locale === "kz" ? fundraiser.descriptionKz : fundraiser.descriptionRu;
  const remaining = Math.max(0, fundraiser.goalAmount - fundraiser.raisedAmount);

  return (
    <Section tone="cream">
      <Container className="max-w-3xl">
        <LinkButton href={`/${locale}/fundraisers`} variant="ghost" size="sm" className="mb-6">
          ← {dict.cta.back}
        </LinkButton>

        <Photo src={fundraiser.coverImage} alt={title} label={title} ratio="aspect-[16/8]" className="rounded-xl2" priority />

        <span
          className={`mt-6 inline-block rounded-full px-3 py-1 text-xs font-bold ${
            fundraiser.status === "OPEN" ? "bg-forest-100 text-forest-700" : "bg-graphite-50 text-graphite-500"
          }`}
        >
          {fundraiser.status === "OPEN" ? `🟡 ${dict.fundraisers.statusOpen}` : `⚪ ${dict.fundraisers.statusClosed}`}
        </span>

        <h1 className="mt-3 font-display text-3xl font-bold text-graphite-800 sm:text-4xl">{title}</h1>
        <p className="prose-content mt-4"><span>{description}</span></p>

        <div className="mt-6 rounded-xl2 border border-graphite-800/10 bg-white p-6 shadow-card">
          <ProgressBar raised={fundraiser.raisedAmount} goal={fundraiser.goalAmount} />
          <dl className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
            <div><dt className="text-graphite-500">{dict.fundraisers.goal}</dt><dd className="mt-1 font-display text-lg font-bold">{formatTenge(fundraiser.goalAmount, locale)}</dd></div>
            <div><dt className="text-graphite-500">{dict.fundraisers.raised}</dt><dd className="mt-1 font-display text-lg font-bold text-forest-600">{formatTenge(fundraiser.raisedAmount, locale)}</dd></div>
            <div><dt className="text-graphite-500">{dict.fundraisers.remaining}</dt><dd className="mt-1 font-display text-lg font-bold text-terracotta-600">{formatTenge(remaining, locale)}</dd></div>
          </dl>
          <p className="mt-4 text-center text-xs text-graphite-400">
            {dict.fundraisers.startDate}: {formatDate(fundraiser.startDate, locale)}
            {fundraiser.endDate ? ` · ${dict.fundraisers.endDate}: ${formatDate(fundraiser.endDate, locale)}` : ""}
          </p>
        </div>

        {fundraiser.status === "OPEN" && (
          <div className="mt-6">
            <PaymentPanel dict={dict} />
          </div>
        )}

        {fundraiser.story && (
          <div className="mt-8">
            <LinkButton href={`/${locale}/stories/${fundraiser.story.slug}`} variant="outline" size="md">
              {dict.cta.viewStory}
            </LinkButton>
          </div>
        )}

        {fundraiser.status === "CLOSED" && fundraiser.expenses.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-xl font-bold text-graphite-800">{dict.reports.expenses}</h2>
            <ul className="mt-3 divide-y divide-graphite-800/10 rounded-xl2 border border-graphite-800/10 bg-white">
              {fundraiser.expenses.map((e) => (
                <li key={e.id} className="flex items-center justify-between p-4 text-sm">
                  <span>{locale === "kz" ? e.titleKz : e.titleRu}</span>
                  <span className="font-bold">{formatTenge(e.amount, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  );
}
