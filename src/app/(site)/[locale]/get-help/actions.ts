"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { saveApplicationDocuments } from "@/lib/storage";
import { formatTicketNumber } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().trim().min(2).max(200),
  city: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(30),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  childrenCount: z.string().optional(),
  childrenAges: z.string().max(200).optional(),
  situationDescription: z.string().trim().min(10).max(4000),
  helpCategories: z.array(z.string()).min(1),
  preferredContactTime: z.string().max(200).optional(),
  consentPersonalData: z.literal("on"),
  // anti-spam
  website: z.string().max(0).optional(), // honeypot — должно быть пустым
  renderedAt: z.string(),
});

export type GetHelpState =
  | { status: "idle" }
  | { status: "success"; ticketNumber: string }
  | { status: "error"; message: string };

export async function submitHelpRequest(
  _prev: GetHelpState,
  formData: FormData
): Promise<GetHelpState> {
  const raw = {
    fullName: formData.get("fullName")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    whatsapp: formData.get("whatsapp")?.toString() ?? "",
    childrenCount: formData.get("childrenCount")?.toString() ?? "",
    childrenAges: formData.get("childrenAges")?.toString() ?? "",
    situationDescription: formData.get("situationDescription")?.toString() ?? "",
    helpCategories: formData.getAll("helpCategories").map(String),
    preferredContactTime: formData.get("preferredContactTime")?.toString() ?? "",
    consentPersonalData: formData.get("consentPersonalData")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
    renderedAt: formData.get("renderedAt")?.toString() ?? "",
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Пожалуйста, заполните обязательные поля корректно." };
  }
  const data = parsed.data;

  // Anti-spam: honeypot должен остаться пустым, и форма не должна быть
  // отправлена быстрее чем за 2 секунды после отрисовки страницы.
  const renderedAtMs = Date.parse(data.renderedAt);
  if (data.website || !renderedAtMs || Date.now() - renderedAtMs < 2000) {
    // Молча "принимаем", чтобы не подсказывать боту, что его вычислили.
    return { status: "success", ticketNumber: formatTicketNumber(new Date().getFullYear(), 0) };
  }

  const files = formData.getAll("documents").filter((f): f is File => f instanceof File && f.size > 0);
  const documentPaths = files.length > 0 ? await saveApplicationDocuments(files) : [];

  const year = new Date().getFullYear();
  const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
  const countThisYear = await prisma.application.count({ where: { createdAt: { gte: yearStart } } });
  const ticketNumber = formatTicketNumber(year, countThisYear + 1);

  await prisma.application.create({
    data: {
      ticketNumber,
      fullName: data.fullName,
      city: data.city,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      childrenCount: data.childrenCount ? parseInt(data.childrenCount, 10) || null : null,
      childrenAges: data.childrenAges || null,
      situationDescription: data.situationDescription,
      helpCategories: data.helpCategories,
      documentPaths,
      preferredContactTime: data.preferredContactTime || null,
      consentPersonalData: true,
    },
  });

  return { status: "success", ticketNumber };
}
