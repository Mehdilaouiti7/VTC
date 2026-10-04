"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type { BlockedSlot } from "@/lib/types";

const WEEKDAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayStatus(day: Date, blockedSlots: BlockedSlot[]): "free" | "partial" | "full" {
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
  const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
  // Admins pick times to the minute (e.g. 23:59), so require "until the end of
  // the day" rather than the exact last millisecond to count as full coverage.
  const dayEndThreshold = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 55, 0);

  let overlap = false;
  let fullyCovered = false;

  for (const slot of blockedSlots) {
    const start = new Date(slot.start_at);
    const end = new Date(slot.end_at);
    if (start <= dayEnd && end >= dayStart) {
      overlap = true;
      if (start <= dayStart && end >= dayEndThreshold) fullyCovered = true;
    }
  }

  if (fullyCovered) return "full";
  if (overlap) return "partial";
  return "free";
}

export default function AvailabilityCalendar({
  selectedDate,
  onSelect,
  blockedSlots,
  minDate,
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
  blockedSlots: BlockedSlot[];
  minDate?: string;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const floor = useMemo(() => {
    if (!minDate) return today;
    const d = new Date(minDate + "T00:00:00");
    return d > today ? d : today;
  }, [minDate, today]);

  const [cursor, setCursor] = useState(() => {
    const base = selectedDate ? new Date(selectedDate + "T00:00:00") : floor;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

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

  return (
    <div className="border-2 border-divider bg-bg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="p-1.5 hover:bg-surface transition-colors"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <p className="text-sm font-semibold">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="p-1.5 hover:bg-surface transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-ink/40 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = toDateStr(day);
          const isPast = day < floor;
          const status = dayStatus(day, blockedSlots);
          const disabled = isPast || status === "full";
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              title={
                status === "full"
                  ? "Chauffeur indisponible ce jour-là"
                  : status === "partial"
                  ? "Certains horaires sont indisponibles ce jour-là"
                  : undefined
              }
              className={clsx(
                "relative aspect-square text-xs flex items-center justify-center transition-colors",
                disabled && "text-ink/25 cursor-not-allowed line-through",
                !disabled && !isSelected && "hover:bg-surface",
                isSelected && "bg-accent text-bg font-semibold"
              )}
            >
              {day.getDate()}
              {status === "partial" && !disabled && (
                <span
                  className={clsx(
                    "absolute bottom-1 h-1 w-1",
                    isSelected ? "bg-bg" : "bg-red-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink/45">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-red-500" />
          Horaires restreints
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-ink/30 line-through">12</span>
          Journée indisponible
        </span>
      </div>
    </div>
  );
}
