"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { savePublicImage } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  titleRu: z.string().min(2),
  titleKz: z.string().min(2),
  excerptRu: z.string().min(2),
  excerptKz: z.string().min(2),
  bodyRu: z.string().min(2),
  bodyKz: z.string().min(2),
  category: z.enum(["NEWS", "ANNOUNCEMENT", "EVENT", "PROMO", "REPORT", "GRANT", "VACANCY"]),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефис"),
  published: z.string().optional(),
});

function toData(formData: FormData) {
  return schema.parse({
    titleRu: formData.get("titleRu"),
    titleKz: formData.get("titleKz"),
    excerptRu: formData.get("excerptRu"),
    excerptKz: formData.get("excerptKz"),
    bodyRu: formData.get("bodyRu"),
    bodyKz: formData.get("bodyKz"),
    category: formData.get("category"),
    slug: formData.get("slug"),
    published: formData.get("published")?.toString(),
  });
}

export async function createNews(formData: FormData) {
  await requireAdmin();
  const data = toData(formData);
  const coverFile = formData.get("cover") as File | null;
  const coverImage = coverFile ? await savePublicImage(coverFile, "news") : null;

  await prisma.newsPost.create({
    data: { ...data, coverImage, published: data.published === "on" },
  });
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updateNews(id: string, formData: FormData) {
  await requireAdmin();
  const data = toData(formData);
  const coverFile = formData.get("cover") as File | null;
  const coverImage = coverFile && coverFile.size > 0 ? await savePublicImage(coverFile, "news") : undefined;

  await prisma.newsPost.update({
    where: { id },
    data: { ...data, published: data.published === "on", ...(coverImage ? { coverImage } : {}) },
  });
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await requireAdmin();
  await prisma.newsPost.delete({ where: { id } });
  revalidatePath("/admin/news");
}
