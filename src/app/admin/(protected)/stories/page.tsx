import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteStory } from "./actions";
import { StoryActions } from "./StoryActions";

export const metadata = { title: "Мама недели / Истории — Админ-панель" };

const statusLabels: Record<string, string> = {
  FUNDRAISING_OPEN: "🟡 Сбор открыт", IN_PROGRESS: "🔵 В процессе",
  HELP_PROVIDED: "🟢 Помощь оказана", REPORT_PUBLISHED: "⚪ Отчёт опубликован",
};

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: "desc" },
    include: { fundraiser: true },
  });

  return (
    <div>
      <PageHeader title="Мама недели / Истории помощи" createHref="/admin/stories/new" />
      <div className="space-y-3">
        {stories.map((s) => (
          <div key={s.id} className="rounded-xl2 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {s.isMamaOfWeek && <span className="rounded-full bg-terracotta-500 px-2 py-0.5 text-[10px] font-bold text-white">МАМА НЕДЕЛИ</span>}
                  <Link href={`/admin/stories/${s.id}`} className="font-bold text-graphite-800 hover:text-terracotta-600">{s.titleRu}</Link>
                </div>
                <p className="mt-1 text-xs text-graphite-500">
                  {statusLabels[s.status]} · {s.published ? "Опубликовано" : "Черновик"}
                  {!s.consentGiven && <span className="ml-2 font-bold text-terracotta-600">⚠ нет согласия на публикацию</span>}
                </p>
                {s.fundraiser && (
                  <p className="mt-1 text-xs text-graphite-500">
                    Сбор: {s.fundraiser.raisedAmount.toLocaleString("ru-RU")} / {s.fundraiser.goalAmount.toLocaleString("ru-RU")} ₸
                    {s.fundraiser.status === "CLOSED" && " · закрыт"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StoryActions
                  id={s.id}
                  published={s.published}
                  hasFundraiser={!!s.fundraiser}
                  fundraiserOpen={s.fundraiser?.status === "OPEN"}
                />
                <DeleteButton action={deleteStory.bind(null, s.id)} />
              </div>
            </div>
          </div>
        ))}
        {stories.length === 0 && <p className="text-graphite-400">Пока нет историй.</p>}
      </div>
    </div>
  );
}
