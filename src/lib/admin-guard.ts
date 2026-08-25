import "server-only";

import { redirect } from "next/navigation";
import { getSession, type AdminSessionPayload } from "@/lib/auth";

/**
 * Проверка сессии внутри Server Actions — дополнительный уровень защиты
 * помимо middleware и layout (Server Actions можно вызвать напрямую).
 */
export async function requireAdmin(): Promise<AdminSessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireRole(role: "ADMIN"): Promise<AdminSessionPayload> {
  const session = await requireAdmin();
  if (session.role !== role) redirect("/admin");
  return session;
}
