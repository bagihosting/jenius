
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
import { Loader2, Search, Gift, ToggleLeft, ToggleRight, Trash2, Crown, Edit, Save, XCircle } from 'lucide-react';
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
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc, getDoc, setDoc, query, where } from 'firebase/firestore';


interface UserBonus {
  user: User;
  bonus: number;
}

async function getFeatureStatus(): Promise<boolean> {
    const docRef = doc(db, "appConfig", "bonusFeature");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().isActive;
    }
    return false;
}

async function setFeatureStatus(isActive: boolean): Promise<void> {
    const docRef = doc(db, "appConfig", "bonusFeature");
    await setDoc(docRef, { isActive });
}


export default function BonusManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserBonus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [newBonusValue, setNewBonusValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "user"));
      const querySnapshot = await getDocs(q);
      const loadedUsers: UserBonus[] = querySnapshot.docs.map(doc => {
          const userData = doc.data() as User;
          return { user: userData, bonus: userData.bonusPoints || 0 };
      });
      
      setUsers(loadedUsers.sort((a,b) => b.bonus - a.bonus));
      
      const featureStatus = await getFeatureStatus();
      setIsFeatureActive(featureStatus);

    } catch (error) {
      console.error("Error loading data: ", error);
      toast({
        title: 'Gagal Memuat Data',
        description: 'Terjadi kesalahan saat mengambil data dari Firestore.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      loadData();
    }
  }, [isClient]);

  const handleToggleFeature = async (isActive: boolean) => {
    await setFeatureStatus(isActive);
    setIsFeatureActive(isActive);
    toast({
      title: 'Fitur Bonus Diperbarui',
      description: `Fitur bonus telah berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.`,
    });
  };

  const confirmResetBonus = async () => {
    if (!userToReset) return;
    try {
      const userDocRef = doc(db, "users", userToReset.uid);
      await updateDoc(userDocRef, { bonusPoints: 0 });
      toast({ title: 'Bonus Direset', description: `Bonus untuk ${userToReset.name} telah direset.` });
      loadData();
    } catch (error) {
      toast({ title: 'Gagal Mereset Bonus', variant: 'destructive' });
    } finally {
      setUserToReset(null);
    }
  };

  const handleEditBonus = (user: User, currentBonus: number) => {
    setEditingUserEmail(user.email);
    setNewBonusValue(currentBonus.toString());
  };

  const handleCancelEdit = () => {
    setEditingUserEmail(null);
    setNewBonusValue('');
  };

  const handleSaveBonus = async (user: User) => {
    const newBonus = parseFloat(newBonusValue);
    if (isNaN(newBonus) || newBonus < 0) {
      toast({ title: 'Nilai Tidak Valid', description: 'Bonus harus berupa angka positif.', variant: 'destructive' });
      return;
    }
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { bonusPoints: newBonus });
      toast({ title: 'Bonus Diperbarui', description: `Bonus telah berhasil diperbarui.` });
      loadData();
    } catch (error) {
      toast({ title: 'Gagal Memperbarui Bonus', variant: 'destructive' });
    } finally {
      handleCancelEdit();
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(item =>
      (item.user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.user.robloxUsername?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (!isClient) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </div>
    )
  }

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
            <CardDescription>Daftar siswa berdasarkan poin bonus yang terkumpul. Edit atau reset bonus setelah dikirimkan.</CardDescription>
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
                    <TableRow key={user.uid}>
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
                        {editingUserEmail === user.email ? (
                           <Input 
                                type="number"
                                value={newBonusValue}
                                onChange={(e) => setNewBonusValue(e.target.value)}
                                className="h-8 w-32"
                                step="0.01"
                           />
                        ) : (
                           <div className="flex items-center gap-2 font-bold">
                               <Crown className="w-4 h-4 text-amber-500" />
                               {bonus.toFixed(4)}
                           </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {editingUserEmail === user.email ? (
                            <>
                                <Button variant="ghost" size="icon" onClick={() => handleSaveBonus(user)}>
                                    <Save className="h-4 w-4 text-green-600"/>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                                    <XCircle className="h-4 w-4 text-red-600"/>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="icon" onClick={() => handleEditBonus(user, bonus)}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setUserToReset(user)} disabled={bonus === 0}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        )}
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
