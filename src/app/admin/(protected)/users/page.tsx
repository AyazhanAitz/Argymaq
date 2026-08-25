import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { ToggleActiveButton } from "./ToggleActiveButton";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Пользователи — Админ-панель" };

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/admin");

  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <PageHeader title="Пользователи админ-панели" createHref="/admin/users/new" />
      <div className="overflow-hidden rounded-xl2 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-800/10 bg-cream-100 text-left text-xs font-bold uppercase text-graphite-500">
            <tr><th className="p-3">Имя</th><th className="p-3">Email</th><th className="p-3">Роль</th><th className="p-3">С</th><th className="p-3">Статус</th></tr>
          </thead>
          <tbody className="divide-y divide-graphite-800/5">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3 font-semibold">{u.name}</td>
                <td className="p-3 text-graphite-500">{u.email}</td>
                <td className="p-3">{u.role === "ADMIN" ? "Администратор" : "Менеджер"}</td>
                <td className="p-3 text-graphite-400">{formatDate(u.createdAt, "ru")}</td>
                <td className="p-3"><ToggleActiveButton id={u.id} active={u.active} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
