import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, cn } from "@/lib/utils";

export const metadata = { title: "Обращения — Админ-панель" };

const STATUSES = [
  ["ALL", "Все"], ["NEW", "Новое"], ["ACCEPTED", "Принято"],
  ["CONSULTATION_SCHEDULED", "Консультация назначена"], ["IN_SUPPORT", "На сопровождении"],
  ["REFERRED", "Направлено"], ["COMPLETED", "Завершено"],
] as const;

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status ?? "ALL";
  const applications = await prisma.application.findMany({
    where: status !== "ALL" ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-graphite-800">Обращения «Получить помощь»</h1>
          <p className="text-sm text-graphite-500">
            Приватный раздел — данные заявителей никогда не публикуются на сайте.
          </p>
        </div>
        <a
          href={`/api/admin/applications/export${status !== "ALL" ? `?status=${status}` : ""}`}
          className="flex items-center gap-1.5 rounded-full bg-forest-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-forest-600"
        >
          <Download className="h-4 w-4" /> Выгрузить в CSV
        </a>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {STATUSES.map(([value, label]) => (
          <Link
            key={value}
            href={value === "ALL" ? "/admin/applications" : `/admin/applications?status=${value}`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-bold",
              status === value ? "bg-terracotta-500 text-white" : "bg-white text-graphite-600 hover:bg-cream-200"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl2 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-800/10 bg-cream-100 text-left text-xs font-bold uppercase text-graphite-500">
            <tr>
              <th className="p-3">№</th>
              <th className="p-3">ФИО</th>
              <th className="p-3">Город</th>
              <th className="p-3">Телефон</th>
              <th className="p-3">Дата</th>
              <th className="p-3">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-800/5">
            {applications.map((a) => (
              <tr key={a.id}>
                <td className="p-3 font-mono text-xs">
                  <Link href={`/admin/applications/${a.id}`} className="font-bold text-terracotta-600 hover:underline">
                    {a.ticketNumber}
                  </Link>
                </td>
                <td className="p-3 font-semibold">{a.fullName}</td>
                <td className="p-3 text-graphite-500">{a.city}</td>
                <td className="p-3 text-graphite-500">{a.phone}</td>
                <td className="p-3 text-graphite-400">{formatDate(a.createdAt, "ru")}</td>
                <td className="p-3">
                  {STATUSES.find(([v]) => v === a.status)?.[1] ?? a.status}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-graphite-400">Обращений пока нет.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
