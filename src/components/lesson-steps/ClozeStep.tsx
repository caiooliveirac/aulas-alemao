"use client";

import { useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "cloze" }>;

function renderSentence(sentence: string) {
  const parts = sentence.split("{___}");
  if (parts.length === 1) return <span>{sentence}</span>;
  return (
    <>
      {parts[0]}
      <span className="mx-1 inline-block min-w-10 rounded-md border border-dashed border-[var(--accent)]/30 bg-[var(--accent)]/5 px-2 py-0.5 text-center">
        ___
      </span>
      {parts.slice(1).join("{___}")}
    </>
  );
}

export default function ClozeStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const ok = useMemo(() => (submitted && picked ? picked === step.correct : false), [submitted, picked, step.correct]);

  const submit = () => {
    if (!picked) return;
    const isOk = picked === step.correct;
    const xp = isOk ? step.xpCorrect ?? 20 : step.xpWrong ?? 6;
    onComplete(isOk, xp, "cloze", step.srs);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">✒</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Cloze</div>
      </div>
      <div className="mt-2 text-sm text-foreground/60">{step.instruction}</div>

      <div className="mt-3 text-base leading-7">{renderSentence(step.sentence)}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {step.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={submitted}
            onClick={() => setPicked(opt)}
            className={[
              "rounded-xl border px-3 py-2 text-sm transition-all",
              picked === opt ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] hover:border-[var(--border-strong)]",
            ].join(" ")}
          >
            {opt}
          </button>
        ))}
      </div>

      {submitted ? (
        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: ok ? 'var(--success-bg, rgba(16,185,129,0.08))' : 'var(--error-bg, rgba(239,68,68,0.08))' }}>
          <div className="font-bold">{ok ? "✅ Correto" : "❌ Quase"}</div>
          {step.explanation ? <div className="mt-2 text-foreground/70">{step.explanation}</div> : null}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button fullWidth onClick={submit} type="button" disabled={!picked} variant="accent">
            Confirmar
          </Button>
        ) : (
          <Button fullWidth onClick={onNext} type="button" variant="accent">
            Próximo
          </Button>
        )}
      </div>
    </div>
  );
}
