import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { LessonSchema, type Lesson, type LessonMeta } from "./schema";

let cachedLessons: Lesson[] | null = null;

async function readAllLessons(): Promise<Lesson[]> {
  if (cachedLessons) return cachedLessons;

  const lessonsDir = path.join(process.cwd(), "content", "lessons");
  const entries = await fs.readdir(lessonsDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => e.name);

  const lessons: Lesson[] = [];
  for (const fileName of files) {
    const filePath = path.join(lessonsDir, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(raw) as unknown;
    const parsed = LessonSchema.parse(json);
    lessons.push(parsed);
  }

  lessons.sort((a, b) => a.id.localeCompare(b.id));
  cachedLessons = lessons;
  return lessons;
}

export async function getLessonsMeta(): Promise<LessonMeta[]> {
  const lessons = await readAllLessons();
  return lessons.map(({ steps: _steps, ...meta }) => meta);
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const lessons = await readAllLessons();
  return lessons.find((l) => l.id === id) ?? null;
}

export function clearLessonCache() {
  cachedLessons = null;
}
