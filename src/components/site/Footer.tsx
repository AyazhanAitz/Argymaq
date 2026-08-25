"use client";

import Link from "next/link";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import { Logo } from "./Logo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";
import { services } from "@/content/services";
import { trackEvent } from "@/lib/analytics";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = (path: string) => `/${locale}${path}`;
  const address = locale === "kz" ? CONTACTS.addressKz : CONTACTS.addressRu;

  return (
    <footer className="bg-graphite-800 text-cream-200">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo locale={locale} dark />
          <p className="mt-4 text-sm leading-relaxed text-cream-200/80">{dict.footer.description}</p>
          <div className="mt-5 flex gap-3">
            <SocialIcon href={CONTACTS.instagram} label="Instagram" onClick={() => trackEvent("click_instagram")}>
              <InstagramIcon className="h-4.5 w-4.5" />
            </SocialIcon>
            {CONTACTS.facebook && (
              <SocialIcon href={CONTACTS.facebook} label="Facebook" onClick={() => trackEvent("click_facebook")}>
                <FacebookIcon className="h-4.5 w-4.5" />
              </SocialIcon>
            )}
            <SocialIcon href={CONTACTS.whatsappHref} label="WhatsApp" onClick={() => trackEvent("click_whatsapp")}>
              <MessageCircle className="h-4.5 w-4.5" />
            </SocialIcon>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-gold-300">
            {dict.footer.navTitle}
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href={p("/about")} className="hover:text-gold-300">{dict.nav.about}</Link></li>
            <li><Link href={p("/get-help")} className="hover:text-gold-300">{dict.getHelp.title}</Link></li>
            <li><Link href={p("/mama-of-week")} className="hover:text-gold-300">{dict.mamaOfWeek.badge}</Link></li>
            <li><Link href={p("/stories")} className="hover:text-gold-300">{dict.stories.title}</Link></li>
            <li><Link href={p("/fundraisers")} className="hover:text-gold-300">{dict.fundraisers.title}</Link></li>
            <li><Link href={p("/news")} className="hover:text-gold-300">{dict.news.title}</Link></li>
            <li><Link href={p("/help-center")} className="hover:text-gold-300">{dict.helpCenter.title}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-gold-300">
            {dict.footer.servicesTitle}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={p(`/services/${s.slug}`)} className="hover:text-gold-300">
                  {locale === "kz" ? s.titleKz : s.titleRu}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-gold-300">
            {dict.footer.contactsTitle}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin className="h-4.5 w-4.5 shrink-0 text-gold-300" />
              <span>{address}</span>
            </li>
            <li>
              <a href={CONTACTS.phoneHref} className="flex items-center gap-2 hover:text-gold-300" onClick={() => trackEvent("click_call")}>
                <Phone className="h-4.5 w-4.5 text-gold-300" /> {CONTACTS.phone}
              </a>
            </li>
            <li>
              <Link href={p("/contacts")} className="inline-block underline underline-offset-2 hover:text-gold-300">
                {dict.contacts.title} →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-50/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-cream-200/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {dict.meta.orgName}. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={p("/privacy-policy")} className="hover:text-gold-300">{dict.footer.privacyPolicy}</Link>
            <Link href={p("/terms")} className="hover:text-gold-300">{dict.footer.terms}</Link>
            <Link href={p("/requisites")} className="hover:text-gold-300">{dict.footer.requisites}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
  onClick,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition-colors hover:bg-terracotta-500"
    >
      {children}
    </a>
  );
}
