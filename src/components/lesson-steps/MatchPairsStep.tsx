"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "match_pairs" }>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPairsStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => void;
}) {
  const [shuffledLeft] = useState(() => shuffle(step.pairs.map((p) => p.left)));
  const [shuffledRight] = useState(() => shuffle(step.pairs.map((p) => p.right)));

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState(0);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);

  const pairMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of step.pairs) m.set(p.left, p.right);
    return m;
  }, [step.pairs]);

  const done = matched.size === step.pairs.length;

  const tryMatch = useCallback(
    (left: string, right: string) => {
      if (pairMap.get(left) === right) {
        setMatched((prev) => new Set([...prev, left]));
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongPair(null);
      } else {
        setErrors((e) => e + 1);
        setWrongPair({ left, right });
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongPair(null);
        }, 800);
      }
    },
    [pairMap]
  );

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      tryMatch(selectedLeft, selectedRight);
    }
  }, [selectedLeft, selectedRight, tryMatch]);

  const finish = () => {
    const perfect = errors === 0;
    const xp = perfect ? step.xpCorrect ?? 25 : step.xpWrong ?? 10;
    onComplete(perfect, xp, "match_pairs", step.srs);
    onNext();
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">🔗</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Associação</div>
      </div>
      <div className="mt-2 text-sm text-foreground/60">{step.instruction}</div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Left column */}
        <div className="space-y-2">
          {shuffledLeft.map((left) => {
            const isMatched = matched.has(left);
            const isSelected = selectedLeft === left;
            const isWrong = wrongPair?.left === left;
            return (
              <button
                key={left}
                type="button"
                disabled={isMatched}
                onClick={() => {
                  if (isMatched) return;
                  setSelectedLeft(left);
                }}
                className={[
                  "w-full rounded-xl border px-3 py-2.5 text-sm text-left transition-all",
                  isMatched
                    ? "border-[var(--success)]/30 bg-[var(--success)]/8 opacity-60"
                    : isWrong
                    ? "border-[var(--error)] bg-[var(--error)]/8"
                    : isSelected
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]",
                ].join(" ")}
              >
                {left}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {shuffledRight.map((right) => {
            const isMatched = [...matched].some((l) => pairMap.get(l) === right);
            const isSelected = selectedRight === right;
            const isWrong = wrongPair?.right === right;
            return (
              <button
                key={right}
                type="button"
                disabled={isMatched}
                onClick={() => {
                  if (isMatched) return;
                  setSelectedRight(right);
                }}
                className={[
                  "w-full rounded-xl border px-3 py-2.5 text-sm text-left transition-all",
                  isMatched
                    ? "border-[var(--success)]/30 bg-[var(--success)]/8 opacity-60"
                    : isWrong
                    ? "border-[var(--error)] bg-[var(--error)]/8"
                    : isSelected
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]",
                ].join(" ")}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>

      {done ? (
        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: errors === 0 ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)' }}>
          <div className="font-bold">
            {errors === 0 ? "✅ Perfeito!" : `Concluído com ${errors} erro${errors > 1 ? "s" : ""}`}
          </div>
        </div>
      ) : null}

      {errors > 0 && !done ? (
        <div className="mt-3 text-xs text-[var(--error)]">
          {errors} erro{errors > 1 ? "s" : ""} até agora
        </div>
      ) : null}

      <div className="mt-5">
        {done ? (
          <Button fullWidth onClick={finish} type="button" variant="accent">
            Próximo
          </Button>
        ) : (
          <div className="text-xs text-center opacity-50">
            Selecione um item de cada coluna para associar
          </div>
        )}
      </div>
    </div>
  );
}
