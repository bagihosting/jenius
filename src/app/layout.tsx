
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
  title: 'Pintar Elementary: Your Fun Learning Partner',
  description: 'Interactive quizzes, offline access, and AI-powered learning for Grade 5 students. Master subjects with Pintar Elementary!',
  keywords: ['Pintar Elementary', 'e-learning for kids', 'grade 5', 'interactive quiz', 'offline learning', 'AI education'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={ptSans.variable}>
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
