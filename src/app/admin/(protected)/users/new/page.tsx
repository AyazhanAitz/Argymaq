import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Field, Input, Select, FormActions, SubmitBtn } from "@/components/admin/fields";
import { createAdminUser } from "../actions";

export const metadata = { title: "Новый пользователь — Админ-панель" };

export default async function NewAdminUserPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/admin");

  return (
    <div className="max-w-md">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Новый пользователь</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <form action={createAdminUser} className="space-y-4">
          <Field label="Имя" required><Input name="name" required /></Field>
          <Field label="Email" required><Input name="email" type="email" required /></Field>
          <Field label="Пароль" required hint="минимум 8 символов"><Input name="password" type="password" minLength={8} required /></Field>
          <Field label="Роль" required>
            <Select name="role" defaultValue="MANAGER" required>
              <option value="MANAGER">Менеджер (без управления пользователями)</option>
              <option value="ADMIN">Администратор (полный доступ)</option>
            </Select>
          </Field>
          <FormActions><SubmitBtn label="Создать" /></FormActions>
        </form>
      </div>
    </div>
  );
}
