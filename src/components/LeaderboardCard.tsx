
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getFirebase, isFirebaseConfigured } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import type { User } from '@/lib/types';
import { Crown } from 'lucide-react';


const getAverageScore = (progress: { [subjectId: string]: number } | undefined) => {
    if (!progress || Object.keys(progress).length === 0) return 0;
    const scores = Object.values(progress);
    const total = scores.reduce((acc, score) => acc + score, 0);
    return Math.round(total / scores.length);
};


export function LeaderboardCard() {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
        setIsLoading(false);
        return;
    }
    const { db } = getFirebase();
    if (!db) {
        setIsLoading(false);
        return;
    }

    const usersRef = ref(db, 'users');
    const topUsersQuery = query(usersRef, orderByChild('bonusPoints'), limitToLast(5));
    
    const unsubscribe = onValue(topUsersQuery, (snapshot) => {
      const usersData: User[] = [];
      snapshot.forEach((childSnapshot) => {
        usersData.push({ uid: childSnapshot.key, ...childSnapshot.val() });
      });
      setLeaderboard(usersData.sort((a, b) => (b.bonusPoints || 0) - (a.bonusPoints || 0)));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Trophy className="text-yellow-500" />
          Papan Peringkat
        </CardTitle>
        <CardDescription>Pengguna dengan Poin Bonus tertinggi.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        ) : (
            <div className="space-y-4">
                {leaderboard.map((user, index) => (
                    <div key={user.uid} className="flex items-center gap-4">
                        <span className="font-bold text-lg w-5">{index + 1}</span>
                        <Avatar>
                            <AvatarImage src={user.photoUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-semibold truncate flex items-center gap-1.5">
                                {user.name}
                                {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                            </p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                        <div className="font-bold text-primary">{(user.bonusPoints || 0).toFixed(2)}</div>
                    </div>
                ))}
                {leaderboard.length === 0 && (
                    <p className="text-center text-muted-foreground h-40 flex items-center justify-center">
                        Belum ada data peringkat.
                    </p>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
