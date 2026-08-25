import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteGrant } from "./actions";

export const metadata = { title: "Гранты — Админ-панель" };

export default async function AdminGrantsPage() {
  const grants = await prisma.grant.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Гранты и возможности" createHref="/admin/grants/new" />
      <div className="overflow-hidden rounded-xl2 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-800/10 bg-cream-100 text-left text-xs font-bold uppercase text-graphite-500">
            <tr><th className="p-3">Название</th><th className="p-3">Организатор</th><th className="p-3">Статус</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody className="divide-y divide-graphite-800/5">
            {grants.map((g) => (
              <tr key={g.id}>
                <td className="p-3 font-semibold"><Link href={`/admin/grants/${g.id}`} className="hover:text-terracotta-600">{g.titleRu}</Link></td>
                <td className="p-3 text-graphite-500">{g.organizer}</td>
                <td className="p-3">{g.status === "OPEN" ? <span className="text-forest-600">🟢 Открыт</span> : <span className="text-graphite-400">⚪ Завершён</span>}</td>
                <td className="p-3"><DeleteButton action={deleteGrant.bind(null, g.id)} /></td>
              </tr>
            ))}
            {grants.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-graphite-400">Пока нет грантов.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
