import { CheckCircle2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Story, Fundraiser } from "@prisma/client";
import { formatTenge } from "@/lib/utils";

type StoryWithFundraiser = Story & { fundraiser: Fundraiser | null };

export function MamaOfWeekBlock({
  locale,
  dict,
  story,
}: {
  locale: Locale;
  dict: Dictionary;
  story: StoryWithFundraiser | null;
}) {
  const title = story ? (locale === "kz" ? story.titleKz : story.titleRu) : null;
  const problem = story ? (locale === "kz" ? story.problemKz : story.problemRu) : null;
  const needed = story ? (locale === "kz" ? story.neededHelpKz : story.neededHelpRu).split("\n").filter(Boolean) : [];
  const goal = story ? (locale === "kz" ? story.goalOfWeekKz : story.goalOfWeekRu) : null;

  return (
    <Section tone="graphite" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 bg-[url('/ornament/accent.svg')] bg-contain bg-no-repeat opacity-40"
      />
      <div className="container-page relative">
        <SectionHeading kicker={dict.mamaOfWeek.kicker} title={dict.mamaOfWeek.title} dark align="center" />

        {story ? (
          <div className="mx-auto grid max-w-5xl gap-8 rounded-xl2 bg-cream-50 p-6 shadow-soft sm:p-8 lg:grid-cols-2">
            <Photo
              src={story.coverImage}
              alt={title || "Мама недели"}
              label={title ?? undefined}
              ratio="aspect-[4/3]"
              className="rounded-xl2"
            />
            <div className="flex flex-col">
              <span className="mb-3 inline-block w-fit rounded-full bg-terracotta-500 px-3 py-1 text-xs font-bold text-white">
                {dict.mamaOfWeek.badge}
              </span>
              <p className="text-sm italic text-graphite-500">{dict.mamaOfWeek.intro}</p>
              <h3 className="mt-3 font-display text-xl font-bold text-graphite-800">{title}</h3>

              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-terracotta-500">
                {dict.mamaOfWeek.problemLabel}
              </p>
              <p className="mt-1 text-graphite-700">{problem}</p>

              {needed.length > 0 && (
                <>
                  <p className="mt-4 text-sm font-bold uppercase tracking-wide text-terracotta-500">
                    {dict.mamaOfWeek.neededLabel}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {needed.map((n) => (
                      <li key={n} className="flex items-start gap-2 text-sm text-graphite-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {n}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {goal && (
                <div className="mt-4 rounded-xl bg-sand-100 p-3 text-sm">
                  <span className="font-bold text-graphite-800">{dict.mamaOfWeek.goalLabel}: </span>
                  <span className="text-graphite-700">{goal}</span>
                </div>
              )}

              {story.fundraiser && (
                <div className="mt-5">
                  <ProgressBar raised={story.fundraiser.raisedAmount} goal={story.fundraiser.goalAmount} />
                  <div className="mt-2 flex justify-between text-xs font-semibold text-graphite-600">
                    <span>{dict.fundraisers.raised}: {formatTenge(story.fundraiser.raisedAmount, locale)}</span>
                    <span>{dict.fundraisers.goal}: {formatTenge(story.fundraiser.goalAmount, locale)}</span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href={`/${locale}/mama-of-week/${story.slug}`} size="md">
                  {story.fundraiser ? dict.cta.supportCollection : dict.cta.support}
                </LinkButton>
                <LinkButton href={`/${locale}/mama-of-week`} variant="ghost" size="md">
                  {dict.mamaOfWeek.archiveLink}
                </LinkButton>
              </div>
            </div>
          </div>
        ) : (
          <p className="mx-auto max-w-md text-center text-cream-200">{dict.mamaOfWeek.empty}</p>
        )}

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-cream-200/70">
          {dict.mamaOfWeek.consentNote}
        </p>
      </div>
    </Section>
  );
}
