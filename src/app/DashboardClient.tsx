"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LessonMeta } from "@/content/schema";
import type { TopicInfo } from "@/content/loadTopics";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { defaultProgressState, type ProgressState } from "@/lib/progress";
import { loadLocal } from "@/lib/storage";
import { getLevel, getNextLevel } from "@/lib/xp";
import { getDueCards } from "@/lib/srs";

type Props = {
  lessons: LessonMeta[];
  topics: Record<string, TopicInfo>;
};

export default function DashboardClient({ lessons, topics }: Props) {
  const [state] = useState<ProgressState>(() => loadLocal<ProgressState>("progress", defaultProgressState));

  const dueCount = useMemo(() => getDueCards(state.srsCards).length, [state.srsCards]);
  const level = useMemo(() => getLevel(state.profile.xp), [state.profile.xp]);
  const nextLevel = useMemo(() => getNextLevel(state.profile.xp), [state.profile.xp]);

  const completed = useMemo(() => new Set(state.profile.completedLessons), [state.profile.completedLessons]);

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">DeutschBrücke</div>
            <div className="text-sm opacity-70">B1 → B2 · microtarefas · feedback imediato</div>
          </div>
          <div className="text-2xl">🌉</div>
        </div>
      </header>

      <section className="mb-5 rounded-xl border border-black/10 dark:border-white/15 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm opacity-70">Nível</div>
            <div className="text-base font-semibold">
              {level.badge} {level.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-70">XP</div>
            <div className="text-base font-semibold">{state.profile.xp}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm opacity-80">
          <div>🔥 streak: {state.profile.streak}</div>
          <div>🧠 revisão pendente: {dueCount}</div>
        </div>
        {nextLevel ? (
          <div className="mt-3 text-xs opacity-70">
            Próximo: {nextLevel.badge} {nextLevel.name} em {Math.max(0, nextLevel.xpNeeded - state.profile.xp)} XP
          </div>
        ) : null}
        <div className="mt-3 flex gap-2">
          <Link href="/review" className="flex-1">
            <Button fullWidth variant={dueCount > 0 ? "primary" : "secondary"}>
              Revisar (SRS)
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold opacity-80">Lições</h2>
          <div className="text-xs opacity-60">data-driven (JSON + schema)</div>
        </div>

        {lessons.map((lesson) => {
          const isDone = completed.has(lesson.id);
          const icon = topics[lesson.topic]?.icon ?? "📘";
          return (
            <div key={lesson.id} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">
                    {icon} {lesson.title}
                  </div>
                  <div className="mt-1 text-xs opacity-70">
                    {lesson.level} · {lesson.estimatedMinutes} min · {lesson.xpReward} XP
                  </div>
                </div>
                {isDone ? <Chip className="text-xs">concluída</Chip> : <Chip className="text-xs">nova</Chip>}
              </div>

              <div className="mt-2 text-sm opacity-80">🎯 {lesson.grammarFocus}</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {lesson.skillTags.slice(0, 4).map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <div className="mt-4">
                <Link href={`/lesson/${lesson.id}`}>
                  <Button fullWidth>{isDone ? "Refazer lição" : "Começar"}</Button>
                </Link>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
