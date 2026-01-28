"use client";

import { doc, setDoc, type Firestore } from 'firebase/firestore';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { allSubjects } from './data';
import { useMemo } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type VideoProgress = {
  progress: number;
  completed: boolean;
};

export type SubjectProgress = {
  videos: {
    [videoId: string]: VideoProgress;
  };
  summary?: string;
};

export type UserProgress = {
  [subjectId: string]: SubjectProgress;
};

const getInitialProgress = (): UserProgress => {
    const initialProgress: UserProgress = {};
    allSubjects.forEach(subject => {
        initialProgress[subject.id] = { videos: {}, summary: '' };
    });
    return initialProgress;
};

export const useUserProgress = () => {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();

    const progressRef = useMemo(() => {
        if (!db || !user) return null;
        return doc(db, `users/${user.uid}/progress`, 'main');
    }, [db, user]);

    const { data: progressData, loading: progressLoading } = useDoc<UserProgress>(progressRef);

    const progress = useMemo(() => {
        const baseProgress = getInitialProgress();
        if (!progressData) {
            return baseProgress;
        }
        
        const merged = { ...baseProgress };
        for (const subjectId in progressData) {
            if (Object.prototype.hasOwnProperty.call(progressData, subjectId) && merged[subjectId]) {
                merged[subjectId] = {
                    ...merged[subjectId],
                    ...progressData[subjectId]
                };
            }
        }
        
        allSubjects.forEach(subject => {
            if (merged[subject.id] && typeof merged[subject.id].summary === 'undefined') {
                merged[subject.id].summary = '';
            }
        });

        return merged;
    }, [progressData]);
    
    const loading = userLoading || (!!user && progressLoading);

    return { progress, loading, user, db };
};

export function updateVideoProgress(
  db: Firestore,
  userId: string,
  subjectId: string,
  videoId: string,
  progress: number,
  currentProgress: UserProgress | null
) {
  if (!currentProgress) return;
  const docRef = doc(db, `users/${userId}/progress/main`);
  
  const newProgress = JSON.parse(JSON.stringify(currentProgress));

  if (!newProgress[subjectId]) {
      newProgress[subjectId] = { videos: {}, summary: '' };
  }
  if (!newProgress[subjectId].videos) {
      newProgress[subjectId].videos = {};
  }

  newProgress[subjectId].videos[videoId] = {
      progress: progress,
      completed: progress >= 90
  };
  
  setDoc(docRef, newProgress).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: 'write',
      requestResourceData: newProgress,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function updateSubjectSummary(
    db: Firestore,
    userId: string,
    subjectId: string,
    summary: string,
    currentProgress: UserProgress | null
) {
    if (!currentProgress) return;
    const docRef = doc(db, `users/${userId}/progress/main`);
    
    const newProgress = JSON.parse(JSON.stringify(currentProgress));

    if (!newProgress[subjectId]) {
        newProgress[subjectId] = { videos: {}, summary: '' };
    }
    
    newProgress[subjectId].summary = summary;

    setDoc(docRef, newProgress).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'write',
          requestResourceData: newProgress,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

