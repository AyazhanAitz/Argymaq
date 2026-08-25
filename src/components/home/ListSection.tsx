import { Section, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { ReactNode } from "react";

export function ListSection<T>({
  tone = "cream",
  kicker,
  title,
  subtitle,
  items,
  renderItem,
  emptyText,
  viewAllHref,
  viewAllLabel,
  columns = 3,
}: {
  tone?: "cream" | "sand" | "white" | "graphite";
  kicker?: string;
  title: string;
  subtitle?: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyText: string;
  viewAllHref: string;
  viewAllLabel: string;
  columns?: 2 | 3 | 4;
}) {
  const colsClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[
    columns
  ];

  return (
    <Section tone={tone}>
      <div className="container-page">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading kicker={kicker} title={title} subtitle={subtitle} dark={tone === "graphite"} />
          {items.length > 0 && (
            <LinkButton href={viewAllHref} variant={tone === "graphite" ? "gold" : "outline"} size="sm">
              {viewAllLabel}
            </LinkButton>
          )}
        </div>

        {items.length === 0 ? (
          <p className={tone === "graphite" ? "text-cream-200" : "text-graphite-500"}>{emptyText}</p>
        ) : (
          <div className={`grid gap-5 ${colsClass}`}>
            {items.map((item, i) => (
              <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
                {renderItem(item)}
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
