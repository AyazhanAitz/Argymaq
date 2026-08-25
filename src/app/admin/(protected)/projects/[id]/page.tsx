import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../ProjectForm";
import { updateProject } from "../actions";

export const metadata = { title: "Редактировать проект — Админ-панель" };

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Редактировать проект</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <ProjectForm project={project} action={updateProject.bind(null, project.id)} />
      </div>
    </div>
  );
}
