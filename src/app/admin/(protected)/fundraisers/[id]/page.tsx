import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Field, Input, Textarea, Select, FormActions, SubmitBtn } from "@/components/admin/fields";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { updateFundraiser, addExpense, deleteExpense } from "../actions";
import { formatTenge, formatDate } from "@/lib/utils";

export const metadata = { title: "Сбор — Админ-панель" };

function toInputDate(d?: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export default async function EditFundraiserPage({ params }: { params: { id: string } }) {
  const fundraiser = await prisma.fundraiser.findUnique({
    where: { id: params.id },
    include: { expenses: { orderBy: { date: "asc" } }, story: true },
  });
  if (!fundraiser) notFound();

  const spent = fundraiser.expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = fundraiser.raisedAmount - spent;
  const updateAction = updateFundraiser.bind(null, fundraiser.id);
  const addExpenseAction = addExpense.bind(null, fundraiser.id);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="mb-1 font-display text-2xl font-bold text-graphite-800">{fundraiser.titleRu}</h1>
        {fundraiser.story && <p className="text-sm text-graphite-500">История: {fundraiser.story.titleRu}</p>}
      </div>

      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-bold text-graphite-800">Параметры сбора</h2>
        <form action={updateAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Название (RU)" required><Input name="titleRu" defaultValue={fundraiser.titleRu} required /></Field>
            <Field label="Название (KZ)" required><Input name="titleKz" defaultValue={fundraiser.titleKz} required /></Field>
          </div>
          <Field label="Описание (RU)" required><Textarea name="descriptionRu" rows={2} defaultValue={fundraiser.descriptionRu} required /></Field>
          <Field label="Описание (KZ)" required><Textarea name="descriptionKz" rows={2} defaultValue={fundraiser.descriptionKz} required /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Цель, ₸" required><Input name="goalAmount" type="number" defaultValue={fundraiser.goalAmount} required /></Field>
            <Field label="Собрано, ₸" required><Input name="raisedAmount" type="number" defaultValue={fundraiser.raisedAmount} required /></Field>
            <Field label="Дата окончания"><Input name="endDate" type="date" defaultValue={toInputDate(fundraiser.endDate)} /></Field>
            <Field label="Статус" required>
              <Select name="status" defaultValue={fundraiser.status} required>
                <option value="OPEN">🟡 Открыт</option>
                <option value="CLOSED">⚪ Закрыт</option>
              </Select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
            <input type="checkbox" name="published" defaultChecked={fundraiser.published} className="h-4 w-4 accent-terracotta-500" />
            Опубликован на сайте
          </label>
          <FormActions><SubmitBtn /></FormActions>
        </form>
      </div>

      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-bold text-graphite-800">Отчёт по расходам</h2>
        <dl className="mb-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div><dt className="text-graphite-500">Получено</dt><dd className="font-bold">{formatTenge(fundraiser.raisedAmount)}</dd></div>
          <div><dt className="text-graphite-500">Израсходовано</dt><dd className="font-bold text-terracotta-600">{formatTenge(spent)}</dd></div>
          <div><dt className="text-graphite-500">Остаток</dt><dd className="font-bold text-forest-600">{formatTenge(balance)}</dd></div>
        </dl>

        <ul className="mb-4 divide-y divide-graphite-800/10 rounded-xl border border-graphite-800/10">
          {fundraiser.expenses.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-2 p-3 text-sm">
              <div>
                <p className="font-semibold">{e.titleRu}</p>
                <p className="text-xs text-graphite-400">{formatDate(e.date, "ru")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">{formatTenge(e.amount)}</span>
                <DeleteButton action={deleteExpense.bind(null, e.id, fundraiser.id)} />
              </div>
            </li>
          ))}
          {fundraiser.expenses.length === 0 && <li className="p-3 text-center text-graphite-400">Расходов пока нет.</li>}
        </ul>

        <form action={addExpenseAction} className="grid gap-3 sm:grid-cols-2">
          <Field label="Статья расхода (RU)" required><Input name="titleRu" required /></Field>
          <Field label="Статья расхода (KZ)" required><Input name="titleKz" required /></Field>
          <Field label="Сумма, ₸" required><Input name="amount" type="number" required /></Field>
          <Field label="Дата" required><Input name="date" type="date" required defaultValue={toInputDate(new Date())} /></Field>
          <div className="sm:col-span-2">
            <SubmitBtn label="Добавить расход" />
          </div>
        </form>
      </div>
    </div>
  );
}
