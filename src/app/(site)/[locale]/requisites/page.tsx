import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Section, Container } from "@/components/ui/Container";
import { AlertTriangle } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.footer.requisites };
}

export default function RequisitesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  const rows = [
    "Полное наименование",
    "БИН",
    "Юридический адрес",
    "Банк",
    "ИИК",
    "БИК",
    "КБе",
  ];

  return (
    <Section tone="cream">
      <Container className="max-w-2xl">
        <h1 className="mb-6 font-display text-3xl font-bold text-graphite-800">{dict.footer.requisites}</h1>

        <div className="mb-6 flex items-start gap-3 rounded-xl2 border-2 border-dashed border-terracotta-300 bg-terracotta-50 p-5">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-terracotta-500" />
          <p className="text-sm text-graphite-700">
            {dict.common.todoContent}: официальные банковские реквизиты ОФ «Фонд социального развития
            «Арғымақ» будут опубликованы здесь после предоставления заказчиком. Приём средств
            производится только через официальный счёт Фонда — см. также раздел «Открытые сборы».
          </p>
        </div>

        <dl className="divide-y divide-graphite-800/10 rounded-xl2 border border-graphite-800/10 bg-white">
          {rows.map((row) => (
            <div key={row} className="flex justify-between gap-4 p-4">
              <dt className="font-semibold text-graphite-700">{row}</dt>
              <dd className="text-graphite-400">TODO</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
