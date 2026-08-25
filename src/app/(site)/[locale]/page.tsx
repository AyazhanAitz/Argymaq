import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { notFound } from "next/navigation";
import {
  getCurrentMamaOfWeek,
  getOpenFundraisers,
  getStories,
  getProjects,
  getOpenGrants,
  getNews,
  getUpcomingEvents,
  getSiteStats,
} from "@/lib/queries";

import { Hero } from "@/components/home/Hero";
import { QuickActions } from "@/components/home/QuickActions";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { MamaOfWeekBlock } from "@/components/home/MamaOfWeekBlock";
import { WeeklyCycle } from "@/components/home/WeeklyCycle";
import { ListSection } from "@/components/home/ListSection";
import { StatsBlock } from "@/components/home/StatsBlock";
import { HelpCenterTeaser } from "@/components/home/HelpCenterTeaser";
import { PartnersTeaser } from "@/components/home/PartnersTeaser";
import { InstagramTeaser } from "@/components/home/InstagramTeaser";
import { ContactsTeaser } from "@/components/home/ContactsTeaser";

import { FundraiserCard } from "@/components/cards/FundraiserCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { GrantCard } from "@/components/cards/GrantCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { EventCard } from "@/components/cards/EventCard";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  const [mamaOfWeek, fundraisers, stories, projects, grants, news, events, stats] = await Promise.all([
    getCurrentMamaOfWeek(),
    getOpenFundraisers(3),
    getStories("ALL").then((s) => s.slice(0, 3)),
    getProjects("PROJECT", 3),
    getOpenGrants(3),
    getNews(3),
    getUpcomingEvents(3),
    getSiteStats(),
  ]);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <QuickActions dict={dict} />
      <ServicesGrid locale={locale} dict={dict} />
      <ProcessTimeline dict={dict} />
      <MamaOfWeekBlock locale={locale} dict={dict} story={mamaOfWeek} />
      <WeeklyCycle dict={dict} />

      <ListSection
        tone="cream"
        title={dict.fundraisers.title}
        subtitle={dict.fundraisers.subtitle}
        items={fundraisers}
        renderItem={(f) => <FundraiserCard locale={locale} dict={dict} fundraiser={f} />}
        emptyText={dict.fundraisers.empty}
        viewAllHref={`/${locale}/fundraisers`}
        viewAllLabel={dict.cta.viewAll}
      />

      <ListSection
        tone="sand"
        title={dict.stories.title}
        subtitle={dict.stories.subtitle}
        items={stories}
        renderItem={(s) => <StoryCard locale={locale} dict={dict} story={s} />}
        emptyText={dict.stories.empty}
        viewAllHref={`/${locale}/stories`}
        viewAllLabel={dict.cta.viewAll}
      />

      <ListSection
        tone="white"
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
        items={projects}
        renderItem={(p) => <ProjectCard locale={locale} dict={dict} project={p} />}
        emptyText={dict.projects.empty}
        viewAllHref={`/${locale}/projects`}
        viewAllLabel={dict.cta.viewAll}
      />

      <ListSection
        tone="cream"
        title={dict.grants.title}
        subtitle={dict.grants.subtitle}
        items={grants}
        renderItem={(g) => <GrantCard locale={locale} dict={dict} grant={g} />}
        emptyText={dict.grants.empty}
        viewAllHref={`/${locale}/grants`}
        viewAllLabel={dict.cta.viewAll}
      />

      <ListSection
        tone="sand"
        title={dict.news.title}
        subtitle={dict.news.subtitle}
        items={news}
        renderItem={(n) => <NewsCard locale={locale} dict={dict} post={n} />}
        emptyText={dict.news.empty}
        viewAllHref={`/${locale}/news`}
        viewAllLabel={dict.cta.viewAll}
      />

      <ListSection
        tone="white"
        title={dict.calendar.title}
        subtitle={dict.calendar.subtitle}
        items={events}
        renderItem={(e) => <EventCard locale={locale} dict={dict} event={e} />}
        emptyText={dict.calendar.empty}
        viewAllHref={`/${locale}/calendar`}
        viewAllLabel={dict.cta.viewAll}
      />

      <StatsBlock stats={stats} locale={locale} />
      <HelpCenterTeaser locale={locale} dict={dict} />
      <PartnersTeaser locale={locale} dict={dict} />
      <InstagramTeaser dict={dict} />
      <ContactsTeaser locale={locale} dict={dict} />
    </>
  );
}
