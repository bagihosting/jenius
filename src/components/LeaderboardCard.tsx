
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Loader2, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { db } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
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
      
      // Change from 'users' to the public 'leaderboard' node
      const leaderboardRef = ref(db, 'leaderboard'); 
      // Query to get top 5 users by bonusPoints
      const topUsersQuery = query(leaderboardRef, orderByChild('bonusPoints'), limitToLast(5));
      
      const unsubscribe = onValue(topUsersQuery, (snapshot) => {
        const usersData: User[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            // Only add users who have some points to the leaderboard
            if (user.bonusPoints > 0) {
               usersData.push({ uid: childSnapshot.key!, ...user });
            }
          });
        }
        // Sort in descending order and set state
        setLeaderboard(usersData.sort((a, b) => (b.bonusPoints || 0) - (a.bonusPoints || 0)));
        setIsLoading(false);
      }, (error) => {
          console.error("Firebase Leaderboard read failed:", error);
          setIsLoading(false);
      });

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    } else if (isClient && !authLoading && !isAuthenticated) {
        // If user is not authenticated, don't try to load leaderboard
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
