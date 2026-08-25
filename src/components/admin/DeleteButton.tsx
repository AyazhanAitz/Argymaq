"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

/**
 * Кнопка удаления — вызывает server action напрямую (не через <form>).
 *
 * ВАЖНО: несколько одновременно смонтированных <form action={...}> на одной
 * странице (например, отдельная форма на каждую строку списка) приводили к
 * тому, что React/Next иногда отправлял action-запрос без cookie сессии —
 * пользователя "выбрасывало" в /admin/login. Императивный вызов через
 * useTransition этой проблеме не подвержен.
 */
export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Удалить безвозвратно?")) return;
        startTransition(() => {
          action();
        });
      }}
      className="rounded-lg p-2 text-graphite-400 hover:bg-terracotta-50 hover:text-terracotta-600 disabled:opacity-50"
      aria-label="Удалить"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
