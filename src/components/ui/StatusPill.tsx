import { cn } from "@/lib/utils";

export type StoryStatus = "FUNDRAISING_OPEN" | "IN_PROGRESS" | "HELP_PROVIDED" | "REPORT_PUBLISHED";

const config: Record<StoryStatus, { dot: string; className: string }> = {
  FUNDRAISING_OPEN: { dot: "🟡", className: "bg-gold-300/30 text-gold-600" },
  IN_PROGRESS: { dot: "🔵", className: "bg-forest-100 text-forest-600" },
  HELP_PROVIDED: { dot: "🟢", className: "bg-forest-100 text-forest-700" },
  REPORT_PUBLISHED: { dot: "⚪", className: "bg-graphite-50 text-graphite-600" },
};

export function StatusPill({ status, label }: { status: StoryStatus; label: string }) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        c.className
      )}
    >
      <span aria-hidden>{c.dot}</span>
      {label}
    </span>
  );
}
