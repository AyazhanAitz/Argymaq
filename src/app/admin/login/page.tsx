import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl2 bg-white p-8 shadow-soft">
        <h1 className="mb-1 text-center font-display text-xl font-bold text-graphite-800">
          Админ-панель Центра
        </h1>
        <p className="mb-6 text-center text-sm text-graphite-500">Аналарды қолдау орталығы</p>
        <LoginForm />
      </div>
    </div>
  );
}
