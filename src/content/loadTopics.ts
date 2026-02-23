import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

export type TopicInfo = { icon: string };

let cachedTopics: Record<string, TopicInfo> | null = null;

export async function getTopics(): Promise<Record<string, TopicInfo>> {
  if (cachedTopics) return cachedTopics;
  const filePath = path.join(process.cwd(), "content", "topics.json");
  const raw = await fs.readFile(filePath, "utf8");
  cachedTopics = JSON.parse(raw) as Record<string, TopicInfo>;
  return cachedTopics;
}
