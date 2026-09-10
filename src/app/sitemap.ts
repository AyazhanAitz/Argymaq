import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n/config";
import { services } from "@/content/services";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://argymaq.kz";

const STATIC_PATHS = [
  "", "about", "services", "get-help", "mama-of-week", "stories", "fundraisers",
  "reports", "crisis-home", "jobs", "grants", "projects", "flea-market", "kids",
  "help-center", "partners", "volunteers", "news", "calendar", "useful-info",
  "gallery", "contacts", "privacy-policy", "terms", "requisites",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: `${SITE_URL}/${locale}${path ? `/${path}` : ""}`, lastModified: new Date() });
    }
    for (const s of services) {
      entries.push({ url: `${SITE_URL}/${locale}/services/${s.slug}` });
    }
  }

  try {
    const [news, stories, fundraisers, projects, articles] = await Promise.all([
      prisma.newsPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.story.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.fundraiser.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.project.findMany({ where: { published: true }, select: { slug: true, category: true, updatedAt: true } }),
      prisma.usefulArticle.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    for (const locale of locales) {
      for (const n of news) entries.push({ url: `${SITE_URL}/${locale}/news/${n.slug}`, lastModified: n.updatedAt });
      for (const s of stories) entries.push({ url: `${SITE_URL}/${locale}/stories/${s.slug}`, lastModified: s.updatedAt });
      for (const f of fundraisers) entries.push({ url: `${SITE_URL}/${locale}/fundraisers/${f.slug}`, lastModified: f.updatedAt });
      for (const a of articles) entries.push({ url: `${SITE_URL}/${locale}/useful-info/${a.slug}`, lastModified: a.updatedAt });
      for (const p of projects) {
        const base = p.category === "FLEA_MARKET" ? "flea-market" : p.category === "KIDS" ? "kids" : "projects";
        entries.push({ url: `${SITE_URL}/${locale}/${base}/${p.slug}`, lastModified: p.updatedAt });
      }
    }
  } catch {
    // Database unavailable during build time; return static-only sitemap
  }

  return entries;
}
