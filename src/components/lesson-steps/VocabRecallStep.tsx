"use client";

import { useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "vocab_recall" }>;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"""„''()\[\]{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function VocabRecallStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => void;
}) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = useMemo(() => {
    if (!submitted) return false;
    const input = normalize(text);
    return step.acceptedAnswers.some((a) => normalize(a) === input);
  }, [submitted, text, step.acceptedAnswers]);

  const dirLabel = step.direction === "pt_to_de" ? "PT → DE" : "DE → PT";

  const submit = () => {
    if (text.trim().length === 0) return;
    const input = normalize(text);
    const ok = step.acceptedAnswers.some((a) => normalize(a) === input);
    const xp = ok ? step.xpCorrect ?? 20 : step.xpWrong ?? 4;
    onComplete(ok, xp, "vocab_recall", step.srs);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">🧠</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Recall ({dirLabel})</div>
      </div>
      <div className="mt-2 text-sm text-foreground/60">{step.instruction}</div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
        <div className="text-xl font-bold">{step.prompt}</div>
      </div>

      {step.hint && !submitted ? (
        <div className="mt-2 text-center">
          {showHint ? (
            <div className="text-xs text-foreground/40">💡 {step.hint}</div>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs text-[var(--accent)]/60 hover:text-[var(--accent)] underline"
            >
              Precisa de uma dica?
            </button>
          )}
        </div>
      ) : null}

      <div className="mt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim().length > 0) submit();
          }}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm text-center focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 outline-none transition-all"
          placeholder={
            step.direction === "pt_to_de"
              ? "Digite em alemão…"
              : "Digite em português…"
          }
          autoFocus
        />
      </div>

      {submitted ? (
        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
          <div className="font-bold">
            {isCorrect ? "✅ Exato!" : "❌ Não era isso"}
          </div>
          <div className="mt-2 text-foreground/70">
            <span className="text-xs text-foreground/40">Aceito: </span>
            {step.acceptedAnswers.join(" / ")}
          </div>
          {step.explanation ? (
            <div className="mt-2 text-foreground/60">{step.explanation}</div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button
            fullWidth
            onClick={submit}
            type="button"
            disabled={text.trim().length === 0}
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
