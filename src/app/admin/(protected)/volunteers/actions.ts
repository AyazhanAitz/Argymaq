"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function updateVolunteerStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.volunteerApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/volunteers");
}

export async function deleteVolunteerApplication(id: string) {
  await requireAdmin();
  await prisma.volunteerApplication.delete({ where: { id } });
  revalidatePath("/admin/volunteers");
}
