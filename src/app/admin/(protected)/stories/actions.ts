"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { savePublicImage } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  titleRu: z.string().min(2),
  titleKz: z.string().min(2),
  summaryRu: z.string().min(2),
  summaryKz: z.string().min(2),
  problemRu: z.string().min(2),
  problemKz: z.string().min(2),
  neededHelpRu: z.string().min(2),
  neededHelpKz: z.string().min(2),
  goalOfWeekRu: z.string().optional(),
  goalOfWeekKz: z.string().optional(),
  resultRu: z.string().optional(),
  resultKz: z.string().optional(),
  reportRu: z.string().optional(),
  reportKz: z.string().optional(),
  categoryTags: z.string().optional(),
  status: z.enum(["FUNDRAISING_OPEN", "IN_PROGRESS", "HELP_PROVIDED", "REPORT_PUBLISHED"]),
  isMamaOfWeek: z.string().optional(),
  weekOf: z.string().optional(),
  consentGiven: z.string().optional(),
  anonymized: z.string().optional(),
  published: z.string().optional(),
  fundraiserGoal: z.string().optional(),
  fundraiserRaised: z.string().optional(),
  fundraiserStart: z.string().optional(),
  fundraiserEnd: z.string().optional(),
});

function toData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.parse(raw);
  return {
    ...parsed,
    categoryTags: parsed.categoryTags ? parsed.categoryTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    isMamaOfWeek: parsed.isMamaOfWeek === "on",
    weekOf: parsed.weekOf ? new Date(parsed.weekOf) : null,
    consentGiven: parsed.consentGiven === "on",
    anonymized: parsed.anonymized === "on",
    published: parsed.published === "on",
  };
}

export async function createStory(formData: FormData) {
  await requireAdmin();
  const data = toData(formData);
  const coverFile = formData.get("cover") as File | null;
  const coverImage = coverFile ? await savePublicImage(coverFile, "stories") : null;
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const images = (await Promise.all(imageFiles.map((f) => savePublicImage(f, "stories")))).filter((v): v is string => !!v);

  const story = await prisma.story.create({
    data: {
      slug: data.slug,
      titleRu: data.titleRu,
      titleKz: data.titleKz,
      summaryRu: data.summaryRu,
      summaryKz: data.summaryKz,
      problemRu: data.problemRu,
      problemKz: data.problemKz,
      neededHelpRu: data.neededHelpRu,
      neededHelpKz: data.neededHelpKz,
      goalOfWeekRu: data.goalOfWeekRu || null,
      goalOfWeekKz: data.goalOfWeekKz || null,
      resultRu: data.resultRu || null,
      resultKz: data.resultKz || null,
      reportRu: data.reportRu || null,
      reportKz: data.reportKz || null,
      categoryTags: data.categoryTags,
      status: data.status,
      isMamaOfWeek: data.isMamaOfWeek,
      weekOf: data.weekOf,
      consentGiven: data.consentGiven,
      anonymized: data.anonymized,
      published: data.published,
      coverImage,
      images,
    },
  });

  const goalAmount = data.fundraiserGoal ? parseInt(data.fundraiserGoal, 10) : 0;
  if (goalAmount > 0) {
    await prisma.fundraiser.create({
      data: {
        slug: `${data.slug}-sbor`,
        titleRu: data.titleRu,
        titleKz: data.titleKz,
        descriptionRu: data.summaryRu,
        descriptionKz: data.summaryKz,
        goalAmount,
        raisedAmount: data.fundraiserRaised ? parseInt(data.fundraiserRaised, 10) : 0,
        startDate: data.fundraiserStart ? new Date(data.fundraiserStart) : new Date(),
        endDate: data.fundraiserEnd ? new Date(data.fundraiserEnd) : null,
        coverImage,
        storyId: story.id,
        published: data.published,
      },
    });
  }

  revalidatePath("/admin/stories");
  redirect("/admin/stories");
}

export async function updateStory(id: string, formData: FormData) {
  await requireAdmin();
  const data = toData(formData);
  const coverFile = formData.get("cover") as File | null;
  const coverImage = coverFile && coverFile.size > 0 ? await savePublicImage(coverFile, "stories") : undefined;
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const newImages = (await Promise.all(imageFiles.map((f) => savePublicImage(f, "stories")))).filter((v): v is string => !!v);

  const existing = await prisma.story.findUnique({ where: { id }, include: { fundraiser: true } });
  if (!existing) return;

  await prisma.story.update({
    where: { id },
    data: {
      slug: data.slug,
      titleRu: data.titleRu,
      titleKz: data.titleKz,
      summaryRu: data.summaryRu,
      summaryKz: data.summaryKz,
      problemRu: data.problemRu,
      problemKz: data.problemKz,
      neededHelpRu: data.neededHelpRu,
      neededHelpKz: data.neededHelpKz,
      goalOfWeekRu: data.goalOfWeekRu || null,
      goalOfWeekKz: data.goalOfWeekKz || null,
      resultRu: data.resultRu || null,
      resultKz: data.resultKz || null,
      reportRu: data.reportRu || null,
      reportKz: data.reportKz || null,
      categoryTags: data.categoryTags,
      status: data.status,
      isMamaOfWeek: data.isMamaOfWeek,
      weekOf: data.weekOf,
      consentGiven: data.consentGiven,
      anonymized: data.anonymized,
      published: data.published,
      ...(coverImage ? { coverImage } : {}),
      images: [...existing.images, ...newImages],
    },
  });

  const goalAmount = data.fundraiserGoal ? parseInt(data.fundraiserGoal, 10) : 0;
  const raisedAmount = data.fundraiserRaised ? parseInt(data.fundraiserRaised, 10) : 0;
  if (existing.fundraiser) {
    await prisma.fundraiser.update({
      where: { id: existing.fundraiser.id },
      data: {
        goalAmount: goalAmount || existing.fundraiser.goalAmount,
        raisedAmount,
        startDate: data.fundraiserStart ? new Date(data.fundraiserStart) : existing.fundraiser.startDate,
        endDate: data.fundraiserEnd ? new Date(data.fundraiserEnd) : existing.fundraiser.endDate,
        published: data.published,
        ...(coverImage ? { coverImage } : {}),
      },
    });
  } else if (goalAmount > 0) {
    await prisma.fundraiser.create({
      data: {
        slug: `${data.slug}-sbor`,
        titleRu: data.titleRu,
        titleKz: data.titleKz,
        descriptionRu: data.summaryRu,
        descriptionKz: data.summaryKz,
        goalAmount,
        raisedAmount,
        startDate: data.fundraiserStart ? new Date(data.fundraiserStart) : new Date(),
        endDate: data.fundraiserEnd ? new Date(data.fundraiserEnd) : null,
        coverImage: coverImage ?? existing.coverImage,
        storyId: id,
        published: data.published,
      },
    });
  }

  revalidatePath("/admin/stories");
  redirect("/admin/stories");
}

export async function deleteStory(id: string) {
  await requireAdmin();
  await prisma.story.delete({ where: { id } });
  revalidatePath("/admin/stories");
}

export async function togglePublishStory(id: string, published: boolean) {
  await requireAdmin();
  await prisma.story.update({ where: { id }, data: { published: !published } });
  revalidatePath("/admin/stories");
}

export async function closeStoryFundraiser(storyId: string) {
  await requireAdmin();
  const story = await prisma.story.findUnique({ where: { id: storyId }, include: { fundraiser: true } });
  if (story?.fundraiser) {
    await prisma.fundraiser.update({ where: { id: story.fundraiser.id }, data: { status: "CLOSED", endDate: new Date() } });
  }
  await prisma.story.update({ where: { id: storyId }, data: { status: "HELP_PROVIDED" } });
  revalidatePath("/admin/stories");
}

export async function publishStoryReport(id: string) {
  await requireAdmin();
  await prisma.story.update({ where: { id }, data: { status: "REPORT_PUBLISHED" } });
  revalidatePath("/admin/stories");
  revalidatePath("/admin/fundraisers");
}
