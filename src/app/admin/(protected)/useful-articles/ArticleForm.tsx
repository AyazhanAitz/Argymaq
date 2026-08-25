import { Field, Input, Textarea, FormActions, SubmitBtn } from "@/components/admin/fields";
import type { UsefulArticle } from "@prisma/client";

export function ArticleForm({ article, action }: { article?: UsefulArticle; action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Заголовок (RU)" required><Input name="titleRu" defaultValue={article?.titleRu} required /></Field>
        <Field label="Заголовок (KZ)" required><Input name="titleKz" defaultValue={article?.titleKz} required /></Field>
        <Field label="Slug" required><Input name="slug" defaultValue={article?.slug} pattern="[a-z0-9-]+" required /></Field>
        <Field label="Категория" required><Input name="category" defaultValue={article?.category} required /></Field>
      </div>
      <Field label="Краткое описание (RU)" required><Textarea name="summaryRu" rows={2} defaultValue={article?.summaryRu} required /></Field>
      <Field label="Краткое описание (KZ)" required><Textarea name="summaryKz" rows={2} defaultValue={article?.summaryKz} required /></Field>
      <Field label="Текст инструкции (RU)" required><Textarea name="bodyRu" rows={10} defaultValue={article?.bodyRu} required /></Field>
      <Field label="Текст инструкции (KZ)" required><Textarea name="bodyKz" rows={10} defaultValue={article?.bodyKz} required /></Field>
      <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
        <input type="checkbox" name="published" defaultChecked={article?.published ?? false} className="h-4 w-4 accent-terracotta-500" />
        Опубликовано на сайте
      </label>
      <FormActions><SubmitBtn /></FormActions>
    </form>
  );
}
