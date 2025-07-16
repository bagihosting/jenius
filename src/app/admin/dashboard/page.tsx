
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
        setUserCount(allUsers.length);
        setContentCount(1); // For the homepage content
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dasbor Admin</h1>
                    <p className="text-muted-foreground">Ringkasan statistik aplikasi.</p>
                </div>
            </div>
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
            <div className="mt-2">
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
