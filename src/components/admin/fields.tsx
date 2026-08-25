import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

const base = "w-full rounded-xl border border-graphite-800/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold-500";

export function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-graphite-700">
        {label} {required && <span className="text-terracotta-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-graphite-400">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={base} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={base} />;
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-3 border-t border-graphite-800/10 pt-5">{children}</div>;
}

export function SubmitBtn({ label = "Сохранить" }: { label?: string }) {
  return (
    <button type="submit" className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-terracotta-600">
      {label}
    </button>
  );
}
