import { Field, Input, Textarea, Select, FormActions, SubmitBtn } from "@/components/admin/fields";
import type { Project } from "@prisma/client";

export function ProjectForm({ project, action }: { project?: Project; action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-5" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название (RU)" required><Input name="titleRu" defaultValue={project?.titleRu} required /></Field>
        <Field label="Название (KZ)" required><Input name="titleKz" defaultValue={project?.titleKz} required /></Field>
        <Field label="Slug" required><Input name="slug" defaultValue={project?.slug} pattern="[a-z0-9-]+" required /></Field>
        <Field label="Раздел" required hint="Проекты / Дармарки и экоакции / Детям">
          <Select name="category" defaultValue={project?.category ?? "PROJECT"} required>
            <option value="PROJECT">Проекты</option>
            <option value="FLEA_MARKET">Дармарки и экоакции</option>
            <option value="ECO">Экоакции</option>
            <option value="KIDS">Детям</option>
          </Select>
        </Field>
      </div>
      <Field label="Описание (RU)" required><Textarea name="descriptionRu" rows={3} defaultValue={project?.descriptionRu} required /></Field>
      <Field label="Описание (KZ)" required><Textarea name="descriptionKz" rows={3} defaultValue={project?.descriptionKz} required /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Цель (RU)"><Textarea name="goalRu" rows={2} defaultValue={project?.goalRu ?? ""} /></Field>
        <Field label="Цель (KZ)"><Textarea name="goalKz" rows={2} defaultValue={project?.goalKz ?? ""} /></Field>
        <Field label="Результаты (RU)"><Textarea name="resultsRu" rows={2} defaultValue={project?.resultsRu ?? ""} /></Field>
        <Field label="Результаты (KZ)"><Textarea name="resultsKz" rows={2} defaultValue={project?.resultsKz ?? ""} /></Field>
        <Field label="Отчёт (RU)"><Textarea name="reportRu" rows={2} defaultValue={project?.reportRu ?? ""} /></Field>
        <Field label="Отчёт (KZ)"><Textarea name="reportKz" rows={2} defaultValue={project?.reportKz ?? ""} /></Field>
      </div>
      <Field label="Партнёры" hint="через запятую">
        <Input name="partners" defaultValue={project?.partners.join(", ") ?? ""} />
      </Field>
      <Field label="Обложка"><input type="file" name="cover" accept="image/*" className="block text-sm" /></Field>
      <Field label="Фотографии (галерея проекта)" hint="можно выбрать несколько; добавляются к существующим">
        <input type="file" name="images" accept="image/*" multiple className="block text-sm" />
      </Field>
      <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
        <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="h-4 w-4 accent-terracotta-500" />
        Опубликовано на сайте
      </label>
      <FormActions><SubmitBtn /></FormActions>
    </form>
  );
}
