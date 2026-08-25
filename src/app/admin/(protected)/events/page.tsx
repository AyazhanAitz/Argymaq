import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteEvent } from "./actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Календарь — Админ-панель" };

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });

  return (
    <div>
      <PageHeader title="Календарь мероприятий" createHref="/admin/events/new" />
      <div className="overflow-hidden rounded-xl2 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-800/10 bg-cream-100 text-left text-xs font-bold uppercase text-graphite-500">
            <tr><th className="p-3">Название</th><th className="p-3">Дата</th><th className="p-3">Место</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody className="divide-y divide-graphite-800/5">
            {events.map((e) => (
              <tr key={e.id}>
                <td className="p-3 font-semibold"><Link href={`/admin/events/${e.id}`} className="hover:text-terracotta-600">{e.titleRu}</Link></td>
                <td className="p-3 text-graphite-500">{formatDate(e.date, "ru")}</td>
                <td className="p-3 text-graphite-500">{e.location}</td>
                <td className="p-3"><DeleteButton action={deleteEvent.bind(null, e.id)} /></td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-graphite-400">Пока нет мероприятий.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
