import { MessageCircle, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/getDictionary";
import { CONTACTS } from "@/lib/contacts";

/**
 * Панель официальной оплаты сбора (п.11 ТЗ).
 * TODO: заказчик должен предоставить официальные реквизиты счёта Фонда
 * и/или QR-код платёжного сервиса. До этого момента — только контакт
 * через WhatsApp для уточнения способа поддержки, без сбора данных карт.
 */
export function PaymentPanel({ dict }: { dict: Dictionary }) {
  return (
    <div className="rounded-xl2 border-2 border-dashed border-forest-300 bg-forest-50/50 p-6">
      <div className="flex items-center gap-2 text-forest-700">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-sm font-bold">{dict.fundraisers.paymentNotice}</span>
      </div>
      <p className="mt-3 text-sm text-graphite-600">
        TODO: требуется контент заказчика — официальные реквизиты счёта Фонда
        «Арғымақ» и/или QR-код для оплаты. Реквизиты будут опубликованы здесь
        после предоставления.
      </p>
      <LinkButton href={CONTACTS.whatsappHref} variant="whatsapp" size="md" className="mt-4">
        <MessageCircle className="h-4 w-4" /> {dict.cta.whatsapp}
      </LinkButton>
    </div>
  );
}
