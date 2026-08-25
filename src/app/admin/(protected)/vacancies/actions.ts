"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  titleRu: z.string().min(2),
  titleKz: z.string().min(2),
  organization: z.string().optional(),
  city: z.string().min(2),
  format: z.enum(["OFFICE", "REMOTE", "HYBRID"]),
  schedule: z.string().min(2),
  direction: z.string().min(2),
  salaryFrom: z.string().optional(),
  salaryTo: z.string().optional(),
  descriptionRu: z.string().min(2),
  descriptionKz: z.string().min(2),
  requirementsRu: z.string().optional(),
  requirementsKz: z.string().optional(),
  contactInfo: z.string().optional(),
  active: z.string().optional(),
});

function toData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.parse(raw);
  return {
    ...parsed,
    salaryFrom: parsed.salaryFrom ? parseInt(parsed.salaryFrom, 10) : null,
    salaryTo: parsed.salaryTo ? parseInt(parsed.salaryTo, 10) : null,
    active: parsed.active === "on",
  };
}

export async function createVacancy(formData: FormData) {
  await requireAdmin();
  await prisma.vacancy.create({ data: toData(formData) });
  revalidatePath("/admin/vacancies");
  redirect("/admin/vacancies");
}

export async function updateVacancy(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.vacancy.update({ where: { id }, data: toData(formData) });
  revalidatePath("/admin/vacancies");
  redirect("/admin/vacancies");
}

export async function deleteVacancy(id: string) {
  await requireAdmin();
  await prisma.vacancy.delete({ where: { id } });
  revalidatePath("/admin/vacancies");
}
