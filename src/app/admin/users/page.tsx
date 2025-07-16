
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
    const [formData, setFormData] = useState({ name: '', email: '', schoolType: 'SDN' as SchoolType, password: '', badge: '' });
    const { toast } = useToast();

    const loadUsers = useCallback(() => {
        setIsLoading(true);
        try {
            const loadedUsers: User[] = [];
            // Ensure admin user exists for login
            if (!localStorage.getItem('user_admin@ayahjenius.com')) {
                localStorage.setItem('user_admin@ayahjenius.com', JSON.stringify({
                    name: 'Admin Jenius',
                    email: 'admin@ayahjenius.com',
                    schoolType: 'SDN',
                    role: 'admin'
                }));
                localStorage.setItem('pwd_admin@ayahjenius.com', 'admin123');
            }
             // Ensure default user exists for login
            if (!localStorage.getItem('user_user@ayahjenius.com')) {
                localStorage.setItem('user_user@ayahjenius.com', JSON.stringify({
                    name: 'Pengguna Jenius',
                    email: 'user@ayahjenius.com',
                    schoolType: 'SDN',
                    role: 'user'
                }));
                 localStorage.setItem('pwd_user@ayahjenius.com', 'password123');
            }

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('user_')) {
                    try {
                        const userData = JSON.parse(localStorage.getItem(key) || '{}');
                        if (userData.email && userData.name && userData.schoolType && userData.role) {
                             loadedUsers.push(userData);
                        }
                    } catch (e) {
                        console.error("Could not parse user data from local storage", e);
                    }
                }
            }
            const uniqueUsers = Array.from(new Map(loadedUsers.map(user => [user.email, user])).values());
            setUsers(uniqueUsers);
        } catch (error) {
            console.error("Error loading users from local storage", error);
            toast({
                title: 'Gagal Memuat Pengguna',
                description: 'Terjadi kesalahan saat mengakses data dari local storage.',
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
                email: user.email,
                schoolType: user.schoolType,
                password: '', 
                badge: user.badge || '',
            });
        } else {
            setFormData({ name: '', email: '', schoolType: 'SDN', password: '', badge: '' });
        }
        setIsDialogOpen(true);
    };

    const handleFormChange = (value: string, field: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleFormSubmit = () => {
        const { name, email, schoolType, password, badge } = formData;
        if (!name || !email || !schoolType) {
            toast({ title: "Error", description: "Nama, email, dan jenis sekolah harus diisi.", variant: "destructive" });
            return;
        }

        if (currentUser) { 
            if (currentUser.email !== email && localStorage.getItem(`user_${email}`)) {
                toast({ title: "Error", description: "Pengguna dengan email baru ini sudah ada.", variant: "destructive" });
                return;
            }
            if (currentUser.email !== email) { 
                 localStorage.removeItem(`user_${currentUser.email}`);
            }
            const updatedUser: User = { ...currentUser, name, email, schoolType, badge: badge || undefined };
            localStorage.setItem(`user_${email}`, JSON.stringify(updatedUser));
            if (password) {
                localStorage.setItem(`pwd_${email}`, password);
            }
            toast({ title: "Sukses", description: "Data pengguna berhasil diperbarui." });
        } else { 
            if (!password) {
                 toast({ title: "Error", description: "Password harus diisi untuk pengguna baru.", variant: "destructive" });
                 return;
            }
            if (localStorage.getItem(`user_${email}`)) {
                 toast({ title: "Error", description: "Pengguna dengan email ini sudah ada.", variant: "destructive" });
                 return;
            }
            const newUser: User = { name, email, schoolType, role: 'user', badge: badge || undefined };
             localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
             localStorage.setItem(`pwd_${email}`, password);
             toast({ title: "Sukses", description: "Pengguna baru berhasil ditambahkan." });
        }
        
        loadUsers();
        setIsDialogOpen(false);
    };

    const handleDeleteUser = (email: string) => {
        if (email === 'admin@ayahjenius.com') {
            toast({ title: "Aksi Ditolak", description: "Tidak dapat menghapus akun admin.", variant: "destructive" });
            return;
        }
        localStorage.removeItem(`user_${email}`);
        localStorage.removeItem(`pwd_${email}`);
        toast({ title: "Sukses", description: "Pengguna berhasil dihapus." });
        loadUsers();
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
                                <TableCell colSpan={6} className="text-center">
                                    <div className="flex justify-center items-center p-4">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.email}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
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
                                                    <AlertDialogAction onClick={() => handleDeleteUser(user.email)} className="bg-destructive hover:bg-destructive/90">
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
                                <TableCell colSpan={6} className="text-center">
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
