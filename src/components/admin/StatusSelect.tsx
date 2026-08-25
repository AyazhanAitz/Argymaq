"use client";

import { useTransition } from "react";

export function StatusSelect({
  id,
  value,
  options,
  action,
}: {
  id: string;
  value: string;
  options: [string, string][];
  action: (id: string, status: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value}
      disabled={pending}
      onChange={(e) => startTransition(() => action(id, e.target.value))}
      className="rounded-lg border border-graphite-800/15 bg-white px-2 py-1.5 text-xs font-semibold"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}
