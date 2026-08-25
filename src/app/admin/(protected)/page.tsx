import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Inbox, Star, HandCoins, Mail, Users, Handshake } from "lucide-react";

export const metadata = { title: "Дашборд — Админ-панель" };

export default async function AdminDashboardPage() {
  const [newApplications, totalApplications, openFundraisers, mamaOfWeek, newMessages, newVolunteers, newPartners] =
    await Promise.all([
      prisma.application.count({ where: { status: "NEW" } }),
      prisma.application.count(),
      prisma.fundraiser.count({ where: { status: "OPEN" } }),
      prisma.story.findFirst({ where: { isMamaOfWeek: true, published: true }, orderBy: { weekOf: "desc" } }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.volunteerApplication.count({ where: { status: "NEW" } }),
      prisma.partnerApplication.count({ where: { status: "NEW" } }),
    ]);

  const tiles = [
    { label: "Новые обращения", value: newApplications, sub: `Всего: ${totalApplications}`, icon: Inbox, href: "/admin/applications", color: "bg-terracotta-50 text-terracotta-600" },
    { label: "Открытые сборы", value: openFundraisers, icon: HandCoins, href: "/admin/fundraisers", color: "bg-forest-50 text-forest-600" },
    { label: "Новые сообщения", value: newMessages, icon: Mail, href: "/admin/messages", color: "bg-gold-300/25 text-gold-600" },
    { label: "Заявки волонтёров", value: newVolunteers, icon: Users, href: "/admin/volunteers", color: "bg-sand-100 text-graphite-700" },
    { label: "Заявки партнёров", value: newPartners, icon: Handshake, href: "/admin/partners", color: "bg-cream-200 text-graphite-700" },
  ];

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-graphite-800">Дашборд</h1>
      <p className="mb-6 text-graphite-500">Обзор текущей активности Центра.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="rounded-xl2 bg-white p-5 shadow-card transition-shadow hover:shadow-soft">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${t.color}`}>
              <t.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-3xl font-bold text-graphite-800">{t.value}</p>
            <p className="text-sm font-semibold text-graphite-600">{t.label}</p>
            {t.sub && <p className="mt-0.5 text-xs text-graphite-400">{t.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl2 bg-white p-6 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-5 w-5 text-terracotta-500" />
          <h2 className="font-display text-lg font-bold text-graphite-800">Мама недели</h2>
        </div>
        {mamaOfWeek ? (
          <div className="flex items-center justify-between">
            <p className="text-graphite-700">{mamaOfWeek.titleRu}</p>
            <Link href="/admin/stories" className="text-sm font-bold text-terracotta-500 hover:underline">
              Управление →
            </Link>
          </div>
        ) : (
          <p className="text-graphite-500">
            Сейчас нет опубликованной истории «Мама недели».{" "}
            <Link href="/admin/stories/new" className="font-bold text-terracotta-500 hover:underline">
              Создать новую
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
