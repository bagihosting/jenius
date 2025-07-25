
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
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
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
    const requestsRef = collection(db, 'upgradeRequests');
    const q = query(requestsRef, where('status', '==', 'pending'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requestList: UpgradeRequest[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Convert Firestore Timestamp to Date, then to string for sorting
            const requestedAt = data.requestedAt?.toDate ? data.requestedAt.toDate() : new Date();
            requestList.push({ ...data, uid: doc.id, requestedAt: requestedAt.toISOString() } as UpgradeRequest);
        });
        setRequests(requestList.sort((a,b) => new Date(b.requestedAt as string).getTime() - new Date(a.requestedAt as string).getTime()));
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
      const batch = writeBatch(db);
      
      const userRef = doc(db, 'users', request.uid);
      batch.update(userRef, {
          role: 'mahasiswa',
          major: request.major
      });

      const requestRef = doc(db, 'upgradeRequests', request.uid);
      batch.update(requestRef, { status: 'approved' });
      
      await batch.commit();
      
      toast({ title: 'Pengguna Disetujui!', description: `${request.name} sekarang adalah Mahasiswa.` });
      // No need to update state manually, onSnapshot listener will do it.
    } catch (error: any) {
        toast({ title: "Operasi Gagal", description: error.message, variant: 'destructive' });
    }
  };

  const handleReject = async (uid: string) => {
     if (!db) return;
     if (window.confirm("Apakah Anda yakin ingin menolak dan menghapus pengajuan ini?")) {
        try {
            await deleteDoc(doc(db, `upgradeRequests`, uid));
            toast({ title: 'Pengajuan ditolak dan dihapus' });
            // No need to update state manually, onSnapshot listener will do it.
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
