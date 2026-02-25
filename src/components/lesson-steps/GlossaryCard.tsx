"use client";

import type { GlossaryEntry } from "@/content/schema";

export default function GlossaryCard({ entry }: { entry: GlossaryEntry }) {
  return (
    <div className="mt-2 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-3 animate-fade-up">
      <div className="text-sm font-bold text-[var(--accent)]">{entry.term}</div>
      <div className="mt-1 text-sm text-foreground/70">DE: {entry.de}</div>
      <div className="mt-1 text-sm text-foreground/70">PT: {entry.pt}</div>
    </div>
  );
}
