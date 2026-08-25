import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const gradients = [
  "from-sand-200 via-cream-100 to-terracotta-100",
  "from-forest-100 via-cream-100 to-sand-200",
  "from-terracotta-100 via-sand-100 to-cream-200",
  "from-cream-200 via-sand-100 to-forest-100",
];

function hashLabel(label: string) {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Универсальный компонент фотографии.
 * Если реального изображения ещё нет (src не передан) — показывает
 * аккуратную нейтральную заглушку в стилистике сайта вместо стокового фото,
 * с подписью, что нужен контент от заказчика/реальные фото Центра.
 */
export function Photo({
  src,
  alt,
  label,
  className,
  ratio = "aspect-[4/3]",
  priority,
  sizes,
}: {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", ratio, className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          className="object-cover"
        />
      </div>
    );
  }

  const gradient = gradients[hashLabel(label ?? alt) % gradients.length];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br text-center",
        gradient,
        ratio,
        className
      )}
      role="img"
      aria-label={alt}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/ornament/accent.svg')] bg-center bg-no-repeat opacity-30"
        style={{ backgroundSize: "50%" }}
      />
      <Camera className="relative z-10 h-7 w-7 text-graphite-600/50" strokeWidth={1.5} />
      {label && (
        <span className="relative z-10 mt-2 max-w-[80%] px-2 text-xs font-medium text-graphite-600/70">
          {label}
        </span>
      )}
      <span className="relative z-10 mt-1 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-graphite-500/70">
        Фото готовится
      </span>
    </div>
  );
}
