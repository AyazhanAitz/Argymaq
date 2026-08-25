import { NewsForm } from "../NewsForm";
import { createNews } from "../actions";

export const metadata = { title: "Новая новость — Админ-панель" };

export default function NewNewsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Новая новость</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <NewsForm action={createNews} />
      </div>
    </div>
  );
}
