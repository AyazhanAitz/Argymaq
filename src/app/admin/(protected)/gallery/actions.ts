"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { savePublicImage } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  category: z.enum(["PROJECTS", "MOTHERS", "CHILDREN", "VOLUNTEERS", "EVENTS", "FLEA_MARKET", "ECO"]),
  captionRu: z.string().optional(),
  captionKz: z.string().optional(),
});

export async function uploadGalleryImages(formData: FormData) {
  await requireAdmin();
  const { category, captionRu, captionKz } = schema.parse({
    category: formData.get("category"),
    captionRu: formData.get("captionRu")?.toString() || undefined,
    captionKz: formData.get("captionKz")?.toString() || undefined,
  });

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    const url = await savePublicImage(file, "gallery");
    if (url) {
      await prisma.galleryImage.create({ data: { url, category, captionRu, captionKz } });
    }
  }
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
}
