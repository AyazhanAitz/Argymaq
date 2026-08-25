import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getAllEvents } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { EventCard } from "@/components/cards/EventCard";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.calendar.title, description: dict.calendar.subtitle };
}

export default async function CalendarPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const events = await getAllEvents();
  const now = new Date();
  const upcoming = events.filter((e) => e.date >= now);
  const past = events.filter((e) => e.date < now);

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.nav.news} title={dict.calendar.title} subtitle={dict.calendar.subtitle} align="center" />

        {upcoming.length === 0 ? (
          <p className="text-center text-graphite-500">{dict.calendar.empty}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.id} locale={locale} dict={dict} event={e} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mb-4 mt-14 font-display text-xl font-bold text-graphite-800">Прошедшие мероприятия</h2>
            <div className="grid gap-5 opacity-70 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <EventCard key={e.id} locale={locale} dict={dict} event={e} />
              ))}
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}
