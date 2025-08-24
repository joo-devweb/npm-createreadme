// © Nathan 2025

import React, { useEffect } from 'react';

interface BotDetectorProps {
  onDetect: () => void;
}

export function BotDetector({ onDetect }: BotDetectorProps): null {
  useEffect(() => {
    const handleDetection = (e: Event) => {
        e.preventDefault();
        onDetect();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')) || // Mac equivalents
        (e.ctrlKey && e.key === 'U')
      ) {
        handleDetection(e);
      }
    };

    document.addEventListener('contextmenu', handleDetection);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleDetection);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDetect]);

  return null;
}