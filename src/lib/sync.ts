import type { ProgressState } from "@/lib/progress";
import { defaultProgressState } from "@/lib/progress";
import { loadLocal, saveLocal } from "@/lib/storage";

const BASE = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_BASE_PATH || "")
  : "";

/**
 * Pull progress from server (identified by auth cookie).
 * Falls back to localStorage if offline.
 */
export async function pullProgress(): Promise<ProgressState> {
  const local = loadLocal<ProgressState>("progress", defaultProgressState);

  try {
    const res = await fetch(`${BASE}/api/progress`, {
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!res.ok) throw new Error("fetch failed");

    const { state: remote } = (await res.json()) as { state: ProgressState };

    // Server has data → use it (server is source of truth)
    if (remote && remote.profile && remote.profile.xp > 0) {
      saveLocal("progress", remote);
      return remote;
    }

    // Server empty but local has data → migrate local to server
    if (local.profile.xp > 0 || local.srsCards.length > 0 || local.lessonRuns.length > 0) {
      await pushProgress(local);
      return local;
    }

    return defaultProgressState;
  } catch {
    return local;
  }
}

/**
 * Push progress to server + localStorage.
 * User identity comes from the auth cookie (sent automatically).
 */
export async function pushProgress(state: ProgressState): Promise<void> {
  saveLocal("progress", state);

  try {
    await fetch(`${BASE}/api/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ state }),
    });
  } catch {
    console.warn("[sync] Failed to push progress to server, saved locally.");
  }
}
