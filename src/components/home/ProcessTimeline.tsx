import { Section, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/getDictionary";

export function ProcessTimeline({ dict }: { dict: Dictionary }) {
  return (
    <Section tone="white">
      <div className="container-page">
        <SectionHeading kicker={dict.process.kicker} title={dict.process.title} align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {dict.process.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="relative flex h-full flex-col rounded-xl2 bg-sand-100 p-6">
                <span className="font-display text-3xl font-extrabold text-terracotta-400/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-graphite-800">
                  {step.title.replace(/^\d+\s—\s/, "")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-600">{step.description}</p>
                {i < dict.process.steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-[-14px] top-1/2 hidden -translate-y-1/2 text-2xl text-terracotta-300 lg:block"
                  >
                    →
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
