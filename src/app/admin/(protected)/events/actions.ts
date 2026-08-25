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
  descriptionRu: z.string().min(2),
  descriptionKz: z.string().min(2),
  date: z.string().min(1),
  time: z.string().optional(),
  location: z.string().min(2),
  organizer: z.string().optional(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
});

function toData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.parse(raw);
  return { ...parsed, date: new Date(parsed.date), registrationUrl: parsed.registrationUrl || null };
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const data = toData(formData);
  const coverFile = formData.get("cover") as File | null;
  const coverImage = coverFile ? await savePublicImage(coverFile, "events") : null;
  await prisma.event.create({ data: { ...data, coverImage } });
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();
  const data = toData(formData);
  const coverFile = formData.get("cover") as File | null;
  const coverImage = coverFile && coverFile.size > 0 ? await savePublicImage(coverFile, "events") : undefined;
  await prisma.event.update({ where: { id }, data: { ...data, ...(coverImage ? { coverImage } : {}) } });
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
}
