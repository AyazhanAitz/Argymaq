import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getStories } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { StoryCard } from "@/components/cards/StoryCard";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.stories.title, description: dict.stories.subtitle };
}

const FILTERS = ["ALL", "FUNDRAISING_OPEN", "IN_PROGRESS", "HELP_PROVIDED", "REPORT_PUBLISHED"] as const;

export default async function StoriesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { status?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const activeStatus = FILTERS.includes(searchParams.status as (typeof FILTERS)[number])
    ? (searchParams.status as (typeof FILTERS)[number])
    : "ALL";
  const stories = await getStories(activeStatus);

  const filterLabels: Record<(typeof FILTERS)[number], string> = {
    ALL: dict.stories.filters.all,
    FUNDRAISING_OPEN: dict.stories.filters.fundraisingOpen,
    IN_PROGRESS: dict.stories.filters.inProgress,
    HELP_PROVIDED: dict.stories.filters.helpProvided,
    REPORT_PUBLISHED: dict.stories.filters.reportPublished,
  };

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.mamaOfWeek.kicker} title={dict.stories.title} subtitle={dict.stories.subtitle} align="center" />

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={f === "ALL" ? `/${locale}/stories` : `/${locale}/stories?status=${f}`}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                activeStatus === f
                  ? "bg-terracotta-500 text-white"
                  : "bg-white text-graphite-600 hover:bg-terracotta-50"
              )}
            >
              {filterLabels[f]}
            </Link>
          ))}
        </div>

        {stories.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.stories.empty}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <StoryCard key={s.id} locale={locale} dict={dict} story={s} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
