
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gift, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ref, onValue } from 'firebase/database';
import { getFirebase, isFirebaseConfigured } from '@/lib/firebase';
import type { User } from '@/lib/types';

export default function AdminDashboardPage() {
    const [userCount, setUserCount] = useState(0);
    const [isBonusFeatureActive, setIsBonusFeatureActive] = useState(true); // Assuming it's always active now
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setIsLoading(false);
            return;
        }
        const { db } = getFirebase();
        if (!db) {
            setIsLoading(false);
            return;
        }

        const usersRef = ref(db, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                setUserCount(Object.keys(snapshot.val()).length);
            } else {
                setUserCount(0);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
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
                            {userCount} pengguna terdaftar di database
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
                             Fitur bonus terhubung ke database
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Selamat Datang, Admin!</CardTitle>
                        <CardDescription>
                           Gunakan menu di samping untuk mengelola pengguna dan bonus.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
