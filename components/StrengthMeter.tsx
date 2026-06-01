"use client";

import { motion } from "framer-motion";
import type { Strength } from "@/lib/senha";

export function StrengthMeter({ strength }: { strength: Strength }) {
  return (
    <div className="flex items-center gap-3">
      {/* Quatro segmentos que acendem conforme a força */}
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3, 4].map((level) => {
          const on = level <= strength.score;
          return (
            <motion.span
              key={level}
              className="h-1.5 flex-1 rounded-full"
              animate={{ backgroundColor: on ? strength.color : "#2d333b" }}
              transition={{ duration: 0.2 }}
            />
          );
        })}
      </div>
      <span
        className="w-24 text-right text-sm font-bold"
        style={{ color: strength.color }}
      >
        {strength.label}
      </span>
    </div>
  );
}
