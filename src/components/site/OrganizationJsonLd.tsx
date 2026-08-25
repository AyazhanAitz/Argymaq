import { CONTACTS } from "@/lib/contacts";

/** JSON-LD структурированные данные NGO/Organization (п.37 ТЗ). */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Центр поддержки матерей «Аналарды қолдау орталығы»",
    alternateName: "ОФ «Фонд социального развития «Арғымақ»",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://argymaq.kz",
    logo: "/ornament/accent.svg",
    telephone: CONTACTS.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Толе би, 23А, цокольный этаж, подъезд 3, каб. Ц-01",
      addressLocality: "Алматы",
      addressCountry: "KZ",
    },
    sameAs: [CONTACTS.instagram, CONTACTS.facebook, CONTACTS.threads].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
