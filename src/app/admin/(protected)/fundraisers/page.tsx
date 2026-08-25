import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTenge, percent } from "@/lib/utils";

export const metadata = { title: "Сборы — Админ-панель" };

export default async function AdminFundraisersPage() {
  const fundraisers = await prisma.fundraiser.findMany({
    orderBy: { createdAt: "desc" },
    include: { story: true, expenses: true },
  });

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-graphite-800">Сборы и отчёты</h1>
      <p className="mb-6 text-sm text-graphite-500">
        Сборы создаются автоматически при указании суммы в форме истории («Мама недели / Истории помощи»).
        Здесь можно обновлять собранную сумму, закрывать сбор и вести отчёт по расходам.
      </p>
      <div className="space-y-3">
        {fundraisers.map((f) => (
          <Link key={f.id} href={`/admin/fundraisers/${f.id}`} className="block rounded-xl2 bg-white p-5 shadow-card hover:shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-graphite-800">{f.titleRu}</p>
                <p className="text-xs text-graphite-500">
                  {f.status === "OPEN" ? "🟡 Открыт" : "⚪ Закрыт"} · {percent(f.raisedAmount, f.goalAmount)}%
                  {f.story && ` · история: ${f.story.titleRu}`}
                </p>
              </div>
              <p className="font-bold text-terracotta-600">
                {formatTenge(f.raisedAmount, "ru")} / {formatTenge(f.goalAmount, "ru")}
              </p>
            </div>
          </Link>
        ))}
        {fundraisers.length === 0 && <p className="text-graphite-400">Пока нет сборов.</p>}
      </div>
    </div>
  );
}
