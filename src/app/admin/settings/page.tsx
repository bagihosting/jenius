
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Settings, Save, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { UpgradeInfo } from '@/lib/types';
import { saveUpgradeSettingsAction } from '@/app/actions';

const upgradeInfoSchema = z.object({
    donationAmount: z.coerce.number().min(0, "Jumlah donasi harus positif."),
    bankName: z.string().min(1, "Nama bank tidak boleh kosong."),
    accountNumber: z.string().min(1, "Nomor rekening tidak boleh kosong."),
    accountName: z.string().min(1, "Nama pemilik rekening tidak boleh kosong."),
    instructions: z.string().optional(),
});

type UpgradeInfoFormValues = z.infer<typeof upgradeInfoSchema>;

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<UpgradeInfoFormValues>({
        resolver: zodResolver(upgradeInfoSchema),
        defaultValues: {
            donationAmount: 100000,
            bankName: 'BCA',
            accountNumber: '1234567890',
            accountName: 'Ayah Jenius Cendekia',
            instructions: 'Setelah transfer, formulir akan ditinjau oleh admin. Aktivasi akun dapat memakan waktu hingga 1x24 jam.',
        },
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && !authLoading && user?.role === 'admin' && db) {
            setIsLoadingData(true);
            const settingsRef = ref(db, 'appSettings/upgradeInfo');
            get(settingsRef).then((snapshot) => {
                if (snapshot.exists()) {
                    form.reset(snapshot.val());
                }
            }).catch(error => {
                toast({ title: 'Gagal Memuat Pengaturan', description: error.message, variant: 'destructive' });
            }).finally(() => {
                setIsLoadingData(false);
            });
        } else if (!authLoading) {
            setIsLoadingData(false);
        }
    }, [isClient, authLoading, user, form, toast]);
    
    const onSubmit = async (data: UpgradeInfoFormValues) => {
        const result = await saveUpgradeSettingsAction(data);
        if (result.success) {
            toast({ title: 'Berhasil!', description: 'Pengaturan upgrade telah disimpan.' });
        } else {
            toast({ title: 'Gagal Menyimpan', description: result.error, variant: 'destructive' });
        }
    };

    if (!isClient || authLoading || isLoadingData) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Pengaturan Aplikasi</h1>
                    <p className="text-muted-foreground">Kelola berbagai pengaturan dan konten di aplikasi.</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Banknote className="text-primary"/>
                        Pengaturan Upgrade Mahasiswa
                    </CardTitle>
                    <CardDescription>
                        Ubah detail donasi, rekening, dan instruksi yang ditampilkan kepada pengguna di halaman upgrade.
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="donationAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jumlah Donasi (Rp)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Bank</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: BCA" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomor Rekening</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: 1234567890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Atas Nama (Pemilik Rekening)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Ayah Jenius Cendekia" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="instructions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instruksi Tambahan (Opsional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tulis instruksi tambahan untuk pengguna..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Simpan Pengaturan
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </>
    );
}
