"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function updateApplicationStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.application.update({ where: { id }, data: { status: status as never } });
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
}

export async function updateApplicationNote(id: string, formData: FormData) {
  await requireAdmin();
  const adminNote = formData.get("adminNote")?.toString() ?? "";
  await prisma.application.update({ where: { id }, data: { adminNote } });
  revalidatePath(`/admin/applications/${id}`);
}

export async function deleteApplication(id: string) {
  await requireAdmin();
  await prisma.application.delete({ where: { id } });
  revalidatePath("/admin/applications");
}
