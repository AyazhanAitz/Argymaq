import { Section, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/getDictionary";

export function WeeklyCycle({ dict }: { dict: Dictionary }) {
  return (
    <Section tone="sand">
      <div className="container-page">
        <SectionHeading kicker={dict.weeklyCycle.kicker} title={dict.weeklyCycle.title} align="center" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dict.weeklyCycle.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="flex h-full items-start gap-3 rounded-xl2 border border-graphite-800/5 bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-graphite-800">
                    {step.title.replace(/^\d+\.\s/, "")}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-graphite-600">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
