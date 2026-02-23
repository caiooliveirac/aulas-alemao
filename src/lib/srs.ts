import type { SrsCard } from "./progress";

const MINUTE = 60_000;

// v1: simple intervals that feel responsive in early usage.
const INTERVALS_MINUTES = [1, 5, 20, 12 * 60, 2 * 24 * 60, 5 * 24 * 60];

export function isDue(card: SrsCard, now = Date.now()) {
  return card.dueAt <= now;
}

export function getDueCards(cards: SrsCard[], now = Date.now()) {
  return cards.filter((c) => isDue(c, now)).sort((a, b) => a.dueAt - b.dueAt);
}

export function scheduleFirstReview(card: Omit<SrsCard, "dueAt" | "intervalMinutes" | "reviewCount" | "lastCorrect">, now = Date.now()): SrsCard {
  return {
    ...card,
    intervalMinutes: INTERVALS_MINUTES[0],
    dueAt: now,
    reviewCount: 0,
    lastCorrect: null,
  };
}

export function scheduleNext(card: SrsCard, correct: boolean, now = Date.now()): SrsCard {
  const nextCount = correct ? card.reviewCount + 1 : Math.max(0, card.reviewCount - 1);
  const idx = Math.min(nextCount, INTERVALS_MINUTES.length - 1);
  const minutes = correct ? INTERVALS_MINUTES[idx] : INTERVALS_MINUTES[0];
  return {
    ...card,
    reviewCount: nextCount,
    intervalMinutes: minutes,
    dueAt: now + minutes * MINUTE,
    lastCorrect: correct,
  };
}
