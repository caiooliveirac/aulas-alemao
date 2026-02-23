"use client";

import { useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

type Step = Extract<LessonStep, { type: "reorder" }>;

export default function ReorderStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const remaining = useMemo(() => step.words.filter((w) => !picked.includes(w)), [step.words, picked]);
  const answer = picked.join(" ").trim();
  const isOk = submitted ? answer === step.correct : false;

  const place = (w: string) => {
    if (submitted) return;
    setPicked((p) => [...p, w]);
  };

  const removeLast = () => {
    if (submitted) return;
    setPicked((p) => p.slice(0, -1));
  };

  const reset = () => {
    if (submitted) return;
    setPicked([]);
  };

  const submit = () => {
    if (picked.length === 0) return;
    const ok = answer === step.correct;
    const xp = ok ? step.xpCorrect ?? 25 : step.xpWrong ?? 8;
    onComplete(ok, xp, "reorder", step.srs);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="text-sm opacity-70">Reordenação</div>
      <div className="mt-2 text-sm opacity-80">{step.instruction}</div>
      {step.hint ? <div className="mt-2"><Chip>{step.hint}</Chip></div> : null}

      <div className="mt-4 rounded-lg border border-black/10 dark:border-white/15 p-3">
        <div className="text-xs opacity-60">Sua frase</div>
        <div className="mt-1 min-h-10 text-base">{answer || "…"}</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {remaining.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => place(w)}
            disabled={submitted}
            className="rounded-lg border border-black/10 dark:border-white/15 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            {w}
          </button>
        ))}
      </div>

      {submitted ? (
        <div className="mt-4 rounded-lg border border-black/10 dark:border-white/15 p-3 text-sm">
          <div className="font-semibold">{isOk ? "✅ Correto" : "❌ Correto seria"}</div>
          {!isOk ? <div className="mt-2 opacity-80">{step.correct}</div> : null}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <>
            <Button variant="secondary" onClick={removeLast} type="button" disabled={picked.length === 0}>
              Desfazer
            </Button>
            <Button variant="secondary" onClick={reset} type="button" disabled={picked.length === 0}>
              Reset
            </Button>
            <Button fullWidth onClick={submit} type="button" disabled={picked.length === 0}>
              Checar
            </Button>
          </>
        ) : (
          <Button fullWidth onClick={onNext} type="button">
            Próximo
          </Button>
        )}
      </div>
    </div>
  );
}
