import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProject } from "./actions";

export const metadata = { title: "Проекты — Админ-панель" };

const categoryLabels: Record<string, string> = {
  PROJECT: "Проекты", FLEA_MARKET: "Дармарки", ECO: "Экоакции", KIDS: "Детям",
};

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Проекты / Дармарки / Детям" createHref="/admin/projects/new" />
      <div className="overflow-hidden rounded-xl2 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-800/10 bg-cream-100 text-left text-xs font-bold uppercase text-graphite-500">
            <tr><th className="p-3">Название</th><th className="p-3">Раздел</th><th className="p-3">Статус</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody className="divide-y divide-graphite-800/5">
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-semibold"><Link href={`/admin/projects/${p.id}`} className="hover:text-terracotta-600">{p.titleRu}</Link></td>
                <td className="p-3 text-graphite-500">{categoryLabels[p.category]}</td>
                <td className="p-3">{p.published ? <span className="text-forest-600">Опубликован</span> : <span className="text-graphite-400">Черновик</span>}</td>
                <td className="p-3"><DeleteButton action={deleteProject.bind(null, p.id)} /></td>
              </tr>
            ))}
            {projects.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-graphite-400">Пока нет проектов.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
