"use client";

import { useState } from "react";
import type { LessonStep } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "dialogue_choice" }>;

export default function DialogueChoiceStep({
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

  const isCorrect = submitted && picked === step.correctIndex;

  const submit = () => {
    if (picked === null) return;
    const ok = picked === step.correctIndex;
    const xp = ok ? step.xpCorrect ?? 20 : step.xpWrong ?? 6;
    onComplete(ok, xp, "dialogue_choice");
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">💬</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Diálogo</div>
      </div>
      <div className="mt-2 text-xs text-foreground/40">{step.context}</div>

      <div className="mt-4 space-y-2">
        {step.lines.map((line, i) => (
          <div
            key={i}
            className={[
              "rounded-xl p-3",
              i % 2 === 0
                ? "bg-[var(--surface)] border border-[var(--border)] ml-0 mr-8"
                : "bg-[var(--accent)]/5 border border-[var(--accent)]/10 ml-8 mr-0",
            ].join(" ")}
          >
            <div className="text-xs font-semibold text-foreground/40 mb-1">
              {line.speaker}
            </div>
            <div className="text-sm">{line.text}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border-2 border-dashed border-[var(--accent)]/20 p-3">
        <div className="text-xs font-bold text-[var(--accent)] mb-2">
          {step.choicePrompt}
        </div>
        <div className="space-y-2">
          {step.options.map((opt, idx) => {
            const isRight = submitted && idx === step.correctIndex;
            const isWrong = submitted && picked === idx && idx !== step.correctIndex;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => (!submitted ? setPicked(idx) : null)}
                className={[
                  "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                  picked === idx && !submitted
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]",
                  isRight
                    ? "bg-[var(--success)]/10 border-[var(--success)]/30"
                    : "",
                  isWrong ? "opacity-50 line-through" : "",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {submitted ? (
        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
          <div className="font-bold">
            {isCorrect ? "✅ Boa escolha!" : "❌ Não era a melhor resposta"}
          </div>
          {step.explanation ? (
            <div className="mt-2 text-foreground/70">{step.explanation}</div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button
            fullWidth
            onClick={submit}
            type="button"
            disabled={picked === null}
            variant="accent"
          >
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
