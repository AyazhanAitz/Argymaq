import { GrantForm } from "../GrantForm";
import { createGrant } from "../actions";

export const metadata = { title: "Новый грант — Админ-панель" };

export default function NewGrantPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Новый грант</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card"><GrantForm action={createGrant} /></div>
    </div>
  );
}
