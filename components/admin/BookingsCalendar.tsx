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
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="p-1.5 rounded hover:bg-anthracite/5"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="font-display text-sm">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </p>
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="p-1.5 rounded hover:bg-anthracite/5"
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-anthracite/40 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
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
                "relative aspect-square rounded-md text-xs flex items-center justify-center transition-colors",
                isSelected ? "bg-or text-noir font-medium" : "hover:bg-anthracite/5",
                isToday && !isSelected && "border border-or/50"
              )}
            >
              {day.getDate()}
              {count > 0 && (
                <span
                  className={clsx(
                    "absolute bottom-1 h-1 w-1 rounded-full",
                    isSelected ? "bg-noir" : "bg-or"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <button
          onClick={() => selectDate(selectedDate)}
          className="mt-4 text-xs text-anthracite/50 hover:text-anthracite underline"
        >
          Effacer le filtre de date
        </button>
      )}
    </div>
  );
}
