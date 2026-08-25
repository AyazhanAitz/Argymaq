import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "../EventForm";
import { updateEvent } from "../actions";

export const metadata = { title: "Редактировать мероприятие — Админ-панель" };

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Редактировать мероприятие</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <EventForm event={event} action={updateEvent.bind(null, event.id)} />
      </div>
    </div>
  );
}
