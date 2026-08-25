"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { isRateLimited } from "@/lib/rateLimit";

export type LoginState = { status: "idle" } | { status: "error"; message: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { status: "error", message: "Введите email и пароль." };
  }

  // Защита от подбора пароля (brute-force).
  if (isRateLimited("admin-login")) {
    return { status: "error", message: "Слишком много попыток входа. Попробуйте позже." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.active) {
    return { status: "error", message: "Неверный email или пароль." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { status: "error", message: "Неверный email или пароль." };
  }

  const token = await createSessionToken({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
  await setSessionCookie(token);

  redirect("/admin");
}
