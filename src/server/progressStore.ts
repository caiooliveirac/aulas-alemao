import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { defaultProgressState, type ProgressState } from "@/lib/progress";

function sanitizeClientId(clientId: string) {
  return clientId.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 64) || "default";
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

function dataDir() {
  return process.env.DB_DATA_DIR || path.join(process.cwd(), "data");
}

function progressFile(clientId: string) {
  const dir = path.join(dataDir(), "progress");
  const safe = sanitizeClientId(clientId);
  return { dir, filePath: path.join(dir, `${safe}.json`) };
}

export async function readProgress(clientId: string): Promise<ProgressState> {
  const { dir, filePath } = progressFile(clientId);
  await ensureDir(dir);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(raw) as ProgressState;
    return { ...defaultProgressState, ...json };
  } catch {
    return defaultProgressState;
  }
}

export async function writeProgress(clientId: string, state: ProgressState): Promise<void> {
  const { dir, filePath } = progressFile(clientId);
  await ensureDir(dir);
  await fs.writeFile(filePath, JSON.stringify(state, null, 2), "utf8");
}
