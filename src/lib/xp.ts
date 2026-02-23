export type LevelInfo = { name: string; xpNeeded: number; badge: string };

export const LEVELS: LevelInfo[] = [
  { name: "Anfänger", xpNeeded: 0, badge: "🌱" },
  { name: "Lerner", xpNeeded: 200, badge: "📖" },
  { name: "Entdecker", xpNeeded: 500, badge: "🧭" },
  { name: "Sprecher", xpNeeded: 1000, badge: "🗣️" },
  { name: "Kenner", xpNeeded: 2000, badge: "🎯" },
  { name: "Meister", xpNeeded: 3500, badge: "⭐" },
  { name: "Experte", xpNeeded: 5000, badge: "🏆" },
  { name: "Brückenbauer", xpNeeded: 8000, badge: "🌉" },
];

export function getLevel(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpNeeded) current = lvl;
  }
  return current;
}

export function getNextLevel(xp: number): LevelInfo | null {
  for (const lvl of LEVELS) {
    if (xp < lvl.xpNeeded) return lvl;
  }
  return null;
}
