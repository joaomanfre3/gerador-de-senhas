"use client";

import { useEffect, useState } from "react";
import { Check, Copy, KeyRound, RefreshCw } from "lucide-react";
import {
  type Options,
  DEFAULT_OPTIONS,
  estimateStrength,
  generatePassword,
} from "@/lib/senha";
import { StrengthMeter } from "@/components/StrengthMeter";
import { Toggle } from "@/components/Toggle";

const STORAGE_KEY = "gerador-de-senhas:v1";

export default function Home() {
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Carrega as opções salvas e já gera a primeira senha.
  useEffect(() => {
    let opts = DEFAULT_OPTIONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) opts = { ...DEFAULT_OPTIONS, ...JSON.parse(raw) };
    } catch {
      /* localStorage indisponível — usa o padrão */
    }
    setOptions(opts);
    setPassword(generatePassword(opts));
    setHydrated(true);
  }, []);

  // Persiste as opções.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      /* cota cheia / modo privado */
    }
  }, [options, hydrated]);

  // Aplica uma mudança de opção e já regenera a senha com o novo critério.
  function update(patch: Partial<Options>) {
    const next = { ...options, ...patch };
    setOptions(next);
    setPassword(generatePassword(next));
  }

  function regenerate() {
    setPassword(generatePassword(options));
  }

  async function copy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard bloqueado — ignora silenciosamente */
    }
  }

  const strength = estimateStrength(options);
  // Quantos conjuntos estão ativos (pra travar o último e não zerar a senha).
  const activeCount = [options.lower, options.upper, options.numbers, options.symbols].filter(
    Boolean,
  ).length;

  if (!hydrated) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-10">
      <header className="flex items-center gap-2">
        <KeyRound size={24} style={{ color: "var(--color-accent)" }} />
        <h1 className="text-xl font-extrabold tracking-tight">Gerador de Senhas</h1>
      </header>

      {/* Senha gerada */}
      <section className="rounded-2xl bg-card p-4 ring-1 ring-white/10" style={{ backgroundColor: "var(--color-card)" }}>
        <div className="flex items-start gap-3">
          <p className="min-h-12 flex-1 break-all font-mono text-xl leading-relaxed text-white">
            {password || "—"}
          </p>
          <div className="flex shrink-0 gap-1">
            <button
              onClick={regenerate}
              aria-label="Gerar outra senha"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/70 transition hover:bg-white/10 active:scale-90"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={copy}
              aria-label="Copiar senha"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-black transition active:scale-90"
              style={{ backgroundColor: copied ? "#22c55e" : "var(--color-accent)" }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <StrengthMeter strength={strength} />
          <p className="mt-2 text-xs text-white/40">
            Entropia estimada: ~{strength.bits} bits
          </p>
        </div>
      </section>

      {/* Tamanho */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-white/70">Tamanho</span>
          <span className="font-mono text-lg font-bold" style={{ color: "var(--color-accent)" }}>
            {options.length}
          </span>
        </div>
        <input
          type="range"
          min={6}
          max={40}
          value={options.length}
          onChange={(e) => update({ length: Number(e.target.value) })}
          className="w-full"
          aria-label="Tamanho da senha"
        />
      </section>

      {/* Opções de caractere */}
      <section className="flex flex-col gap-2">
        <Toggle
          label="Letras minúsculas (a-z)"
          checked={options.lower}
          disabled={options.lower && activeCount === 1}
          onChange={(v) => update({ lower: v })}
        />
        <Toggle
          label="Letras maiúsculas (A-Z)"
          checked={options.upper}
          disabled={options.upper && activeCount === 1}
          onChange={(v) => update({ upper: v })}
        />
        <Toggle
          label="Números (0-9)"
          checked={options.numbers}
          disabled={options.numbers && activeCount === 1}
          onChange={(v) => update({ numbers: v })}
        />
        <Toggle
          label="Símbolos (!@#$)"
          checked={options.symbols}
          disabled={options.symbols && activeCount === 1}
          onChange={(v) => update({ symbols: v })}
        />
        <Toggle
          label="Evitar caracteres ambíguos"
          checked={options.avoidAmbiguous}
          onChange={(v) => update({ avoidAmbiguous: v })}
        />
      </section>

      <footer className="text-center text-xs text-white/30">
        As senhas são geradas no seu navegador e nunca saem dele.
      </footer>
    </main>
  );
}
