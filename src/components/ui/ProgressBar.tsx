import { percent } from "@/lib/utils";

export function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = percent(raised, goal);
  return (
    <div>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-cream-200"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="animate-fill-bar h-full rounded-full bg-gradient-to-r from-terracotta-400 to-gold-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-right text-sm font-bold text-terracotta-600">{pct}%</div>
    </div>
  );
}
