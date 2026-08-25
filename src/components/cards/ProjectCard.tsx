import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Project } from "@prisma/client";

export function ProjectCard({ locale, dict, project }: { locale: Locale; dict: Dictionary; project: Project }) {
  const title = locale === "kz" ? project.titleKz : project.titleRu;
  const description = locale === "kz" ? project.descriptionKz : project.descriptionRu;
  const basePath =
    project.category === "FLEA_MARKET" ? "flea-market" : project.category === "KIDS" ? "kids" : "projects";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl2 border border-graphite-800/5 bg-white shadow-card">
      <Photo src={project.coverImage} alt={title} label={title} ratio="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-graphite-800">{title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-graphite-600">{description}</p>
        <LinkButton href={`/${locale}/${basePath}/${project.slug}`} variant="outline" size="sm" className="mt-4 w-full">
          {dict.cta.readMore}
        </LinkButton>
      </div>
    </div>
  );
}
