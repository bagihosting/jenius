
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ProgressData = {
  [subjectId: string]: number;
};

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>({});

  useEffect(() => {
    if (user && user.progress) {
      setProgress(user.progress);
    } else {
      setProgress({});
    }
  }, [user]);

  const updateSubjectProgress = useCallback(async (subjectId: string, score: number) => {
    if (!user) return;

    const newProgress = {
      ...progress,
      [subjectId]: Math.max(progress[subjectId] || 0, score),
    };
    
    setProgress(newProgress);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        progress: newProgress
      });
    } catch (error) {
      console.error('Failed to save progress to Firestore', error);
      // Optionally revert state or show toast
    }
  }, [user, progress]);

  const getSubjectProgress = useCallback(
    (subjectId: string) => {
      return progress[subjectId] || 0;
    },
    [progress]
  );

  return { getSubjectProgress, updateSubjectProgress };
};
