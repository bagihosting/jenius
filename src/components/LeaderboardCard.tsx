
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, DatabaseZap } from 'lucide-react';


export function LeaderboardCard() {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Trophy className="text-yellow-500" />
          Peringkat Kelas
        </CardTitle>
        <CardDescription>Siswa dengan skor rata-rata tertinggi.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground h-40 flex flex-col items-center justify-center">
            <DatabaseZap className="w-8 h-8 mb-2 text-destructive" />
            <p className="font-semibold">Fitur Papan Peringkat Dinonaktifkan</p>
            <p className="text-sm">Database tidak terhubung.</p>
        </div>
      </CardContent>
    </Card>
  );
}
