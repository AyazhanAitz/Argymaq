"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-guard";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "MANAGER"]),
});

export async function createAdminUser(formData: FormData) {
  await requireRole("ADMIN");
  const data = schema.parse(Object.fromEntries(formData.entries()));
  const passwordHash = await bcrypt.hash(data.password, 12);
  await prisma.adminUser.create({
    data: { name: data.name, email: data.email.toLowerCase(), passwordHash, role: data.role },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function toggleAdminUserActive(id: string, active: boolean) {
  const session = await requireRole("ADMIN");
  if (session.sub === id) return; // нельзя деактивировать самого себя
  await prisma.adminUser.update({ where: { id }, data: { active: !active } });
  revalidatePath("/admin/users");
}
