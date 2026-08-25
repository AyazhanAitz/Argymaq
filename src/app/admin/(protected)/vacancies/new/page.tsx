import { VacancyForm } from "../VacancyForm";
import { createVacancy } from "../actions";

export const metadata = { title: "Новая вакансия — Админ-панель" };

export default function NewVacancyPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Новая вакансия</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card"><VacancyForm action={createVacancy} /></div>
    </div>
  );
}
