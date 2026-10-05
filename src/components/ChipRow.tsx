"use client";

import Chip from "@/components/Chip";
import type { ChipData } from "@/types";

interface ChipDef {
  key: "person" | "timeframe" | "visual";
  emoji: string;
  label: string;
  data: ChipData;
  onChange: (data: ChipData) => void;
}

interface ChipRowProps {
  personChip: ChipData;
  timeframeChip: ChipData;
  visualChip: ChipData;
  onPersonChange: (data: ChipData) => void;
  onTimeframeChange: (data: ChipData) => void;
  onVisualChange: (data: ChipData) => void;
  disabled?: boolean;
}

export default function ChipRow({
  personChip,
  timeframeChip,
  visualChip,
  onPersonChange,
  onTimeframeChange,
  onVisualChange,
  disabled
}: ChipRowProps) {
  const chips: ChipDef[] = [
    { key: "person",    emoji: "person",         label: "Person",        data: personChip,    onChange: onPersonChange },
    { key: "timeframe", emoji: "calendar_today", label: "Time",          data: timeframeChip, onChange: onTimeframeChange },
    { key: "visual",    emoji: "palette",        label: "Visual detail", data: visualChip,    onChange: onVisualChange },
  ];

  const stateOrder = { filled: 0, expanding: 1, idle: 2 } as const;
  const sorted = [...chips].sort(
    (a, b) => stateOrder[a.data.state] - stateOrder[b.data.state]
  );

  return (
    <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-space-xs mb-space-sm">
      {sorted.map((chip) => (
        <Chip
          key={chip.key}
          emoji={chip.emoji}
          label={chip.label}
          chipData={chip.data}
          onChange={chip.onChange}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
