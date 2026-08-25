import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * Приватное хранилище загруженных документов (обращения "Получить помощь").
 *
 * ВАЖНО (п.38 ТЗ): документы женщин никогда не должны быть доступны публично.
 * Поэтому файлы сохраняются ВНЕ каталога /public и раздаются только через
 * защищённый маршрут /api/admin/documents/[...path], который проверяет
 * админ-сессию перед отдачей файла.
 *
 * TODO (продакшн): для реального деплоя рекомендуется заменить локальное
 * файловое хранилище на защищённое объектное хранилище (S3-совместимое,
 * приватный бакет + подписанные ссылки с ограниченным сроком действия).
 */
const PRIVATE_STORAGE_ROOT = path.join(process.cwd(), "storage", "applications");

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".heic", ".doc", ".docx"];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 МБ

export async function saveApplicationDocuments(files: File[]): Promise<string[]> {
  const savedPaths: string[] = [];
  const applicationDir = randomUUID();
  const targetDir = path.join(PRIVATE_STORAGE_ROOT, applicationDir);

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (file.size > MAX_FILE_SIZE) continue;

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

    await mkdir(targetDir, { recursive: true });
    const safeName = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(targetDir, safeName), buffer);
    savedPaths.push(path.join(applicationDir, safeName));
  }

  return savedPaths;
}

const PUBLIC_UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 МБ

/**
 * Публичное хранилище медиафайлов (обложки новостей/проектов/сборов,
 * фотогалерея). В отличие от документов обращений, эти файлы
 * предназначены для публичного показа на сайте.
 */
export async function savePublicImage(file: File, category: string): Promise<string | null> {
  if (!file || file.size === 0 || file.size > MAX_IMAGE_SIZE) return null;
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) return null;

  const dir = path.join(PUBLIC_UPLOADS_ROOT, category);
  await mkdir(dir, { recursive: true });
  const fileName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileName), buffer);
  return `/uploads/${category}/${fileName}`;
}

export function resolvePrivateDocumentPath(relativePath: string): string {
  const resolved = path.normalize(path.join(PRIVATE_STORAGE_ROOT, relativePath));
  if (!resolved.startsWith(PRIVATE_STORAGE_ROOT)) {
    throw new Error("Недопустимый путь к документу");
  }
  return resolved;
}
