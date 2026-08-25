import { Field, Input, Textarea, Select, FormActions, SubmitBtn } from "@/components/admin/fields";
import type { Grant } from "@prisma/client";

function toInputDate(d?: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export function GrantForm({ grant, action }: { grant?: Grant; action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название (RU)" required><Input name="titleRu" defaultValue={grant?.titleRu} required /></Field>
        <Field label="Название (KZ)" required><Input name="titleKz" defaultValue={grant?.titleKz} required /></Field>
        <Field label="Организатор" required><Input name="organizer" defaultValue={grant?.organizer} required /></Field>
        <Field label="Размер финансирования" required><Input name="fundingAmount" defaultValue={grant?.fundingAmount} required /></Field>
        <Field label="Дедлайн"><Input name="deadline" type="date" defaultValue={toInputDate(grant?.deadline)} /></Field>
        <Field label="Статус" required>
          <Select name="status" defaultValue={grant?.status ?? "OPEN"} required>
            <option value="OPEN">🟢 Открыт</option>
            <option value="CLOSED">⚪ Завершён</option>
          </Select>
        </Field>
        <Field label="Официальный источник (URL)" required>
          <Input name="sourceUrl" type="url" defaultValue={grant?.sourceUrl} required />
        </Field>
      </div>
      <Field label="Для кого (RU)" required><Textarea name="forWhomRu" rows={2} defaultValue={grant?.forWhomRu} required /></Field>
      <Field label="Для кого (KZ)" required><Textarea name="forWhomKz" rows={2} defaultValue={grant?.forWhomKz} required /></Field>
      <Field label="Требования (RU)" required><Textarea name="requirementsRu" rows={3} defaultValue={grant?.requirementsRu} required /></Field>
      <Field label="Требования (KZ)" required><Textarea name="requirementsKz" rows={3} defaultValue={grant?.requirementsKz} required /></Field>
      <Field label="Необходимые документы (RU)"><Textarea name="documentsNeededRu" rows={2} defaultValue={grant?.documentsNeededRu ?? ""} /></Field>
      <Field label="Необходимые документы (KZ)"><Textarea name="documentsNeededKz" rows={2} defaultValue={grant?.documentsNeededKz ?? ""} /></Field>
      <FormActions><SubmitBtn /></FormActions>
    </form>
  );
}
