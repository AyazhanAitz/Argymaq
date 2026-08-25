import { ArticleForm } from "../ArticleForm";
import { createArticle } from "../actions";

export const metadata = { title: "Новая статья — Админ-панель" };

export default function NewArticlePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Новая статья</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card"><ArticleForm action={createArticle} /></div>
    </div>
  );
}
