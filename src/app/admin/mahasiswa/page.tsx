
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, GraduationCap } from 'lucide-react';
import { db } from '@/lib/firebase';
import { ref, onValue, update, remove } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { type UpgradeRequest } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function MahasiswaManagementPage() {
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: adminUser, loading: authLoading, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || authLoading || !isAuthenticated || adminUser?.role !== 'admin' || !db) {
      if (!authLoading) setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const requestsRef = ref(db, 'upgradeRequests');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const requestList: UpgradeRequest[] = Object.keys(data)
                .map((key) => ({ ...data[key], uid: key, }))
                .filter(req => req.status === 'pending'); // Only show pending requests
            setRequests(requestList.sort((a,b) => new Date(b.requestedAt as string).getTime() - new Date(a.requestedAt as string).getTime()));
        } else {
            setRequests([]);
        }
        setIsLoading(false);
    }, (error) => {
        console.error("Firebase requests read failed:", error);
        toast({ title: 'Gagal memuat pengajuan', description: error.message, variant: 'destructive' });
        setRequests([]);
        setIsLoading(false);
    });

    return () => unsubscribe();

  }, [isClient, authLoading, isAuthenticated, adminUser, toast]);

  const handleApprove = async (request: UpgradeRequest) => {
    if (!db) return;
    try {
      const updates: { [key: string]: any } = {};
      updates[`/users/${request.uid}/role`] = 'mahasiswa';
      updates[`/users/${request.uid}/major`] = request.major; // Save major to user profile
      updates[`/upgradeRequests/${request.uid}/status`] = 'approved';

      await update(ref(db), updates);
      
      toast({ title: 'Pengguna Disetujui!', description: `${request.name} sekarang adalah Mahasiswa.` });
      // No need to update state manually, onValue listener will do it.
    } catch (error: any) {
        toast({ title: "Operasi Gagal", description: error.message, variant: 'destructive' });
    }
  };

  const handleReject = async (uid: string) => {
     if (!db) return;
     if (window.confirm("Apakah Anda yakin ingin menolak dan menghapus pengajuan ini?")) {
        try {
            await remove(ref(db, `upgradeRequests/${uid}`));
            toast({ title: 'Pengajuan ditolak dan dihapus' });
            // No need to update state manually, onValue listener will do it.
        } catch (error: any) {
            toast({ title: 'Gagal menolak pengajuan', description: error.message, variant: 'destructive' });
        }
     }
  };


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Mahasiswa</h1>
          <p className="text-muted-foreground">Tinjau dan setujui pengajuan upgrade akun ke Mahasiswa.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <GraduationCap className="text-primary"/>
                Pengajuan Upgrade Akun
            </CardTitle>
            <CardDescription>
                Berikut adalah daftar pengguna yang mengajukan upgrade akun. Setujui setelah donasi terverifikasi.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Universitas & Jurusan</TableHead>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada pengajuan yang menunggu.
                    </TableCell>
                  </TableRow>
                )}
                {requests.map((req) => (
                  <TableRow key={req.uid}>
                    <TableCell>
                        <div className="font-medium">{req.name}</div>
                        <div className="text-sm text-muted-foreground">{req.email} (@{req.username})</div>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">{req.universityName}</div>
                        <div className="text-sm text-muted-foreground">{req.major}</div>
                    </TableCell>
                    <TableCell>
                        {req.requestedAt ? format(new Date(req.requestedAt as string), "d MMM yyyy, HH:mm") : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-yellow-600 border-yellow-300 bg-yellow-50">
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleApprove(req)}>
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Setujui</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleReject(req.uid)}>
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Tolak</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
