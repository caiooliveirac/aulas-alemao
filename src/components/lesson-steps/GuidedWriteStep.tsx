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
      <div className="text-sm opacity-70">Produção guiada</div>
      <div className="mt-2 text-sm opacity-80">{step.instruction}</div>

      <div className="mt-4">
        <div className="text-xs opacity-60">Starters</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {step.starters.map((s) => (
            <button
              key={s}
              type="button"
              disabled={submitted}
              onClick={() => applyStarter(s)}
              className="rounded-lg border border-black/10 dark:border-white/15 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs opacity-60">Keywords</div>
        <div className="mt-2 flex flex-wrap gap-2">{step.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
      </div>

      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          className="min-h-28 w-full rounded-lg border border-black/10 dark:border-white/15 bg-transparent p-3 text-sm"
          placeholder="Escreva aqui (1–2 frases)…"
        />
        <div className="mt-1 text-xs opacity-60">mínimo: 10 caracteres</div>
      </div>

      {submitted ? (
        <div className="mt-4 rounded-lg border border-black/10 dark:border-white/15 p-3 text-sm">
          <div className="font-semibold">Exemplo</div>
          <div className="mt-2 opacity-80">{step.exampleAnswer}</div>
          <div className="mt-3 text-xs opacity-60">
            Auto-check (v1): compare sua frase com o exemplo e veja se usou as estruturas alvo.
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button fullWidth onClick={submit} type="button" disabled={!canSubmit}>
            Concluir
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
