import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getMamaOfWeekArchive } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { StoryCard } from "@/components/cards/StoryCard";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.mamaOfWeek.title, description: dict.mamaOfWeek.intro };
}

export default async function MamaOfWeekArchivePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const stories = await getMamaOfWeekArchive();

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.mamaOfWeek.kicker} title={dict.mamaOfWeek.title} subtitle={dict.mamaOfWeek.consentNote} align="center" />
        {stories.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.mamaOfWeek.empty}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <StoryCard key={s.id} locale={locale} dict={dict} story={s} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
