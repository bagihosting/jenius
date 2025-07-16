
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Loader2, Search, Gift, ToggleLeft, ToggleRight, Trash2, Crown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserBonus {
  user: User;
  bonus: number;
}

export default function BonusManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserBonus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedUsers: UserBonus[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_')) {
          const userData: User = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.role === 'user') {
            const bonusKey = `bonus_points_${userData.email}`;
            const bonus = parseFloat(localStorage.getItem(bonusKey) || '0');
            loadedUsers.push({ user: userData, bonus });
          }
        }
      }
      setUsers(loadedUsers.sort((a,b) => b.bonus - a.bonus));
      
      const featureStatus = localStorage.getItem('bonus_feature_status');
      setIsFeatureActive(featureStatus === 'active');

    } catch (error) {
      toast({
        title: 'Gagal Memuat Data',
        description: 'Terjadi kesalahan saat mengambil data dari penyimpanan lokal.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFeature = (isActive: boolean) => {
    localStorage.setItem('bonus_feature_status', isActive ? 'active' : 'inactive');
    setIsFeatureActive(isActive);
    toast({
      title: 'Fitur Bonus Diperbarui',
      description: `Fitur bonus telah berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.`,
    });
  };

  const confirmResetBonus = () => {
    if (!userToReset) return;
    try {
      localStorage.setItem(`bonus_points_${userToReset.email}`, '0');
      toast({ title: 'Bonus Direset', description: `Bonus untuk ${userToReset.name} telah direset.` });
      loadData();
    } catch (error) {
      toast({ title: 'Gagal Mereset Bonus', variant: 'destructive' });
    } finally {
      setUserToReset(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(item =>
      (item.user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.user.robloxUsername?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold">Manajemen Bonus</h1>
            <p className="text-muted-foreground">Kelola fitur bonus Robux untuk siswa.</p>
        </div>
         <div className="flex items-center space-x-2">
            <Switch
                id="bonus-feature-toggle"
                checked={isFeatureActive}
                onCheckedChange={handleToggleFeature}
            />
            <Label htmlFor="bonus-feature-toggle" className="flex items-center gap-2 cursor-pointer">
                {isFeatureActive ? <ToggleRight className="text-green-500"/> : <ToggleLeft />}
                {isFeatureActive ? 'Fitur Aktif' : 'Fitur Nonaktif'}
            </Label>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Peringkat Bonus Siswa</CardTitle>
            <CardDescription>Daftar siswa berdasarkan poin bonus yang terkumpul. Reset bonus setelah dikirimkan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa atau username Roblox..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Username Roblox</TableHead>
                  <TableHead>Bonus Terkumpul</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-48">
                      <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-48">
                      Tidak ada data bonus yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(({ user, bonus }) => (
                    <TableRow key={user.username}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <Avatar>
                              <AvatarImage src={user.photoUrl} alt={user.name} />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.robloxUsername || <span className="text-muted-foreground italic">Belum diisi</span>}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-bold">
                            <Crown className="w-4 h-4 text-amber-500" />
                            {bonus.toFixed(4)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setUserToReset(user)} disabled={bonus === 0}>
                            <Trash2 className="mr-2 h-3 w-3" />
                            Reset Bonus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!userToReset} onOpenChange={(open) => !open && setUserToReset(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Bonus Siswa?</AlertDialogTitle>
            <AlertDialogDescription>
                Tindakan ini akan mengatur ulang bonus untuk <strong>{userToReset?.name}</strong> menjadi 0.
                Pastikan Anda telah mengirimkan bonus sebelum mereset. Tindakan ini tidak dapat diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToReset(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetBonus}>Ya, Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
