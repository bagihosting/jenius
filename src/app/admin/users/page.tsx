
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseZap } from 'lucide-react';


export default function UsersPage() {

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
            <p className="text-muted-foreground">Fitur ini dinonaktifkan.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <DatabaseZap className="text-destructive"/>
                Database Dihapus
            </CardTitle>
            <CardDescription>
                Manajemen pengguna tidak dapat berfungsi karena database Firestore telah dihapus dari aplikasi.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Untuk menggunakan fitur ini, koneksi ke database diperlukan untuk menyimpan dan mengelola data pengguna.
            </p>
        </CardContent>
      </Card>
    </>
  );
}
