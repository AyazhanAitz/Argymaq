"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  titleRu: z.string().min(2),
  titleKz: z.string().min(2),
  organizer: z.string().min(2),
  forWhomRu: z.string().min(2),
  forWhomKz: z.string().min(2),
  fundingAmount: z.string().min(1),
  requirementsRu: z.string().min(2),
  requirementsKz: z.string().min(2),
  deadline: z.string().optional(),
  documentsNeededRu: z.string().optional(),
  documentsNeededKz: z.string().optional(),
  sourceUrl: z.string().url(),
  status: z.enum(["OPEN", "CLOSED"]),
});

function toData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.parse(raw);
  return { ...parsed, deadline: parsed.deadline ? new Date(parsed.deadline) : null };
}

export async function createGrant(formData: FormData) {
  await requireAdmin();
  await prisma.grant.create({ data: toData(formData) });
  revalidatePath("/admin/grants");
  redirect("/admin/grants");
}

export async function updateGrant(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.grant.update({ where: { id }, data: toData(formData) });
  revalidatePath("/admin/grants");
  redirect("/admin/grants");
}

export async function deleteGrant(id: string) {
  await requireAdmin();
  await prisma.grant.delete({ where: { id } });
  revalidatePath("/admin/grants");
}
