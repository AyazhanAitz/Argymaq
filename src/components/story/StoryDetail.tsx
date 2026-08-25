"use client";

import { CheckCircle2 } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Story, Fundraiser, Expense } from "@prisma/client";
import { formatTenge } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type StoryWithFundraiser = Story & { fundraiser: (Fundraiser & { expenses?: Expense[] }) | null };

export function StoryDetail({
  locale,
  dict,
  story,
}: {
  locale: Locale;
  dict: Dictionary;
  story: StoryWithFundraiser;
}) {
  const title = locale === "kz" ? story.titleKz : story.titleRu;
  const problem = locale === "kz" ? story.problemKz : story.problemRu;
  const needed = (locale === "kz" ? story.neededHelpKz : story.neededHelpRu).split("\n").filter(Boolean);
  const goal = locale === "kz" ? story.goalOfWeekKz : story.goalOfWeekRu;
  const result = locale === "kz" ? story.resultKz : story.resultRu;
  const report = locale === "kz" ? story.reportKz : story.reportRu;

  const statusLabels = {
    FUNDRAISING_OPEN: dict.stories.filters.fundraisingOpen,
    IN_PROGRESS: dict.stories.filters.inProgress,
    HELP_PROVIDED: dict.stories.filters.helpProvided,
    REPORT_PUBLISHED: dict.stories.filters.reportPublished,
  } as const;

  return (
    <article>
      <Photo src={story.coverImage} alt={title} label={title} ratio="aspect-[16/8]" className="rounded-xl2" priority />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <StatusPill status={story.status as never} label={statusLabels[story.status as keyof typeof statusLabels]} />
        {story.isMamaOfWeek && (
          <span className="rounded-full bg-terracotta-500 px-3 py-1 text-xs font-bold text-white">
            {dict.mamaOfWeek.badge}
          </span>
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold text-graphite-800 sm:text-4xl">{title}</h1>

      <div className="prose-content mt-6">
        <h2>{dict.mamaOfWeek.problemLabel}</h2>
        <p>{problem}</p>

        {needed.length > 0 && (
          <>
            <h3>{dict.mamaOfWeek.neededLabel}</h3>
            <ul>
              {needed.map((n) => (
                <li key={n} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-forest-500" /> {n}
                </li>
              ))}
            </ul>
          </>
        )}

        {goal && (
          <>
            <h3>{dict.mamaOfWeek.goalLabel}</h3>
            <p>{goal}</p>
          </>
        )}
      </div>

      {story.fundraiser && (
        <div className="mt-8 rounded-xl2 border border-graphite-800/10 bg-sand-100 p-6">
          <h3 className="font-display text-lg font-bold text-graphite-800">{dict.fundraisers.title}</h3>
          <div className="mt-4">
            <ProgressBar raised={story.fundraiser.raisedAmount} goal={story.fundraiser.goalAmount} />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div><dt className="text-graphite-500">{dict.fundraisers.goal}</dt><dd className="font-bold">{formatTenge(story.fundraiser.goalAmount, locale)}</dd></div>
            <div><dt className="text-graphite-500">{dict.fundraisers.raised}</dt><dd className="font-bold text-forest-600">{formatTenge(story.fundraiser.raisedAmount, locale)}</dd></div>
            <div><dt className="text-graphite-500">{dict.fundraisers.remaining}</dt><dd className="font-bold text-terracotta-600">{formatTenge(Math.max(0, story.fundraiser.goalAmount - story.fundraiser.raisedAmount), locale)}</dd></div>
          </dl>
          {story.fundraiser.status === "OPEN" && (
            <LinkButton
              href={`/${locale}/fundraisers/${story.fundraiser.slug}`}
              className="mt-5"
              size="lg"
              onClick={() => trackEvent("click_support_fundraiser", { slug: story.fundraiser!.slug })}
            >
              {dict.cta.supportCollection}
            </LinkButton>
          )}
        </div>
      )}

      {(result || report) && (
        <div className="prose-content mt-8">
          {result && (
            <>
              <h2>{dict.stories.result}</h2>
              <p>{result}</p>
            </>
          )}
          {report && (
            <>
              <h2>{dict.stories.report}</h2>
              <p>{report}</p>
            </>
          )}
        </div>
      )}

      {story.resultImages?.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {story.resultImages.map((img) => (
            <Photo key={img} src={img} alt={title} ratio="aspect-square" className="rounded-xl" />
          ))}
        </div>
      )}

      <p className="mt-8 rounded-xl bg-cream-100 p-4 text-xs leading-relaxed text-graphite-500">
        {dict.mamaOfWeek.consentNote}
      </p>
    </article>
  );
}
