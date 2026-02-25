"use client";

import { useState } from "react";
import type { LessonStep } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "comprehension" }>;

export default function ComprehensionStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"]) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (picked === null) return;
    const ok = picked === step.correctIndex;
    const xp = ok ? step.xpCorrect ?? 20 : step.xpWrong ?? 6;
    onComplete(ok, xp, "comprehension");
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">❓</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Compreensão</div>
      </div>
      <div className="mt-2 text-base font-bold">{step.question}</div>

      <div className="mt-4 space-y-2">
        {step.options.map((opt, idx) => {
          const isCorrect = submitted && idx === step.correctIndex;
          const isWrong = submitted && picked === idx && idx !== step.correctIndex;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => (!submitted ? setPicked(idx) : null)}
              className={[
                "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                picked === idx ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] hover:border-[var(--border-strong)]",
                isCorrect ? "bg-[var(--success)]/10 border-[var(--success)]/30" : "",
                isWrong ? "opacity-50 line-through" : "",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <div className="mt-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/15 p-3 text-sm text-foreground/80">
          {step.explanation ?? ""}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button fullWidth onClick={submit} type="button" disabled={picked === null} variant="accent">
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
