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

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 12.2 16 8.3c.6-.27 1.1.17.85.9l-1.6 6.9c-.15.65-.7.8-1.2.5l-2.6-1.95-1.25 1.2c-.15.14-.28.2-.5.2l.18-2.55 4.6-4.2c.2-.18-.04-.28-.3-.1l-5.7 3.6-2.45-.75c-.55-.17-.56-.55.11-.8Z" />
    </svg>
  );
}
