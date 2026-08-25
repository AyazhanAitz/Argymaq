import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { NewsPost } from "@prisma/client";
import { formatDate } from "@/lib/utils";

const categoryLabels: Record<string, { ru: string; kz: string }> = {
  NEWS: { ru: "Новость", kz: "Жаңалық" },
  ANNOUNCEMENT: { ru: "Объявление", kz: "Хабарландыру" },
  EVENT: { ru: "Мероприятие", kz: "Іс-шара" },
  PROMO: { ru: "Акция", kz: "Акция" },
  REPORT: { ru: "Отчёт", kz: "Есеп" },
  GRANT: { ru: "Грант", kz: "Грант" },
  VACANCY: { ru: "Вакансия", kz: "Бос орын" },
};

export function NewsCard({ locale, dict, post }: { locale: Locale; dict: Dictionary; post: NewsPost }) {
  const title = locale === "kz" ? post.titleKz : post.titleRu;
  const excerpt = locale === "kz" ? post.excerptKz : post.excerptRu;
  const category = categoryLabels[post.category]?.[locale] ?? post.category;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl2 border border-graphite-800/5 bg-white shadow-card">
      <Photo src={post.coverImage} alt={title} label={title} ratio="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-terracotta-500">
          <span className="rounded-full bg-terracotta-50 px-2.5 py-1">{category}</span>
          <span className="text-graphite-400">{formatDate(post.publishedAt, locale)}</span>
        </div>
        <h3 className="font-display text-lg font-bold text-graphite-800">{title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-graphite-600">{excerpt}</p>
        <LinkButton href={`/${locale}/news/${post.slug}`} variant="outline" size="sm" className="mt-4 w-full">
          {dict.news.readFull}
        </LinkButton>
      </div>
    </div>
  );
}
