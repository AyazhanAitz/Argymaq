import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Field, Input, Select, FormActions, SubmitBtn } from "@/components/admin/fields";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { uploadGalleryImages, deleteGalleryImage } from "./actions";

export const metadata = { title: "Галерея — Админ-панель" };

const categories: [string, string][] = [
  ["PROJECTS", "Проекты"], ["MOTHERS", "Мамы"], ["CHILDREN", "Дети"],
  ["VOLUNTEERS", "Волонтёры"], ["EVENTS", "Мероприятия"], ["FLEA_MARKET", "Дармарки"], ["ECO", "Экоакции"],
];

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-graphite-800">Фотогалерея</h1>

      <div className="mb-8 max-w-xl rounded-xl2 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-bold text-graphite-800">Загрузить фотографии</h2>
        <form action={uploadGalleryImages} className="space-y-4" encType="multipart/form-data">
          <Field label="Категория" required>
            <Select name="category" required defaultValue="PROJECTS">
              {categories.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </Field>
          <Field label="Подпись (RU)"><Input name="captionRu" /></Field>
          <Field label="Подпись (KZ)"><Input name="captionKz" /></Field>
          <Field label="Файлы" required hint="можно выбрать несколько">
            <input type="file" name="images" accept="image/*" multiple required className="block text-sm" />
          </Field>
          <FormActions><SubmitBtn label="Загрузить" /></FormActions>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {images.map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-xl">
            <Image src={img.url} alt={img.captionRu || ""} width={200} height={200} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-graphite-900/60 p-1.5">
              <span className="truncate text-[10px] text-white">{img.category}</span>
              <DeleteButton action={deleteGalleryImage.bind(null, img.id)} />
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="col-span-full text-graphite-400">Пока нет загруженных фотографий.</p>}
      </div>
    </div>
  );
}
