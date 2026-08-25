import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteVacancy } from "./actions";

export const metadata = { title: "Вакансии — Админ-панель" };

export default async function AdminVacanciesPage() {
  const vacancies = await prisma.vacancy.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <PageHeader title="Вакансии" createHref="/admin/vacancies/new" />
      <div className="overflow-hidden rounded-xl2 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-800/10 bg-cream-100 text-left text-xs font-bold uppercase text-graphite-500">
            <tr><th className="p-3">Название</th><th className="p-3">Город</th><th className="p-3">Статус</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody className="divide-y divide-graphite-800/5">
            {vacancies.map((v) => (
              <tr key={v.id}>
                <td className="p-3 font-semibold"><Link href={`/admin/vacancies/${v.id}`} className="hover:text-terracotta-600">{v.titleRu}</Link></td>
                <td className="p-3 text-graphite-500">{v.city}</td>
                <td className="p-3">{v.active ? <span className="text-forest-600">Активна</span> : <span className="text-graphite-400">Скрыта</span>}</td>
                <td className="p-3"><DeleteButton action={deleteVacancy.bind(null, v.id)} /></td>
              </tr>
            ))}
            {vacancies.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-graphite-400">Пока нет вакансий.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
