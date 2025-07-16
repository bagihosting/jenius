
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';


const schoolTypes = [
  { id: 'SDN', name: 'SD Negeri' },
  { id: 'SDIT', name: 'SD Islam Terpadu' },
  { id: 'MI', name: 'Madrasah Ibtidaiyah (MI)' },
];

const userSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus memiliki setidaknya 2 karakter.' }),
  username: z.string().min(3, { message: 'Username harus memiliki setidaknya 3 karakter.' }).regex(/^[a-z0-9_]+$/, 'Username hanya boleh berisi huruf kecil, angka, dan garis bawah (_).'),
  email: z.string().email({ message: 'Email tidak valid.' }),
  schoolType: z.enum(['SDN', 'SDIT', 'MI']),
  role: z.enum(['user', 'admin'], { required_error: 'Peran harus dipilih.' }),
  password: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

function UserForm({ form, onSubmit, editingUser }: { form: any, onSubmit: (data: UserFormValues) => void, editingUser: User | null }) {
    const role = useWatch({
        control: form.control,
        name: 'role',
    });

    useEffect(() => {
        if (role === 'admin') {
            form.setValue('schoolType', 'SDN');
        }
    }, [role, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} disabled={!!editingUser} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@contoh.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={editingUser ? 'Isi untuk mengubah' : 'Password baru'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peran</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih peran" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {role === 'user' && (
                    <FormField
                      control={form.control}
                      name="schoolType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Sekolah</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis sekolah" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {schoolTypes.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </Form>
    )
}

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
    form.reset({ name: '', username: '', email: '', schoolType: 'SDN', role: 'user', password: '' });
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
                      <TableCell>{user.role === 'admin' ? 'N/A' : user.schoolType}</TableCell>
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
          <UserForm form={form} onSubmit={onSubmit} editingUser={editingUser} />
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
