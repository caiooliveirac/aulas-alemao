"use client";

import { useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "translate" }>;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"""„''()\[\]{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function TranslateStep({
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

  const isCorrect = useMemo(() => {
    if (!submitted) return false;
    const input = normalize(text);
    return step.acceptedAnswers.some((a) => normalize(a) === input);
  }, [submitted, text, step.acceptedAnswers]);

  const dirLabel = step.direction === "pt_to_de" ? "PT → DE" : "DE → PT";
  const langHint =
    step.direction === "pt_to_de" ? "Escreva em alemão" : "Escreva em português";

  const submit = () => {
    if (text.trim().length < 2) return;
    const input = normalize(text);
    const ok = step.acceptedAnswers.some((a) => normalize(a) === input);
    const xp = ok ? step.xpCorrect ?? 25 : step.xpWrong ?? 6;
    onComplete(ok, xp, "translate", step.srs);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">🔄</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Tradução ({dirLabel})</div>
      </div>
      <div className="mt-2 text-sm text-foreground/60">{step.instruction}</div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="text-xs text-foreground/40 uppercase tracking-wider mb-1">
          {step.direction === "pt_to_de" ? "Português" : "Deutsch"}
        </div>
        <div className="text-base font-bold">{step.source}</div>
      </div>

      {step.hint && !submitted ? (
        <div className="mt-2 text-xs text-foreground/40">💡 {step.hint}</div>
      ) : null}

      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          className="min-h-20 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 outline-none transition-all"
          placeholder={langHint + "…"}
        />
      </div>

      {submitted ? (
        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
          <div className="font-bold">{isCorrect ? "✅ Correto!" : "❌ Não exatamente"}</div>
          <div className="mt-2 text-foreground/70">
            <span className="text-xs text-foreground/40">Respostas aceitas: </span>
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
            disabled={text.trim().length < 2}
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
