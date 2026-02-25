"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LessonMeta } from "@/content/schema";
import type { TopicInfo } from "@/content/loadTopics";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { defaultProgressState, type ProgressState } from "@/lib/progress";
import { loadLocal } from "@/lib/storage";
import { pullProgress } from "@/lib/sync";
import { getLevel, getNextLevel } from "@/lib/xp";
import { getDueCards } from "@/lib/srs";

type Props = {
  lessons: LessonMeta[];
  topics: Record<string, TopicInfo>;
};

export default function DashboardClient({ lessons, topics }: Props) {
  // Load from localStorage immediately, then hydrate from server
  const [state, setState] = useState<ProgressState>(() => loadLocal<ProgressState>("progress", defaultProgressState));

  useEffect(() => {
    pullProgress().then((s) => setState(s));
  }, []);

  const dueCount = useMemo(() => getDueCards(state.srsCards).length, [state.srsCards]);
  const level = useMemo(() => getLevel(state.profile.xp), [state.profile.xp]);
  const nextLevel = useMemo(() => getNextLevel(state.profile.xp), [state.profile.xp]);

  const completed = useMemo(() => new Set(state.profile.completedLessons), [state.profile.completedLessons]);

  const xpForNext = nextLevel ? Math.max(0, nextLevel.xpNeeded - state.profile.xp) : 0;
  const xpProgress = nextLevel
    ? ((state.profile.xp - (nextLevel.xpNeeded - 100)) / 100) * 100
    : 100;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Hero header */}
      <header className="mb-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="gradient-text">DeutschBrücke</span>
            </h1>
            <p className="mt-1 text-sm text-foreground/50">
              B1 → B2 · microtarefas · feedback imediato
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-2xl">
            🌉
          </div>
        </div>
      </header>

      {/* Stats card */}
      <section className="glass-card mb-6 p-5 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">Nível</p>
            <p className="mt-1 text-lg font-bold">
              {level.badge} {level.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">XP total</p>
            <p className="mt-1 text-lg font-bold gradient-text">{state.profile.xp}</p>
          </div>
        </div>

        {/* XP progress */}
        {nextLevel ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-foreground/50 mb-1.5">
              <span>Próximo: {nextLevel.badge} {nextLevel.name}</span>
              <span>{xpForNext} XP restantes</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
              <div
                className="progress-bar h-full"
                style={{ width: `${Math.min(100, Math.max(5, xpProgress))}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Quick stats */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--warning)]/10 text-sm">🔥</span>
            <div>
              <span className="font-semibold">{state.profile.streak}</span>
              <span className="text-foreground/50 ml-1 text-xs">streak</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-sm">🧠</span>
            <div>
              <span className="font-semibold">{dueCount}</span>
              <span className="text-foreground/50 ml-1 text-xs">revisão</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link href="/review">
            <Button fullWidth variant={dueCount > 0 ? "accent" : "secondary"}>
              {dueCount > 0 ? `Revisar ${dueCount} ${dueCount === 1 ? "item" : "itens"}` : "Revisão em dia ✓"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Lessons section */}
      <section>
        <div className="mb-4 flex items-baseline justify-between animate-fade-up" style={{ animationDelay: "120ms" }}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/40">Lições</h2>
          <span className="text-xs text-foreground/30">{lessons.length} disponíveis</span>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const isDone = completed.has(lesson.id);
            const icon = topics[lesson.topic]?.icon ?? "📘";
            return (
              <div
                key={lesson.id}
                className="glass-card p-5 animate-fade-up"
                style={{ animationDelay: `${150 + i * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <h3 className="text-base font-bold leading-tight">{lesson.title}</h3>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-foreground/50">
                      <Chip variant="accent">{lesson.level}</Chip>
                      <span>{lesson.estimatedMinutes} min</span>
                      <span>·</span>
                      <span className="font-medium text-[var(--accent)]">{lesson.xpReward} XP</span>
                    </div>
                  </div>
                  {isDone ? (
                    <Chip variant="success">✓ concluída</Chip>
                  ) : (
                    <Chip>nova</Chip>
                  )}
                </div>

                <p className="mt-3 text-sm text-foreground/60">🎯 {lesson.grammarFocus}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {lesson.skillTags.slice(0, 4).map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>

                <div className="mt-4">
                  <Link href={`/lesson/${lesson.id}`}>
                    <Button fullWidth variant={isDone ? "secondary" : "accent"}>
                      {isDone ? "Refazer lição" : "Começar"}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-foreground/25 animate-fade-up" style={{ animationDelay: "500ms" }}>
        DeutschBrücke · microtarefas + SRS
      </footer>
    </div>
  );
}
