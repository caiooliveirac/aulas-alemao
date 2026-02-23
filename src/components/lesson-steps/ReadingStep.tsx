"use client";

import { useMemo, useState } from "react";
import type { LessonStep, GlossaryEntry } from "@/content/schema";
import { Button } from "@/components/ui/Button";
import GlossaryCard from "./GlossaryCard";

type ReadingStep = Extract<LessonStep, { type: "reading" }>;

export default function ReadingStep({
  step,
  onNext,
  onComplete,
}: {
  step: ReadingStep;
  onNext: () => void;
  onComplete: (ok: boolean, xp: number, kind: LessonStep["type"]) => void;
}) {
  const [chunkIdx, setChunkIdx] = useState(0);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const chunk = step.chunks[chunkIdx];
  const glossaryMap = useMemo(() => {
    const map = new Map<string, GlossaryEntry>();
    for (const g of chunk.glossary ?? []) map.set(g.term, g);
    return map;
  }, [chunk.glossary]);

  const tokens = useMemo(() => {
    // Minimal highlighting: match exact glossary term after stripping common punctuation.
    const parts = chunk.text.split(/(\s+)/);
    return parts.map((p, i) => {
      if (/^\s+$/.test(p)) return { key: i, text: p, term: null as string | null };
      const cleaned = p.replace(/[“”„”\"'.,!?;:()\[\]{}]/g, "");
      const isTerm = glossaryMap.has(cleaned);
      return { key: i, text: p, term: isTerm ? cleaned : null };
    });
  }, [chunk.text, glossaryMap]);

  const isLastChunk = chunkIdx >= step.chunks.length - 1;

  const nextChunkOrFinish = () => {
    if (!isLastChunk) setChunkIdx((i) => i + 1);
    else {
      const xp = step.xp ?? 10;
      onComplete(true, xp, "reading");
      onNext();
    }
  };

  const entry = activeTerm ? glossaryMap.get(activeTerm) ?? null : null;

  return (
    <div>
      <div className="text-sm opacity-70">{step.instruction ?? "Leitura"}</div>
      <div className="mt-3 text-base leading-7">
        {tokens.map((t) => {
          if (!t.term) return <span key={t.key}>{t.text}</span>;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTerm((cur) => (cur === t.term ? null : t.term))}
              className="underline decoration-black/30 dark:decoration-white/30 underline-offset-4 font-medium"
              title="Abrir glossário"
            >
              {t.text}
            </button>
          );
        })}
      </div>

      {entry ? <GlossaryCard entry={entry} /> : null}

      <div className="mt-5 flex items-center justify-between">
        <div className="text-xs opacity-60">
          bloco {chunkIdx + 1}/{step.chunks.length}
        </div>
        <Button onClick={nextChunkOrFinish} type="button">
          {isLastChunk ? "Continuar" : "Próximo bloco"}
        </Button>
      </div>
    </div>
  );
}
