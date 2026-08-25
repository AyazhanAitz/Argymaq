"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContactMessage, type ContactFormState } from "./actions";
import type { Dictionary } from "@/i18n/getDictionary";

const initialState: ContactFormState = { status: "idle" };
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

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [state, formAction] = useFormState(submitContactMessage, initialState);
  const [renderedAt] = useState(() => new Date().toISOString());

  if (state.status === "success") {
    return (
      <div className="rounded-xl2 border-2 border-forest-300 bg-forest-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-forest-500" />
        <p className="mt-2 font-bold text-graphite-800">Сообщение отправлено. Спасибо!</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="renderedAt" value={renderedAt} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.contacts.form.name} *</span>
        <input name="name" required className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.getHelp.fields.phone} / Email *</span>
        <input name="contact" required className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-graphite-700">{dict.contacts.form.message} *</span>
        <textarea name="message" required rows={4} className={inputCls} />
      </label>
      {state.status === "error" && <p className="rounded-xl bg-terracotta-50 p-3 text-sm font-semibold text-terracotta-600">{state.message}</p>}
      <SubmitButton label={dict.cta.send} />
    </form>
  );
}
