
'use client';

import React, { useState, useEffect } from 'react';
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
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { ref, onValue, set, remove, push, child } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { UserForm, userSchema } from '@/components/UserForm';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      role: 'user',
      schoolType: undefined,
      schoolName: '',
      password: '',
      major: '',
    },
  });

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data).map((key) => ({
          uid: key,
          ...data[key],
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
        ...user,
        password: '', // Clear password on edit
    });
    setIsSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    form.reset({
      name: '',
      username: '',
      email: '',
      role: 'user',
      schoolType: undefined,
      schoolName: '',
      password: '',
      major: '',
    });
    setIsSheetOpen(true);
  };
  
  const handleDelete = async (uid: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat diurungkan.")) {
      try {
        await remove(ref(db, `users/${uid}`));
        toast({ title: 'Pengguna berhasil dihapus' });
      } catch (error) {
        toast({ title: 'Gagal menghapus pengguna', variant: 'destructive' });
      }
    }
  };


  const onSubmit = async (values: any) => {
      try {
        let uid = editingUser?.uid;
        if (uid) { // Editing existing user
          const userRef = ref(db, `users/${uid}`);
          await set(userRef, {
              ...editingUser,
              ...values,
              password: editingUser.password // Keep original password hash unless changed
          });
          toast({ title: "Pengguna berhasil diperbarui" });
        } else { // Creating new user
            // This is a simplified user creation. Does not create an Auth user.
            const newUserRef = push(child(ref(db), 'users'));
            await set(newUserRef, values);
            toast({ title: "Pengguna baru berhasil ditambahkan (tanpa Auth)" });
        }
        setIsSheetOpen(false);
      } catch (error: any) {
          toast({ title: "Operasi Gagal", description: error.message, variant: 'destructive' });
      }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Tambah, lihat, dan edit pengguna.</p>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4"/>
            Tambah Pengguna
        </Button>
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
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.schoolName || user.major || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                        </Button>
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
      
       <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
            <SheetHeader>
                <SheetTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</SheetTitle>
                <SheetDescription>
                   {editingUser ? 'Ubah detail pengguna di bawah ini.' : 'Isi formulir untuk membuat pengguna baru.'}
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
    </>
  );
}
