
import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'Bocoran Soal HOTS & Guru AI Jenius: Cara Anak Ranking 1',
  description: 'Rahasia anak ranking 1 terbongkar! Dapatkan bocoran soal HOTS harian, bantuan PR dari guru AI jenius, dan latihan soal ujian sesuai Kurikulum Merdeka. Bukan bimbel biasa, ini cara cerdas taklukkan sekolah.',
  keywords: ['bocoran soal hots', 'latihan soal ujian harian', 'guru ai pribadi', 'bantuan pr cerdas', 'cara anak ranking 1', 'aplikasi belajar kurikulum merdeka', 'kunci jawaban ai'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={ptSans.variable}>
      <head>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
            <Suspense>
            {children}
            </Suspense>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
