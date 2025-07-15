import { Header } from '@/components/Header';
import { SubjectCard } from '@/components/SubjectCard';
import { subjects } from '@/lib/subjects';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-headline text-gray-800 dark:text-gray-200">
            Selamat Datang di Pintar Elementary!
          </h1>
          <p className="text-md md:text-xl text-muted-foreground mt-2">
            Pilih pelajaran untuk mulai belajar dan berlatih.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © 2024 Pintar Elementary. All rights reserved.
      </footer>
    </div>
  );
}
