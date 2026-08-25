"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const updateSchema = z.object({
  titleRu: z.string().min(2),
  titleKz: z.string().min(2),
  descriptionRu: z.string().min(2),
  descriptionKz: z.string().min(2),
  goalAmount: z.string().min(1),
  raisedAmount: z.string().min(1),
  endDate: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED"]),
  published: z.string().optional(),
});

export async function updateFundraiser(id: string, formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const data = updateSchema.parse(raw);
  await prisma.fundraiser.update({
    where: { id },
    data: {
      titleRu: data.titleRu,
      titleKz: data.titleKz,
      descriptionRu: data.descriptionRu,
      descriptionKz: data.descriptionKz,
      goalAmount: parseInt(data.goalAmount, 10),
      raisedAmount: parseInt(data.raisedAmount, 10),
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: data.status,
      published: data.published === "on",
    },
  });
  revalidatePath("/admin/fundraisers");
  revalidatePath(`/admin/fundraisers/${id}`);
}

const expenseSchema = z.object({
  titleRu: z.string().min(2),
  titleKz: z.string().min(2),
  amount: z.string().min(1),
  date: z.string().min(1),
});

export async function addExpense(fundraiserId: string, formData: FormData) {
  await requireAdmin();
  const data = expenseSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.expense.create({
    data: {
      fundraiserId,
      titleRu: data.titleRu,
      titleKz: data.titleKz,
      amount: parseInt(data.amount, 10),
      date: new Date(data.date),
    },
  });
  revalidatePath(`/admin/fundraisers/${fundraiserId}`);
}

export async function deleteExpense(id: string, fundraiserId: string) {
  await requireAdmin();
  await prisma.expense.delete({ where: { id } });
  revalidatePath(`/admin/fundraisers/${fundraiserId}`);
}
