"use client";

import { MessageCircle, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, ThreadsIcon } from "@/components/icons/SocialIcons";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";
import { trackEvent } from "@/lib/analytics";

export function QuickActions({ dict }: { dict: Dictionary }) {
  const items = [
    { href: CONTACTS.whatsappHref, icon: MessageCircle, label: dict.cta.whatsapp, event: "click_whatsapp" as const, color: "text-[#25D366]" },
    { href: CONTACTS.phoneHref, icon: Phone, label: dict.cta.call, event: "click_call" as const, color: "text-forest-500" },
    { href: CONTACTS.instagram, icon: InstagramIcon, label: dict.cta.instagram, event: "click_instagram" as const, color: "text-terracotta-500" },
    ...(CONTACTS.facebook
      ? [{ href: CONTACTS.facebook, icon: FacebookIcon, label: dict.cta.facebook, event: "click_facebook" as const, color: "text-graphite-600" }]
      : []),
    ...(CONTACTS.threads
      ? [{ href: CONTACTS.threads, icon: ThreadsIcon, label: dict.cta.threads, event: "click_threads" as const, color: "text-graphite-600" }]
      : []),
  ];

  return (
    <div className="border-b border-graphite-800/5 bg-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-3 py-5 sm:gap-4">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(item.event)}
            className="flex items-center gap-2 rounded-full border border-graphite-800/10 px-4 py-2 text-sm font-semibold text-graphite-700 transition-colors hover:border-terracotta-300 hover:bg-terracotta-50"
          >
            <item.icon className={`h-4 w-4 ${item.color}`} />
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
