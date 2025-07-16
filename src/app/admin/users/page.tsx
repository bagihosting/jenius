
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Loader2, PlusCircle, Search, Trash, Edit, User as UserIcon, School, Mail, KeyRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { UserForm, userSchema } from '@/components/UserForm';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type UserFormValues = z.infer<typeof userSchema>;

const defaultFormValues: UserFormValues = {
  name: '',
  username: '',
  email: '',
  schoolType: 'SDN',
  schoolName: '',
  role: 'user',
  password: '',
  photoUrl: '',
  badge: '',
  robloxUsername: '',
};

export default function UsersPage() {
  const { toast } = useToast();
  const { user: activeUser, updateUser: updateActiveUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultFormValues,
  });

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const loadedUsers: User[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_')) {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.username && userData.email) {
            loadedUsers.push(userData);
          }
        }
      }
      setUsers(loadedUsers);
    } catch (error) {
      toast({
        title: 'Gagal Memuat Pengguna',
        description: 'Terjadi kesalahan saat mengambil data dari penyimpanan lokal.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddNew = () => {
    setEditingUser(null);
    form.reset(defaultFormValues);
    setIsSheetOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
        ...user,
        photoUrl: user.photoUrl || '',
        badge: user.badge || '',
        robloxUsername: user.robloxUsername || '',
        password: '',
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    try {
      localStorage.removeItem(`user_${userToDelete.username}`);
      localStorage.removeItem(`pwd_${userToDelete.email}`);
      toast({ title: 'Pengguna Dihapus', description: `Pengguna ${userToDelete.name} telah berhasil dihapus.` });
      loadUsers(); 
    } catch (error) {
      toast({ title: 'Gagal Menghapus', variant: 'destructive' });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const onSubmit = (data: UserFormValues) => {
    try {
      if (editingUser) {
        // Edit existing user
        const updatedUser: User = { ...editingUser, ...data, password: '' };
        delete updatedUser.password;
        
        localStorage.setItem(`user_${updatedUser.username}`, JSON.stringify(updatedUser));
        
        if (data.password) {
            localStorage.setItem(`pwd_${updatedUser.email}`, data.password);
        }
        
        if (editingUser.username !== data.username) {
            localStorage.removeItem(`user_${editingUser.username}`);
        }
        if (editingUser.email !== data.email) {
            localStorage.removeItem(`pwd_${editingUser.email}`);
        }
        
        if (activeUser?.username === editingUser.username) {
            updateActiveUser(updatedUser);
        }

        toast({ title: 'Pengguna Diperbarui', description: `Data untuk ${data.name} telah diperbarui.` });
      } else {
        // Add new user
        if (!data.password) {
          form.setError('password', { type: 'manual', message: 'Password wajib diisi untuk pengguna baru.' });
          return;
        }
        if (localStorage.getItem(`user_${data.username}`)) {
            form.setError('username', { type: 'manual', message: 'Username ini sudah digunakan.' });
            return;
        }
        const newUser: User = { ...data, password: '' }; 
        delete newUser.password;

        localStorage.setItem(`user_${newUser.username}`, JSON.stringify(newUser));
        localStorage.setItem(`pwd_${data.email}`, data.password);
        toast({ title: 'Pengguna Ditambahkan', description: `${data.name} telah berhasil ditambahkan.` });
      }
      setIsSheetOpen(false);
      loadUsers();
    } catch (error) {
      toast({ title: 'Terjadi Kesalahan', description: 'Gagal menyimpan data pengguna.', variant: 'destructive' });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
            <p className="text-muted-foreground">Tambah, edit, atau hapus data pengguna sistem.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2" />
          Tambah Pengguna
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pengguna..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table View for Desktop */}
          <div className="overflow-x-auto hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-48">
                      <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-48">
                      Tidak ada pengguna yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                           <Avatar>
                              <AvatarImage src={user.photoUrl} alt={user.name} />
                              <AvatarFallback>
                                <UserIcon className="w-4 h-4"/>
                              </AvatarFallback>
                           </Avatar>
                           <div>
                                {user.name}
                                <div className="text-xs text-muted-foreground">{user.username}</div>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role === 'admin' ? 'N/A' : (user.schoolName || user.schoolType)}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user)}
                          disabled={activeUser?.username === user.username}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Card View for Mobile */}
          <div className="md:hidden">
             {isLoading ? (
                <div className="text-center p-8">
                  <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  Tidak ada pengguna yang ditemukan.
                </div>
              ) : (
                <div className="divide-y">
                {filteredUsers.map((user) => (
                    <div key={user.username} className="p-4">
                        <div className="flex items-start justify-between">
                             <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src={user.photoUrl} alt={user.name} />
                                    <AvatarFallback>
                                        <UserIcon className="w-4 h-4"/>
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 -mr-2 -mt-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(user)}
                                    disabled={activeUser?.username === user.username}
                                    >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Hapus</span>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            {user.role === 'user' && (
                                <div className="flex items-center gap-2">
                                    <School className="h-4 w-4" />
                                    <span>{user.schoolName || user.schoolType}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                </div>
              )
             }
          </div>

        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-full">
          <SheetHeader>
            <SheetTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</SheetTitle>
            <SheetDescription>
              {editingUser ? `Mengubah data untuk ${editingUser.name}.` : 'Isi detail di bawah ini untuk membuat akun baru.'}
            </SheetDescription>
          </SheetHeader>
           <UserForm form={form} onSubmit={onSubmit} editingUser={editingUser}>
              <SheetFooter className="mt-6">
                <SheetClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </SheetClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </SheetFooter>
          </UserForm>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus pengguna
              <strong> {userToDelete?.name} </strong> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
