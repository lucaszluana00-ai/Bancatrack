"use client";

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { getSubjectById } from '@/lib/data';
import YouTubePlayer from '@/components/video/YouTubePlayer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserProgress, updateVideoProgress, updateSubjectSummary, type VideoProgress } from '@/lib/progress';
import { debounce } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const subject = getSubjectById(slug);
  const [activeVideo, setActiveVideo] = useState(subject?.videos[0]?.id);

  const { progress: userProgress, loading, user, db } = useUserProgress();
  const progressRef = useRef(userProgress);

  useEffect(() => {
    progressRef.current = userProgress;
  }, [userProgress]);

  const [localProgress, setLocalProgress] = useState<Record<string, VideoProgress>>({});
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (!loading && !user) {
        router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userProgress && subject) {
      setLocalProgress(userProgress[subject.id]?.videos || {});
      setSummary(userProgress[subject.id]?.summary || '');
    }
  }, [userProgress, subject]);
  
  const debouncedUpdate = useCallback(
    debounce((subjectId: string, videoId: string, videoProgress: number) => {
      if (db && user) {
          updateVideoProgress(db, user.uid, subjectId, videoId, videoProgress, progressRef.current);
      }
    }, 2000),
    [db, user]
  );

  const debouncedSummaryUpdate = useCallback(
    debounce((subjectId: string, newSummary: string) => {
        if (db && user) {
            updateSubjectSummary(db, user.uid, subjectId, newSummary, progressRef.current);
        }
    }, 1000),
    [db, user]
  );

  const handleProgressUpdate = useCallback((videoId: string, newProgress: number) => {
    if (!subject) return;
    
    setLocalProgress(prev => ({
      ...prev,
      [videoId]: { progress: newProgress, completed: newProgress >= 90 }
    }));
    debouncedUpdate(subject.id, videoId, newProgress);
  }, [subject, debouncedUpdate]);
  
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!subject) return;
    const newSummary = e.target.value;
    setSummary(newSummary);
    debouncedSummaryUpdate(subject.id, newSummary);
  };

  const subjectOverallProgress = useMemo(() => {
    if (!subject || Object.keys(localProgress).length === 0) return 0;
    const totalProgress = subject.videos.reduce((acc, video) => {
      return acc + (localProgress[video.id]?.progress || 0);
    }, 0);
    return Math.round(totalProgress / subject.videos.length);
  }, [localProgress, subject]);


  if (!subject) {
    return <div>Matéria não encontrada.</div>;
  }

  if (loading || !user) {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="mb-8">
          <CardHeader>
            <div className='flex items-center gap-4'>
                <subject.Icon className="h-10 w-10 text-primary" />
                <div>
                    <CardTitle className="text-3xl font-bold">{subject.name}</CardTitle>
                    <CardDescription>Progresso na matéria: {subjectOverallProgress}%</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={subjectOverallProgress} />
          </CardContent>
      </Card>

      <Accordion 
        type="single" 
        collapsible 
        defaultValue={subject.videos[0]?.id} 
        className="w-full space-y-4"
        onValueChange={(value) => setActiveVideo(value)}
      >
        {subject.videos.map((video) => {
          const videoProgress = localProgress[video.id] || { progress: 0, completed: false };
          const isActive = activeVideo === video.id;
          return (
            <AccordionItem value={video.id} key={video.id} className="border-b-0">
                <Card className="overflow-hidden">
                    <AccordionTrigger className="p-4 hover:no-underline [&[data-state=open]>svg]:text-primary">
                        <div className="flex flex-1 items-center justify-between pr-4">
                            <div className="flex items-center gap-3 text-left">
                                {videoProgress.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <div className="h-5 w-5 border-2 border-muted-foreground rounded-full flex-shrink-0"/>
                                )}
                                <span className='font-medium'>{video.title}</span>
                            </div>
                            <div className="text-sm font-semibold text-primary">{Math.round(videoProgress.progress)}%</div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="aspect-video bg-black">
                            {isActive && (
                                <YouTubePlayer
                                    videoId={video.id}
                                    onProgress={handleProgressUpdate}
                                    initialProgress={videoProgress.progress}
                                />
                            )}
                        </div>
                        <div className="p-4">
                            <Progress value={videoProgress.progress} className="h-2" />
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Meus Resumos</CardTitle>
          <CardDescription>Anote aqui os pontos mais importantes da matéria.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Digite seu resumo aqui..."
            value={summary}
            onChange={handleSummaryChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}

