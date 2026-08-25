import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateVolunteerStatus, deleteVolunteerApplication } from "./actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Заявки волонтёров — Админ-панель" };

const STATUS_OPTIONS: [string, string][] = [
  ["NEW", "Новая"], ["CONTACTED", "Связались"], ["ACTIVE", "Активный волонтёр"], ["ARCHIVED", "В архиве"],
];

export default async function AdminVolunteersPage() {
  const items = await prisma.volunteerApplication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Заявки волонтёров</h1>
      <div className="space-y-3">
        {items.map((v) => (
          <div key={v.id} className="rounded-xl2 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-graphite-800">{v.fullName}</p>
                <p className="text-sm text-graphite-500">{v.phone} {v.email ? `· ${v.email}` : ""} {v.city ? `· ${v.city}` : ""}</p>
                <p className="mt-1 text-xs text-graphite-400">{formatDate(v.createdAt, "ru")}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusSelect id={v.id} value={v.status} options={STATUS_OPTIONS} action={updateVolunteerStatus} />
                <DeleteButton action={deleteVolunteerApplication.bind(null, v.id)} />
              </div>
            </div>
            <p className="mt-2 flex flex-wrap gap-1.5">
              {v.specializations.map((s) => (
                <span key={s} className="rounded-full bg-cream-200 px-2 py-0.5 text-xs text-graphite-600">{s}</span>
              ))}
            </p>
            {v.message && <p className="mt-2 text-sm text-graphite-600">{v.message}</p>}
          </div>
        ))}
        {items.length === 0 && <p className="text-graphite-400">Пока нет заявок.</p>}
      </div>
    </div>
  );
}
