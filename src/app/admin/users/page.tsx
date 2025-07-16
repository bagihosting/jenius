
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
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Loader2, PlusCircle, Search, Trash, Edit, User as UserIcon, School, Mail, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { UserForm, userSchema } from '@/components/UserForm';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, deleteUser as deleteAuthUser, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';


type UserFormValues = z.infer<typeof userSchema>;

const defaultFormValues: UserFormValues = {
  name: '',
  username: '',
  email: '',
  role: 'user',
  password: '',
  photoUrl: '',
  badge: '',
  robloxUsername: '',
  schoolType: 'SDN',
  schoolName: '',
  major: '',
};

export default function UsersPage() {
  const { toast } = useToast();
  const { user: activeUser, updateUser: updateActiveUser, reauthenticate } = useAuth();
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

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const loadedUsers: User[] = querySnapshot.docs.map(doc => doc.data() as User);
      setUsers(loadedUsers);
    } catch (error) {
      console.error("Error loading users: ", error);
      toast({
        title: 'Gagal Memuat Pengguna',
        description: 'Terjadi kesalahan saat mengambil data dari Firestore.',
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
        password: '', // Password field should be empty for editing
        schoolName: user.schoolName || '',
        schoolType: user.schoolType || 'SDN',
        major: user.major || '',
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      // This is a complex operation and requires re-authentication on the backend/functions for security.
      // For this client-side admin panel, we'll just delete the Firestore doc.
      // Deleting the actual Firebase Auth user from the client is not recommended.
      await deleteDoc(doc(db, "users", userToDelete.uid));
      
      toast({ title: 'Pengguna Dihapus', description: `Data pengguna ${userToDelete.name} telah berhasil dihapus dari database.` });
      loadUsers(); 
    } catch (error) {
      console.error("Delete error: ", error);
      toast({ title: 'Gagal Menghapus', description: 'Gagal menghapus data pengguna.', variant: 'destructive' });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    try {
      const isNewUser = !editingUser;
      
      if (isNewUser) {
        if (!data.password) {
          form.setError('password', { type: 'manual', message: 'Password wajib diisi untuk pengguna baru.' });
          return;
        }
        
        // As an admin panel, creating a user should be done via a server-side function for security.
        // The following is a simplified client-side representation.
        toast({ title: 'Menambahkan Pengguna...', description: 'Fitur ini memerlukan implementasi backend yang aman.' });
        // In a real app, you would call a Cloud Function here to create the auth user and Firestore doc.
        
      } else {
        // Edit existing user
        const userDocRef = doc(db, "users", editingUser!.uid);
        const updatedUserData: Partial<User> = {
          ...data,
        };
        delete updatedUserData.password; // Don't save password to Firestore
        
        await updateDoc(userDocRef, updatedUserData);

        if (activeUser?.uid === editingUser!.uid) {
            updateActiveUser(updatedUserData);
        }

        toast({ title: 'Pengguna Diperbarui', description: `Data untuk ${data.name} telah diperbarui.` });
      }
      setIsSheetOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Form submit error: ", error);
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

  const getRoleBadge = (role: string) => {
    switch(role) {
        case 'admin': return <Badge variant="default">Admin</Badge>;
        case 'mahasiswa': return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Mahasiswa</Badge>;
        default: return <Badge variant="secondary">User</Badge>;
    }
  }

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

          <div className="overflow-x-auto hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Institusi/Jurusan</TableHead>
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
                    <TableRow key={user.uid}>
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
                      <TableCell>{user.role === 'mahasiswa' ? user.major : user.schoolName || 'N/A'}</TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
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
                          disabled={activeUser?.uid === user.uid}
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
                    <div key={user.uid} className="p-4">
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
                                    <div className="mt-2">{getRoleBadge(user.role)}</div>
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
                                    disabled={activeUser?.uid === user.uid}
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
                             {user.role === 'mahasiswa' && (
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    <span>{user.major}</span>
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
              {editingUser ? `Mengubah data untuk ${editingUser.name}.` : 'Fitur ini harus diimplementasikan dengan aman melalui backend.'}
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
              Tindakan ini akan menghapus data pengguna
              <strong> {userToDelete?.name} </strong> dari database. Ini tidak akan menghapus akun autentikasi Firebase mereka. Tindakan ini tidak dapat diurungkan.
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
