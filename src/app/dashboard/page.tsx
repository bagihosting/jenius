
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { SubjectCard } from '@/components/SubjectCard';
import { getSubjects } from '@/lib/subjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, MessageSquareQuote, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { SchoolType, Grade, Semester } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading, isAuthenticated } = useAuth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const grade = (searchParams.get('grade') as Grade) || '1';
    const semester = (searchParams.get('semester') as Semester) || '1';
    
    useEffect(() => {
        if (!loading && isClient && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, isClient, router]);
    
    if (!isClient || loading || !isAuthenticated) {
        return (
            <main className="flex-grow flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary"/>
            </main>
        )
    }

    const schoolType = user?.schoolType;

    if (!grade || !semester || !schoolType) {
        return (
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Parameter Tidak Lengkap</CardTitle>
                        <CardDescription>Silakan kembali dan pilih kelas serta semester.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/belajar">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const schoolName = user?.schoolName || 'Sekolah Anda';
    const subjects = getSubjects(schoolType, grade, semester);
    const schoolInfo = { schoolType, grade, semester };
    
    const backlink = `/belajar`;

    return (
        <main className="flex-grow p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                     <div className="flex justify-between items-center mb-4">
                        <Link href={backlink} className="flex items-center gap-2 text-primary hover:underline">
                            <ArrowLeft size={16} />
                            Ganti Kelas
                        </Link>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">Dasbor Belajar</h1>
                    <p className="text-muted-foreground text-lg">
                        Mata pelajaran untuk {schoolName}, Kelas {grade}, Semester {semester}.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
                    {subjects.map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} schoolInfo={schoolInfo} />
                    ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                     <Card className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquareQuote/>
                                Bantuan PR Cerdas
                            </CardTitle>
                            <CardDescription>Punya PR yang bikin pusing? Tanyakan di sini dan dapatkan penjelasan langkah demi langkah dari Ayah Jenius.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Button asChild>
                                <Link href={`/pr-helper?grade=${grade}&semester=${semester}`}>
                                    Tanya PR
                                </Link>
                           </Button>
                        </CardContent>
                    </Card>
                     <Card className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Edit />
                                Latihan Soal Ujian Harian
                            </CardTitle>
                            <CardDescription>Uji kemampuanmu dengan soal-soal latihan baru yang dibuat oleh Ayah Jenius setiap hari.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                 <Link href={`/exam-practice?grade=${grade}&semester=${semester}`}>
                                    Mulai Latihan
                                </Link>
                           </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </main>
    );
}

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Suspense fallback={<main className="flex-grow flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary"/></main>}>
                <DashboardContent />
            </Suspense>
             <footer className="text-center p-4 text-muted-foreground text-sm">
                © {new Date().getFullYear()} Ayah Jenius. All rights reserved.
            </footer>
        </div>
    );
}
