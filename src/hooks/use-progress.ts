
'use client';

import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ref, set, get } from 'firebase/database';
import { db } from '@/lib/firebase';

export const useProgress = () => {
  const { user } = useAuth();

  const updateSubjectProgress = useCallback(async (subjectId: string, score: number) => {
    if (!user || !db) return;

    const progressRef = ref(db, `users/${user.uid}/progress/${subjectId}`);
    
    try {
        const snapshot = await get(progressRef);
        const currentBest = snapshot.val() || 0;
        if (score > currentBest) {
            await set(progressRef, score);
        }
    } catch (error) {
        console.error("Failed to update progress:", error);
    }
  }, [user]);

  const getSubjectProgress = useCallback(
    (subjectId: string): number => {
      if (!user || !user.progress) return 0;
      return user.progress[subjectId] || 0;
    },
    [user]
  );

  return { getSubjectProgress, updateSubjectProgress };
};
