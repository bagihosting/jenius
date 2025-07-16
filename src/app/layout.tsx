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
  title: 'Ayah Jenius',
  description: 'Aplikasi belajar untuk semua pelajaran kelas 1-6 SD/MI',
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
      <body className="font-body antialiased">
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
