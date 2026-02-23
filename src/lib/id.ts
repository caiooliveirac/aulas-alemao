export function randomId(prefix = "id") {
  // Good enough for v1 local-only. (Avoids extra dependency.)
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}
