import { Field, Input, Textarea, Select, FormActions, SubmitBtn } from "@/components/admin/fields";
import type { Story, Fundraiser } from "@prisma/client";

function toInputDate(d?: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export function StoryForm({
  story,
  fundraiser,
  action,
}: {
  story?: Story;
  fundraiser?: Fundraiser | null;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="space-y-5" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название истории (RU)" required><Input name="titleRu" defaultValue={story?.titleRu} required /></Field>
        <Field label="Название истории (KZ)" required><Input name="titleKz" defaultValue={story?.titleKz} required /></Field>
        <Field label="Slug" required><Input name="slug" defaultValue={story?.slug} pattern="[a-z0-9-]+" required /></Field>
        <Field label="Категории проблемы" hint="через запятую: алименты, документы...">
          <Input name="categoryTags" defaultValue={story?.categoryTags.join(", ") ?? ""} />
        </Field>
      </div>

      <Field label="Краткое описание для карточки (RU)" required><Textarea name="summaryRu" rows={2} defaultValue={story?.summaryRu} required /></Field>
      <Field label="Краткое описание для карточки (KZ)" required><Textarea name="summaryKz" rows={2} defaultValue={story?.summaryKz} required /></Field>
      <Field label="Описание проблемы (RU)" required><Textarea name="problemRu" rows={4} defaultValue={story?.problemRu} required /></Field>
      <Field label="Описание проблемы (KZ)" required><Textarea name="problemKz" rows={4} defaultValue={story?.problemKz} required /></Field>
      <Field label="Необходимая помощь (RU)" required hint="каждый пункт с новой строки">
        <Textarea name="neededHelpRu" rows={3} defaultValue={story?.neededHelpRu} required />
      </Field>
      <Field label="Необходимая помощь (KZ)" required hint="каждый пункт с новой строки">
        <Textarea name="neededHelpKz" rows={3} defaultValue={story?.neededHelpKz} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Цель недели (RU)" hint="для «Мамы недели»"><Textarea name="goalOfWeekRu" rows={2} defaultValue={story?.goalOfWeekRu ?? ""} /></Field>
        <Field label="Цель недели (KZ)"><Textarea name="goalOfWeekKz" rows={2} defaultValue={story?.goalOfWeekKz ?? ""} /></Field>
      </div>

      <div className="rounded-xl2 border border-gold-300/50 bg-gold-300/10 p-4">
        <p className="mb-3 text-sm font-bold text-graphite-700">Финансовый сбор (необязательно)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Необходимая сумма, ₸"><Input name="fundraiserGoal" type="number" defaultValue={fundraiser?.goalAmount ?? ""} /></Field>
          <Field label="Текущая собранная сумма, ₸"><Input name="fundraiserRaised" type="number" defaultValue={fundraiser?.raisedAmount ?? 0} /></Field>
          <Field label="Дата начала сбора"><Input name="fundraiserStart" type="date" defaultValue={toInputDate(fundraiser?.startDate) || toInputDate(new Date())} /></Field>
          <Field label="Срок сбора (дата окончания)"><Input name="fundraiserEnd" type="date" defaultValue={toInputDate(fundraiser?.endDate)} /></Field>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Результат (RU)"><Textarea name="resultRu" rows={2} defaultValue={story?.resultRu ?? ""} /></Field>
        <Field label="Результат (KZ)"><Textarea name="resultKz" rows={2} defaultValue={story?.resultKz ?? ""} /></Field>
        <Field label="Отчёт (RU)" hint="что сделали, сколько получили/потратили"><Textarea name="reportRu" rows={3} defaultValue={story?.reportRu ?? ""} /></Field>
        <Field label="Отчёт (KZ)"><Textarea name="reportKz" rows={3} defaultValue={story?.reportKz ?? ""} /></Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Статус истории" required>
          <Select name="status" defaultValue={story?.status ?? "FUNDRAISING_OPEN"} required>
            <option value="FUNDRAISING_OPEN">🟡 Сбор открыт</option>
            <option value="IN_PROGRESS">🔵 Помощь в процессе</option>
            <option value="HELP_PROVIDED">🟢 Помощь оказана</option>
            <option value="REPORT_PUBLISHED">⚪ Отчёт опубликован</option>
          </Select>
        </Field>
        <Field label="Дата публикации (для «Мамы недели»)"><Input name="weekOf" type="date" defaultValue={toInputDate(story?.weekOf)} /></Field>
      </div>

      <Field label="Обложка"><input type="file" name="cover" accept="image/*" className="block text-sm" /></Field>
      <Field label="Дополнительные фотографии" hint="можно выбрать несколько; добавляются к существующим">
        <input type="file" name="images" accept="image/*" multiple className="block text-sm" />
      </Field>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
          <input type="checkbox" name="isMamaOfWeek" defaultChecked={story?.isMamaOfWeek ?? false} className="h-4 w-4 accent-terracotta-500" />
          Показывать как «Мама недели»
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
          <input type="checkbox" name="consentGiven" defaultChecked={story?.consentGiven ?? false} required className="h-4 w-4 accent-terracotta-500" />
          Согласие на публикацию получено <span className="text-terracotta-500">*</span>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
          <input type="checkbox" name="anonymized" defaultChecked={story?.anonymized ?? true} className="h-4 w-4 accent-terracotta-500" />
          Не раскрывать персональные данные (анонимизировано)
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
          <input type="checkbox" name="published" defaultChecked={story?.published ?? false} className="h-4 w-4 accent-terracotta-500" />
          Опубликовано на сайте
        </label>
      </div>

      <FormActions><SubmitBtn /></FormActions>
    </form>
  );
}
