"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function updatePartnerStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.partnerApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/partners");
}

export async function deletePartnerApplication(id: string) {
  await requireAdmin();
  await prisma.partnerApplication.delete({ where: { id } });
  revalidatePath("/admin/partners");
}
