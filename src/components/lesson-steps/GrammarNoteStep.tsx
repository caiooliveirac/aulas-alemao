"use client";

import { useState } from "react";
import type { LessonStep } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "grammar_note" }>;

export default function GrammarNoteStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"]) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const finish = () => {
    onComplete(true, step.xp ?? 5, "grammar_note");
    onNext();
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">📐</span>
        <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
          Dica de Gramática
        </div>
      </div>

      <div className="mt-3 text-base font-bold">{step.title}</div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6">
        {step.explanation}
      </div>

      {step.ruleFormula ? (
        <div className="mt-3 rounded-xl border-2 border-dashed border-[var(--accent)]/20 bg-[var(--accent)]/5 p-3 text-center font-mono text-sm text-[var(--accent)]">
          {step.ruleFormula}
        </div>
      ) : null}

      <div className="mt-4">
        <div className="text-xs font-bold uppercase tracking-wider text-foreground/40">
          Exemplos
        </div>
        <div className="mt-2 space-y-2">
          {step.examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] p-3"
            >
              <div className="text-sm font-medium">
                {ex.highlight ? (
                  <>
                    {ex.de.split(ex.highlight).map((part, j, arr) => (
                      <span key={j}>
                        {part}
                        {j < arr.length - 1 ? (
                          <mark className="rounded bg-yellow-200/60 dark:bg-yellow-500/30 px-0.5">
                            {ex.highlight}
                          </mark>
                        ) : null}
                      </span>
                    ))}
                  </>
                ) : (
                  ex.de
                )}
              </div>
              <div className="mt-1 text-xs text-foreground/50">{ex.pt}</div>
            </div>
          ))}
        </div>
      </div>

      {step.commonMistake ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 w-full text-left"
        >
          <div className="flex items-center gap-2 text-sm font-medium opacity-80">
            <span>⚠️</span>
            <span>Erro comum</span>
            <span className="ml-auto text-xs opacity-50">
              {expanded ? "▲" : "▼"}
            </span>
          </div>
          {expanded ? (
            <div className="mt-2 rounded-lg border border-red-200/50 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-3 text-sm opacity-80">
              {step.commonMistake}
            </div>
          ) : null}
        </button>
      ) : null}

      <div className="mt-5">
        <Button fullWidth onClick={finish} type="button" variant="accent">
          Entendi — continuar
        </Button>
      </div>
    </div>
  );
}
