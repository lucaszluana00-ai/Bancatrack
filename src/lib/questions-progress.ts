"use client";

import { useMemo } from 'react';
import { doc, setDoc, type Firestore } from 'firebase/firestore';
import { allSubjects } from './data';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type QuestionProgressStatus = 'in_progress' | 'completed';

export interface QuestionProgress {
  status: QuestionProgressStatus;
  semana: string;
  questionsDone: number | string;
  accuracy: number | string;
  observations: string;
}

export type AllQuestionProgress = Record<string, QuestionProgress>;

const getInitialProgress = (): AllQuestionProgress => {
    const initialProgress: AllQuestionProgress = {};
    allSubjects.forEach(subject => {
        initialProgress[subject.id] = { 
            status: 'in_progress',
            semana: '',
            questionsDone: '',
            accuracy: '',
            observations: ''
        };
    });
    return initialProgress;
};

export const useQuestionProgress = () => {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();

    const progressRef = useMemo(() => {
        if (!db || !user) return null;
        return doc(db, `users/${user.uid}/questionsProgress`, 'main');
    }, [db, user]);

    const { data: progressData, loading: progressLoading } = useDoc<AllQuestionProgress>(progressRef);

    const progress = useMemo(() => {
        const baseProgress = getInitialProgress();
        if (!progressData) {
            return baseProgress;
        }

        const merged = { ...baseProgress, ...progressData };

        allSubjects.forEach(id => {
            if (!merged[id.id]) {
                merged[id.id] = { 
                    status: 'in_progress',
                    semana: '',
                    questionsDone: '',
                    accuracy: '',
                    observations: ''
                };
            }
        });
        
        return merged;
    }, [progressData]);

    const loading = userLoading || (!!user && progressLoading);

    const updateQuestionProgress = (newProgress: AllQuestionProgress) => {
        if (!progressRef) return;
        setDoc(progressRef, newProgress).catch(serverError => {
            const permissionError = new FirestorePermissionError({
                path: progressRef.path,
                operation: 'write',
                requestResourceData: newProgress,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }

    return { progress, loading, updateQuestionProgress, user };
};

