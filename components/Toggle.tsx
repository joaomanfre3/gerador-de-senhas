"use client";

interface ToggleProps {
  label: string;
  checked: boolean;
  /** Impede desmarcar o último conjunto ativo (senão a senha fica vazia). */
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, disabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5 transition enabled:hover:bg-white/[0.06] disabled:opacity-50"
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "" : "bg-white/15"
        }`}
        style={checked ? { backgroundColor: "var(--color-accent)" } : undefined}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
