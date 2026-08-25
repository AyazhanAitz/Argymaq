import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "../ArticleForm";
import { updateArticle } from "../actions";

export const metadata = { title: "Редактировать статью — Админ-панель" };

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.usefulArticle.findUnique({ where: { id: params.id } });
  if (!article) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Редактировать статью</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <ArticleForm article={article} action={updateArticle.bind(null, article.id)} />
      </div>
    </div>
  );
}
