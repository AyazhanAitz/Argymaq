"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Lock } from "lucide-react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-3.5 font-bold text-cream-50 transition-colors hover:bg-terracotta-600 disabled:opacity-60"
    >
      {pending && <Loader2 className="h-5 w-5 animate-spin" />}
      Войти
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
          <Lock className="h-6 w-6" />
        </div>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-graphite-700">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3 focus:border-gold-500"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-graphite-700">Пароль</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-graphite-800/15 bg-white px-4 py-3 focus:border-gold-500"
        />
      </label>
      {state.status === "error" && (
        <p className="rounded-xl bg-terracotta-50 p-3 text-sm font-semibold text-terracotta-600">{state.message}</p>
      )}
      <SubmitButton />
    </form>
  );
}
