import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export function buildNav(dict: Dictionary, locale: Locale): NavItem[] {
  const p = (path: string) => `/${locale}${path}`;
  return [
    { label: dict.nav.about, href: p("/about") },
    {
      label: dict.nav.help,
      href: p("/get-help"),
      children: [
        { label: dict.getHelp.title, href: p("/get-help") },
        { label: dict.mamaOfWeek.badge, href: p("/mama-of-week") },
        { label: dict.stories.title, href: p("/stories") },
        { label: dict.fundraisers.title, href: p("/fundraisers") },
        { label: dict.crisisHome.title, href: p("/crisis-home") },
        { label: dict.usefulInfo.title, href: p("/useful-info") },
      ],
    },
    {
      label: dict.nav.services,
      href: p("/services"),
    },
    {
      label: dict.nav.projects,
      href: p("/projects"),
      children: [
        { label: dict.projects.title, href: p("/projects") },
        { label: dict.fleaMarket.title, href: p("/flea-market") },
        { label: dict.kids.title, href: p("/kids") },
      ],
    },
    {
      label: dict.nav.opportunities,
      href: p("/grants"),
      children: [
        { label: dict.grants.title, href: p("/grants") },
        { label: dict.jobs.title, href: p("/jobs") },
      ],
    },
    {
      label: dict.nav.news,
      href: p("/news"),
      children: [
        { label: dict.news.title, href: p("/news") },
        { label: dict.calendar.title, href: p("/calendar") },
        { label: dict.gallery.title, href: p("/gallery") },
      ],
    },
    {
      label: dict.nav.support,
      href: p("/help-center"),
      children: [
        { label: dict.helpCenter.title, href: p("/help-center") },
        { label: dict.partners.title, href: p("/partners") },
        { label: dict.volunteers.title, href: p("/volunteers") },
        { label: dict.reports.title, href: p("/reports") },
      ],
    },
  ];
}
