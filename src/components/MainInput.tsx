interface MainInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onEnter?: () => void;
}

export default function MainInput({ value, onChange, placeholder, disabled, onEnter }: MainInputProps) {
  return (
    <div className="relative mt-space-xs mb-space-sm bg-surface-container-low/70 rounded-DEFAULT p-space-sm shadow-inner transition-colors focus-within:bg-surface-container-high group">
      <textarea
        id="memory-query-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder ?? "What do you remember?"}
        rows={2}
        maxLength={500}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && onEnter) {
              onEnter();
            }
          }
        }}
        className="w-full bg-transparent resize-none outline-none font-body-lg text-body-lg text-on-surface placeholder:italic placeholder:text-outline disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
}
