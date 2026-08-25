"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(200),
  contact: z.string().trim().min(3).max(200),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(0).optional(),
  renderedAt: z.string(),
});

export type ContactFormState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    contact: formData.get("contact")?.toString() ?? "",
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

  await prisma.contactMessage.create({
    data: { name: data.name, contact: data.contact, message: data.message },
  });

  return { status: "success" };
}
