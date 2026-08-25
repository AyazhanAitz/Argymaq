import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

function csvEscape(value: string): string {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const applications = await prisma.application.findMany({
    where: status && status !== "ALL" ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Номер обращения", "Дата", "ФИО", "Город", "Телефон", "WhatsApp",
    "Кол-во детей", "Возраст детей", "Категории помощи", "Описание ситуации",
    "Удобное время связи", "Статус", "Заметка администратора",
  ];

  const rows = applications.map((a) => [
    a.ticketNumber,
    formatDate(a.createdAt, "ru"),
    a.fullName,
    a.city,
    a.phone,
    a.whatsapp ?? "",
    a.childrenCount?.toString() ?? "",
    a.childrenAges ?? "",
    a.helpCategories.join("; "),
    a.situationDescription.replace(/\n/g, " "),
    a.preferredContactTime ?? "",
    a.status,
    a.adminNote ?? "",
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  // BOM для корректного отображения кириллицы в Excel
  const bom = "﻿";

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${Date.now()}.csv"`,
    },
  });
}
