
'use client';

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Award, Star, Brain, Loader2 } from "lucide-react";
import type { SchoolType, User } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

const schoolTypeMap: { [key in SchoolType]: string } = {
  SDN: 'SD Negeri',
  SDIT: 'SD Islam Terpadu',
  MI: 'Madrasah Ibtidaiyah',
};

const badgeMap: { [key: string]: { icon: React.ElementType, label: string, color: string } } = {
    'star_student': { icon: Star, label: 'Bintang Kelas', color: 'text-yellow-500' },
    'diligent_learner': { icon: Award, label: 'Rajin Belajar', color: 'text-blue-500' },
    'little_genius': { icon: Brain, label: 'Jenius Cilik', color: 'text-purple-500' },
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', username: '', email: '', schoolType: 'SDN' as SchoolType, password: '', badge: '' });
    const { toast } = useToast();
    const { user: activeUser, updateUser } = useAuth();

    const loadUsers = useCallback(() => {
        setIsLoading(true);
        try {
            const userKeysStr = localStorage.getItem('user_keys');
            if (!userKeysStr) {
                const initialUsers = [];
                const adminData = localStorage.getItem('user_admin');
                const userData = localStorage.getItem('user_user');
                if (adminData) initialUsers.push(JSON.parse(adminData));
                if (userData) initialUsers.push(JSON.parse(userData));
                setUsers(initialUsers);
                return;
            }

            const userKeys: string[] = JSON.parse(userKeysStr);
            const loadedUsers: User[] = userKeys
                .map(key => {
                    try {
                        const userData = localStorage.getItem(key);
                        return userData ? JSON.parse(userData) : null;
                    } catch {
                        return null;
                    }
                })
                .filter((user): user is User => user !== null && user.username);

            setUsers(loadedUsers);
        } catch (error) {
            console.error("Error loading users from local storage", error);
            toast({
                title: 'Gagal Memuat Pengguna',
                description: 'Terjadi kesalahan saat mengakses data pengguna.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);


    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleDialogOpen = (user: User | null) => {
        setCurrentUser(user);
        if (user) {
            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
                schoolType: user.schoolType,
                password: '', 
                badge: user.badge || '',
            });
        } else {
            setFormData({ name: '', username: '', email: '', schoolType: 'SDN', password: '', badge: '' });
        }
        setIsDialogOpen(true);
    };

    const handleFormChange = (value: string, field: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }
    
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleFormSubmit = () => {
        const { name, username, email, schoolType, password, badge } = formData;
        if (!name || !username || !email || !schoolType) {
            toast({ title: "Error", description: "Nama, username, email, dan jenis sekolah harus diisi.", variant: "destructive" });
            return;
        }

        try {
            const userKeysStr = localStorage.getItem('user_keys') || '[]';
            let userKeys: string[] = JSON.parse(userKeysStr);

            if (currentUser) {
                const updatedUser: User = { ...currentUser, name, username, email, schoolType, badge: badge || undefined };
                
                if (currentUser.username !== username) {
                    if (localStorage.getItem(`user_${username}`)) {
                        toast({ title: "Error", description: "Username baru sudah digunakan.", variant: "destructive" });
                        return;
                    }
                    localStorage.removeItem(`user_${currentUser.username}`);
                    userKeys = userKeys.filter(k => k !== `user_${currentUser.username}`);
                }

                localStorage.setItem(`user_${username}`, JSON.stringify(updatedUser));
                
                if (!userKeys.includes(`user_${username}`)) {
                    userKeys.push(`user_${username}`);
                }
                
                if (password) {
                    localStorage.setItem(`pwd_${email}`, password);
                }

                if(activeUser?.username === currentUser.username) {
                    updateUser(updatedUser);
                }

                toast({ title: "Sukses", description: "Data pengguna berhasil diperbarui." });

            } else {
                if (!password) {
                     toast({ title: "Error", description: "Password harus diisi untuk pengguna baru.", variant: "destructive" });
                     return;
                }
                if (localStorage.getItem(`user_${username}`)) {
                     toast({ title: "Error", description: "Pengguna dengan username ini sudah ada.", variant: "destructive" });
                     return;
                }
                const newUser: User = { name, username, email, schoolType, role: 'user', badge: badge || undefined };
                localStorage.setItem(`user_${username}`, JSON.stringify(newUser));
                localStorage.setItem(`pwd_${email}`, password);
                userKeys.push(`user_${username}`);
                toast({ title: "Sukses", description: "Pengguna baru berhasil ditambahkan." });
            }
            
            localStorage.setItem('user_keys', JSON.stringify(Array.from(new Set(userKeys))));
            loadUsers();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save user:", error);
            toast({ title: "Error", description: "Gagal menyimpan data pengguna.", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (user: User) => {
        if (user.role === 'admin') {
            toast({ title: "Aksi Ditolak", description: "Tidak dapat menghapus akun admin.", variant: "destructive" });
            return;
        }

        try {
            localStorage.removeItem(`user_${user.username}`);
            localStorage.removeItem(`pwd_${user.email}`);

            const userKeysStr = localStorage.getItem('user_keys') || '[]';
            let userKeys: string[] = JSON.parse(userKeysStr);
            userKeys = userKeys.filter(key => key !== `user_${user.username}`);
            localStorage.setItem('user_keys', JSON.stringify(userKeys));

            toast({ title: "Sukses", description: "Pengguna berhasil dihapus." });
            loadUsers();
        } catch(error) {
            console.error("Failed to delete user:", error);
            toast({ title: "Error", description: "Gagal menghapus pengguna.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manajemen Pengguna</CardTitle>
                    <CardDescription>
                        Tambah, edit, atau hapus data pengguna.
                    </CardDescription>
                </div>
                <Button onClick={() => handleDialogOpen(null)}>
                    <PlusCircle className="mr-2"/>
                    Tambah Pengguna
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Jenis Sekolah</TableHead>
                             <TableHead>Lencana</TableHead>
                            <TableHead>Peran</TableHead>
                            <TableHead className="text-right">Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                             <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    <div className="flex justify-center items-center p-4">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.email}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{schoolTypeMap[user.schoolType] || user.schoolType}</TableCell>
                                    <TableCell>
                                        {user.badge && badgeMap[user.badge] ? (
                                            <span className="flex items-center gap-2" title={badgeMap[user.badge].label}>
                                                <badgeMap[user.badge].icon className={`h-5 w-5 ${badgeMap[user.badge].color}`} />
                                                <span className="hidden md:inline">{badgeMap[user.badge].label}</span>
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(user)}>
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" disabled={user.role === 'admin'}>
                                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini akan menghapus pengguna <span className="font-bold">{user.name}</span> secara permanen. Data tidak dapat dikembalikan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteUser(user)} className="bg-destructive hover:bg-destructive/90">
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Tidak ada pengguna ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
                        <DialogDescription>
                            Isi detail pengguna di bawah ini. Klik simpan jika sudah selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nama</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
                         </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">Username</Label>
                            <Input id="username" name="username" value={formData.username} onChange={handleInputChange} className="col-span-3" />
                         </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" />
                         </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password_field" className="text-right">Password</Label>
                            <Input id="password_field" name="password" type="password" value={formData.password} onChange={handleInputChange} className="col-span-3" placeholder={currentUser ? "Kosongkan jika tidak ingin mengubah" : "Wajib diisi"}/>
                         </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="schoolType" className="text-right">Jenis Sekolah</Label>
                            <Select value={formData.schoolType} onValueChange={(value) => handleFormChange(value, 'schoolType')}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih jenis sekolah..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(schoolTypeMap).map(([key, name]) => (
                                        <SelectItem key={key} value={key}>{name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                         </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="badge" className="text-right">Lencana</Label>
                            <Select value={formData.badge} onValueChange={(value) => handleFormChange(value, 'badge')}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Tanpa Lencana" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Tanpa Lencana</SelectItem>
                                    {Object.entries(badgeMap).map(([key, { icon: Icon, label }]) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" /> {label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleFormSubmit}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
