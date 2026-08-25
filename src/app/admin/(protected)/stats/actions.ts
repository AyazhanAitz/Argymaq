"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function updateStat(key: string, formData: FormData) {
  await requireAdmin();
  const value = parseInt(formData.get("value")?.toString() ?? "0", 10) || 0;
  await prisma.siteStat.update({ where: { key }, data: { value } });
  revalidatePath("/admin/stats");
  revalidatePath("/");
}
