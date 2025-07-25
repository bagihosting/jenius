
'use client';

import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useProgress = () => {
  const { user } = useAuth();

  const updateSubjectProgress = useCallback(async (subjectId: string, score: number) => {
    if (!user || !db) return;

    const userRef = doc(db, `users`, user.uid);
    
    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const currentProgress = docSnap.data().progress || {};
            const currentBest = currentProgress[subjectId] || 0;
            if (score > currentBest) {
                await updateDoc(userRef, {
                    [`progress.${subjectId}`]: score
                });
            }
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
