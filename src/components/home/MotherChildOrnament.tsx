/**
 * Декоративный линейный орнамент «мама с ребёнком» — воспроизводит
 * силуэт-иллюстрацию из референсного макета (тонкая золотистая линия на
 * фоне фотографии hero). Собственный inline-SVG, не копия стороннего лого.
 */
export function MotherChildOrnament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {/* Голова и плечи мамы */}
      <path d="M100 18c-16 0-28 13-28 29 0 11 6 20 14 25-20 8-34 24-36 46" />
      <path d="M100 18c16 0 28 13 28 29 0 11-6 20-14 25 20 8 34 24 36 46" />
      <circle cx="100" cy="47" r="27" />
      {/* Плащ/платок */}
      <path d="M62 118c-6 18-8 40-6 62" />
      <path d="M138 118c6 18 8 40 6 62" />
      {/* Ребёнок на руках */}
      <circle cx="100" cy="128" r="16" />
      <path d="M78 150c0 16 10 26 22 26s22-10 22-26" />
    </svg>
  );
}
