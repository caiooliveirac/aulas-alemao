"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function LoginForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = pin.trim();
    if (trimmed.length < 4) {
      setError("PIN deve ter pelo menos 4 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: trimmed }),
      });

      if (res.ok) {
        router.push(`${BASE}/`);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Erro ao entrar.");
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass-card w-full max-w-sm p-6 animate-fade-up">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-3xl">
          🌉
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          <span className="gradient-text">DeutschBrücke</span>
        </h1>
        <p className="mt-1 text-sm text-foreground/50">Alemão B1 → B2 com microtarefas e SRS</p>
      </div>

      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-foreground/40">Seu PIN pessoal</span>
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoFocus
          required
          minLength={4}
          className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-center text-lg font-bold tracking-[0.3em] text-foreground placeholder:text-foreground/30 placeholder:tracking-normal placeholder:font-normal outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          placeholder="ex: maria2026"
        />
      </label>

      <p className="mt-2 text-xs text-foreground/40 text-center">
        Escolha um PIN qualquer. Ele é sua identidade — use o
        mesmo PIN em qualquer dispositivo para manter seu progresso.
      </p>

      {error && (
        <p className="mt-3 text-sm font-medium text-[var(--error)] text-center">{error}</p>
      )}

      <div className="mt-5">
        <Button type="submit" fullWidth variant="accent" disabled={loading || pin.trim().length < 4}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
