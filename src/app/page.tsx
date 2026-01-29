"use client";

import OverallProgress from '@/components/dashboard/OverallProgress';
import InProgressSubjects from '@/components/dashboard/InProgressSubjects';
import { useUserProgress } from '@/lib/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { allSubjects } from '@/lib/data';

export default function Home() {
  const { progress, loading } = useUserProgress();

  if (loading || !progress) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Skeleton className="h-48 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <OverallProgress userProgress={progress} allSubjects={allSubjects} />
        <InProgressSubjects
          userProgress={progress}
          allSubjects={allSubjects}
        />
      </div>
    </div>
  );
}
