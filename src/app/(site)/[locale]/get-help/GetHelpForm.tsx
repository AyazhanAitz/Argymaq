"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { CheckCircle2, Loader2, Paperclip } from "lucide-react";
import { submitHelpRequest, type GetHelpState } from "./actions";
import type { Dictionary } from "@/i18n/getDictionary";
import { trackEvent } from "@/lib/analytics";

const initialState: GetHelpState = { status: "idle" };

const CATEGORY_ORDER = [
  "ALIMONY", "DIVORCE", "HOUSING", "BENEFITS", "SOCIAL_HELP", "DISABILITY",
  "DOCUMENTS", "REGISTRATION", "DEBTS", "ACCOUNT_ARREST", "EMPLOYMENT",
  "CAREER_GUIDANCE", "BUSINESS", "PSYCHOLOGIST", "TEMP_HOUSING", "OTHER",
] as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-500 px-8 py-4 text-lg font-bold text-cream-50 shadow-soft transition-colors hover:bg-terracotta-600 disabled:opacity-60 sm:w-auto"
    >
      {pending && <Loader2 className="h-5 w-5 animate-spin" />}
      {label}
    </button>
  );
}

export function GetHelpForm({ dict }: { dict: Dictionary }) {
  const [state, formAction] = useFormState(submitHelpRequest, initialState);
  const [renderedAt] = useState(() => new Date().toISOString());

  if (state.status === "success") {
    return (
      <div className="rounded-xl2 border-2 border-forest-300 bg-forest-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-forest-500" />
        <h2 className="mt-4 font-display text-2xl font-bold text-graphite-800">{dict.getHelp.successTitle}</h2>
        <p className="mt-2 text-graphite-600">{dict.getHelp.successText}</p>
        <p className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-display text-xl font-bold text-terracotta-600 shadow-card">
          {dict.getHelp.ticketLabel}: {state.ticketNumber}
        </p>
      </div>
    );
  }

  return (
    <form
      action={(fd) => {
        trackEvent("submit_help_request");
        return formAction(fd);
      }}
      className="space-y-6"
    >
      {/* honeypot — скрыто от людей, видно ботам */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="renderedAt" value={renderedAt} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.getHelp.fields.fullName} required>
          <input name="fullName" required maxLength={200} className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500" />
        </Field>
        <Field label={dict.getHelp.fields.city} required>
          <input name="city" required maxLength={120} className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500" />
        </Field>
        <Field label={dict.getHelp.fields.phone} required>
          <input name="phone" type="tel" required maxLength={30} className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500" placeholder="+7 7__ ___ __ __" />
        </Field>
        <Field label={dict.getHelp.fields.whatsapp}>
          <input name="whatsapp" type="tel" maxLength={30} className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500" placeholder="+7 7__ ___ __ __" />
        </Field>
        <Field label={dict.getHelp.fields.childrenCount}>
          <input name="childrenCount" type="number" min={0} max={20} className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500" />
        </Field>
        <Field label={dict.getHelp.fields.childrenAges}>
          <input name="childrenAges" maxLength={200} className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500" placeholder="напр. 2, 5, 9" />
        </Field>
      </div>

      <Field label={dict.getHelp.fields.situation} required>
        <textarea name="situationDescription" required minLength={10} maxLength={4000} rows={5} className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500" />
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-bold text-graphite-700">
          {dict.getHelp.fields.helpType} <span className="text-terracotta-500">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORY_ORDER.map((cat) => (
            <label
              key={cat}
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-graphite-800/10 bg-white px-3 py-2.5 text-sm has-[:checked]:border-terracotta-400 has-[:checked]:bg-terracotta-50"
            >
              <input type="checkbox" name="helpCategories" value={cat} className="h-4 w-4 accent-terracotta-500" />
              {dict.helpCategories[cat]}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={dict.getHelp.fields.documents}>
        <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-graphite-800/20 px-4 py-3 text-sm text-graphite-500 hover:border-terracotta-300">
          <Paperclip className="h-5 w-5 shrink-0" />
          <span>PDF, JPG, PNG, DOC — {dict.common.optional}</span>
          <input type="file" name="documents" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx" className="hidden" />
        </label>
      </Field>

      <Field label={dict.getHelp.fields.contactTime}>
        <input name="preferredContactTime" maxLength={200} className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3.5 text-base focus:border-gold-500" placeholder="напр. будни после 18:00" />
      </Field>

      <label className="flex items-start gap-3 text-sm text-graphite-700">
        <input type="checkbox" name="consentPersonalData" required className="mt-1 h-5 w-5 shrink-0 accent-terracotta-500" />
        {dict.getHelp.fields.consent} <span className="text-terracotta-500">*</span>
      </label>

      {state.status === "error" && (
        <p className="rounded-xl bg-terracotta-50 p-3 text-sm font-semibold text-terracotta-600">{state.message}</p>
      )}

      <SubmitButton label={dict.cta.submit} />
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-graphite-700">
        {label} {required && <span className="text-terracotta-500">*</span>}
      </span>
      {children}
    </label>
  );
}
