"use client";

import { useRef, useEffect } from "react";
import type { ChipData } from "@/types";

interface ChipProps {
  emoji: string;
  label: string;
  chipData: ChipData;
  onChange: (data: ChipData) => void;
  disabled?: boolean;
}

export default function Chip({ emoji, label, chipData, onChange, disabled }: ChipProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, value } = chipData;

  useEffect(() => {
    if (state === "expanding") {
      inputRef.current?.focus();
    }
  }, [state]);

  function expand() {
    if (disabled) return;
    onChange({ state: "expanding", value: null });
  }

  function commit(raw: string) {
    if (disabled) return;
    const trimmed = raw.trim();
    if (!trimmed) {
      onChange({ state: "idle", value: null });
    } else {
      onChange({ state: "filled", value: trimmed });
    }
  }

  function dismiss() {
    if (disabled) return;
    onChange({ state: "idle", value: null });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit(e.currentTarget.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      dismiss();
    }
  }

  // Idle state
  if (state === "idle") {
    return (
      <button
        type="button"
        aria-label={`Add ${label} clue`}
        onClick={expand}
        disabled={disabled}
        className="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-bright transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">{emoji}</span>
        <span className="font-label-md text-label-md">{label}</span>
      </button>
    );
  }

  // Expanding state
  if (state === "expanding") {
    return (
      <span className="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-container-highest border-2 border-primary text-on-surface shadow-[0_0_12px_rgba(168,199,250,0.3)] z-20 transition-all">
        <span className="material-symbols-outlined text-[18px] text-primary">{emoji}</span>
        <input
          ref={inputRef}
          aria-label={`Enter ${label}`}
          type="text"
          disabled={disabled}
          defaultValue=""
          onBlur={(e) => commit(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Enter ${label.toLowerCase()}…`}
          className="bg-transparent border-none outline-none text-on-surface font-label-md text-label-md w-[120px] placeholder:text-outline-variant"
        />
      </span>
    );
  }

  // Filled state (Active as per code.html)
  return (
    <span className="flex-shrink-0 flex items-center gap-1.5 h-8 pl-3 pr-1 rounded-full bg-surface-container-high text-on-surface-variant transition-colors disabled:opacity-70 border-[1px] border-primary-container">
      <span className="material-symbols-outlined text-[18px] text-primary-container">{emoji}</span>
      <span title={value ?? ""} className="font-label-md text-label-md max-w-[140px] truncate text-primary-container">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Remove ${label} clue`}
        onClick={dismiss}
        disabled={disabled}
        className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-bright text-on-surface-variant transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </span>
  );
}
