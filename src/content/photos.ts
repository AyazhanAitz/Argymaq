/**
 * Реальные фотографии Центра, предоставленные заказчиком.
 *
 * Исходники лежат в `src/photos/<категория>/` (как их предоставил заказчик).
 * Здесь используются копии с безопасными именами из `public/photos/...`,
 * чтобы избежать проблем с кириллицей/запятыми в путях при сборке и раздаче
 * через Next.js Image.
 *
 * Категории соответствуют папкам, которые прислал заказчик:
 *  - charity        ← "Благотворительность"
 *  - consultations   ← "Консультации, приём услугополучателей"
 *  - masterclasses   ← "Мастерклассы"
 *  - ecoReuse        ← "Экоакция, дармарка, reuse"
 */

export const LOGO = {
  /** Логотип Центра «Аналарды қолдау орталығы» (дерево/лист с мамой и ребёнком). */
  center: "/photos/logo/analardy-qoldau-logo.jpg",
  /** Логотип ОФ «Фонд социального развития «Арғымақ» (наездник на лошади). */
  fund: "/photos/logo/argymaq-fund-logo.jpg",
} as const;

function range(count: number, pad = (n: number) => String(n).padStart(2, "0")) {
  return Array.from({ length: count }, (_, i) => pad(i + 1));
}

export const CHARITY_PHOTOS = range(12).map((n) => `/photos/charity/charity-${n}.jpg`);
export const CONSULTATION_PHOTOS = range(16).map((n) => `/photos/consultations/consultation-${n}.jpg`);
export const MASTERCLASS_PHOTOS = range(12).map((n) => `/photos/masterclasses/masterclass-${n}.jpg`);
export const ECO_REUSE_PHOTOS = range(16).map((n) => `/photos/eco-reuse/eco-reuse-${n}.jpg`);

/** Фото с выставки «Одно село — один продукт»: мастерица с национальными костюмами. */
export const HERO_PHOTO = MASTERCLASS_PHOTOS[4]; // masterclass-05.jpg

/** Уличный пункт сбора «Charity/Благотворительность» — для страницы Дармарки/эко. */
export const FLEA_MARKET_HERO_PHOTO = ECO_REUSE_PHOTOS[2]; // eco-reuse-03.jpg

/** Фото ручных изделий с мастер-класса — для страниц о бизнесе/предпринимательстве. */
export const HANDICRAFT_PHOTO = MASTERCLASS_PHOTOS[0]; // masterclass-01.jpg

export const ALL_REAL_PHOTOS = {
  charity: CHARITY_PHOTOS,
  consultations: CONSULTATION_PHOTOS,
  masterclasses: MASTERCLASS_PHOTOS,
  ecoReuse: ECO_REUSE_PHOTOS,
};
