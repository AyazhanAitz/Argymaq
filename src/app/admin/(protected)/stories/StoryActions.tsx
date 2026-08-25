"use client";

import { useTransition } from "react";
import { togglePublishStory, closeStoryFundraiser, publishStoryReport } from "./actions";

export function StoryActions({
  id,
  published,
  hasFundraiser,
  fundraiserOpen,
}: {
  id: string;
  published: boolean;
  hasFundraiser: boolean;
  fundraiserOpen: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => togglePublishStory(id, published))}
        className={`rounded-full px-3 py-1.5 text-xs font-bold ${published ? "bg-graphite-100 text-graphite-600" : "bg-forest-500 text-white"}`}
      >
        {published ? "Снять с публикации" : "Опубликовать"}
      </button>
      {hasFundraiser && fundraiserOpen && (
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => closeStoryFundraiser(id))}
          className="rounded-full bg-terracotta-500 px-3 py-1.5 text-xs font-bold text-white"
        >
          Закрыть сбор
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => publishStoryReport(id))}
        className="rounded-full bg-gold-400 px-3 py-1.5 text-xs font-bold text-graphite-900"
      >
        Опубликовать отчёт
      </button>
    </div>
  );
}
