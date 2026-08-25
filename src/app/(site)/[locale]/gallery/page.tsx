import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getGalleryImages } from "@/lib/queries";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic"; // всегда свежие данные из БД (контент управляется админ-панелью)

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.gallery.title, description: dict.gallery.subtitle };
}

const CATEGORIES = ["ALL", "PROJECTS", "MOTHERS", "CHILDREN", "VOLUNTEERS", "EVENTS", "FLEA_MARKET", "ECO"] as const;

export default async function GalleryPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const active = CATEGORIES.includes(searchParams.category as (typeof CATEGORIES)[number])
    ? (searchParams.category as (typeof CATEGORIES)[number])
    : "ALL";
  const images = await getGalleryImages(active);

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading kicker={dict.nav.news} title={dict.gallery.title} subtitle={dict.gallery.subtitle} align="center" />

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === "ALL" ? `/${locale}/gallery` : `/${locale}/gallery?category=${cat}`}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active === cat ? "bg-terracotta-500 text-white" : "bg-white text-graphite-600 hover:bg-terracotta-50"
              )}
            >
              {dict.gallery.categories[cat]}
            </Link>
          ))}
        </div>

        <GalleryGrid images={images} locale={locale} />
      </Container>
    </Section>
  );
}
