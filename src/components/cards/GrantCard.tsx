import { Award } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Grant } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export function GrantCard({ locale, dict, grant }: { locale: Locale; dict: Dictionary; grant: Grant }) {
  const forWhom = locale === "kz" ? grant.forWhomKz : grant.forWhomRu;

  return (
    <div className="flex h-full flex-col rounded-xl2 border border-graphite-800/5 bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-300/25 text-gold-600">
          <Award className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            grant.status === "OPEN" ? "bg-forest-100 text-forest-700" : "bg-graphite-50 text-graphite-500"
          }`}
        >
          {grant.status === "OPEN" ? "🟢 Открыт" : "⚪ Завершён"}
        </span>
      </div>
      <h3 className="font-display text-lg font-bold text-graphite-800">{grant.titleRu}</h3>
      <p className="mt-1 text-sm text-graphite-500">{grant.organizer}</p>
      <dl className="mt-3 space-y-1.5 text-sm text-graphite-600">
        <div><dt className="inline font-semibold">{dict.grants.forWhom}: </dt><dd className="inline">{forWhom}</dd></div>
        <div><dt className="inline font-semibold">{dict.grants.funding}: </dt><dd className="inline">{grant.fundingAmount}</dd></div>
        {grant.deadline && (
          <div><dt className="inline font-semibold">{dict.grants.deadline}: </dt><dd className="inline">{formatDate(grant.deadline, locale)}</dd></div>
        )}
      </dl>
      <LinkButton href={grant.sourceUrl} variant="outline" size="sm" className="mt-4 w-full">
        {dict.grants.source}
      </LinkButton>
    </div>
  );
}
