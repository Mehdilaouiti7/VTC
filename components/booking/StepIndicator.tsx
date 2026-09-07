import { Check } from "lucide-react";
import clsx from "clsx";

const STEPS = ["Trajet", "Date & horaires", "Vos besoins", "Coordonnées", "Récapitulatif"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="max-w-3xl mx-auto mb-10 sm:mb-12">
      <p className="sm:hidden text-center text-xs uppercase tracking-wider text-anthracite/50 mb-4">
        Étape {current}/{STEPS.length} — <span className="text-anthracite">{STEPS[current - 1]}</span>
      </p>

      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const active = stepNum === current;
          const done = stepNum < current;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={clsx(
                    "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium border transition-colors",
                    done && "bg-or border-or text-noir",
                    active && "border-or text-or",
                    !active && !done && "border-anthracite/15 text-anthracite/40"
                  )}
                >
                  {done ? <Check size={15} /> : stepNum}
                </div>
                <span
                  className={clsx(
                    "hidden sm:block text-[11px] uppercase tracking-wide whitespace-nowrap",
                    active ? "text-anthracite" : "text-anthracite/40"
                  )}
                >
                  {label}
                </span>
              </div>
              {stepNum !== STEPS.length && (
                <div
                  className={clsx(
                    "h-px flex-1 mx-1.5 sm:mx-2 sm:mt-[-18px]",
                    done ? "bg-or" : "bg-anthracite/10"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
