import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "../NewsForm";
import { updateNews } from "../actions";

export const metadata = { title: "Редактировать новость — Админ-панель" };

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const post = await prisma.newsPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Редактировать новость</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <NewsForm post={post} action={updateNews.bind(null, post.id)} />
      </div>
    </div>
  );
}
