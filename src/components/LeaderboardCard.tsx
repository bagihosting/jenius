
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Loader2, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';


export function LeaderboardCard() {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !authLoading && isAuthenticated) {
      if (!db) {
          setIsLoading(false);
          return;
      }
      
      const usersRef = collection(db, 'users'); 
      // Query users with bonusPoints > 0, order by points desc, limit to top 5
      const topUsersQuery = query(
        usersRef, 
        where('bonusPoints', '>', 0),
        orderBy('bonusPoints', 'desc'), 
        limit(5)
      );
      
      const unsubscribe = onSnapshot(topUsersQuery, (querySnapshot) => {
        const usersData: User[] = [];
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                usersData.push({ uid: doc.id, ...user } as User);
            });
        }
        setLeaderboard(usersData);
        setIsLoading(false);
      }, (error) => {
          console.error("Firebase Leaderboard read failed:", error);
          setIsLoading(false);
      });

      return () => unsubscribe();
    } else if (isClient && !authLoading && !isAuthenticated) {
        setIsLoading(false);
    }
  }, [isClient, authLoading, isAuthenticated]);
  
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
                        <span className="font-bold text-lg w-5 text-center">{index + 1}</span>
                        <Avatar>
                            <AvatarImage src={user.photoUrl} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-semibold truncate flex items-center gap-1.5">
                                {user.name}
                                {index === 0 && (user.bonusPoints || 0) > 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                            </p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                        <div className="font-bold text-primary">{(user.bonusPoints || 0).toFixed(4)}</div>
                    </div>
                ))}
                {leaderboard.length === 0 && (
                    <p className="text-center text-muted-foreground h-40 flex items-center justify-center">
                        Belum ada data peringkat. Ayo selesaikan kuis untuk jadi yang pertama!
                    </p>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
