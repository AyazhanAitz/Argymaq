import { Briefcase, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Vacancy } from "@prisma/client";

const formatLabels: Record<string, { ru: string; kz: string }> = {
  OFFICE: { ru: "Офис", kz: "Кеңсе" },
  REMOTE: { ru: "Удалённо", kz: "Қашықтан" },
  HYBRID: { ru: "Гибрид", kz: "Аралас" },
};

export function VacancyCard({ locale, vacancy }: { locale: Locale; vacancy: Vacancy }) {
  const title = locale === "kz" ? vacancy.titleKz : vacancy.titleRu;
  const description = locale === "kz" ? vacancy.descriptionKz : vacancy.descriptionRu;

  return (
    <div className="rounded-xl2 border border-graphite-800/5 bg-white p-5 shadow-card">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold text-forest-600">
        <span className="rounded-full bg-forest-50 px-2.5 py-1">{formatLabels[vacancy.format][locale]}</span>
        <span className="flex items-center gap-1 text-graphite-500"><MapPin className="h-3.5 w-3.5" /> {vacancy.city}</span>
        <span className="flex items-center gap-1 text-graphite-500"><Briefcase className="h-3.5 w-3.5" /> {vacancy.direction}</span>
      </div>
      <h3 className="font-display text-lg font-bold text-graphite-800">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-graphite-600">{description}</p>
      <p className="mt-2 text-sm text-graphite-500">{vacancy.schedule}</p>
      {(vacancy.salaryFrom || vacancy.salaryTo) && (
        <p className="mt-2 text-sm font-bold text-terracotta-600">
          {vacancy.salaryFrom?.toLocaleString("ru-RU")}
          {vacancy.salaryTo ? ` – ${vacancy.salaryTo.toLocaleString("ru-RU")}` : ""} ₸
        </p>
      )}
      {vacancy.contactInfo && <p className="mt-3 text-xs text-graphite-500">{vacancy.contactInfo}</p>}
    </div>
  );
}
