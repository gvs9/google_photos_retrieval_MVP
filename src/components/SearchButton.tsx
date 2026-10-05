interface SearchButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

export default function SearchButton({ onClick, isLoading, isDisabled }: SearchButtonProps) {
  const disabled = isLoading || isDisabled;
  
  return (
    <button
      id="search-button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLoading ? "Searching…" : "Search photos"}
      className="h-10 px-6 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Spinner />
          <span>Searching…</span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span>Search</span>
        </>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </svg>
  );
}
