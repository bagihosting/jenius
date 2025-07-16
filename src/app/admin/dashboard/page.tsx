
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText } from "lucide-react";
import React from "react";

export default function AdminDashboardPage() {
    // In a real app, these numbers would come from a database.
    const [userCount, setUserCount] = React.useState(0);
    const [contentCount, setContentCount] = React.useState(0);

    React.useEffect(() => {
        // Simulate fetching data
        const allUsers = Object.keys(localStorage).filter(k => k.startsWith('user_'));
        setUserCount(allUsers.length + 2); // +2 for default user and admin
        setContentCount(1); // For the homepage content
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dasbor Admin</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Pengguna
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Jumlah akun terdaftar
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Konten Dikelola
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{contentCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Halaman depan (Segera hadir)
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Selamat Datang, Admin!</CardTitle>
                        <CardDescription>
                            Gunakan menu di sebelah kiri untuk menavigasi panel admin. Anda dapat mengelola pengguna dan segera dapat mengedit konten halaman depan.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
