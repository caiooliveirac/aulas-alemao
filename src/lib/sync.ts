import type { ProgressState } from "@/lib/progress";
import { defaultProgressState } from "@/lib/progress";
import { loadLocal, saveLocal } from "@/lib/storage";

const BASE = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_BASE_PATH || "")
  : "";

/**
 * Pull progress from **server**; merge with localStorage if server is empty.
 * Falls back to localStorage if offline.
 */
export async function pullProgress(): Promise<ProgressState> {
  const local = loadLocal<ProgressState>("progress", defaultProgressState);

  try {
    const res = await fetch(`${BASE}/api/progress`, {
      headers: { "x-client-id": "default" },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("fetch failed");

    const { state: remote } = (await res.json()) as { state: ProgressState };

    // If server has data, use it (server is source of truth)
    if (remote && remote.profile && remote.profile.xp > 0) {
      // Also save to localStorage as offline cache
      saveLocal("progress", remote);
      return remote;
    }

    // Server is empty but local has data → push local to server (first-time migration)
    if (local.profile.xp > 0 || local.srsCards.length > 0 || local.lessonRuns.length > 0) {
      await pushProgress(local);
      return local;
    }

    return defaultProgressState;
  } catch {
    // Offline fallback
    return local;
  }
}

/**
 * Push progress to server + localStorage.
 */
export async function pushProgress(state: ProgressState): Promise<void> {
  // Always save to localStorage as offline cache
  saveLocal("progress", state);

  try {
    await fetch(`${BASE}/api/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": "default",
      },
      body: JSON.stringify({ state }),
    });
  } catch {
    // Silently fail — localStorage has the data; will sync next time
    console.warn("[sync] Failed to push progress to server, saved locally.");
  }
}
