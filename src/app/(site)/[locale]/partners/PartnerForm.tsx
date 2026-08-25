"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitPartnerRequest, type PartnerFormState } from "./actions";
import { cooperationTypes } from "@/content/formOptions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { trackEvent } from "@/lib/analytics";

const initialState: PartnerFormState = { status: "idle" };
const inputCls = "w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="flex items-center justify-center gap-2 rounded-full bg-forest-500 px-8 py-4 text-lg font-bold text-cream-50 shadow-soft transition-colors hover:bg-forest-600 disabled:opacity-60">
      {pending && <Loader2 className="h-5 w-5 animate-spin" />}
      {label}
    </button>
  );
}

export function PartnerForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [state, formAction] = useFormState(submitPartnerRequest, initialState);
  const [renderedAt] = useState(() => new Date().toISOString());

  if (state.status === "success") {
    return (
      <div className="rounded-xl2 border-2 border-forest-300 bg-forest-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forest-500" />
        <p className="mt-3 font-display text-xl font-bold text-graphite-800">Спасибо! Заявка отправлена.</p>
        <p className="mt-1 text-graphite-600">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form action={(fd) => { trackEvent("submit_partner_form"); return formAction(fd); }} className="space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="renderedAt" value={renderedAt} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.partners.fields.organization} *</span>
          <input name="organization" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.partners.fields.name} *</span>
          <input name="contactName" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.partners.fields.phone} *</span>
          <input name="phone" type="tel" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.partners.fields.email}</span>
          <input name="email" type="email" className={inputCls} />
        </label>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-bold text-graphite-700">{dict.partners.fields.type} *</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {cooperationTypes.map((t) => (
            <label key={t.value} className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-graphite-800/10 bg-white px-3 py-2.5 text-sm has-[:checked]:border-forest-400 has-[:checked]:bg-forest-50">
              <input type="checkbox" name="cooperationTypes" value={t.value} className="h-4 w-4 accent-forest-500" />
              {locale === "kz" ? t.kz : t.ru}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.partners.fields.message}</span>
        <textarea name="message" rows={4} className={inputCls} />
      </label>

      {state.status === "error" && <p className="rounded-xl bg-terracotta-50 p-3 text-sm font-semibold text-terracotta-600">{state.message}</p>}

      <SubmitButton label={dict.cta.send} />
    </form>
  );
}
