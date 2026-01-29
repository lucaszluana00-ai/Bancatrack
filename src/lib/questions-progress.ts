"use client";

import { useState, useEffect, useCallback } from 'react';
import { allSubjects } from './data';

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

const QUESTIONS_STORAGE_KEY = 'bancaTrackQuestionsProgress';

export const useQuestionProgress = () => {
    const [progress, setProgress] = useState<AllQuestionProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedProgressRaw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
            if (savedProgressRaw) {
                const savedProgress = JSON.parse(savedProgressRaw);
                const baseProgress = getInitialProgress();
                const merged = { ...baseProgress, ...savedProgress };

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
                setProgress(merged);
            } else {
                setProgress(getInitialProgress());
            }
        } catch (error) {
            console.error("Failed to load questions progress from localStorage", error);
            setProgress(getInitialProgress());
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionProgress = useCallback((newProgress: AllQuestionProgress) => {
        try {
            const newProgressJSON = JSON.stringify(newProgress);
            localStorage.setItem(QUESTIONS_STORAGE_KEY, newProgressJSON);
            setProgress(newProgress);
        } catch (error) {
            console.error("Failed to save questions progress to localStorage", error);
        }
    }, []);

    return { progress, loading, updateQuestionProgress };
};
