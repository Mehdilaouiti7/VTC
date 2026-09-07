import { Check } from "lucide-react";
import clsx from "clsx";

const STEPS = ["Trajet", "Date & horaires", "Vos besoins", "Coordonnées", "Récapitulatif"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto mb-12 overflow-x-auto pb-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const active = stepNum === current;
        const done = stepNum < current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none min-w-[70px]">
            <div className="flex flex-col items-center gap-2">
              <div
                className={clsx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium border transition-colors",
                  done && "bg-or border-or text-noir",
                  active && "border-or text-or",
                  !active && !done && "border-anthracite/15 text-anthracite/40"
                )}
              >
                {done ? <Check size={15} /> : stepNum}
              </div>
              <span
                className={clsx(
                  "text-[11px] uppercase tracking-wide whitespace-nowrap",
                  active ? "text-anthracite" : "text-anthracite/40"
                )}
              >
                {label}
              </span>
            </div>
            {stepNum !== STEPS.length && (
              <div
                className={clsx(
                  "h-px flex-1 mx-2 mt-[-18px]",
                  done ? "bg-or" : "bg-anthracite/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
