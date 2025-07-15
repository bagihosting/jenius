import { notFound } from 'next/navigation';
import { getSubjectById } from '@/lib/subjects';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Download, BookText, ArrowLeft } from 'lucide-react';
import { QuizView } from '@/components/QuizView';
import Link from 'next/link';
import { getIcon } from '@/lib/icons';

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const subject = getSubjectById(params.subjectId);

  if (!subject) {
    notFound();
  }

  const Icon = getIcon(subject.icon);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft size={16} />
            Kembali ke semua pelajaran
          </Link>
          <div className="bg-card p-6 md:p-8 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
              <div className="bg-primary/20 p-3 rounded-full">
                <Icon className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-gray-800 dark:text-gray-200">{subject.title}</h1>
                <p className="text-muted-foreground mt-1">Materi belajar untuk kelas 5</p>
              </div>
            </div>
            
            <div className="prose dark:prose-invert max-w-none mb-8">
              <h2 className="flex items-center gap-2 font-headline"><BookText size={20} />Materi Pelajaran</h2>
              <p>{subject.content}</p>
            </div>
            
            <div className="text-center my-6">
              <Button variant="secondary" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download Materi (Segera Hadir)
              </Button>
            </div>

            <QuizView subjectId={subject.id} subjectContent={subject.content} />

          </div>
        </div>
      </main>
    </div>
  );
}
