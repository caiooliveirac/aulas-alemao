"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { defaultProgressState, type ProgressState, type SrsCard } from "@/lib/progress";
import { getDueCards, scheduleNext } from "@/lib/srs";
import { loadLocal, saveLocal } from "@/lib/storage";
import { pullProgress, pushProgress } from "@/lib/sync";
import { useEffect } from "react";

export default function ReviewClient() {
  const [state, setState] = useState<ProgressState>(() => loadLocal("progress", defaultProgressState));

  // Hydrate from server on mount
  useEffect(() => {
    pullProgress().then((s) => setState(s));
  }, []);
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
    pushProgress(next);
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
    <div className="mx-auto max-w-lg px-4 py-8">
      <header className="mb-6 flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="gradient-text">Revisão SRS</span>
          </h1>
          <p className="mt-1 text-sm text-foreground/50">
            {due.length > 0 ? `${due.length} ${due.length === 1 ? "item pendente" : "itens pendentes"}` : "Tudo em dia!"}
          </p>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm">← Voltar</Button>
        </Link>
      </header>

      {due.length === 0 ? (
        <div className="glass-card p-8 text-center animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--success)]/10 text-2xl">✓</div>
          <p className="font-semibold">Nenhum item pendente</p>
          <p className="mt-1 text-sm text-foreground/50">Volte mais tarde para revisão.</p>
        </div>
      ) : active ? (
        <div className="glass-card p-5 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center gap-2">
            <Chip variant="accent">{active.kind}</Chip>
            {active.tags?.slice(0, 2).map((t) => <Chip key={t}>{t}</Chip>)}
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">Pergunta</p>
            <p className="mt-2 text-lg font-bold">{active.front}</p>
          </div>

          {showBack ? (
            <>
              <div className="mt-5 rounded-xl bg-[var(--accent)]/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">Resposta</p>
                <p className="mt-2 text-base font-semibold">{active.back}</p>
              </div>

              <div className="mt-5 flex gap-3">
                <Button fullWidth onClick={() => grade(false)} type="button" variant="secondary">
                  ✗ Errei
                </Button>
                <Button fullWidth onClick={() => grade(true)} type="button" variant="accent">
                  ✓ Acertei
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-6">
              <Button fullWidth onClick={() => setShowBack(true)} type="button" variant="accent">
                Mostrar resposta
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
