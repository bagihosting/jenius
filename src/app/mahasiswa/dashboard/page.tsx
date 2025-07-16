
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, BrainCircuit, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { academicAssistantAction } from '@/app/actions';
import type { AcademicAssistantOutput } from '@/ai/flows/academic-assistant-flow';
import Image from 'next/image';

type AssistantState = 'idle' | 'loading' | 'answered';

export default function MahasiswaDashboardPage() {
    const router = useRouter();
    const { user, loading, isAuthenticated, updateUser } = useAuth();
    const { toast } = useToast();

    const [major, setMajor] = useState('');
    const [topic, setTopic] = useState('');
    const [request, setRequest] = useState('');
    const [isSavingMajor, setIsSavingMajor] = useState(false);
    
    const [state, setState] = useState<AssistantState>('idle');
    const [result, setResult] = useState<AcademicAssistantOutput | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.role !== 'mahasiswa')) {
            router.push('/login');
        }
        if (user?.major) {
            setMajor(user.major);
        }
    }, [user, loading, isAuthenticated, router]);

    const handleSaveMajor = () => {
        if (!user || !major) return;
        setIsSavingMajor(true);
        try {
            updateUser({ major });
            toast({
                title: 'Berhasil!',
                description: 'Jurusan Anda telah disimpan.',
            });
        } catch (e) {
            toast({
                title: 'Gagal Menyimpan',
                description: 'Terjadi kesalahan saat menyimpan jurusan.',
                variant: 'destructive',
            });
        } finally {
            setIsSavingMajor(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!major || !topic || !request) {
            toast({
                title: 'Form Belum Lengkap',
                description: 'Silakan isi semua field untuk mendapatkan bantuan.',
                variant: 'destructive',
            });
            return;
        }

        setState('loading');
        const response = await academicAssistantAction({ major, topic, request });

        if (response.error) {
            toast({
                title: 'Gagal Mendapatkan Jawaban',
                description: response.error,
                variant: 'destructive',
            });
            setState('idle');
        } else if (response.data) {
            setResult(response.data);
            setState('answered');
        }
    };
    
    const handleReset = () => {
        setTopic('');
        setRequest('');
        setResult(null);
        setState('idle');
    };

    if (!isClient || loading || !isAuthenticated) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-headline flex items-center gap-3">
                                <BrainCircuit className="h-8 w-8 text-primary" />
                                Asisten Akademik Mahasiswa
                            </CardTitle>
                            <CardDescription>
                                Dapatkan penjelasan mendalam untuk materi kuliah apa pun. Cukup masukkan jurusan, topik, dan pertanyaan Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             {state === 'idle' || state === 'loading' ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <div className="space-y-2 md:col-span-3">
                                            <Label htmlFor="major">Jurusan/Bidang Studi Anda</Label>
                                            <Input
                                                id="major"
                                                placeholder="Contoh: Teknik Informatika"
                                                value={major}
                                                onChange={(e) => setMajor(e.target.value)}
                                                required
                                            />
                                        </div>
                                         <div className="space-y-2 md:col-span-2 self-end">
                                            <Button onClick={handleSaveMajor} disabled={isSavingMajor || !major} className="w-full">
                                                {isSavingMajor ? <Loader2 className="animate-spin" /> : 'Simpan Jurusan'}
                                            </Button>
                                         </div>
                                    </div>
                                    
                                     <div className="space-y-2">
                                        <Label htmlFor="topic">Topik Spesifik</Label>
                                        <Input
                                            id="topic"
                                            placeholder="Contoh: Object-Oriented Programming (OOP)"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="request">Pertanyaan atau Permintaan Anda</Label>
                                        <Textarea
                                            id="request"
                                            placeholder="Contoh: Jelaskan 4 pilar utama OOP dengan contoh kode sederhana."
                                            value={request}
                                            onChange={(e) => setRequest(e.target.value)}
                                            required
                                            rows={5}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <Button type="submit" size="lg" disabled={state === 'loading' || !major}>
                                            {state === 'loading' ? (
                                                <>
                                                    <Loader2 className="mr-2 animate-spin" />
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2" />
                                                    Dapatkan Penjelasan
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                             ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg">Permintaan Anda:</h3>
                                        <div className="p-4 bg-muted rounded-md border">
                                            <p><span className="font-bold text-sm text-muted-foreground">Jurusan:</span> {major}</p>
                                            <p><span className="font-bold text-sm text-muted-foreground">Topik:</span> {topic}</p>
                                            <p className="mt-2">{request}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Penjelasan dari Asisten Akademik:</h3>
                                        {result?.imageUrl && (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border my-4">
                                                <Image
                                                    src={result.imageUrl}
                                                    alt={`Ilustrasi untuk: ${topic}`}
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4 bg-primary/5 rounded-md border border-primary/20 prose prose-sm max-w-none dark:prose-invert"
                                            dangerouslySetInnerHTML={{ __html: result?.explanation.replace(/\n/g, '<br />') || '' }}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <Button onClick={handleReset}>Buat Pertanyaan Baru</Button>
                                    </div>
                                </div>
                             )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
