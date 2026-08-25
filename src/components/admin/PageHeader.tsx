import Link from "next/link";
import { Plus } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  createHref,
  createLabel = "Добавить",
}: {
  title: string;
  subtitle?: string;
  createHref?: string;
  createLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-graphite-800">{title}</h1>
        {subtitle && <p className="text-sm text-graphite-500">{subtitle}</p>}
      </div>
      {createHref && (
        <Link
          href={createHref}
          className="flex items-center gap-1.5 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-terracotta-600"
        >
          <Plus className="h-4 w-4" /> {createLabel}
        </Link>
      )}
    </div>
  );
}
