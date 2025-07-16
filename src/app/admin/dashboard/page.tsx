
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gift, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";


export default function AdminDashboardPage() {
    const [userCount, setUserCount] = useState(0);
    const [isBonusFeatureActive, setIsBonusFeatureActive] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            // Mock data since database is removed
            setUserCount(0);
            setIsBonusFeatureActive(false);
            setIsLoading(false);
        }
    }, [isClient]);

    if (!isClient || isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

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
                            Database tidak terhubung
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Status Fitur Bonus
                        </CardTitle>
                        <Gift className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${isBonusFeatureActive ? 'text-green-500' : 'text-red-500'}`}>
                            {isBonusFeatureActive ? 'Aktif' : 'Nonaktif'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                             Database tidak terhubung
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Selamat Datang, Admin!</CardTitle>
                        <CardDescription>
                           Manajemen pengguna dan bonus dinonaktifkan karena database telah dihapus.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
