import { Photo } from "@/components/ui/Photo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Fundraiser } from "@prisma/client";
import { formatTenge, formatDate } from "@/lib/utils";

export function FundraiserCard({
  locale,
  dict,
  fundraiser,
}: {
  locale: Locale;
  dict: Dictionary;
  fundraiser: Fundraiser;
}) {
  const title = locale === "kz" ? fundraiser.titleKz : fundraiser.titleRu;
  const description = locale === "kz" ? fundraiser.descriptionKz : fundraiser.descriptionRu;
  const remaining = Math.max(0, fundraiser.goalAmount - fundraiser.raisedAmount);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl2 border border-graphite-800/5 bg-white shadow-card">
      <Photo src={fundraiser.coverImage} alt={title} label={title} ratio="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-graphite-800">{title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-graphite-600">{description}</p>

        <div className="mt-4">
          <ProgressBar raised={fundraiser.raisedAmount} goal={fundraiser.goalAmount} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-graphite-500">{dict.fundraisers.goal}</dt>
            <dd className="font-bold text-graphite-800">{formatTenge(fundraiser.goalAmount, locale)}</dd>
          </div>
          <div>
            <dt className="text-graphite-500">{dict.fundraisers.raised}</dt>
            <dd className="font-bold text-forest-600">{formatTenge(fundraiser.raisedAmount, locale)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-graphite-500">{dict.fundraisers.remaining}</dt>
            <dd className="font-bold text-terracotta-600">{formatTenge(remaining, locale)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-[11px] text-graphite-400">
          {dict.fundraisers.startDate}: {formatDate(fundraiser.startDate, locale)}
          {fundraiser.endDate ? ` · ${dict.fundraisers.endDate}: ${formatDate(fundraiser.endDate, locale)}` : ""}
        </p>

        <LinkButton href={`/${locale}/fundraisers/${fundraiser.slug}`} className="mt-4 w-full" size="sm">
          {dict.cta.support}
        </LinkButton>
      </div>
    </div>
  );
}
