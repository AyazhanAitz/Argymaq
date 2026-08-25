import { Field, Input, Textarea, Select, FormActions, SubmitBtn } from "@/components/admin/fields";
import type { NewsPost } from "@prisma/client";

const CATEGORIES = [
  ["NEWS", "Новость"], ["ANNOUNCEMENT", "Объявление"], ["EVENT", "Мероприятие"],
  ["PROMO", "Акция"], ["REPORT", "Отчёт"], ["GRANT", "Грант"], ["VACANCY", "Вакансия"],
] as const;

export function NewsForm({ post, action }: { post?: NewsPost; action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-5" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Заголовок (RU)" required>
          <Input name="titleRu" defaultValue={post?.titleRu} required />
        </Field>
        <Field label="Заголовок (KZ)" required>
          <Input name="titleKz" defaultValue={post?.titleKz} required />
        </Field>
        <Field label="Slug (URL)" required hint="латиница, цифры, дефис">
          <Input name="slug" defaultValue={post?.slug} required pattern="[a-z0-9-]+" />
        </Field>
        <Field label="Категория" required>
          <Select name="category" defaultValue={post?.category ?? "NEWS"} required>
            {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Краткое описание (RU)" required>
        <Textarea name="excerptRu" defaultValue={post?.excerptRu} rows={2} required />
      </Field>
      <Field label="Краткое описание (KZ)" required>
        <Textarea name="excerptKz" defaultValue={post?.excerptKz} rows={2} required />
      </Field>
      <Field label="Полный текст (RU)" required>
        <Textarea name="bodyRu" defaultValue={post?.bodyRu} rows={8} required />
      </Field>
      <Field label="Полный текст (KZ)" required>
        <Textarea name="bodyKz" defaultValue={post?.bodyKz} rows={8} required />
      </Field>

      <Field label="Обложка" hint="JPG/PNG/WEBP, до 10 МБ">
        <input type="file" name="cover" accept="image/*" className="block text-sm" />
      </Field>

      <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="h-4 w-4 accent-terracotta-500" />
        Опубликовано на сайте
      </label>

      <FormActions>
        <SubmitBtn />
      </FormActions>
    </form>
  );
}
