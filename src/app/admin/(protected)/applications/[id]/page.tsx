import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Textarea, FormActions, SubmitBtn } from "@/components/admin/fields";
import { updateApplicationStatus, updateApplicationNote, deleteApplication } from "../actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Обращение — Админ-панель" };

const STATUS_OPTIONS: [string, string][] = [
  ["NEW", "Новое"], ["ACCEPTED", "Принято"], ["CONSULTATION_SCHEDULED", "Консультация назначена"],
  ["IN_SUPPORT", "На сопровождении"], ["REFERRED", "Направлено"], ["COMPLETED", "Завершено"],
];

const CATEGORY_LABELS: Record<string, string> = {
  ALIMONY: "Алименты", DIVORCE: "Развод", HOUSING: "Жильё", BENEFITS: "Пособия",
  SOCIAL_HELP: "Социальная помощь", DISABILITY: "Инвалидность", DOCUMENTS: "Документы",
  REGISTRATION: "Регистрация", DEBTS: "Долги и кредиты", ACCOUNT_ARREST: "Арест счёта",
  EMPLOYMENT: "Трудоустройство", CAREER_GUIDANCE: "Профориентация", BUSINESS: "Бизнес",
  PSYCHOLOGIST: "Психолог", TEMP_HOUSING: "Временное проживание", OTHER: "Другое",
};

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await prisma.application.findUnique({ where: { id: params.id } });
  if (!application) notFound();

  const noteAction = updateApplicationNote.bind(null, application.id);

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-graphite-800">{application.ticketNumber}</h1>
          <p className="text-sm text-graphite-500">Создано {formatDate(application.createdAt, "ru")}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusSelect id={application.id} value={application.status} options={STATUS_OPTIONS} action={updateApplicationStatus} />
          <DeleteButton action={deleteApplication.bind(null, application.id)} />
        </div>
      </div>

      <div className="space-y-4 rounded-xl2 bg-white p-6 shadow-card">
        <Row label="ФИО" value={application.fullName} />
        <Row label="Город/район" value={application.city} />
        <Row label="Телефон" value={application.phone} />
        <Row label="WhatsApp" value={application.whatsapp ?? "—"} />
        <Row label="Количество детей" value={application.childrenCount?.toString() ?? "—"} />
        <Row label="Возраст детей" value={application.childrenAges ?? "—"} />
        <Row label="Удобное время связи" value={application.preferredContactTime ?? "—"} />
        <Row label="Согласие на обработку ПДн" value={application.consentPersonalData ? "Да" : "Нет"} />

        <div>
          <p className="mb-1 text-sm font-bold text-graphite-500">Необходимая помощь</p>
          <div className="flex flex-wrap gap-1.5">
            {application.helpCategories.map((c) => (
              <span key={c} className="rounded-full bg-cream-200 px-2.5 py-1 text-xs text-graphite-700">
                {CATEGORY_LABELS[c] ?? c}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-bold text-graphite-500">Описание ситуации</p>
          <p className="whitespace-pre-line text-graphite-800">{application.situationDescription}</p>
        </div>

        {application.documentPaths.length > 0 && (
          <div>
            <p className="mb-1 text-sm font-bold text-graphite-500">Прикреплённые документы</p>
            <ul className="space-y-1">
              {application.documentPaths.map((path) => (
                <li key={path}>
                  <a
                    href={`/api/admin/documents/${path}`}
                    className="flex items-center gap-2 text-sm text-terracotta-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" /> {path.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl2 bg-white p-6 shadow-card">
        <h2 className="mb-3 font-display text-lg font-bold text-graphite-800">Внутренняя заметка</h2>
        <form action={noteAction} className="space-y-3">
          <Textarea name="adminNote" rows={4} defaultValue={application.adminNote ?? ""} placeholder="Заметки для команды Центра (не видны заявителю)" />
          <FormActions><SubmitBtn label="Сохранить заметку" /></FormActions>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-graphite-800/5 pb-2">
      <span className="text-sm font-bold text-graphite-500">{label}</span>
      <span className="text-right text-graphite-800">{value}</span>
    </div>
  );
}
