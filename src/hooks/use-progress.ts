'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

const BASE_PROGRESS_KEY = 'pintarElementaryProgress';

type ProgressData = {
  [subjectId: string]: number;
};

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>({});

  const getProgressKey = useCallback(() => {
    if (!user?.email) return null;
    return `${BASE_PROGRESS_KEY}_${user.email}`;
  }, [user?.email]);

  useEffect(() => {
    const progressKey = getProgressKey();
    if (!progressKey) {
        setProgress({}); // Reset progress if no user
        return;
    };

    try {
      const storedProgress = localStorage.getItem(progressKey);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      } else {
        setProgress({}); // Initialize if no progress found for this user
      }
    } catch (error) {
      console.error('Failed to read progress from localStorage', error);
      setProgress({});
    }
  }, [getProgressKey]);

  const updateSubjectProgress = useCallback((subjectId: string, score: number) => {
    const progressKey = getProgressKey();
    if (!progressKey) return;

    setProgress((prevProgress) => {
      const newProgress = {
        ...prevProgress,
        [subjectId]: Math.max(prevProgress[subjectId] || 0, score),
      };
      try {
        localStorage.setItem(progressKey, JSON.stringify(newProgress));
      } catch (error) {
        console.error('Failed to save progress to localStorage', error);
      }
      return newProgress;
    });
  }, [getProgressKey]);

  const getSubjectProgress = useCallback(
    (subjectId: string) => {
      return progress[subjectId] || 0;
    },
    [progress]
  );

  return { getSubjectProgress, updateSubjectProgress };
};
