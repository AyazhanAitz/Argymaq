export const CONTACTS = {
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+7 777 113 67 14",
  phoneHref: `tel:${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "77771136714").replace(/\D/g, "")}`,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "77771136714",
  get whatsappHref() {
    return `https://wa.me/${this.whatsappNumber}`;
  },
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/analardy_qoldau_ortalygy",
  instagramHandle: "@analardy_qoldau_ortalygy",
  // TODO: требуется от заказчика — официальные ссылки
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  threads: process.env.NEXT_PUBLIC_THREADS_URL || "",
  addressRu: "г. Алматы, ул. Толе би, 23А (угол ул. Зенкова), цокольный этаж, подъезд 3, каб. Ц-01",
  addressKz: "Алматы қ., Төле би көш., 23А (Зенков көшесінің бұрышы), цоколь қабат, 3-ші кіреберіс, Ц-01 каб.",
} as const;
