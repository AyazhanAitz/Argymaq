"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import type { GalleryImage } from "@prisma/client";

export function GalleryGrid({ images, locale }: { images: GalleryImage[]; locale: "ru" | "kz" }) {
  const [active, setActive] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Photo
            key={i}
            src={null}
            alt="Фотогалерея Центра"
            label="Фотогалерея"
            ratio={i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}
            className="break-inside-avoid rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            className="block w-full break-inside-avoid overflow-hidden rounded-xl focus-visible:outline-offset-4"
          >
            <Image
              src={img.url}
              alt={(locale === "kz" ? img.captionKz : img.captionRu) || "Фото Центра"}
              width={480}
              height={360}
              className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite-900/90 p-4"
          onClick={() => setActive(null)}
        >
          <button
            aria-label="Закрыть"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
            onClick={() => setActive(null)}
          >
            <X className="h-6 w-6" />
          </button>
          {active > 0 && (
            <button
              aria-label="Предыдущее фото"
              onClick={(e) => { e.stopPropagation(); setActive(active - 1); }}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {active < images.length - 1 && (
            <button
              aria-label="Следующее фото"
              onClick={(e) => { e.stopPropagation(); setActive(active + 1); }}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
          <div className="relative max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[active].url}
              alt={(locale === "kz" ? images[active].captionKz : images[active].captionRu) || "Фото Центра"}
              width={1200}
              height={900}
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
