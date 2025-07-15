import { notFound } from 'next/navigation';
import { getSubjectById } from '@/lib/subjects';
import { Header } from '@/components/Header';
import { SubjectDetails } from '@/components/SubjectDetails';
import type { Subject } from '@/lib/types';

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const subject = getSubjectById(params.subjectId);

  if (!subject) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <SubjectDetails subject={subject as Subject} />
      </main>
    </div>
  );
}
