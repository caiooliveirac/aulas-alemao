"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lesson, LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { randomId } from "@/lib/id";
import {
  defaultProgressState,
  markActiveToday,
  markLessonCompleted,
  type ProgressState,
  type SrsCard,
} from "@/lib/progress";
import { scheduleFirstReview } from "@/lib/srs";
import { loadLocal, saveLocal } from "@/lib/storage";
import ReadingStep from "@/components/lesson-steps/ReadingStep";
import ComprehensionStep from "@/components/lesson-steps/ComprehensionStep";
import ClozeStep from "@/components/lesson-steps/ClozeStep";
import ReorderStep from "@/components/lesson-steps/ReorderStep";
import GuidedWriteStep from "@/components/lesson-steps/GuidedWriteStep";

type Props = { lesson: Lesson };

type StepResult = { ok: boolean; xp: number; kind: LessonStep["type"] };

function toSrsCard(seed: SrsCardSeed): SrsCard {
  return scheduleFirstReview({
    id: randomId("srs"),
    front: seed.front,
    back: seed.back,
    kind: seed.kind,
    tags: seed.tags,
  });
}

export default function LessonSession({ lesson }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [results, setResults] = useState<StepResult[]>([]);
  const [done, setDone] = useState(false);

  const progress = useMemo(() => ((stepIndex + 1) / lesson.steps.length) * 100, [stepIndex, lesson.steps.length]);

  const persist = (next: ProgressState) => {
    saveLocal("progress", next);
  };

  const addXP = (xp: number) => setSessionXP((p) => p + xp);

  const addSrsIfNeeded = (seed?: SrsCardSeed) => {
    if (!seed) return;
    const state = loadLocal<ProgressState>("progress", defaultProgressState);
    const already = state.srsCards.some((c) => c.front === seed.front && c.back === seed.back);
    if (already) return;
    const card = toSrsCard(seed);
    const next: ProgressState = { ...state, srsCards: [...state.srsCards, card] };
    persist(next);
  };

  const onStepComplete = (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => {
    addXP(xp);
    setResults((p) => [...p, { ok, xp, kind }]);
    addSrsIfNeeded(seed);
  };

  const next = () => {
    if (stepIndex < lesson.steps.length - 1) setStepIndex((i) => i + 1);
    else finish();
  };

  const finish = () => {
    const state = loadLocal<ProgressState>("progress", defaultProgressState);
    const nextState: ProgressState = {
      ...state,
      profile: markLessonCompleted(markActiveToday({ ...state.profile, xp: state.profile.xp + sessionXP }), lesson),
      lessonRuns: [...state.lessonRuns, { lessonId: lesson.id, finishedAt: Date.now(), earnedXP: sessionXP }],
    };
    persist(nextState);
    setDone(true);
  };

  const step = lesson.steps[stepIndex];

  if (done) {
    const correct = results.filter((r) => r.ok).length;
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
        <div className="text-sm opacity-70">Resumo</div>
        <div className="mt-1 text-base font-semibold">+{sessionXP} XP</div>
        <div className="mt-2 text-sm opacity-80">
          Acertos: {correct}/{results.length}
        </div>
        <div className="mt-4">
          <Link href="/">
            <Button fullWidth>Voltar ao dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
      <div className="flex items-center justify-between gap-2">
        <Chip>
          passo {stepIndex + 1}/{lesson.steps.length}
        </Chip>
        <div className="text-sm opacity-70">sess\u00e3o: {sessionXP} XP</div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div className="h-2 bg-foreground" style={{ width: `${Math.round(progress)}%` }} />
      </div>

      <div className="mt-4">
        <StepRenderer step={step} onComplete={onStepComplete} onNext={next} />
      </div>
    </div>
  );
}

function StepRenderer({
  step,
  onComplete,
  onNext,
}: {
  step: LessonStep;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => void;
  onNext: () => void;
}) {
  switch (step.type) {
    case "reading":
      return <ReadingStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "comprehension":
      return <ComprehensionStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "cloze":
      return <ClozeStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "reorder":
      return <ReorderStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "guided_write":
      return <GuidedWriteStep step={step} onNext={onNext} onComplete={onComplete} />;
    default:
      return null;
  }
}
