"use client";

import { useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "error_correction" }>;

export default function ErrorCorrectionStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => void;
}) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [correction, setCorrection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const words = useMemo(() => step.sentence.split(/(\s+)/), [step.sentence]);

  const isCorrect = useMemo(() => {
    if (!submitted) return false;
    return (
      selectedWord === step.errorWord &&
      correction.trim().toLowerCase() === step.correctedWord.toLowerCase()
    );
  }, [submitted, selectedWord, correction, step.errorWord, step.correctedWord]);

  const foundError = selectedWord === step.errorWord;

  const submit = () => {
    if (!selectedWord || correction.trim().length === 0) return;
    const ok =
      selectedWord === step.errorWord &&
      correction.trim().toLowerCase() === step.correctedWord.toLowerCase();
    const xp = ok ? step.xpCorrect ?? 25 : step.xpWrong ?? 6;
    onComplete(ok, xp, "error_correction", step.srs);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">🔍</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Correção de erro</div>
      </div>
      <div className="mt-2 text-sm text-foreground/60">{step.instruction}</div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="text-base leading-7 flex flex-wrap gap-0">
          {words.map((word, i) => {
            if (/^\s+$/.test(word)) return <span key={i}>&nbsp;</span>;
            const isSelected = selectedWord === word;
            const isError = submitted && word === step.errorWord;
            return (
              <button
                key={i}
                type="button"
                disabled={submitted}
                onClick={() => setSelectedWord(word)}
                className={[
                  "px-1 py-0.5 rounded transition-all cursor-pointer",
                  isSelected && !submitted
                    ? "bg-[var(--warning)]/20"
                    : "",
                  isError && !isCorrect
                    ? "bg-[var(--error)]/15 line-through"
                    : "",
                  isError && isCorrect
                    ? "bg-[var(--success)]/15 line-through"
                    : "",
                  !submitted && !isSelected
                    ? "hover:bg-[var(--surface-hover)]"
                    : "",
                ].join(" ")}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      {selectedWord && !submitted ? (
        <div className="mt-3 text-xs text-foreground/50">
          Palavra selecionada: <strong className="text-[var(--accent)]">{selectedWord}</strong>
        </div>
      ) : null}

      {selectedWord && !submitted ? (
        <div className="mt-3">
          <label className="text-xs text-foreground/40 font-medium">Correção:</label>
          <input
            type="text"
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 outline-none transition-all"
            placeholder="Escreva a palavra correta…"
          />
        </div>
      ) : null}

      {submitted ? (
        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
          <div className="font-bold">
            {isCorrect ? "✅ Perfeito!" : "❌ Não era isso"}
          </div>
          {!foundError && (
            <div className="mt-2 text-foreground/70">
              O erro estava em: <strong>{step.errorWord}</strong>
            </div>
          )}
          <div className="mt-2 text-foreground/70">
            Correto: <strong>{step.correctedWord}</strong>
          </div>
          <div className="mt-2 text-foreground/60">{step.explanation}</div>
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button
            fullWidth
            onClick={submit}
            type="button"
            disabled={!selectedWord || correction.trim().length === 0}
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
