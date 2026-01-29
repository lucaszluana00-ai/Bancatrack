"use client";

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useUserProgress, type UserProgress, type VideoProgress } from '@/lib/progress';
import { debounce } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function SubjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const subject = getSubjectById(slug);
  const [activeVideo, setActiveVideo] = useState(subject?.videos[0]?.id);

  const { progress: userProgress, loading, updateProgress } = useUserProgress();
  
  const [localVideoProgress, setLocalVideoProgress] = useState<Record<string, VideoProgress>>({});
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (userProgress && subject) {
      setLocalVideoProgress(userProgress[subject.id]?.videos || {});
      setSummary(userProgress[subject.id]?.summary || '');
    }
  }, [userProgress, subject]);
  
  const debouncedUpdateProgress = useCallback(
    debounce((newProgressData: UserProgress) => {
        if(updateProgress) {
            updateProgress(newProgressData);
        }
    }, 1000),
    [updateProgress]
  );

  const handleProgressUpdate = useCallback((videoId: string, newProgressValue: number) => {
    if (!subject || !userProgress) return;
    
    // Update local state for immediate UI feedback
    setLocalVideoProgress(prev => ({
      ...prev,
      [videoId]: { progress: newProgressValue, completed: newProgressValue >= 90 }
    }));

    // Create the new full progress object to be saved
    const newFullProgress = JSON.parse(JSON.stringify(userProgress));
    if (!newFullProgress[subject.id]) {
      newFullProgress[subject.id] = { videos: {}, summary: '' };
    }
     if (!newFullProgress[subject.id].videos) {
      newFullProgress[subject.id].videos = {};
    }
    newFullProgress[subject.id].videos[videoId] = {
      progress: newProgressValue,
      completed: newProgressValue >= 90
    };
    
    debouncedUpdateProgress(newFullProgress);

  }, [subject, userProgress, debouncedUpdateProgress]);
  
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!subject || !userProgress) return;
    const newSummary = e.target.value;
    
    // Update local state for immediate UI feedback
    setSummary(newSummary);

    // Create the new full progress object to be saved
    const newFullProgress = JSON.parse(JSON.stringify(userProgress));
    if (!newFullProgress[subject.id]) {
      newFullProgress[subject.id] = { videos: {}, summary: '' };
    }
    newFullProgress[subject.id].summary = newSummary;

    debouncedUpdateProgress(newFullProgress);
  };

  const subjectOverallProgress = useMemo(() => {
    if (!subject || !userProgress) return 0;

    const subjectProgress = userProgress[subject.id];
    if (!subjectProgress || subject.videos.length === 0) return 0;
    
    const totalProgress = subject.videos.reduce((acc, video) => {
      return acc + (subjectProgress.videos[video.id]?.progress || 0);
    }, 0);

    return Math.round(totalProgress / subject.videos.length);
  }, [userProgress, subject]);


  if (!subject) {
    return <div>Matéria não encontrada.</div>;
  }

  if (loading || !userProgress) {
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
  
  const videoProgressForUI = (videoId: string) => localVideoProgress[videoId] || { progress: 0, completed: false };

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
          const videoProgress = videoProgressForUI(video.id);
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
