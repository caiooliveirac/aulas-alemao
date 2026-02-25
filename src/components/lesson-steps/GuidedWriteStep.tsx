"use client";

import { useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

type Step = Extract<LessonStep, { type: "guided_write" }>;

export default function GuidedWriteStep({
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

  const canSubmit = useMemo(() => text.trim().length >= 10, [text]);

  const applyStarter = (s: string) => {
    if (submitted) return;
    setText((cur) => (cur.trim().length === 0 ? s + " " : cur));
  };

  const submit = () => {
    if (!canSubmit) return;
    const xp = step.xp ?? 15;
    onComplete(true, xp, "guided_write", step.srs);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg">✍️</span>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">Produção guiada</div>
      </div>
      <div className="mt-2 text-sm text-foreground/60">{step.instruction}</div>

      <div className="mt-4">
        <div className="text-xs text-foreground/40 font-medium">Starters</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {step.starters.map((s) => (
            <button
              key={s}
              type="button"
              disabled={submitted}
              onClick={() => applyStarter(s)}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-foreground/40 font-medium">Keywords</div>
        <div className="mt-2 flex flex-wrap gap-2">{step.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
      </div>

      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          className="min-h-28 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 outline-none transition-all"
          placeholder="Escreva aqui (1–2 frases)…"
        />
        <div className="mt-1 text-xs text-foreground/40">mínimo: 10 caracteres</div>
      </div>

      {submitted ? (
        <div className="mt-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/15 p-3 text-sm">
          <div className="font-bold text-[var(--accent)]">Exemplo</div>
          <div className="mt-2 text-foreground/70">{step.exampleAnswer}</div>

          {"checkpoints" in step && step.checkpoints && step.checkpoints.length > 0 ? (
            <div className="mt-3">
              <div className="text-xs font-semibold opacity-60 mb-1">Autoavaliação:</div>
              <ul className="space-y-1">
                {step.checkpoints.map((cp, i) => (
                  <li key={i} className="text-xs opacity-70 flex items-start gap-1.5">
                    <span className="mt-0.5">☐</span>
                    <span>{cp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-3 text-xs opacity-60">
              Compare sua frase com o exemplo e veja se usou as estruturas alvo.
            </div>
          )}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button fullWidth onClick={submit} type="button" disabled={!canSubmit} variant="accent">
            Concluir
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
