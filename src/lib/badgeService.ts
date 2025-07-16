
'use client';

import { Award, Brain, Star, Gem, Rocket, LucideProps } from 'lucide-react';
import type { User } from './types';

export interface BadgeTier {
  level: number;
  name: string;
  icon: React.ElementType<LucideProps>;
  color: string;
  minDays: number;
  minQuizzes: number;
  bonusPerQuiz: number;
}

export const badgeTiers: BadgeTier[] = [
  { level: 1, name: 'Murid Baru', icon: Rocket, color: 'text-gray-500', minDays: 3, minQuizzes: 0, bonusPerQuiz: 0.001 },
  { level: 2, name: 'Pembelajar Rajin', icon: Award, color: 'text-blue-500', minDays: 7, minQuizzes: 50, bonusPerQuiz: 0.01 },
  { level: 3, name: 'Jenius Cilik', icon: Brain, color: 'text-purple-500', minDays: 30, minQuizzes: 100, bonusPerQuiz: 0.1 },
  { level: 4, name: 'Bintang Kelas', icon: Star, color: 'text-yellow-500', minDays: 90, minQuizzes: 300, bonusPerQuiz: 0.5 },
  { level: 5, name: 'Legenda Sekolah', icon: Gem, color: 'text-red-500', minDays: 365, minQuizzes: 1000, bonusPerQuiz: 1.0 },
];

const adminBadge: BadgeTier = {
  level: 6, name: 'Super Admin', icon: Gem, color: 'text-amber-500', minDays: 0, minQuizzes: 0, bonusPerQuiz: 0
};

const defaultBadge: BadgeTier = {
  level: 0, name: 'Pemula', icon: Rocket, color: 'text-gray-400', minDays: 0, minQuizzes: 0, bonusPerQuiz: 0
};

interface UserStats {
  accountAgeInDays: number;
  quizCompletions: number;
}

const getUserStats = (user: User | null): UserStats => {
  if (typeof window === 'undefined' || !user || !user.email) {
    return { accountAgeInDays: 0, quizCompletions: 0 };
  }

  const registeredAt = user.registeredAt ? new Date(user.registeredAt) : new Date();
  const now = new Date();
  const accountAgeInDays = Math.floor((now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60 * 24));
  
  const quizCompletions = parseInt(localStorage.getItem(`quizCompletions_${user.email}`) || '0', 10);

  return { accountAgeInDays, quizCompletions };
};

export const getBadgeInfo = (user: User | null): BadgeTier => {
  if (!user) return defaultBadge;
  if (user.role === 'admin') return adminBadge;

  const { accountAgeInDays, quizCompletions } = getUserStats(user);

  // Find the highest tier the user qualifies for
  let currentTier = defaultBadge;
  for (const tier of badgeTiers) {
    if (accountAgeInDays >= tier.minDays && quizCompletions >= tier.minQuizzes) {
      currentTier = tier;
    }
  }

  return currentTier;
};

export const recordQuizCompletion = (user: User | null) => {
    if (typeof window === 'undefined' || !user || !user.email) return;

    const key = `quizCompletions_${user.email}`;
    const currentCompletions = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, (currentCompletions + 1).toString());
}
