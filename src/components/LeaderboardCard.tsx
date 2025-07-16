
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/lib/types';
import { Loader2, User as UserIcon, Trophy } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { getBadgeInfo, BadgeTier } from '@/lib/badgeService';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';


interface StudentRank {
  user: User;
  averageScore: number;
  badge: BadgeTier;
}

const getAverageScore = (user: User): number => {
    if (!user.progress || Object.keys(user.progress).length === 0) return 0;
    
    const scores: number[] = Object.values(user.progress);
    if (scores.length === 0) return 0;

    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / scores.length);
};

export function LeaderboardCard() {
  const { user: currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<StudentRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "users"), 
                where("role", "==", "user")
            );

            const querySnapshot = await getDocs(q);
            const allUsers = querySnapshot.docs.map(doc => doc.data() as User);

            const rankedUsers: StudentRank[] = allUsers
                .map(user => ({
                user,
                averageScore: getAverageScore(user),
                badge: getBadgeInfo(user),
                }))
                .filter(student => student.averageScore > 0)
                .sort((a, b) => b.averageScore - a.averageScore)
                .slice(0, 20); // Get top 20
            
            setLeaderboard(rankedUsers);
        } catch(error) {
            console.error("Error fetching leaderboard: ", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchLeaderboard();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Trophy className="text-yellow-500" />
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
              {leaderboard.map((student, index) => {
                const BadgeIcon = student.badge.icon;
                const isCurrentUser = student.user.uid === currentUser?.uid;
                
                return (
                    <li
                    key={student.user.uid}
                    className={`flex items-center gap-3 p-2 rounded-md ${
                        isCurrentUser ? 'bg-primary/10 border border-primary/20' : ''
                    }`}
                    >
                    <div className="flex items-center gap-3 w-16 shrink-0">
                        <span className="font-bold text-lg w-6 text-center text-muted-foreground">{index + 1}</span>
                        <Avatar className="h-9 w-9">
                        <AvatarImage src={student.user.photoUrl} alt={student.user.name} />
                        <AvatarFallback>
                            <UserIcon className="w-4 h-4"/>
                        </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-grow flex justify-between items-start gap-2">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <BadgeIcon className={`w-4 h-4 ${student.badge.color}`} />
                                <p className="font-semibold leading-tight">{student.user.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground ml-[1.125rem]">{student.user.schoolName}</p>
                        </div>
                        <Badge variant="secondary" className="font-bold shrink-0">{student.averageScore}%</Badge>
                    </div>
                    </li>
                );
            })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
