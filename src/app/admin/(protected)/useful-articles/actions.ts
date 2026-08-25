"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  titleRu: z.string().min(2),
  titleKz: z.string().min(2),
  summaryRu: z.string().min(2),
  summaryKz: z.string().min(2),
  bodyRu: z.string().min(2),
  bodyKz: z.string().min(2),
  category: z.string().min(2),
  published: z.string().optional(),
});

function toData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.parse(raw);
  return { ...parsed, published: parsed.published === "on" };
}

export async function createArticle(formData: FormData) {
  await requireAdmin();
  await prisma.usefulArticle.create({ data: toData(formData) });
  revalidatePath("/admin/useful-articles");
  redirect("/admin/useful-articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.usefulArticle.update({ where: { id }, data: toData(formData) });
  revalidatePath("/admin/useful-articles");
  redirect("/admin/useful-articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.usefulArticle.delete({ where: { id } });
  revalidatePath("/admin/useful-articles");
}
