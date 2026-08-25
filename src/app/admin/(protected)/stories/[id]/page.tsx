import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoryForm } from "../StoryForm";
import { updateStory } from "../actions";

export const metadata = { title: "Редактировать историю — Админ-панель" };

export default async function EditStoryPage({ params }: { params: { id: string } }) {
  const story = await prisma.story.findUnique({ where: { id: params.id }, include: { fundraiser: true } });
  if (!story) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Редактировать историю</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <StoryForm story={story} fundraiser={story.fundraiser} action={updateStory.bind(null, story.id)} />
      </div>
    </div>
  );
}
