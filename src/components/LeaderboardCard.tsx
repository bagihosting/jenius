
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/lib/types';
import { Loader2, Trophy, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface StudentRank {
  user: User;
  averageScore: number;
}

const getAverageScore = (userEmail: string): number => {
  if (typeof window === 'undefined') return 0;
  const progressKey = `pintarElementaryProgress_${userEmail}`;
  const storedProgress = localStorage.getItem(progressKey);
  if (!storedProgress) return 0;

  try {
    const progressData = JSON.parse(storedProgress);
    const scores: number[] = Object.values(progressData);
    if (scores.length === 0) return 0;

    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / scores.length);
  } catch (error) {
    console.error(`Failed to parse progress for ${userEmail}:`, error);
    return 0;
  }
};

export function LeaderboardCard() {
  const { user: currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<StudentRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const allUsers: User[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_')) {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.role === 'user') {
            allUsers.push(userData);
          }
        }
      }

      const rankedUsers: StudentRank[] = allUsers
        .map(user => ({
          user,
          averageScore: getAverageScore(user.email),
        }))
        .sort((a, b) => b.averageScore - a.averageScore);
      
      setLeaderboard(rankedUsers);
      setLoading(false);
    }
  }, []);

  const TrophyIcon = getIcon('Trophy');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <TrophyIcon className="text-yellow-500" />
          Peringkat Kelas
        </CardTitle>
        <CardDescription>Siswa dengan skor rata-rata tertinggi.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
            <p>Belum ada siswa yang menyelesaikan kuis.</p>
          </div>
        ) : (
          <ScrollArea className="h-80 pr-4">
            <ul className="space-y-4">
              {leaderboard.map((student, index) => (
                <li
                  key={student.user.username}
                  className={`flex items-center gap-4 p-2 rounded-md ${
                    student.user.username === currentUser?.username ? 'bg-primary/10 border border-primary/20' : ''
                  }`}
                >
                  <div className="font-bold text-lg w-6 text-center text-muted-foreground">{index + 1}</div>
                  <Avatar>
                    <AvatarImage src={student.user.photoUrl} alt={student.user.name} />
                    <AvatarFallback>
                        <UserIcon className="w-4 h-4"/>
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-semibold truncate">{student.user.name}</p>
                    <p className="text-xs text-muted-foreground">{student.user.schoolName}</p>
                  </div>
                  <Badge variant="secondary" className="font-bold">{student.averageScore}%</Badge>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to satisfy build process, can be removed if not needed elsewhere
export const getIcon = (name: string) => {
    return Trophy;
}
