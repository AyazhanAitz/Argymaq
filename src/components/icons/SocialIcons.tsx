import type { SVGProps } from "react";

/**
 * lucide-react (v1) больше не включает брендовые иконки соцсетей.
 * Ниже — собственные минималистичные монолинейные глифы в стиле lucide
 * (stroke, 24x24, currentColor), а не копии официальных логотипов.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M14 8.5h-1.5A2 2 0 0 0 10.5 10.5V12M9 12h4.5M13 12v8.5" />
    </svg>
  );
}

export function ThreadsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21c-4 0-6.5-2.5-6.5-8.5S8 4 12 4s6 2.2 6 5.5c0 2.6-1.4 3.8-3.2 3.8-1.5 0-2.3-.8-2.4-1.8" />
      <path d="M14.4 9.8c0 2.6-1.2 4-3.4 4-1.4 0-2.4-.7-2.4-2 0-1.5 1.4-2.2 3.4-2.2 1 0 2 .1 2.8.4" />
    </svg>
  );
}
