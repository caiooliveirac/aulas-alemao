import { NextResponse } from "next/server";
import { getLessonsMeta } from "@/content/loadLessons";

export async function GET() {
  const lessons = await getLessonsMeta();
  return NextResponse.json({ lessons }, { headers: { "Cache-Control": "no-store" } });
}
