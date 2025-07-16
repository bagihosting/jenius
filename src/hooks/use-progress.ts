
'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

type ProgressData = {
  [subjectId: string]: number;
};

// NOTE: This hook now uses component state and is NOT persisted.
// Progress will be lost on page refresh.
export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>({});

  const updateSubjectProgress = useCallback(async (subjectId: string, score: number) => {
    if (!user) return;

    const newProgress = {
      ...progress,
      [subjectId]: Math.max(progress[subjectId] || 0, score),
    };
    
    setProgress(newProgress);
    console.warn("Progress saved to local state, but not persisted (no database).");

  }, [user, progress]);

  const getSubjectProgress = useCallback(
    (subjectId: string) => {
      return progress[subjectId] || 0;
    },
    [progress]
  );

  return { getSubjectProgress, updateSubjectProgress };
};
