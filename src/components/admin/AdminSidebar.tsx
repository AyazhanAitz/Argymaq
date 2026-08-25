"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition } from "react";
import {
  LayoutDashboard, Inbox, Star, HandCoins, Newspaper, FolderKanban,
  CalendarDays, Briefcase, Award, BookOpen, Images, Users, Handshake,
  Mail, BarChart3, ShieldCheck, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/(protected)/logout-action";

const NAV = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Обращения", icon: Inbox },
  { href: "/admin/stories", label: "Мама недели / Истории", icon: Star },
  { href: "/admin/fundraisers", label: "Сборы и отчёты", icon: HandCoins },
  { href: "/admin/news", label: "Новости", icon: Newspaper },
  { href: "/admin/projects", label: "Проекты / Дармарки / Детям", icon: FolderKanban },
  { href: "/admin/events", label: "Календарь", icon: CalendarDays },
  { href: "/admin/vacancies", label: "Вакансии", icon: Briefcase },
  { href: "/admin/grants", label: "Гранты", icon: Award },
  { href: "/admin/useful-articles", label: "Полезная информация", icon: BookOpen },
  { href: "/admin/gallery", label: "Галерея", icon: Images },
  { href: "/admin/volunteers", label: "Заявки волонтёров", icon: Users },
  { href: "/admin/partners", label: "Заявки партнёров", icon: Handshake },
  { href: "/admin/messages", label: "Сообщения", icon: Mail },
  { href: "/admin/stats", label: "Статистика Центра", icon: BarChart3 },
  { href: "/admin/users", label: "Пользователи", icon: ShieldCheck, adminOnly: true },
];

export function AdminSidebar({ role, name }: { role: string; name: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-graphite-800/10 bg-white">
      <div className="border-b border-graphite-800/10 p-5">
        <p className="font-display text-sm font-bold text-graphite-800">Аналарды қолдау</p>
        <p className="text-xs text-graphite-500">{name} · {role === "ADMIN" ? "Администратор" : "Менеджер"}</p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.filter((item) => !item.adminOnly || role === "ADMIN").map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-terracotta-50 text-terracotta-600" : "text-graphite-600 hover:bg-cream-100"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-graphite-800/10 p-3">
        <button
          type="button"
          onClick={() => startTransition(() => { logout(); })}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-graphite-500 hover:bg-cream-100"
        >
          <LogOut className="h-4.5 w-4.5" /> Выйти
        </button>
      </div>
    </aside>
  );
}
