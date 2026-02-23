"use client";

import type { GlossaryEntry } from "@/content/schema";

export default function GlossaryCard({ entry }: { entry: GlossaryEntry }) {
  return (
    <div className="mt-2 rounded-lg border border-black/10 dark:border-white/15 bg-background p-3">
      <div className="text-sm font-semibold">{entry.term}</div>
      <div className="mt-1 text-sm opacity-80">DE: {entry.de}</div>
      <div className="mt-1 text-sm opacity-80">PT: {entry.pt}</div>
    </div>
  );
}
