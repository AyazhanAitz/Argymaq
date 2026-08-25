import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { resolvePrivateDocumentPath } from "@/lib/storage";

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".heic": "image/heic",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/**
 * Единственная точка доступа к документам, прикреплённым к обращениям
 * "Получить помощь". Доступ строго только для аутентифицированных
 * администраторов (п.38 ТЗ — запрет публичного доступа к документам женщин).
 */
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const relativePath = params.path.join("/");
    const filePath = resolvePrivateDocumentPath(relativePath);
    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
        "Content-Disposition": `inline; filename="${path.basename(filePath)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
