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
      <div className="text-sm opacity-70">Compreensão</div>
      <div className="mt-2 text-base font-semibold">{step.question}</div>

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
                "w-full rounded-lg border px-3 py-2 text-left text-sm",
                picked === idx ? "border-foreground" : "border-black/10 dark:border-white/15",
                isCorrect ? "bg-black/5 dark:bg-white/10" : "",
                isWrong ? "opacity-60" : "",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <div className="mt-4 rounded-lg border border-black/10 dark:border-white/15 p-3 text-sm opacity-80">
          {step.explanation ?? ""}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button fullWidth onClick={submit} type="button" disabled={picked === null}>
            Confirmar
          </Button>
        ) : (
          <Button fullWidth onClick={onNext} type="button">
            Próximo
          </Button>
        )}
      </div>
    </div>
  );
}
