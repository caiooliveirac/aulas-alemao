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
      <div className="flex items-center gap-2">
        <span className="text-lg">🔀</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Reordenação</div>
      </div>
      <div className="mt-2 text-sm text-foreground/60">{step.instruction}</div>
      {step.hint ? <div className="mt-2"><Chip>{step.hint}</Chip></div> : null}

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <div className="text-xs text-foreground/40">Sua frase</div>
        <div className="mt-1 min-h-10 text-base">{answer || "…"}</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {remaining.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => place(w)}
            disabled={submitted}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] transition-all"
          >
            {w}
          </button>
        ))}
      </div>

      {submitted ? (
        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: isOk ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
          <div className="font-bold">{isOk ? "✅ Correto" : "❌ Correto seria"}</div>
          {!isOk ? <div className="mt-2 text-foreground/70">{step.correct}</div> : null}
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
            <Button fullWidth onClick={submit} type="button" disabled={picked.length === 0} variant="accent">
              Checar
            </Button>
          </>
        ) : (
          <Button fullWidth onClick={onNext} type="button" variant="accent">
            Próximo
          </Button>
        )}
      </div>
    </div>
  );
}
