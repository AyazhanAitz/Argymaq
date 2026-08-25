import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildNav } from "@/content/navigation";
import { fontSans, fontDisplay } from "@/lib/fonts";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyMobileBar } from "@/components/site/StickyMobileBar";
import { GoogleAnalytics } from "@/components/site/GoogleAnalytics";
import { OrganizationJsonLd } from "@/components/site/OrganizationJsonLd";
import "../../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://argymaq.kz";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${dict.meta.siteName} | ${dict.meta.orgName}`,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.hero.subtitle,
    alternates: {
      canonical: `/${locale}`,
      languages: { ru: "/ru", "kk-KZ": "/kz" },
    },
    openGraph: {
      title: dict.meta.siteName,
      description: dict.hero.subtitle,
      locale: locale === "kz" ? "kk_KZ" : "ru_RU",
      type: "website",
      siteName: dict.meta.siteName,
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const nav = buildNav(dict, locale);

  return (
    <html lang={locale === "kz" ? "kk" : "ru"} className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-50 font-sans text-graphite-800">
        <OrganizationJsonLd />
        <GoogleAnalytics />
        <Header locale={locale} dict={dict} nav={nav} />
        <main id="main-content" className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <StickyMobileBar locale={locale} dict={dict} />
      </body>
    </html>
  );
}
