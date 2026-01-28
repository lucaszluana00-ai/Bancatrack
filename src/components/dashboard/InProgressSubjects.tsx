"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { UserProgress } from '@/lib/progress';
import type { Subject } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

interface InProgressSubjectsProps {
  userProgress: UserProgress | null;
  allSubjects: Subject[];
}

interface SubjectWithProgress extends Subject {
  progress: number;
}

export default function InProgressSubjects({
  userProgress,
  allSubjects,
}: InProgressSubjectsProps) {
  const inProgressSubjects = useMemo(() => {
    if (!userProgress) return [];

    return allSubjects
      .map((subject) => {
        const subjectData = userProgress[subject.id];
        if (!subjectData || subject.videos.length === 0) {
          return { ...subject, progress: 0 };
        }

        const totalVideoProgress = subject.videos.reduce((acc, video) => {
          return acc + (subjectData.videos[video.id]?.progress || 0);
        }, 0);

        const progress = Math.round(totalVideoProgress / subject.videos.length);
        return { ...subject, progress };
      })
      .filter(
        (subject) => subject.progress > 0 && subject.progress < 100
      )
      .sort((a, b) => b.progress - a.progress);
  }, [userProgress, allSubjects]);

  if (inProgressSubjects.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Matérias em Andamento</h2>
        <Card className="mt-4">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">Você ainda não começou nenhuma matéria.</p>
                <Link href={`/materias/${allSubjects[0].id}`} passHref>
                    <Button className="mt-4">Começar a estudar</Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Matérias em Andamento</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inProgressSubjects.map((subject) => (
          <Card key={subject.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <subject.Icon className="h-8 w-8 text-primary" />
                    <CardTitle>{subject.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-semibold">{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} className="mt-1" />
            </CardContent>
            <CardFooter>
              <Link href={`/materias/${subject.id}`} className="w-full" passHref>
                <Button variant="outline" className="w-full">
                  Continuar estudando
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
