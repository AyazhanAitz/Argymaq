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

/**
 * Верхний уровень меню повторяет референсный макет (7 пунктов: О нас /
 * Наша помощь / Проекты / Новости / Магазин / Срочная помощь / Контакты).
 * Все остальные разделы сайта (услуги, гранты, вакансии, волонтёрам,
 * партнёрам, отчёты и т.д.) не удалены — они собраны в выпадающих
 * подменю «Наша помощь» и «Проекты», чтобы не терять ни одной
 * существующей страницы.
 */
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
        { label: dict.usefulInfo.title, href: p("/useful-info") },
        { label: dict.nav.services, href: p("/services") },
        { label: dict.grants.title, href: p("/grants") },
        { label: dict.jobs.title, href: p("/jobs") },
        { label: dict.helpCenter.title, href: p("/help-center") },
        { label: dict.partners.title, href: p("/partners") },
        { label: dict.volunteers.title, href: p("/volunteers") },
        { label: dict.reports.title, href: p("/reports") },
      ],
    },
    {
      label: dict.nav.projects,
      href: p("/projects"),
      children: [
        { label: dict.projects.title, href: p("/projects") },
        { label: dict.kids.title, href: p("/kids") },
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
    { label: dict.nav.shop, href: p("/flea-market") },
    { label: dict.nav.urgentHelp, href: p("/crisis-home") },
    { label: dict.nav.contacts, href: p("/contacts") },
  ];
}
