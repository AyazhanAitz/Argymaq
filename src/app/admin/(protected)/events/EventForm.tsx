import { Field, Input, Textarea, FormActions, SubmitBtn } from "@/components/admin/fields";
import type { Event } from "@prisma/client";

function toInputDate(d?: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export function EventForm({ event, action }: { event?: Event; action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-5" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название (RU)" required><Input name="titleRu" defaultValue={event?.titleRu} required /></Field>
        <Field label="Название (KZ)" required><Input name="titleKz" defaultValue={event?.titleKz} required /></Field>
        <Field label="Дата" required><Input name="date" type="date" defaultValue={toInputDate(event?.date)} required /></Field>
        <Field label="Время"><Input name="time" defaultValue={event?.time ?? ""} placeholder="18:00" /></Field>
        <Field label="Место" required><Input name="location" defaultValue={event?.location} required /></Field>
        <Field label="Организатор"><Input name="organizer" defaultValue={event?.organizer ?? ""} /></Field>
        <Field label="Ссылка на регистрацию"><Input name="registrationUrl" type="url" defaultValue={event?.registrationUrl ?? ""} /></Field>
      </div>
      <Field label="Описание (RU)" required><Textarea name="descriptionRu" rows={3} defaultValue={event?.descriptionRu} required /></Field>
      <Field label="Описание (KZ)" required><Textarea name="descriptionKz" rows={3} defaultValue={event?.descriptionKz} required /></Field>
      <Field label="Обложка"><input type="file" name="cover" accept="image/*" className="block text-sm" /></Field>
      <FormActions><SubmitBtn /></FormActions>
    </form>
  );
}
