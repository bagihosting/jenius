'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Subject, SchoolInfo } from '@/lib/types';
import { useProgress } from '@/hooks/use-progress';
import { getIcon } from '@/lib/icons';

interface SubjectCardProps {
  subject: Subject;
  schoolInfo: SchoolInfo;
}

export function SubjectCard({ subject, schoolInfo }: SubjectCardProps) {
  const { getSubjectProgress } = useProgress();
  const progress = getSubjectProgress(subject.id);

  const Icon = getIcon(subject.icon);
  const link = `/subjects/${subject.id}?school=${schoolInfo.schoolType}&grade=${schoolInfo.grade}`;

  return (
    <Link href={link} className="group">
      <Card className="h-full flex flex-col justify-between text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary">
        <CardHeader className="flex-grow">
          <div className="flex justify-center mb-4">
            <Icon className="w-12 h-12 md:w-16 md:h-16 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <CardTitle className="font-headline text-lg md:text-xl">{subject.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{progress}% Selesai</p>
        </CardContent>
      </Card>
    </Link>
  );
}
