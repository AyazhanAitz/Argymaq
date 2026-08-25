import { Photo } from "@/components/ui/Photo";
import type { Locale } from "@/i18n/config";
import type { Project } from "@prisma/client";

export function ProjectDetail({ locale, project }: { locale: Locale; project: Project }) {
  const title = locale === "kz" ? project.titleKz : project.titleRu;
  const description = locale === "kz" ? project.descriptionKz : project.descriptionRu;
  const goal = locale === "kz" ? project.goalKz : project.goalRu;
  const results = locale === "kz" ? project.resultsKz : project.resultsRu;
  const report = locale === "kz" ? project.reportKz : project.reportRu;

  return (
    <article>
      <Photo src={project.coverImage} alt={title} label={title} ratio="aspect-[16/8]" className="rounded-xl2" priority />
      <h1 className="mt-6 font-display text-3xl font-bold text-graphite-800 sm:text-4xl">{title}</h1>
      <div className="prose-content mt-6">
        <p>{description}</p>
        {goal && (<><h2>Цель</h2><p>{goal}</p></>)}
        {results && (<><h2>Результаты</h2><p>{results}</p></>)}
        {report && (<><h2>Отчёт</h2><p>{report}</p></>)}
      </div>

      {project.partners.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-graphite-500">Партнёры</h3>
          <div className="flex flex-wrap gap-2">
            {project.partners.map((p) => (
              <span key={p} className="rounded-full bg-cream-200 px-3 py-1 text-sm text-graphite-700">{p}</span>
            ))}
          </div>
        </div>
      )}

      {project.images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {project.images.map((img) => (
            <Photo key={img} src={img} alt={title} ratio="aspect-square" className="rounded-xl" />
          ))}
        </div>
      )}
    </article>
  );
}
