import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VacancyForm } from "../VacancyForm";
import { updateVacancy } from "../actions";

export const metadata = { title: "Редактировать вакансию — Админ-панель" };

export default async function EditVacancyPage({ params }: { params: { id: string } }) {
  const vacancy = await prisma.vacancy.findUnique({ where: { id: params.id } });
  if (!vacancy) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Редактировать вакансию</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <VacancyForm vacancy={vacancy} action={updateVacancy.bind(null, vacancy.id)} />
      </div>
    </div>
  );
}
