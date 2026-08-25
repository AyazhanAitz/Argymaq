"use client";

import { useTransition } from "react";
import { toggleAdminUserActive } from "./actions";

export function ToggleActiveButton({ id, active }: { id: string; active: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleAdminUserActive(id, active))}
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
        active ? "bg-forest-100 text-forest-700 hover:bg-terracotta-50 hover:text-terracotta-600" : "bg-graphite-50 text-graphite-400"
      }`}
    >
      {active ? "Активен" : "Отключён"}
    </button>
  );
}
