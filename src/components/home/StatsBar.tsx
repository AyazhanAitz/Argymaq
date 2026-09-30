"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Gift, HeartHandshake, Briefcase, Users, HandHeart } from "lucide-react";
import type { SiteStat } from "@prisma/client";
import type { Locale } from "@/i18n/config";

const ICONS: Record<string, typeof Gift> = {
  CLOTHES_TONS: Gift,
  WOMEN_HELPED: HeartHandshake,
  PROJECTS_DONE: Briefcase,
  VOLUNTEERS: Users,
  FAMILIES: HandHeart,
};

/** Порядок и подбор колонок для 5-местной плашки референсного макета. */
const ORDER = ["CLOTHES_TONS", "FAMILIES", "PROJECTS_DONE", "VOLUNTEERS", "WOMEN_HELPED"];

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 900;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(progress * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-2xl font-extrabold text-graphite-900 sm:text-3xl">
      {display}
      {suffix}
    </span>
  );
}

/**
 * Плашка статистики Центра — единая закруглённая карточка с 5 колонками
 * (иконка + число + подпись), композиция повторяет референс-макет.
 * Числа — реальные показатели из SiteStat (заполняются администратором);
 * если запись отсутствует, колонка не выводится, а не подменяется выдумкой.
 */
export function StatsBar({ stats, locale }: { stats: SiteStat[]; locale: Locale }) {
  const byKey = new Map(stats.map((s) => [s.key, s]));
  const columns = ORDER.map((key) => byKey.get(key)).filter((s): s is SiteStat => Boolean(s));

  if (columns.length === 0) return null;

  return (
    <div className="container-page pb-12 sm:pb-16">
      <div className="flex flex-col flex-wrap items-center justify-center gap-x-10 gap-y-6 rounded-[2.5rem] border border-graphite-800/5 bg-cream-50 px-6 py-7 shadow-card sm:flex-row sm:gap-x-12 sm:px-10">
        {columns.map((stat) => {
          const Icon = ICONS[stat.key] ?? Gift;
          return (
            <div key={stat.key} className="flex items-center gap-3">
              <Icon className="h-8 w-8 shrink-0 text-olive-500" strokeWidth={1.5} />
              <div className="text-left leading-tight">
                <Counter value={stat.value} suffix={stat.suffix ?? undefined} />
                <p className="mt-0.5 max-w-[9rem] text-xs font-medium text-graphite-600">
                  {locale === "kz" ? stat.labelKz : stat.labelRu}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
