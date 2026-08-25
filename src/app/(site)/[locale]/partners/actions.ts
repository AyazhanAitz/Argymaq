"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rateLimit";

const schema = z.object({
  organization: z.string().trim().min(2).max(200),
  contactName: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email().optional().or(z.literal("")),
  cooperationTypes: z.array(z.string()).min(1),
  message: z.string().max(2000).optional(),
  website: z.string().max(0).optional(),
  renderedAt: z.string(),
});

export type PartnerFormState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export async function submitPartnerRequest(
  _prev: PartnerFormState,
  formData: FormData
): Promise<PartnerFormState> {
  const parsed = schema.safeParse({
    organization: formData.get("organization")?.toString() ?? "",
    contactName: formData.get("contactName")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    cooperationTypes: formData.getAll("cooperationTypes").map(String),
    message: formData.get("message")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
    renderedAt: formData.get("renderedAt")?.toString() ?? "",
  });

  if (!parsed.success) return { status: "error", message: "Пожалуйста, заполните обязательные поля корректно." };
  const data = parsed.data;

  if (isRateLimited("partners")) {
    return { status: "error", message: "Слишком много попыток. Пожалуйста, попробуйте позже." };
  }

  const renderedAtMs = Date.parse(data.renderedAt);
  if (data.website || !renderedAtMs || Date.now() - renderedAtMs < 2000) {
    return { status: "success" };
  }

  await prisma.partnerApplication.create({
    data: {
      organization: data.organization,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email || null,
      cooperationTypes: data.cooperationTypes,
      message: data.message || null,
    },
  });

  return { status: "success" };
}
