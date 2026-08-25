"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  fullName: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(5).max(30),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  city: z.string().trim().max(120).optional(),
  specializations: z.array(z.string()).min(1),
  message: z.string().max(2000).optional(),
  website: z.string().max(0).optional(),
  renderedAt: z.string(),
});

export type VolunteerFormState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export async function submitVolunteerRequest(
  _prev: VolunteerFormState,
  formData: FormData
): Promise<VolunteerFormState> {
  const parsed = schema.safeParse({
    fullName: formData.get("fullName")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    whatsapp: formData.get("whatsapp")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    specializations: formData.getAll("specializations").map(String),
    message: formData.get("message")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
    renderedAt: formData.get("renderedAt")?.toString() ?? "",
  });

  if (!parsed.success) return { status: "error", message: "Пожалуйста, заполните обязательные поля корректно." };
  const data = parsed.data;

  const renderedAtMs = Date.parse(data.renderedAt);
  if (data.website || !renderedAtMs || Date.now() - renderedAtMs < 2000) {
    return { status: "success" };
  }

  await prisma.volunteerApplication.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      city: data.city || null,
      specializations: data.specializations,
      message: data.message || null,
    },
  });

  return { status: "success" };
}
