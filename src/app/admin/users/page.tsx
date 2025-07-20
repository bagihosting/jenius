
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { ref, get, update, remove } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { UserForm, userSchema } from '@/components/UserForm';
import { useAuth } from '@/context/AuthContext';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      role: 'user',
      schoolType: undefined,
      schoolName: '',
      major: '',
      robloxUsername: '',
      bonusPoints: 0,
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated || !db) {
        setUsers([]);
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const userList = Object.keys(data).map((key) => ({
                uid: key,
                ...data[key],
            }));
            setUsers(userList);
        } else {
            setUsers([]);
        }
    } catch (error: any) {
        console.error("Firebase user list read failed:", error);
        toast({ title: 'Gagal memuat pengguna', description: error.message, variant: 'destructive' });
        setUsers([]);
    } finally {
        setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    if (isClient && !authLoading) {
      if (isAuthenticated && user?.role === 'admin') {
        fetchUsers();
      } else {
        setIsLoading(false);
      }
    }
  }, [isClient, authLoading, isAuthenticated, user, fetchUsers]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
        ...user,
        password: '', // Clear password field on edit
    });
    setIsSheetOpen(true);
  };
  
  const handleDelete = async (uid: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat diurungkan dan akan menghapus data dari Realtime Database. Pengguna Firebase Auth tidak akan terhapus.")) {
      if (!db) {
        toast({ title: 'Koneksi database gagal', variant: 'destructive' });
        return;
      }
      try {
        await remove(ref(db, `users/${uid}`));
        toast({ title: 'Pengguna berhasil dihapus dari database' });
        setUsers(prev => prev.filter(u => u.uid !== uid)); // Optimistic UI update
      } catch (error) {
        toast({ title: 'Gagal menghapus pengguna', variant: 'destructive' });
        console.error(error);
      }
    }
  };


  const onSubmit = async (values: any) => {
      if (!editingUser?.uid || !db) {
        toast({ title: "Error", description: "Tidak ada pengguna yang dipilih untuk diedit.", variant: "destructive" });
        return;
      }
      
      try {
        const userRef = ref(db, `users/${editingUser.uid}`);
        
        // Prepare data for update, removing password if it's empty
        const { password, ...updateData } = values;

        // Ensure bonusPoints is a number
        updateData.bonusPoints = Number(updateData.bonusPoints) || 0;

        await update(userRef, updateData);
        
        toast({ title: "Pengguna berhasil diperbarui" });
        
        // Refresh local data
        setUsers(prev => prev.map(u => u.uid === editingUser.uid ? { ...u, ...updateData } : u));

        setIsSheetOpen(false);
        setEditingUser(null);

      } catch (error: any) {
          toast({ title: "Operasi Gagal", description: error.message, variant: 'destructive' });
      }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Lihat dan edit pengguna yang terdaftar.</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Sekolah/Jurusan</TableHead>
                  <TableHead>Poin Bonus</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-secondary-foreground'}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.schoolName || user.major || 'N/A'}</TableCell>
                    <TableCell>{(user.bonusPoints || 0).toFixed(4)}</TableCell>
                    <TableCell className="text-right">
                      <Sheet open={isSheetOpen && editingUser?.uid === user.uid} onOpenChange={(open) => {
                          if (!open) {
                              setIsSheetOpen(false);
                              setEditingUser(null);
                          }
                      }}>
                        <SheetTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                         <SheetContent className="w-full sm:max-w-lg flex flex-col">
                            <SheetHeader>
                                <SheetTitle>Edit Pengguna</SheetTitle>
                                <SheetDescription>
                                  Ubah detail pengguna di bawah ini. Perubahan akan disimpan di Realtime Database.
                                </SheetDescription>
                            </SheetHeader>
                            <UserForm form={form} onSubmit={onSubmit} editingUser={editingUser}>
                                <SheetFooter className="mt-auto pt-4">
                                    <SheetClose asChild>
                                        <Button type="button" variant="outline">Batal</Button>
                                    </SheetClose>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Simpan Perubahan
                                    </Button>
                                </SheetFooter>
                            </UserForm>
                        </SheetContent>
                      </Sheet>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(user.uid)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
