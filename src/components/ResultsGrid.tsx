import { Photo } from "@/types";
import PhotoCard from "./PhotoCard";

export default function ResultsGrid({ 
  results, 
  title = "Search results", 
  subtitle = "Matched photos",
  onViewAll
}: { 
  results: Photo[], 
  title?: string, 
  subtitle?: string,
  onViewAll?: () => void
}) {
  if (results.length === 0) {
    return (
      <div className="flex justify-center py-16 text-on-surface-variant animate-[fadeIn_0.5s_ease-out_forwards] w-full">
         <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <p className="font-body-lg text-body-lg text-center px-6">
          No matching photos found in the mock dataset.<br/>
          <span className="text-body-sm opacity-70">Try searching for something you see in the gallery!</span>
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="px-space-md py-space-xs flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h3 className="font-title-md text-title-md text-on-surface">{title}</h3>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</span>
        </div>
        <button 
          type="button" 
          onClick={onViewAll}
          className="font-label-md text-label-md text-primary-container hover:text-primary active:scale-95 transition-all"
        >
          View all
        </button>
      </section>
      <section className="grid grid-cols-2 gap-space-xs px-space-md pb-space-xl animate-[fadeIn_0.5s_ease-out_forwards]">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        {results.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </section>
    </>
  );
}
