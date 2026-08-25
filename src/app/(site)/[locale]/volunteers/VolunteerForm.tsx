"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitVolunteerRequest, type VolunteerFormState } from "./actions";
import { volunteerSpecializations } from "@/content/formOptions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { trackEvent } from "@/lib/analytics";

const initialState: VolunteerFormState = { status: "idle" };
const inputCls = "w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="flex items-center justify-center gap-2 rounded-full bg-terracotta-500 px-8 py-4 text-lg font-bold text-cream-50 shadow-soft transition-colors hover:bg-terracotta-600 disabled:opacity-60">
      {pending && <Loader2 className="h-5 w-5 animate-spin" />}
      {label}
    </button>
  );
}

export function VolunteerForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [state, formAction] = useFormState(submitVolunteerRequest, initialState);
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
    <form action={(fd) => { trackEvent("submit_volunteer_form"); return formAction(fd); }} className="space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="renderedAt" value={renderedAt} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.volunteers.fields.fullName} *</span>
          <input name="fullName" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.volunteers.fields.phone} *</span>
          <input name="phone" type="tel" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.volunteers.fields.whatsapp}</span>
          <input name="whatsapp" type="tel" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.volunteers.fields.email}</span>
          <input name="email" type="email" className={inputCls} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.volunteers.fields.city}</span>
          <input name="city" className={inputCls} />
        </label>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-bold text-graphite-700">{dict.volunteers.fields.specialization} *</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {volunteerSpecializations.map((s) => (
            <label key={s.value} className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-graphite-800/10 bg-white px-3 py-2.5 text-sm has-[:checked]:border-terracotta-400 has-[:checked]:bg-terracotta-50">
              <input type="checkbox" name="specializations" value={s.value} className="h-4 w-4 accent-terracotta-500" />
              {locale === "kz" ? s.kz : s.ru}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.volunteers.fields.message}</span>
        <textarea name="message" rows={4} className={inputCls} />
      </label>

      {state.status === "error" && <p className="rounded-xl bg-terracotta-50 p-3 text-sm font-semibold text-terracotta-600">{state.message}</p>}

      <SubmitButton label={dict.cta.send} />
    </form>
  );
}
