import type { Metadata } from "next";
import { fontSans, fontDisplay } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Админ-панель — Аналарды қолдау орталығы",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="min-h-screen bg-cream-100 font-sans text-graphite-800">{children}</body>
    </html>
  );
}
