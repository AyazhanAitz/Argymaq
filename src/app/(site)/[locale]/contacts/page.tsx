import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ContactForm } from "./ContactForm";
import { CONTACTS } from "@/lib/contacts";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.contacts.title, description: dict.contacts.address };
}

export default function ContactsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const address = locale === "kz" ? CONTACTS.addressKz : CONTACTS.addressRu;

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading title={dict.contacts.title} align="center" />

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="space-y-4 rounded-xl2 bg-white p-6 shadow-card">
              <p className="flex items-start gap-3 text-graphite-700">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-500" /> {address}
              </p>
              <a href={CONTACTS.phoneHref} className="flex items-center gap-3 text-graphite-700 hover:text-terracotta-600">
                <Phone className="h-5 w-5 text-terracotta-500" /> {CONTACTS.phone}
              </a>
              <div className="flex flex-wrap gap-3 pt-2">
                <LinkButton href={CONTACTS.phoneHref} size="sm">{dict.cta.call}</LinkButton>
                <LinkButton href={CONTACTS.whatsappHref} variant="whatsapp" size="sm">WhatsApp</LinkButton>
                <LinkButton href={CONTACTS.instagram} variant="outline" size="sm">{dict.cta.instagram}</LinkButton>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl2 shadow-card">
              <iframe
                title="2GIS"
                src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22city%22%3A%22almaty%22%7D"
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
            <div className="mt-3 overflow-hidden rounded-xl2 shadow-card">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps?q=Алматы,+ул.+Толе+би+23А&output=embed"
                className="h-72 w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div className="rounded-xl2 bg-white p-6 shadow-card sm:p-8">
            <h2 className="mb-4 font-display text-xl font-bold text-graphite-800">Написать нам</h2>
            <ContactForm dict={dict} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
