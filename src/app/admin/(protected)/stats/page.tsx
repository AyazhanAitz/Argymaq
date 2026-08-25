import { prisma } from "@/lib/prisma";
import { updateStat } from "./actions";

export const metadata = { title: "Статистика Центра — Админ-панель" };

export default async function AdminStatsPage() {
  const stats = await prisma.siteStat.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-display text-2xl font-bold text-graphite-800">Статистика Центра</h1>
      <p className="mb-6 text-sm text-graphite-500">
        Показатели, отображаемые в блоке статистики на главной странице (п.47 ТЗ). Обновляйте значения по
        мере накопления реальных данных — не указывайте цифры, которые нельзя подтвердить.
      </p>
      <div className="space-y-3">
        {stats.map((s) => {
          const updateWithKey = updateStat.bind(null, s.key);
          return (
            <form key={s.key} action={updateWithKey} className="flex items-center gap-4 rounded-xl2 bg-white p-4 shadow-card">
              <div className="flex-1">
                <p className="font-semibold text-graphite-800">{s.labelRu}</p>
                <p className="text-xs text-graphite-400">{s.key}</p>
              </div>
              <input
                name="value"
                type="number"
                defaultValue={s.value}
                className="w-28 rounded-xl border border-graphite-800/15 px-3 py-2 text-right font-bold"
              />
              <span className="w-16 text-sm text-graphite-500">{s.suffix}</span>
              <button type="submit" className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-bold text-white hover:bg-terracotta-600">
                Сохранить
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
