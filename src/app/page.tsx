
'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookCheck, BrainCircuit, Edit, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: 'Bantuan PR Cerdas',
      description: 'Tak perlu pusing lagi! Ayah Jenius memberikan penjelasan langkah demi langkah yang mudah dipahami untuk setiap soal PR.',
    },
    {
      icon: <Edit className="h-10 w-10 text-primary" />,
      title: 'Latihan Soal Harian',
      description: 'Uji dan asah kemampuan anak dengan ribuan soal latihan baru setiap hari yang disesuaikan dengan kurikulum terkini.',
    },
    {
      icon: <BookCheck className="h-10 w-10 text-primary" />,
      title: 'Materi Sesuai Kurikulum',
      description: 'Semua materi pelajaran dari kelas 1-6 SD/MI (Kurikulum Merdeka) tersedia dalam format yang ringkas dan menarik.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 sm:py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight">
              Buka Potensi <span className="text-primary">Jenius</span> Anak Anda
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Ayah Jenius adalah partner belajar cerdas yang dirancang untuk membantu siswa SD/MI menaklukkan setiap mata pelajaran dengan percaya diri.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" className="h-12 text-lg px-8 w-full sm:w-auto" onClick={() => router.push('/register')}>
                Daftar Gratis Sekarang <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="ghost" className="h-12 text-lg w-full sm:w-auto" onClick={() => router.push('/login')}>
                Sudah Punya Akun?
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-secondary py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Semua yang Dibutuhkan Anak Anda untuk Berprestasi</h2>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg">
                Dari PR hingga persiapan ujian, kami menyediakan alat yang tepat untuk setiap tantangan akademis.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 bg-card">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4 font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
         <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Mulai dalam 3 Langkah Mudah</h2>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center relative">
                    {/* Dashed line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-8">
                        <svg width="100%" height="2">
                            <line x1="0" y1="1" x2="100%" y2="1" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="8 8" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-center z-10">
                        <div className="bg-background p-2 border-2 border-dashed border-primary rounded-full">
                           <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">1</div>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold font-headline">Daftar Akun</h3>
                        <p className="mt-2 text-muted-foreground">Buat akun gratis dan pilih jenjang sekolah anak Anda.</p>
                    </div>
                     <div className="flex flex-col items-center z-10">
                        <div className="bg-background p-2 border-2 border-dashed border-primary rounded-full">
                           <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">2</div>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold font-headline">Pilih Kelas</h3>
                        <p className="mt-2 text-muted-foreground">Pilih kelas dan semester yang sedang dijalani saat ini.</p>
                    </div>
                     <div className="flex flex-col items-center z-10">
                        <div className="bg-background p-2 border-2 border-dashed border-primary rounded-full">
                           <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">3</div>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold font-headline">Mulai Belajar</h3>
                        <p className="mt-2 text-muted-foreground">Akses semua materi, latihan soal, dan bantuan PR sepuasnya!</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-secondary py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <ShieldCheck className="w-16 h-16 text-accent mx-auto" />
                    <blockquote className="mt-6 text-xl md:text-2xl font-semibold italic text-foreground/80">
                        "Sejak pakai Ayah Jenius, nilai anak saya meningkat drastis! Penjelasannya jauh lebih mudah dimengerti daripada les privat. Sangat direkomendasikan!"
                    </blockquote>
                    <p className="mt-4 font-semibold text-muted-foreground">- Ibu Siti, Orang Tua Murid Kelas 4 SDN</p>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 text-center">
             <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Siap Mengubah Cara Belajar Anak Anda?</h2>
                <p className="mt-4 text-muted-foreground text-base sm:text-lg">
                    Hanya butuh 1 menit untuk mendaftar dan membuka akses ke semua fitur cerdas kami.
                </p>
                <div className="mt-8">
                     <Button size="lg" className="h-12 text-lg px-8" onClick={() => router.push('/register')}>
                        Coba Gratis Sekarang
                     </Button>
                </div>
            </div>
        </section>

      </main>

      <footer className="text-center p-6 bg-card text-muted-foreground text-sm border-t">
        © 2024 Ayah Jenius. All rights reserved.
      </footer>
    </div>
  );
}
