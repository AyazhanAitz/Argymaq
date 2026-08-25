"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Container";
import type { SiteStat } from "@prisma/client";

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
    <span ref={ref} className="font-display text-4xl font-extrabold text-terracotta-500 sm:text-5xl">
      {display}
      {suffix}
    </span>
  );
}

export function StatsBlock({ stats, locale }: { stats: SiteStat[]; locale: "ru" | "kz" }) {
  if (stats.length === 0) return null;

  return (
    <Section tone="white">
      <div className="container-page">
        <SectionHeading title="Статистика Центра" align="center" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.key} className="rounded-xl2 bg-cream-100 p-6 text-center">
              <Counter value={stat.value} suffix={stat.suffix ?? undefined} />
              <p className="mt-2 text-sm font-medium text-graphite-600">
                {locale === "kz" ? stat.labelKz : stat.labelRu}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
