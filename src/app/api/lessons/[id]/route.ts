import { NextResponse } from "next/server";
import { getLessonById } from "@/content/loadLessons";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLessonById(id);
  if (!lesson) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ lesson }, { headers: { "Cache-Control": "no-store" } });
}
