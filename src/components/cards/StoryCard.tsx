import { Photo } from "@/components/ui/Photo";
import { StatusPill } from "@/components/ui/StatusPill";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Story } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export function StoryCard({ locale, dict, story }: { locale: Locale; dict: Dictionary; story: Story }) {
  const title = locale === "kz" ? story.titleKz : story.titleRu;
  const summary = locale === "kz" ? story.summaryKz : story.summaryRu;

  const statusLabels = {
    FUNDRAISING_OPEN: dict.stories.filters.fundraisingOpen,
    IN_PROGRESS: dict.stories.filters.inProgress,
    HELP_PROVIDED: dict.stories.filters.helpProvided,
    REPORT_PUBLISHED: dict.stories.filters.reportPublished,
  } as const;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl2 border border-graphite-800/5 bg-white shadow-card">
      <Photo src={story.coverImage} alt={title} label={title} ratio="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <StatusPill status={story.status as never} label={statusLabels[story.status as keyof typeof statusLabels]} />
          {story.publishedAt && (
            <span className="text-xs text-graphite-400">{formatDate(story.publishedAt, locale)}</span>
          )}
        </div>
        <h3 className="font-display text-lg font-bold text-graphite-800">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-600">{summary}</p>
        <LinkButton href={`/${locale}/stories/${story.slug}`} variant="outline" size="sm" className="mt-4 w-full">
          {dict.cta.viewStory}
        </LinkButton>
      </div>
    </div>
  );
}
