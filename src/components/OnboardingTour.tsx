"use client";

import { useEffect, useState } from "react";
import { Joyride, Step, CallBackProps, STATUS } from "react-joyride";

export default function OnboardingTour() {
  const [mounted, setMounted] = useState(false);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: "#tour-main-input",
      content: "Welcome! Describe a memory you are looking for in plain English. For example, 'drinking hot cocoa while it pours outside'.",
      disableBeacon: true,
      placement: "bottom"
    },
    {
      target: "#tour-chip-row",
      content: "Know exactly who was there? Use these clue chips to lock in hard constraints. The AI will never miss them.",
      placement: "bottom"
    },
    {
      target: "#tour-search-button",
      content: "When you're ready, hit Search and the AI will mathematically match your fuzzy memory to the right photos!",
      placement: "top"
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("hasSeenTour", "true");
    }
  };

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          backgroundColor: '#FFFFFF', // Stark white to completely stand out against the dark app
          primaryColor: '#0B57D0',    // Vivid Google Blue
          textColor: '#1A1C19',       // Dark text for readability
          zIndex: 1000,
        },
        buttonNext: {
          backgroundColor: '#0B57D0',
          color: '#FFFFFF',
          fontWeight: 'bold',
          borderRadius: '24px',
          padding: '8px 16px'
        },
        buttonBack: {
          color: '#5F6368'
        },
        tooltip: {
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 8px 10px -6px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(0,0,0,0.1)'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)' // Make the rest of the app much darker so the white tooltip shines
        }
      }}
    />
  );
}
