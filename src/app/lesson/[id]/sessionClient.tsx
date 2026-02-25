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
import { pushProgress } from "@/lib/sync";
import ReadingStep from "@/components/lesson-steps/ReadingStep";
import ComprehensionStep from "@/components/lesson-steps/ComprehensionStep";
import ClozeStep from "@/components/lesson-steps/ClozeStep";
import ReorderStep from "@/components/lesson-steps/ReorderStep";
import GuidedWriteStep from "@/components/lesson-steps/GuidedWriteStep";
import GrammarNoteStep from "@/components/lesson-steps/GrammarNoteStep";
import MatchPairsStep from "@/components/lesson-steps/MatchPairsStep";
import TranslateStep from "@/components/lesson-steps/TranslateStep";
import ErrorCorrectionStep from "@/components/lesson-steps/ErrorCorrectionStep";
import DialogueChoiceStep from "@/components/lesson-steps/DialogueChoiceStep";
import VocabRecallStep from "@/components/lesson-steps/VocabRecallStep";
import MultiClozeStep from "@/components/lesson-steps/MultiClozeStep";

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
    pushProgress(next);
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
    const pct = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;
    return (
      <div className="glass-card p-6 text-center animate-fade-up">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--success)]/10 text-3xl">
          {pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}
        </div>
        <h2 className="text-lg font-bold">Lição concluída!</h2>
        <p className="mt-1 text-3xl font-extrabold gradient-text">+{sessionXP} XP</p>
        <p className="mt-2 text-sm text-foreground/50">
          Acertos: {correct}/{results.length} ({pct}%)
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--error)",
            }}
          />
        </div>
        <div className="mt-5">
          <Link href="/">
            <Button fullWidth variant="accent">Voltar ao dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-fade-up">
      <div className="flex items-center justify-between gap-2">
        <Chip variant="accent">
          passo {stepIndex + 1}/{lesson.steps.length}
        </Chip>
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <span className="text-[var(--accent)]">{sessionXP}</span>
          <span className="text-foreground/40">XP</span>
        </div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div className="progress-bar h-full" style={{ width: `${Math.round(progress)}%` }} />
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
    case "grammar_note":
      return <GrammarNoteStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "match_pairs":
      return <MatchPairsStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "translate":
      return <TranslateStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "error_correction":
      return <ErrorCorrectionStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "dialogue_choice":
      return <DialogueChoiceStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "vocab_recall":
      return <VocabRecallStep step={step} onNext={onNext} onComplete={onComplete} />;
    case "multi_cloze":
      return <MultiClozeStep step={step} onNext={onNext} onComplete={onComplete} />;
    default:
      return null;
  }
}
