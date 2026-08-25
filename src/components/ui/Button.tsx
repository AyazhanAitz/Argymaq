"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants = {
  primary: "bg-terracotta-500 text-cream-50 hover:bg-terracotta-600 shadow-soft",
  secondary: "bg-forest-500 text-cream-50 hover:bg-forest-600 shadow-soft",
  outline: "border-2 border-graphite-800 text-graphite-800 hover:bg-graphite-800 hover:text-cream-50",
  ghost: "text-graphite-700 hover:bg-cream-200",
  gold: "bg-gold-400 text-graphite-900 hover:bg-gold-500 shadow-soft",
  whatsapp: "bg-[#25D366] text-white hover:brightness-95 shadow-soft",
};

const sizes = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
  lg: "text-lg px-8 py-4",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(base, variants[variant], sizes[size], className)}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      />
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
