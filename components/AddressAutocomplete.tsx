"use client";

import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import clsx from "clsx";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  required,
  icon,
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(next: string) {
    onChange(next);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = next.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok || requestId !== requestIdRef.current) return;
        const data = await res.json();
        if (requestId !== requestIdRef.current) return;
        const results: string[] = data.suggestions || [];
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        // Network hiccup: fail silently, the user can still type their own address.
      }
    }, 300);
  }

  function selectSuggestion(suggestion: string) {
    onChange(suggestion);
    setSuggestions([]);
    setOpen(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {icon}
      <input
        type="text"
        required={required}
        autoComplete="off"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      {open && (
        <ul className="absolute z-30 mt-1.5 w-full max-h-64 overflow-auto rounded-lg border border-anthracite/10 bg-white py-1.5 shadow-deep">
          {suggestions.map((suggestion, i) => (
            <li key={suggestion}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={clsx(
                  "w-full px-4 py-2.5 text-left text-sm truncate transition-colors duration-150",
                  i === activeIndex ? "bg-or/10 text-anthracite" : "text-anthracite/70 hover:bg-anthracite/5"
                )}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
