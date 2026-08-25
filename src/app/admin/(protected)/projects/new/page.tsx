import { ProjectForm } from "../ProjectForm";
import { createProject } from "../actions";

export const metadata = { title: "Новый проект — Админ-панель" };

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Новый проект</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card"><ProjectForm action={createProject} /></div>
    </div>
  );
}
