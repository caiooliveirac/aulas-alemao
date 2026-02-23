import type { LessonMeta, SrsCardSeed } from "@/content/schema";

export type ISODate = string; // YYYY-MM-DD

export type Profile = {
  xp: number;
  streak: number;
  lastActive: ISODate | null;
  completedLessons: string[];
};

export type LessonRun = {
  lessonId: string;
  finishedAt: number;
  earnedXP: number;
};

export type SrsCard = {
  id: string;
  front: string;
  back: string;
  kind: SrsCardSeed["kind"];
  tags?: string[];

  dueAt: number;
  intervalMinutes: number;
  reviewCount: number;
  lastCorrect: boolean | null;
};

export type ProgressState = {
  profile: Profile;
  lessonRuns: LessonRun[];
  srsCards: SrsCard[];
  // Prepared for backend sync v2:
  lastSyncedAt?: number;
  clientId?: string;
};

export const defaultProgressState: ProgressState = {
  profile: { xp: 0, streak: 0, lastActive: null, completedLessons: [] },
  lessonRuns: [],
  srsCards: [],
};

export function todayISO(now = new Date()): ISODate {
  return now.toISOString().slice(0, 10);
}

export function yesterdayISO(now = new Date()): ISODate {
  return new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
}

export function applyDailyStreak(profile: Profile, now = new Date()): Profile {
  const today = todayISO(now);
  const yesterday = yesterdayISO(now);
  if (!profile.lastActive) return profile;
  if (profile.lastActive === today) return profile;
  if (profile.lastActive === yesterday) return profile;
  return { ...profile, streak: 0 };
}

export function markActiveToday(profile: Profile, now = new Date()): Profile {
  const today = todayISO(now);
  const wasActiveToday = profile.lastActive === today;
  return {
    ...profile,
    lastActive: today,
    streak: wasActiveToday ? profile.streak : profile.streak + 1,
  };
}

export function markLessonCompleted(profile: Profile, lesson: LessonMeta): Profile {
  const completed = new Set(profile.completedLessons);
  completed.add(lesson.id);
  return { ...profile, completedLessons: [...completed] };
}
