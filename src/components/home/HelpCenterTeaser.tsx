import { Heart, Gift, HandHelping, Shirt, Users, Handshake } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

const icons = [Heart, Gift, HandHelping, Shirt, Users, Handshake];

export function HelpCenterTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section tone="sand">
      <div className="container-page">
        <SectionHeading kicker="Внесите вклад" title={dict.helpCenter.title} subtitle={dict.helpCenter.subtitle} align="center" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dict.helpCenter.options.map((opt, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={opt.title} delay={i * 0.05}>
                <div className="flex h-full items-start gap-3 rounded-xl2 bg-white p-5 shadow-card">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-graphite-800">{opt.title}</h3>
                    <p className="mt-1 text-sm text-graphite-600">{opt.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <LinkButton href={`/${locale}/help-center`} size="lg">
            {dict.cta.supportCenter}
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
