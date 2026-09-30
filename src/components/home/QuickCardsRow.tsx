import Link from "next/link";
import { CheckCircle2, Heart } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Fundraiser, Story, Project, NewsPost } from "@prisma/client";
import { formatTenge, formatDate } from "@/lib/utils";
import { HANDICRAFT_PHOTO } from "@/content/photos";

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-xl2 border border-graphite-800/5 bg-cream-50 p-5 shadow-card">
      <h3 className="mb-4 text-center text-sm font-extrabold uppercase tracking-wide text-graphite-800">{title}</h3>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

type FundraiserWithStory = Fundraiser & { story: Story | null };

/**
 * Ряд из 5 карточек быстрого доступа сразу под hero — композиция повторяет
 * референс-макет («Срочная помощь» / «Наш магазин» / «Наши проекты» /
 * «Сборы» / «Новости и информация»). Везде, где у референса были конкретные
 * суммы и цифры-примеры, здесь используются только реальные данные из БД —
 * при их отсутствии карточка честно показывает пустое состояние вместо
 * выдуманных чисел.
 */
export function QuickCardsRow({
  locale,
  dict,
  urgentFundraiser,
  projects,
  fundraiser,
  news,
}: {
  locale: Locale;
  dict: Dictionary;
  urgentFundraiser: FundraiserWithStory | null;
  projects: Project[];
  fundraiser: FundraiserWithStory | null;
  news: NewsPost[];
}) {
  return (
    <section className="bg-cream-100 pb-12 sm:pb-16">
      <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Срочная помощь */}
        <CardShell title={dict.quickCards.urgentTitle}>
          {urgentFundraiser ? (
            <>
              <span className="mb-3 inline-block w-fit rounded-full bg-terracotta-500 px-3 py-1 text-[11px] font-bold uppercase text-white">
                {dict.quickCards.urgentBadge}
              </span>
              <div className="mb-3 flex gap-3">
                <Photo
                  src={urgentFundraiser.coverImage ?? urgentFundraiser.story?.coverImage ?? null}
                  alt={locale === "kz" ? urgentFundraiser.titleKz : urgentFundraiser.titleRu}
                  ratio="aspect-square"
                  className="w-16 shrink-0 rounded-lg"
                />
                <p className="line-clamp-4 text-xs leading-relaxed text-graphite-600">
                  {locale === "kz" ? urgentFundraiser.titleKz : urgentFundraiser.titleRu}
                </p>
              </div>
              <p className="mb-2 text-xs text-graphite-500">
                {dict.fundraisers.goal}: {formatTenge(urgentFundraiser.goalAmount, locale)}
              </p>
              <div className="mb-4 mt-auto">
                <ProgressBar raised={urgentFundraiser.raisedAmount} goal={urgentFundraiser.goalAmount} />
              </div>
              <LinkButton href={`/${locale}/fundraisers/${urgentFundraiser.slug}`} size="sm" className="w-full">
                {dict.cta.support}
              </LinkButton>
            </>
          ) : (
            <>
              <p className="flex-1 text-sm text-graphite-500">{dict.quickCards.urgentEmpty}</p>
              <LinkButton href={`/${locale}/crisis-home`} variant="outline" size="sm" className="mt-4 w-full">
                {dict.cta.learnMore}
              </LinkButton>
            </>
          )}
        </CardShell>

        {/* Наш магазин */}
        <CardShell title={dict.quickCards.shopTitle}>
          <Photo src={HANDICRAFT_PHOTO} alt={dict.quickCards.shopCaption} ratio="aspect-[4/3]" className="mb-3 rounded-lg" />
          <p className="flex-1 text-sm text-graphite-600">{dict.quickCards.shopCaption}</p>
          <LinkButton href={`/${locale}/flea-market`} variant="outline" size="sm" className="mt-4 w-full">
            {dict.cta.goToShop}
          </LinkButton>
        </CardShell>

        {/* Наши проекты */}
        <CardShell title={dict.quickCards.projectsTitle}>
          {projects.length > 0 ? (
            <ul className="flex-1 space-y-2.5">
              {projects.slice(0, 4).map((p) => (
                <li key={p.id} className="flex items-start gap-2 text-sm text-graphite-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-olive-500" />
                  <span className="line-clamp-2">{locale === "kz" ? p.titleKz : p.titleRu}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex-1 text-sm text-graphite-500">{dict.quickCards.projectsEmpty}</p>
          )}
          <LinkButton href={`/${locale}/projects`} variant="outline" size="sm" className="mt-4 w-full">
            {dict.cta.viewAll}
          </LinkButton>
        </CardShell>

        {/* Сборы */}
        <CardShell title={dict.quickCards.fundraisersTitle}>
          {fundraiser ? (
            <>
              <div className="mb-3 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                  <Heart className="h-7 w-7" />
                </div>
              </div>
              <p className="mb-2 line-clamp-3 flex-1 text-sm text-graphite-600">
                {locale === "kz" ? fundraiser.titleKz : fundraiser.titleRu}
              </p>
              <p className="mb-2 text-xs text-graphite-500">
                {dict.fundraisers.goal}: {formatTenge(fundraiser.goalAmount, locale)}
              </p>
              <div className="mb-4">
                <ProgressBar raised={fundraiser.raisedAmount} goal={fundraiser.goalAmount} />
              </div>
              <LinkButton href={`/${locale}/fundraisers/${fundraiser.slug}`} size="sm" className="w-full">
                {dict.cta.support}
              </LinkButton>
            </>
          ) : (
            <>
              <p className="flex-1 text-sm text-graphite-500">{dict.quickCards.fundraisersEmpty}</p>
              <LinkButton href={`/${locale}/fundraisers`} variant="outline" size="sm" className="mt-4 w-full">
                {dict.cta.viewAll}
              </LinkButton>
            </>
          )}
        </CardShell>

        {/* Новости и информация */}
        <CardShell title={dict.quickCards.newsTitle}>
          {news.length > 0 ? (
            <ul className="flex-1 space-y-3">
              {news.slice(0, 3).map((n) => (
                <li key={n.id}>
                  <Link href={`/${locale}/news/${n.slug}`} className="group flex items-center gap-2.5">
                    <Photo
                      src={n.coverImage}
                      alt={locale === "kz" ? n.titleKz : n.titleRu}
                      ratio="aspect-square"
                      className="w-11 shrink-0 rounded-md"
                    />
                    <span className="flex-1">
                      <span className="block line-clamp-2 text-xs font-semibold text-graphite-800 group-hover:text-terracotta-600">
                        {locale === "kz" ? n.titleKz : n.titleRu}
                      </span>
                      <span className="block text-[11px] text-graphite-400">{formatDate(n.publishedAt, locale)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex-1 text-sm text-graphite-500">{dict.news.empty}</p>
          )}
          <LinkButton href={`/${locale}/news`} variant="outline" size="sm" className="mt-4 w-full">
            {dict.cta.viewAll}
          </LinkButton>
        </CardShell>
      </div>
    </section>
  );
}
