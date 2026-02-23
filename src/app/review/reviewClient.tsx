"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { defaultProgressState, type ProgressState, type SrsCard } from "@/lib/progress";
import { getDueCards, scheduleNext } from "@/lib/srs";
import { loadLocal, saveLocal } from "@/lib/storage";

export default function ReviewClient() {
  const [state, setState] = useState<ProgressState>(() => loadLocal("progress", defaultProgressState));
  const [showBack, setShowBack] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const due = useMemo(() => getDueCards(state.srsCards), [state.srsCards]);
  const active: SrsCard | null = useMemo(() => {
    const pick = (activeId ? due.find((c) => c.id === activeId) : null) ?? due[0] ?? null;
    return pick;
  }, [due, activeId]);

  const persist = (next: ProgressState) => {
    setState(next);
    saveLocal("progress", next);
  };

  const grade = (correct: boolean) => {
    if (!active) return;
    const updated = scheduleNext(active, correct);
    const nextCards = state.srsCards.map((c) => (c.id === updated.id ? updated : c));
    const xp = correct ? 8 : 2;
    persist({
      ...state,
      profile: { ...state.profile, xp: state.profile.xp + xp },
      srsCards: nextCards,
    });

    setShowBack(false);
    const nextDue = getDueCards(nextCards);
    setActiveId(nextDue[0]?.id ?? null);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Revisão (SRS)</div>
          <div className="text-sm opacity-70">itens pendentes: {due.length}</div>
        </div>
        <Link href="/">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </header>

      {due.length === 0 ? (
        <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <div className="text-sm opacity-80">Nenhum item pendente agora.</div>
        </div>
      ) : active ? (
        <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <div className="flex items-center justify-between gap-2">
            <Chip>{active.kind}</Chip>
            {active.tags?.slice(0, 2).map((t) => <Chip key={t}>{t}</Chip>)}
          </div>

          <div className="mt-4 text-sm opacity-70">Pergunta</div>
          <div className="mt-1 text-base font-semibold">{active.front}</div>

          {showBack ? (
            <>
              <div className="mt-4 text-sm opacity-70">Resposta</div>
              <div className="mt-1 text-base">{active.back}</div>

              <div className="mt-5 flex gap-2">
                <Button fullWidth onClick={() => grade(false)} type="button" variant="secondary">
                  Errei
                </Button>
                <Button fullWidth onClick={() => grade(true)} type="button">
                  Acertei
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-5">
              <Button fullWidth onClick={() => setShowBack(true)} type="button">
                Mostrar resposta
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
