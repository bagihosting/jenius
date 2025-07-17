
import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';
import { Poppins, Lato } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'Ayah Jenius: Bantuan PR & Latihan Soal AI Kurikulum Merdeka',
  description: 'Dapatkan bantuan PR instan, latihan soal HOTS harian, dan materi belajar lengkap (SD, SMP, SMA) dengan partner belajar AI, Ayah Jenius. Siap untuk ujian & UTBK 2025!',
  keywords: ['aplikasi belajar', 'bantuan PR', 'latihan soal', 'kurikulum merdeka', 'AI untuk pendidikan', 'soal HOTS', 'tryout UTBK 2025', 'les privat online', 'belajar online sd smp sma'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${lato.variable}`}>
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
