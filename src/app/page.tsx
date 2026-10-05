"use client";

import { useState, useRef, useEffect } from "react";
import MainInput from "@/components/MainInput";
import SearchButton from "@/components/SearchButton";
import ChipRow from "@/components/ChipRow";
import LoadingState from "@/components/LoadingState";
import ResultsGrid from "@/components/ResultsGrid";
import type { ChipData, Photo } from "@/types";

import photosData from "@/data/photos.json";

// ── Dynamic placeholder ──────────────────────────────────────────────────────
function getPlaceholder(
  person: string | null,
  timeframe: string | null,
  visual: string | null
): string {
  if (!person && !timeframe && !visual) return "What do you remember?";
  if (timeframe && !person)            return "You've added a time. Who was there?";
  if (person && !timeframe)            return "Great! What do you remember happening?";
  if (person && timeframe && !visual)  return "Add a visual detail to narrow it down.";
  return "You're all set — hit Search!";
}

export default function Home() {
  const [mainInput, setMainInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Photo[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [personChip, setPersonChip]       = useState<ChipData>({ state: "idle", value: null });
  const [timeframeChip, setTimeframeChip] = useState<ChipData>({ state: "idle", value: null });
  const [visualChip, setVisualChip]       = useState<ChipData>({ state: "idle", value: null });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-reset when user clears all inputs
  const isInputEmpty = mainInput.trim().length === 0 && personChip.state === "idle" && timeframeChip.state === "idle" && visualChip.state === "idle";
  
  useEffect(() => {
    if (isInputEmpty && hasSearched) {
      setHasSearched(false);
      setResults([]);
      setErrorMsg(null);
    }
  }, [isInputEmpty, hasSearched]);

  const handlePersonChange = (data: ChipData) => {
    setPersonChip(data);
    if (data.state === "expanding") {
      if (timeframeChip.state === "expanding") setTimeframeChip({ ...timeframeChip, state: "idle" });
      if (visualChip.state === "expanding") setVisualChip({ ...visualChip, state: "idle" });
    }
  };
  const handleTimeframeChange = (data: ChipData) => {
    setTimeframeChip(data);
    if (data.state === "expanding") {
      if (personChip.state === "expanding") setPersonChip({ ...personChip, state: "idle" });
      if (visualChip.state === "expanding") setVisualChip({ ...visualChip, state: "idle" });
    }
  };
  const handleVisualChange = (data: ChipData) => {
    setVisualChip(data);
    if (data.state === "expanding") {
      if (personChip.state === "expanding") setPersonChip({ ...personChip, state: "idle" });
      if (timeframeChip.state === "expanding") setTimeframeChip({ ...timeframeChip, state: "idle" });
    }
  };


  const anyChipExpanding = personChip.state === "expanding" || timeframeChip.state === "expanding" || visualChip.state === "expanding";
  const placeholder = getPlaceholder(personChip.value, timeframeChip.value, visualChip.value);

  async function handleSearch() {
    if (isLoading || isInputEmpty) return;
    
    if (!navigator.onLine) {
      setErrorMsg("Check your internet connection");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setErrorMsg(null);
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);
    
    const payload = {
      conversational_text: mainInput,
      clues: {
        person: personChip.value,
        timeframe: timeframeChip.value,
        visual_detail: visualChip.value,
      },
    };
    
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "An error occurred while searching");
      }
      
      setResults(data);
    } catch (error: any) {
      if (error.name === "AbortError") {
        return;
      }
      console.error(error);
      setErrorMsg(error.message || "Failed to search. Please try again.");
      setResults([]);
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsLoading(false);
      }
    }
  }

  const handleViewAll = () => {
    if (hasSearched) {
      // If we are in search results, "View all" should clear the search and show the full gallery
      setHasSearched(false);
      setMainInput("");
      setPersonChip({ state: "idle", value: null });
      setTimeframeChip({ state: "idle", value: null });
      setVisualChip({ state: "idle", value: null });
    } else {
      // If we are already viewing the full gallery, maybe just scroll to top or alert
      alert("You are already viewing all 20 photos in the mock library!");
    }
  };

  return (
    <>
      {errorMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-error-container/20 border border-error-container/50 text-error px-6 py-3 rounded-md font-medium z-[100] backdrop-blur-md shadow-lg flex items-center gap-3">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="bg-transparent border-none text-inherit cursor-pointer text-xl leading-none">×</button>
        </div>
      )}

      {/* ── Search card ──────────────────────────────────────────── */}
      <section className="px-space-md pt-space-xs pb-space-md">
        <div className="relative overflow-hidden rounded-lg bg-surface-container p-space-md shadow-xl">
          {/* Ambient Glow Behind AI Elements */}
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-36 h-36 rounded-full bg-tertiary-container/10 blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-space-xs mb-space-sm relative z-10">
            <span className="material-symbols-outlined text-primary-container text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile bg-gradient-to-r from-on-surface via-primary-fixed to-primary-container bg-clip-text text-transparent">
              Find your photos with a memory
            </h2>
          </div>

          <MainInput
            value={mainInput}
            onChange={setMainInput}
            placeholder={placeholder}
            disabled={isLoading}
            onEnter={() => {
              if (!anyChipExpanding) {
                handleSearch();
              }
            }}
          />

          <ChipRow
            personChip={personChip}
            timeframeChip={timeframeChip}
            visualChip={visualChip}
            onPersonChange={handlePersonChange}
            onTimeframeChange={handleTimeframeChange}
            onVisualChange={handleVisualChange}
            disabled={isLoading}
          />

          <div className="flex items-center pt-space-sm bg-surface-container justify-end relative z-10">
            <SearchButton
              onClick={handleSearch}
              isLoading={isLoading}
              isDisabled={isInputEmpty}
            />
          </div>
        </div>
      </section>

      {/* ── Results area ──────────────────────────────── */}
      {isLoading ? (
        <LoadingState />
      ) : hasSearched ? (
        <ResultsGrid results={results} title="Search results" subtitle="Matched photos" onViewAll={handleViewAll} />
      ) : (
        <ResultsGrid results={photosData as Photo[]} title="Recent photos" subtitle="Oct 2024" onViewAll={handleViewAll} />
      )}
    </>
  );
}
