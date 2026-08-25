import { CalendarDays, MapPin, Clock } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Event } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export function EventCard({ locale, dict, event }: { locale: Locale; dict: Dictionary; event: Event }) {
  const title = locale === "kz" ? event.titleKz : event.titleRu;
  const description = locale === "kz" ? event.descriptionKz : event.descriptionRu;

  return (
    <div className="flex h-full flex-col rounded-xl2 border border-graphite-800/5 bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-terracotta-500">
        <CalendarDays className="h-4 w-4" /> {formatDate(event.date, locale)}
      </div>
      <h3 className="font-display text-lg font-bold text-graphite-800">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-600">{description}</p>
      <div className="mt-3 space-y-1.5 text-sm text-graphite-600">
        {event.time && (
          <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-forest-500" /> {event.time}</p>
        )}
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-forest-500" /> {event.location}</p>
      </div>
      {event.registrationUrl && (
        <LinkButton href={event.registrationUrl} variant="outline" size="sm" className="mt-4 w-full">
          {dict.calendar.register}
        </LinkButton>
      )}
    </div>
  );
}
