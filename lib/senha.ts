// Geração de senhas com aleatoriedade segura e medição de força — lógica pura.

export interface Options {
  length: number;
  lower: boolean;
  upper: boolean;
  numbers: boolean;
  symbols: boolean;
  /** Remove caracteres fáceis de confundir (O/0, l/1/I...). */
  avoidAmbiguous: boolean;
}

export const DEFAULT_OPTIONS: Options = {
  length: 16,
  lower: true,
  upper: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: false,
};

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%&*()-_=+[]{};:,.?/",
};

const AMBIGUOUS = new Set("O0oIl1|`'\"{}[]".split(""));

/** Sorteia um inteiro em [0, max) com viés desprezível (rejection sampling). */
function secureRandomInt(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let value = 0;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

/** Embaralha um array no lugar (Fisher–Yates com fonte segura). */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Monta a lista de conjuntos ativos, já filtrando ambíguos se preciso. */
function activeSets(options: Options): string[] {
  const chosen: string[] = [];
  if (options.lower) chosen.push(SETS.lower);
  if (options.upper) chosen.push(SETS.upper);
  if (options.numbers) chosen.push(SETS.numbers);
  if (options.symbols) chosen.push(SETS.symbols);

  return chosen
    .map((set) =>
      options.avoidAmbiguous
        ? set.split("").filter((c) => !AMBIGUOUS.has(c)).join("")
        : set,
    )
    .filter((set) => set.length > 0);
}

/**
 * Gera uma senha respeitando as opções. Garante ao menos um caractere de
 * cada conjunto escolhido e embaralha o resultado.
 */
export function generatePassword(options: Options): string {
  const sets = activeSets(options);
  if (sets.length === 0) return "";

  const pool = sets.join("");
  const chars: string[] = [];

  // Um de cada conjunto, pra cumprir as regras escolhidas.
  for (const set of sets) {
    if (chars.length < options.length) {
      chars.push(set[secureRandomInt(set.length)]);
    }
  }
  // Completa o restante a partir do conjunto total.
  while (chars.length < options.length) {
    chars.push(pool[secureRandomInt(pool.length)]);
  }

  return shuffle(chars).join("");
}

export interface Strength {
  /** 0 a 4. */
  score: number;
  label: string;
  color: string;
  /** Entropia estimada, em bits. */
  bits: number;
}

/** Estima a força pela entropia (tamanho × variedade do alfabeto). */
export function estimateStrength(options: Options): Strength {
  const sets = activeSets(options);
  const poolSize = sets.reduce((sum, s) => sum + s.length, 0);
  const bits = poolSize > 0 ? Math.round(options.length * Math.log2(poolSize)) : 0;

  if (bits < 36) return { score: 1, label: "Fraca", color: "#ef4444", bits };
  if (bits < 60) return { score: 2, label: "Média", color: "#f59e0b", bits };
  if (bits < 90) return { score: 3, label: "Forte", color: "#84cc16", bits };
  return { score: 4, label: "Muito forte", color: "#22c55e", bits };
}
