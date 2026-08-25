import { Field, Input, Textarea, Select, FormActions, SubmitBtn } from "@/components/admin/fields";
import type { Vacancy } from "@prisma/client";

export function VacancyForm({ vacancy, action }: { vacancy?: Vacancy; action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название (RU)" required><Input name="titleRu" defaultValue={vacancy?.titleRu} required /></Field>
        <Field label="Название (KZ)" required><Input name="titleKz" defaultValue={vacancy?.titleKz} required /></Field>
        <Field label="Организация"><Input name="organization" defaultValue={vacancy?.organization ?? ""} /></Field>
        <Field label="Город" required><Input name="city" defaultValue={vacancy?.city} required /></Field>
        <Field label="Формат" required>
          <Select name="format" defaultValue={vacancy?.format ?? "OFFICE"} required>
            <option value="OFFICE">Офис</option>
            <option value="REMOTE">Удалённо</option>
            <option value="HYBRID">Гибрид</option>
          </Select>
        </Field>
        <Field label="График" required><Input name="schedule" defaultValue={vacancy?.schedule} required /></Field>
        <Field label="Направление" required><Input name="direction" defaultValue={vacancy?.direction} required /></Field>
        <Field label="Зарплата от"><Input name="salaryFrom" type="number" defaultValue={vacancy?.salaryFrom ?? ""} /></Field>
        <Field label="Зарплата до"><Input name="salaryTo" type="number" defaultValue={vacancy?.salaryTo ?? ""} /></Field>
        <Field label="Контакты"><Input name="contactInfo" defaultValue={vacancy?.contactInfo ?? ""} /></Field>
      </div>
      <Field label="Описание (RU)" required><Textarea name="descriptionRu" rows={3} defaultValue={vacancy?.descriptionRu} required /></Field>
      <Field label="Описание (KZ)" required><Textarea name="descriptionKz" rows={3} defaultValue={vacancy?.descriptionKz} required /></Field>
      <Field label="Требования (RU)"><Textarea name="requirementsRu" rows={3} defaultValue={vacancy?.requirementsRu ?? ""} /></Field>
      <Field label="Требования (KZ)"><Textarea name="requirementsKz" rows={3} defaultValue={vacancy?.requirementsKz ?? ""} /></Field>
      <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
        <input type="checkbox" name="active" defaultChecked={vacancy?.active ?? true} className="h-4 w-4 accent-terracotta-500" />
        Активна (показывать на сайте)
      </label>
      <FormActions><SubmitBtn /></FormActions>
    </form>
  );
}
