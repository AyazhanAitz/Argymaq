import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updatePartnerStatus, deletePartnerApplication } from "./actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Заявки партнёров — Админ-панель" };

const STATUS_OPTIONS: [string, string][] = [
  ["NEW", "Новая"], ["CONTACTED", "Связались"], ["ACTIVE", "Активный партнёр"], ["ARCHIVED", "В архиве"],
];

export default async function AdminPartnersPage() {
  const items = await prisma.partnerApplication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Заявки партнёров</h1>
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl2 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-graphite-800">{p.organization}</p>
                <p className="text-sm text-graphite-500">{p.contactName} · {p.phone} {p.email ? `· ${p.email}` : ""}</p>
                <p className="mt-1 text-xs text-graphite-400">{formatDate(p.createdAt, "ru")}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusSelect id={p.id} value={p.status} options={STATUS_OPTIONS} action={updatePartnerStatus} />
                <DeleteButton action={deletePartnerApplication.bind(null, p.id)} />
              </div>
            </div>
            <p className="mt-2 flex flex-wrap gap-1.5">
              {p.cooperationTypes.map((t) => (
                <span key={t} className="rounded-full bg-cream-200 px-2 py-0.5 text-xs text-graphite-600">{t}</span>
              ))}
            </p>
            {p.message && <p className="mt-2 text-sm text-graphite-600">{p.message}</p>}
          </div>
        ))}
        {items.length === 0 && <p className="text-graphite-400">Пока нет заявок.</p>}
      </div>
    </div>
  );
}
