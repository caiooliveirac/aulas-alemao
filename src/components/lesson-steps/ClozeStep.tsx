"use client";

import { useMemo, useState } from "react";
import type { LessonStep, SrsCardSeed } from "@/content/schema";
import { Button } from "@/components/ui/Button";

type Step = Extract<LessonStep, { type: "cloze" }>;

function renderSentence(sentence: string) {
  const parts = sentence.split("{___}");
  if (parts.length === 1) return <span>{sentence}</span>;
  return (
    <>
      {parts[0]}
      <span className="mx-1 inline-block min-w-10 rounded-md border border-dashed border-black/20 dark:border-white/20 px-2 py-0.5 text-center">
        ___
      </span>
      {parts.slice(1).join("{___}")}
    </>
  );
}

export default function ClozeStep({
  step,
  onNext,
  onComplete,
}: {
  step: Step;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"], seed?: SrsCardSeed) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const ok = useMemo(() => (submitted && picked ? picked === step.correct : false), [submitted, picked, step.correct]);

  const submit = () => {
    if (!picked) return;
    const isOk = picked === step.correct;
    const xp = isOk ? step.xpCorrect ?? 20 : step.xpWrong ?? 6;
    onComplete(isOk, xp, "cloze", step.srs);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="text-sm opacity-70">Cloze</div>
      <div className="mt-2 text-sm opacity-80">{step.instruction}</div>

      <div className="mt-3 text-base leading-7">{renderSentence(step.sentence)}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {step.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={submitted}
            onClick={() => setPicked(opt)}
            className={[
              "rounded-lg border px-3 py-2 text-sm",
              picked === opt ? "border-foreground" : "border-black/10 dark:border-white/15",
            ].join(" ")}
          >
            {opt}
          </button>
        ))}
      </div>

      {submitted ? (
        <div className="mt-4 rounded-lg border border-black/10 dark:border-white/15 p-3 text-sm">
          <div className="font-semibold">{ok ? "✅ Correto" : "❌ Quase"}</div>
          {step.explanation ? <div className="mt-2 opacity-80">{step.explanation}</div> : null}
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <Button fullWidth onClick={submit} type="button" disabled={!picked}>
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
