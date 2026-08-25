"use client";

import { Share2 } from "lucide-react";

export function ShareButtons({ title, label }: { title: string; label: string }) {
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* пользователь отменил — ничего не делаем */
      }
    }
    await navigator.clipboard.writeText(url);
    alert("Ссылка скопирована");
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center gap-2 rounded-full border border-graphite-800/15 px-4 py-2 text-sm font-semibold text-graphite-700 hover:bg-cream-200"
    >
      <Share2 className="h-4 w-4" /> {label}
    </button>
  );
}
