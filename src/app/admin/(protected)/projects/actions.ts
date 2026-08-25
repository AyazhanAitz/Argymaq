"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { savePublicImage } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  category: z.enum(["PROJECT", "FLEA_MARKET", "ECO", "KIDS"]),
  titleRu: z.string().min(2),
  titleKz: z.string().min(2),
  descriptionRu: z.string().min(2),
  descriptionKz: z.string().min(2),
  goalRu: z.string().optional(),
  goalKz: z.string().optional(),
  resultsRu: z.string().optional(),
  resultsKz: z.string().optional(),
  reportRu: z.string().optional(),
  reportKz: z.string().optional(),
  partners: z.string().optional(),
  published: z.string().optional(),
});

function toData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.parse(raw);
  return {
    ...parsed,
    partners: parsed.partners ? parsed.partners.split(",").map((p) => p.trim()).filter(Boolean) : [],
    published: parsed.published === "on",
  };
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const data = toData(formData);
  const coverFile = formData.get("cover") as File | null;
  const coverImage = coverFile ? await savePublicImage(coverFile, "projects") : null;
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const images = (await Promise.all(imageFiles.map((f) => savePublicImage(f, "projects")))).filter(
    (v): v is string => !!v
  );

  await prisma.project.create({ data: { ...data, coverImage, images } });
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  const data = toData(formData);
  const coverFile = formData.get("cover") as File | null;
  const coverImage = coverFile && coverFile.size > 0 ? await savePublicImage(coverFile, "projects") : undefined;
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const newImages = (await Promise.all(imageFiles.map((f) => savePublicImage(f, "projects")))).filter(
    (v): v is string => !!v
  );

  const existing = await prisma.project.findUnique({ where: { id } });
  const images = [...(existing?.images ?? []), ...newImages];

  await prisma.project.update({ where: { id }, data: { ...data, ...(coverImage ? { coverImage } : {}), images } });
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
}
