import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getServiceBySlug, services } from "@/content/services";
import { Section, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const service = getServiceBySlug(params.slug);
  if (!service) return {};
  return {
    title: locale === "kz" ? service.titleKz : service.titleRu,
    description: locale === "kz" ? service.shortKz : service.shortRu,
  };
}

export default function ServiceDetailPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <Section tone="cream">
      <Container className="max-w-4xl">
        <LinkButton href={`/${locale}/services`} variant="ghost" size="sm" className="mb-6">
          ← {dict.cta.back}
        </LinkButton>
        <Photo
          src={null}
          alt={locale === "kz" ? service.titleKz : service.titleRu}
          label={locale === "kz" ? service.titleKz : service.titleRu}
          ratio="aspect-[16/7]"
          className="rounded-xl2"
        />
        <h1 className="mt-6 font-display text-3xl font-bold text-graphite-800 sm:text-4xl">
          {locale === "kz" ? service.titleKz : service.titleRu}
        </h1>
        <div className="prose-content mt-6">
          <p>{locale === "kz" ? service.bodyKz : service.bodyRu}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href={`/${locale}/get-help`} size="lg">
            {dict.cta.needHelp}
          </LinkButton>
          {service.moreHref && (
            <LinkButton href={`/${locale}${service.moreHref}`} variant="outline" size="lg">
              {dict.cta.readMore}
            </LinkButton>
          )}
        </div>
      </Container>
    </Section>
  );
}
