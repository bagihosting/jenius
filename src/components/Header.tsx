import { BookHeart } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-200 font-headline">
            <BookHeart className="h-8 w-8 text-primary" />
            <span>Ayah Jenius</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
