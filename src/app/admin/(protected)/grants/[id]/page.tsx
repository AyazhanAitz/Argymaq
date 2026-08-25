import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GrantForm } from "../GrantForm";
import { updateGrant } from "../actions";

export const metadata = { title: "Редактировать грант — Админ-панель" };

export default async function EditGrantPage({ params }: { params: { id: string } }) {
  const grant = await prisma.grant.findUnique({ where: { id: params.id } });
  if (!grant) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Редактировать грант</h1>
      <div className="rounded-xl2 bg-white p-6 shadow-card">
        <GrantForm grant={grant} action={updateGrant.bind(null, grant.id)} />
      </div>
    </div>
  );
}
