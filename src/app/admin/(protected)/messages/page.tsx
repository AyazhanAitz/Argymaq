import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateMessageStatus, deleteContactMessage } from "./actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Сообщения — Админ-панель" };

const STATUS_OPTIONS: [string, string][] = [["NEW", "Новое"], ["ANSWERED", "Отвечено"], ["ARCHIVED", "В архиве"]];

export default async function AdminMessagesPage() {
  const items = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Сообщения со страницы «Контакты»</h1>
      <div className="space-y-3">
        {items.map((m) => (
          <div key={m.id} className="rounded-xl2 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-graphite-800">{m.name}</p>
                <p className="text-sm text-graphite-500">{m.contact}</p>
                <p className="mt-1 text-xs text-graphite-400">{formatDate(m.createdAt, "ru")}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusSelect id={m.id} value={m.status} options={STATUS_OPTIONS} action={updateMessageStatus} />
                <DeleteButton action={deleteContactMessage.bind(null, m.id)} />
              </div>
            </div>
            <p className="mt-2 text-sm text-graphite-600">{m.message}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-graphite-400">Пока нет сообщений.</p>}
      </div>
    </div>
  );
}
