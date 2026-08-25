import { prisma } from "@/lib/prisma";

export async function getCurrentMamaOfWeek() {
  return prisma.story.findFirst({
    where: { isMamaOfWeek: true, published: true },
    orderBy: { weekOf: "desc" },
    include: { fundraiser: true },
  });
}

export async function getMamaOfWeekArchive() {
  return prisma.story.findMany({
    where: { isMamaOfWeek: true, published: true },
    orderBy: { weekOf: "desc" },
    include: { fundraiser: true },
  });
}

export async function getOpenFundraisers(take?: number) {
  return prisma.fundraiser.findMany({
    where: { status: "OPEN", published: true },
    orderBy: { createdAt: "desc" },
    take,
    include: { story: true },
  });
}

export async function getAllFundraisers() {
  return prisma.fundraiser.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { story: true, expenses: true },
  });
}

export async function getFundraiserBySlug(slug: string) {
  return prisma.fundraiser.findUnique({
    where: { slug },
    include: { story: true, expenses: { orderBy: { date: "asc" } } },
  });
}

export async function getStories(statusFilter?: string) {
  return prisma.story.findMany({
    where: {
      published: true,
      ...(statusFilter && statusFilter !== "ALL" ? { status: statusFilter as never } : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { fundraiser: true },
  });
}

export async function getStoryBySlug(slug: string) {
  return prisma.story.findUnique({ where: { slug }, include: { fundraiser: { include: { expenses: true } } } });
}

export async function getNews(take?: number) {
  return prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getNewsBySlug(slug: string) {
  return prisma.newsPost.findUnique({ where: { slug } });
}

export async function getUpcomingEvents(take?: number) {
  return prisma.event.findMany({
    where: { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    orderBy: { date: "asc" },
    take,
  });
}

export async function getAllEvents() {
  return prisma.event.findMany({ orderBy: { date: "asc" } });
}

export async function getProjects(category?: "PROJECT" | "FLEA_MARKET" | "ECO" | "KIDS", take?: number) {
  return prisma.project.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export async function getOpenGrants(take?: number) {
  return prisma.grant.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getAllGrants() {
  return prisma.grant.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getActiveVacancies() {
  return prisma.vacancy.findMany({ where: { active: true }, orderBy: { publishedAt: "desc" } });
}

export async function getSiteStats() {
  return prisma.siteStat.findMany();
}

export async function getUsefulArticles(query?: string) {
  return prisma.usefulArticle.findMany({
    where: {
      published: true,
      ...(query
        ? {
            OR: [
              { titleRu: { contains: query, mode: "insensitive" } },
              { titleKz: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { titleRu: "asc" },
  });
}

export async function getUsefulArticleBySlug(slug: string) {
  return prisma.usefulArticle.findUnique({ where: { slug } });
}

export async function getGalleryImages(category?: string) {
  return prisma.galleryImage.findMany({
    where: category && category !== "ALL" ? { category: category as never } : {},
    orderBy: { createdAt: "desc" },
  });
}
