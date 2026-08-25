import { MapPin, Phone, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";

export function ContactsTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const address = locale === "kz" ? CONTACTS.addressKz : CONTACTS.addressRu;
  return (
    <Section tone="graphite">
      <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-cream-50 sm:text-3xl">{dict.contacts.title}</h2>
          <div className="mt-5 space-y-3 text-cream-200">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" /> {address}</p>
            <p className="flex items-center gap-2"><Phone className="h-5 w-5 text-gold-300" /> {CONTACTS.phone}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={CONTACTS.whatsappHref} variant="whatsapp" size="md">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </LinkButton>
            <LinkButton href={`/${locale}/contacts`} variant="gold" size="md">
              {dict.contacts.title} →
            </LinkButton>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl2 bg-cream-50/5">
          <iframe
            title="Карта — 2GIS"
            src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22city%22%3A%22almaty%22%7D"
            className="h-64 w-full grayscale-0 sm:h-80"
            loading="lazy"
          />
        </div>
      </div>
    </Section>
  );
}
