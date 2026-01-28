"use client";

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { UserProgress } from '@/lib/progress';
import type { Subject } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface OverallProgressProps {
  userProgress: UserProgress | null;
  allSubjects: Subject[];
}

export default function OverallProgress({
  userProgress,
  allSubjects,
}: OverallProgressProps) {
  const overallPercentage = useMemo(() => {
    if (!userProgress || allSubjects.length === 0) return 0;

    const subjectProgressTotals = allSubjects.map((subject) => {
      const subjectData = userProgress[subject.id];
      if (!subjectData || subject.videos.length === 0) return 0;

      const totalVideoProgress = subject.videos.reduce((acc, video) => {
        const videoProgress = subjectData.videos[video.id]?.progress || 0;
        return acc + videoProgress;
      }, 0);

      return totalVideoProgress / subject.videos.length;
    });

    const totalProgress = subjectProgressTotals.reduce(
      (acc, current) => acc + current,
      0
    );
    return Math.round(totalProgress / allSubjects.length);
  }, [userProgress, allSubjects]);

  const heroImage = PlaceHolderImages.find(p => p.id === 'geral');

  return (
    <Card className="overflow-hidden">
        {heroImage && (
             <div className="relative w-full h-48">
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             </div>
        )}
      <div className="relative p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-bold">Progresso Geral</CardTitle>
          <CardDescription>
            Sua jornada de estudos até agora. Continue assim!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Concluído</span>
            <span className="text-lg font-semibold">{overallPercentage}%</span>
          </div>
          <Progress value={overallPercentage} className="mt-2 h-4" indicatorClassName="bg-accent" />
        </CardContent>
      </div>
    </Card>
  );
}

// Add a custom indicator class to the Progress component if it doesn't exist
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      indicatorClassName?: string;
    }
  }
  
