import "server-only";

import { headers } from "next/headers";

/**
 * Простой rate-limit в памяти процесса — защита форм от массовой отправки
 * (доп. уровень к honeypot + проверке времени заполнения, см. actions.ts форм).
 *
 * TODO (продакшн): при деплое с несколькими инстансами/serverless функциями
 * состояние в памяти не будет общим между инстансами — для реальной нагрузки
 * рекомендуется вынести лимитер во внешнее хранилище (например, Redis/Upstash).
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 минут
const MAX_REQUESTS = 8;

const buckets = new Map<string, number[]>();

function getClientKey(action: string): string {
  const h = headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return `${action}:${ip}`;
}

/** Возвращает true, если лимит превышен и запрос нужно отклонить. */
export function isRateLimited(action: string): boolean {
  const key = getClientKey(action);
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  buckets.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS;
}
