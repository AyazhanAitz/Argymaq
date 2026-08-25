import { EventForm } from "../EventForm";
import { createEvent } from "../actions";

export const metadata = { title: "Новое мероприятие — Админ-панель" };

export default function NewEventPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Новое мероприятие</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card"><EventForm action={createEvent} /></div>
    </div>
  );
}
