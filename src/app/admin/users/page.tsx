
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Loader2, PlusCircle, Search, Trash, Edit, User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { UserForm, userSchema } from '@/components/UserForm';

type UserFormValues = z.infer<typeof userSchema>;

export default function UsersPage() {
  const { toast } = useToast();
  const { user: activeUser, updateUser: updateActiveUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      schoolType: 'SDN',
      schoolName: '',
      role: 'user',
      password: '',
    },
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
    form.reset({ name: '', username: '', email: '', schoolType: 'SDN', schoolName: '', role: 'user', password: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
        ...user,
        password: '',
    });
    setIsDialogOpen(true);
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
      setIsDialogOpen(false);
      loadUsers();
    } catch (error) {
      toast({ title: 'Terjadi Kesalahan', description: 'Gagal menyimpan data pengguna.', variant: 'destructive' });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Manajemen Pengguna</CardTitle>
              <CardDescription>Tambah, edit, atau hapus data pengguna sistem.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2" />
              Tambah Pengguna
            </Button>
          </div>
          <div className="relative pt-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
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
                    <TableCell colSpan={5} className="text-center">
                      <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Tidak ada pengguna yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <UserIcon className="h-4 w-4 text-muted-foreground"/>
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
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
            <DialogDescription>
              {editingUser ? `Mengubah data untuk ${editingUser.name}.` : 'Isi detail di bawah ini untuk membuat akun baru.'}
            </DialogDescription>
          </DialogHeader>
           <UserForm form={form} onSubmit={onSubmit} editingUser={editingUser}>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </DialogFooter>
          </UserForm>
        </DialogContent>
      </Dialog>

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
