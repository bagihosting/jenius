
'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { SchoolType } from "@/lib/types";

interface User {
  name: string;
  email: string;
  schoolType: SchoolType;
  role: 'user' | 'admin';
}

const schoolTypeMap: { [key: string]: string } = {
  SDN: 'SD Negeri',
  SDIT: 'SD Islam Terpadu',
  MI: 'Madrasah Ibtidaiyah',
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // This is a simulation. In a real app, you would fetch this from your database.
        const loadedUsers: User[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('user_') || key === 'user')) {
                try {
                    const userData = JSON.parse(localStorage.getItem(key) || '{}');
                    // Add a simple check to ensure it's a valid user object
                    if (userData.email && userData.name && userData.schoolType && userData.role) {
                         loadedUsers.push(userData);
                    }
                } catch (e) {
                    console.error("Could not parse user data from local storage", e);
                }
            }
        }

        // To avoid duplicates if 'user' and 'user_...' exist for the same user
        const uniqueUsers = Array.from(new Map(loadedUsers.map(user => [user.email, user])).values());
        
        setUsers(uniqueUsers);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manajemen Pengguna</CardTitle>
                <CardDescription>
                    Lihat dan kelola semua pengguna yang terdaftar di sistem.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Jenis Sekolah</TableHead>
                            <TableHead>Peran</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.email}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{schoolTypeMap[user.schoolType] || user.schoolType}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    Tidak ada pengguna ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
