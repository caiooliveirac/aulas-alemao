"use client";

import { useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "multi_cloze" }>;

export default function MultiClozeStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeBlank, setActiveBlank] = useState<number>(step.blanks[0]?.id ?? 0);

  const allFilled = step.blanks.every((b) => answers[b.id] !== undefined);

  const results = useMemo(() => {
    if (!submitted) return {};
    const r: Record<number, boolean> = {};
    for (const b of step.blanks) {
      r[b.id] = answers[b.id] === b.correct;
    }
    return r;
  }, [submitted, answers, step.blanks]);

  const allCorrect = useMemo(
    () => submitted && Object.values(results).every(Boolean),
    [submitted, results]
  );

  // Parse text into segments — text parts and blank markers
  const segments = useMemo(() => {
    const parts: Array<{ type: "text"; value: string } | { type: "blank"; id: number }> = [];
    const remaining = step.text;

    // Find all markers and split
    const markerRegex = /\{___(\d+)\}/g;
    let match: RegExpExecArray | null;
    let lastIdx = 0;

    while ((match = markerRegex.exec(remaining)) !== null) {
      if (match.index > lastIdx) {
        parts.push({ type: "text", value: remaining.slice(lastIdx, match.index) });
      }
      parts.push({ type: "blank", id: parseInt(match[1], 10) });
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < remaining.length) {
      parts.push({ type: "text", value: remaining.slice(lastIdx) });
    }
    return parts;
  }, [step.text]);

  const selectOption = (blankId: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [blankId]: option }));
    // Auto-advance to next unfilled blank
    const nextBlank = step.blanks.find((b) => b.id !== blankId && answers[b.id] === undefined);
    if (nextBlank) setActiveBlank(nextBlank.id);
  };

  const submit = () => {
    if (!allFilled) return;
    const correct = step.blanks.every((b) => answers[b.id] === b.correct);
    const xp = correct ? step.xpCorrect ?? 30 : step.xpWrong ?? 8;
    onComplete(correct, xp, "multi_cloze", step.srs);
    setSubmitted(true);
  };

  const currentBlank = step.blanks.find((b) => b.id === activeBlank);

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">📝</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Cloze múltiplo</div>
      </div>
      <div className="mt-2 text-sm text-foreground/60">{step.instruction}</div>

      {/* Render text with blanks */}
      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-base leading-8">
        {segments.map((seg, i) => {
          if (seg.type === "text") return <span key={i}>{seg.value}</span>;
          const _blank = step.blanks.find((b) => b.id === seg.id);
          const answer = answers[seg.id];
          const result = results[seg.id];
          const isActive = activeBlank === seg.id && !submitted;
          return (
            <button
              key={i}
              type="button"
              onClick={() => !submitted && setActiveBlank(seg.id)}
              className={[
                "mx-1 inline-block min-w-16 rounded-lg border px-2 py-0.5 text-center text-sm transition-all",
                answer
                  ? submitted
                    ? result
                      ? "border-[var(--success)]/30 bg-[var(--success)]/8"
                      : "border-[var(--error)]/30 bg-[var(--error)]/8"
                    : "border-[var(--accent)] bg-[var(--accent)]/5"
                  : "border-dashed border-[var(--accent)]/20",
                isActive ? "ring-2 ring-[var(--accent)]/30" : "",
              ].join(" ")}
            >
              {answer || "___"}
            </button>
          );
        })}
      </div>

      {/* Options for active blank */}
      {!submitted && currentBlank ? (
        <div className="mt-4">
          <div className="text-xs text-foreground/40 mb-2">
            Lacuna {activeBlank + 1}:
          </div>
          <div className="flex flex-wrap gap-2">
            {currentBlank.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => selectOption(currentBlank.id, opt)}
                className={[
                  "rounded-xl border px-3 py-2 text-sm transition-all",
                  answers[currentBlank.id] === opt
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]",
                ].join(" ")}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Results */}
      {submitted ? (
        <div className="mt-4 space-y-2">
          <div className="font-semibold text-sm">
            {allCorrect ? "✅ Tudo certo!" : "Correções:"}
          </div>
          {!allCorrect &&
            step.blanks.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-[var(--border)] p-2 text-sm"
              >
                <span className={results[b.id] ? "opacity-60" : "font-medium"}>
                  {results[b.id] ? "✓" : "✗"} Lacuna {b.id + 1}:{" "}
                  {results[b.id] ? answers[b.id] : `${answers[b.id]} → ${b.correct}`}
                </span>
                {b.explanation && !results[b.id] ? (
                  <div className="mt-1 text-xs text-foreground/50">{b.explanation}</div>
                ) : null}
              </div>
            ))}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button fullWidth onClick={submit} type="button" disabled={!allFilled} variant="accent">
            Confirmar tudo
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
