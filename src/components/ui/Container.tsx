import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-page", className)} {...props} />;
}

export function Section({
  className,
  tone = "cream",
  ...props
}: HTMLAttributes<HTMLElement> & { tone?: "cream" | "sand" | "white" | "graphite" }) {
  const tones = {
    cream: "bg-cream-50",
    sand: "bg-sand-100",
    white: "bg-white",
    graphite: "bg-graphite-800 text-cream-100",
  };
  return <section className={cn("py-14 sm:py-20", tones[tone], className)} {...props} />;
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  dark = false,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {kicker && (
        <span
          className={cn(
            "mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
            dark ? "bg-cream-50/10 text-gold-300" : "bg-terracotta-50 text-terracotta-600"
          )}
        >
          {kicker}
        </span>
      )}
      <h2
        className={cn(
          "break-words font-display text-3xl font-bold leading-tight sm:text-4xl",
          dark ? "text-cream-50" : "text-graphite-800"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 break-words text-base sm:text-lg", dark ? "text-cream-200" : "text-graphite-600")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn("ornament-divider bg-ornament-line", className)}
    />
  );
}
