'use client';

import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY = 'pintarElementaryProgress';

type ProgressData = {
  [subjectId: string]: number;
};

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressData>({});

  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem(PROGRESS_KEY);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
    } catch (error) {
      console.error('Failed to read progress from localStorage', error);
    }
  }, []);

  const updateSubjectProgress = useCallback((subjectId: string, score: number) => {
    setProgress((prevProgress) => {
      const newProgress = {
        ...prevProgress,
        [subjectId]: Math.max(prevProgress[subjectId] || 0, score),
      };
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
      } catch (error) {
        console.error('Failed to save progress to localStorage', error);
      }
      return newProgress;
    });
  }, []);

  const getSubjectProgress = useCallback(
    (subjectId: string) => {
      return progress[subjectId] || 0;
    },
    [progress]
  );

  return { getSubjectProgress, updateSubjectProgress };
};
