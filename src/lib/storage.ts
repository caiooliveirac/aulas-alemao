const PREFIX = "db";

export function storageKey(key: string) {
  return `${PREFIX}:${key}:v1`;
}

export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  return safeJsonParse(window.localStorage.getItem(storageKey(key)), fallback);
}

export function saveLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(key), JSON.stringify(value));
}
