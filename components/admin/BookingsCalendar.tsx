"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

const WEEKDAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function BookingsCalendar({ bookingDates }: { bookingDates: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date");

  const [cursor, setCursor] = useState(() => {
    const base = selectedDate ? new Date(selectedDate + "T00:00:00") : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of bookingDates) map.set(d, (map.get(d) || 0) + 1);
    return map;
  }, [bookingDates]);

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [cursor]);

  function toDateStr(d: Date) {
    return d.toISOString().split("T")[0];
  }

  function selectDate(dateStr: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDate === dateStr) {
      params.delete("date");
    } else {
      params.set("date", dateStr);
    }
    router.push(`/admin/reservations?${params.toString()}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="btn-icon btn-secondary"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>
        <p className="font-display font-extrabold text-base">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </p>
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="btn-icon btn-secondary"
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[2px] text-center text-[10px] font-semibold uppercase text-ink/50 pb-2 border-b-2 border-divider">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[2px] mt-[2px]">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = toDateStr(day);
          const count = countsByDate.get(dateStr) || 0;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === toDateStr(new Date());

          return (
            <button
              key={dateStr}
              onClick={() => selectDate(dateStr)}
              className={clsx(
                "relative aspect-square border border-divider text-[13px] font-semibold flex items-start justify-start p-1 transition-colors",
                isSelected ? "bg-accent text-bg" : "hover:bg-accent-100",
                isToday && !isSelected && "border-accent"
              )}
            >
              {day.getDate()}
              {count > 0 && (
                <span
                  className={clsx(
                    "absolute bottom-1 left-1 h-[6px] w-[6px]",
                    isSelected ? "bg-bg" : "bg-accent"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <button onClick={() => selectDate(selectedDate)} className="btn-ghost mt-4 !px-0 text-xs">
          Effacer le filtre de date
        </button>
      )}
    </div>
  );
}
