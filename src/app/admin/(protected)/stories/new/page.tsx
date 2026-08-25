import { StoryForm } from "../StoryForm";
import { createStory } from "../actions";

export const metadata = { title: "Новая история — Админ-панель" };

export default function NewStoryPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Новая история / Мама недели</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card"><StoryForm action={createStory} /></div>
    </div>
  );
}
