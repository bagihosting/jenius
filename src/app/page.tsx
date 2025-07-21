
'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookCheck, BrainCircuit, Edit, ShieldCheck, UserPlus, Check, Star, MessageSquareQuote } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: 'Guru AI Jenius 24/7',
      description: 'Dapatkan bantuan PR dan penjelasan materi kapan saja. AI kami dilatih dengan Kurikulum Merdeka terbaru.',
    },
    {
      icon: <Edit className="h-10 w-10 text-primary" />,
      title: 'Latihan Soal Harian',
      description: 'Ribuan soal HOTS (High Order Thinking Skills) baru setiap hari untuk semua mata pelajaran, lengkap dengan pembahasan cerdas.',
    },
    {
      icon: <BookCheck className="h-10 w-10 text-primary" />,
      title: 'Kuis Adaptif & Peringkat',
      description: 'Uji kemampuan dengan kuis yang tingkat kesulitannya menyesuaikan. Bersaing di papan peringkat nasional!',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 sm:py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
             <ShieldCheck className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight">
              Anak Anda Bisa <span className="text-primary">Ranking 1</span>. Kami Bocorkan Caranya.
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Lupakan bimbel mahal. Ayah Jenius adalah guru AI pribadi yang memberikan <span className="font-bold">latihan soal harian & bantuan PR cerdas</span>, sesuai Kurikulum Merdeka.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 text-lg px-8 w-full sm:w-auto shadow-lg shadow-primary/30" onClick={() => router.push('/register')}>
                Coba Gratis Sekarang <ArrowRight className="ml-2" />
              </Button>
            </div>
             <p className="mt-4 text-xs text-muted-foreground">Tanpa kartu kredit. 100% gratis untuk memulai.</p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-secondary/50 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Ini Bukan Aplikasi Belajar Biasa</h2>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg">
                Ayah Jenius dirancang untuk satu tujuan: membuat anak Anda menguasai setiap pelajaran dengan cara yang tidak akan pernah mereka dapatkan di sekolah.
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

         {/* Testimonial Section */}
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                     <div className="flex justify-center gap-1 mb-4">
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">"Nilai Anak Saya Melejit!"</h2>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                   <Card className="bg-card">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="indonesian mother" className="w-12 h-12 rounded-full border-2 border-primary" />
                                <div>
                                    <blockquote className="text-foreground/80 italic">"Awalnya saya ragu, tapi fitur Bantuan PR-nya luar biasa. Penjelasannya lebih mudah dimengerti daripada guru les. Anak saya jadi percaya diri dan nilainya naik drastis."</blockquote>
                                    <p className="mt-4 font-semibold">- Ibu Rina, Orang Tua Siswa Kelas 5 SD</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                 <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="indonesian father" className="w-12 h-12 rounded-full border-2 border-primary" />
                                <div>
                                    <blockquote className="text-foreground/80 italic">"Latihan soal HOTS-nya benar-benar 'daging'. Mirip seperti soal ujian sesungguhnya. Fitur ini saja sudah lebih berharga dari bimbel manapun."</blockquote>
                                    <p className="mt-4 font-semibold">- Bapak Adi, Orang Tua Siswa Kelas 8 SMP</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Pricing/CTA Section */}
        <section className="bg-secondary/50 py-16 sm:py-24">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold font-headline">Satu Langkah Lagi Menuju Prestasi Puncak</h2>
                 <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">Jangan biarkan anak Anda ketinggalan. Berikan mereka keunggulan yang tidak dimiliki teman-temannya.</p>
                <div className="mt-8">
                     <Button size="lg" className="h-14 text-xl px-10 shadow-lg shadow-primary/40" onClick={() => router.push('/register')}>
                        Jadikan Anak Saya Juara
                     </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Pendaftaran gratis, manfaatnya tak ternilai.</p>
            </div>
        </section>
      </main>

      <footer className="text-center p-6 bg-card text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} Ayah Jenius. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}


function AvatarImage({ src, className, ...props }: { src: string, className?: string, "data-ai-hint"?: string }) {
  return (
    <div className={`relative ${className}`} {...props}>
      <img src={src} className="rounded-full w-full h-full object-cover" alt="User Avatar" />
    </div>
  );
}

