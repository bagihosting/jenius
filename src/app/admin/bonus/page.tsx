
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { get, ref, update, onValue } from 'firebase/database';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';


export default function BonusManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (!db) {
        setIsLoading(false);
        return;
    }
    
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersList: User[] = Object.keys(usersData).map(key => ({
          ...usersData[key],
          uid: key
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePointsChange = (uid: string, value: string) => {
    const newUsers = users.map(user => {
      if (user.uid === uid) {
        // Allow empty string for clearing, default to 0 for calculations
        return { ...user, bonusPoints: value === '' ? undefined : Number(value) };
      }
      return user;
    });
    setUsers(newUsers);
  };
  
  const handleSavePoints = async (uid: string) => {
    const user = users.find(u => u.uid === uid);
    if (!user || !db) return;

    try {
      const userRef = ref(db, `users/${uid}`);
      // Ensure that we save a number, defaulting to 0 if it's undefined or NaN
      const pointsToSave = Number.isNaN(Number(user.bonusPoints)) ? 0 : Number(user.bonusPoints) || 0;
      await update(userRef, { bonusPoints: pointsToSave });
      toast({
        title: 'Berhasil!',
        description: `Poin bonus untuk ${user.name} telah diperbarui.`,
      });
    } catch (error) {
      console.error("Error saving points:", error);
      toast({
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan poin bonus.',
        variant: 'destructive',
      });
    }
  };


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold">Manajemen Bonus</h1>
            <p className="text-muted-foreground">Ubah poin bonus pengguna secara manual.</p>
        </div>
      </div>
       {!isClient || isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Gift className="text-primary"/>
                Manajemen Poin Bonus
            </CardTitle>
            <CardDescription>
                Lihat dan kelola poin bonus untuk semua pengguna yang terdaftar.
            </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
            {users.map(user => (
              <div key={user.uid} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`points-${user.uid}`} className="sr-only">Poin Bonus</Label>
                  <Input 
                    id={`points-${user.uid}`}
                    type="number"
                    value={user.bonusPoints === undefined ? '' : user.bonusPoints}
                    onChange={(e) => handlePointsChange(user.uid, e.target.value)}
                    className="w-32"
                    step="0.001"
                  />
                  <Button onClick={() => handleSavePoints(user.uid)} size="sm">
                    <Save className="h-4 w-4 mr-2"/>
                    Simpan
                  </Button>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-muted-foreground text-center">Tidak ada pengguna yang ditemukan.</p>
            )}
           </div>
        </CardContent>
      </Card>
      )}
    </>
  );
}
