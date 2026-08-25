import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteArticle } from "./actions";

export const metadata = { title: "Полезная информация — Админ-панель" };

export default async function AdminArticlesPage() {
  const articles = await prisma.usefulArticle.findMany({ orderBy: { titleRu: "asc" } });

  return (
    <div>
      <PageHeader title="Полезная информация" createHref="/admin/useful-articles/new" />
      <div className="overflow-hidden rounded-xl2 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-800/10 bg-cream-100 text-left text-xs font-bold uppercase text-graphite-500">
            <tr><th className="p-3">Заголовок</th><th className="p-3">Категория</th><th className="p-3">Статус</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody className="divide-y divide-graphite-800/5">
            {articles.map((a) => (
              <tr key={a.id}>
                <td className="p-3 font-semibold"><Link href={`/admin/useful-articles/${a.id}`} className="hover:text-terracotta-600">{a.titleRu}</Link></td>
                <td className="p-3 text-graphite-500">{a.category}</td>
                <td className="p-3">{a.published ? <span className="text-forest-600">Опубликовано</span> : <span className="text-graphite-400">Черновик</span>}</td>
                <td className="p-3"><DeleteButton action={deleteArticle.bind(null, a.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
