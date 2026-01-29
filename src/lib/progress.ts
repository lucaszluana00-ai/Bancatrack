"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { allSubjects } from './data';

export type VideoProgress = {
  progress: number;
  completed: boolean;
};

export type SubjectProgress = {
  videos: {
    [videoId:string]: VideoProgress;
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

const PROGRESS_STORAGE_KEY = 'bancaTrackUserProgress';

export const useUserProgress = () => {
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This effect runs only on the client
        setLoading(true);
        try {
            const savedProgressRaw = localStorage.getItem(PROGRESS_STORAGE_KEY);
            const baseProgress = getInitialProgress();
            
            if (savedProgressRaw) {
                const savedProgress = JSON.parse(savedProgressRaw);
                // Merge saved progress with the base structure to account for new subjects
                const merged = { ...baseProgress };
                for (const subjectId in baseProgress) {
                    if (savedProgress[subjectId]) {
                         merged[subjectId] = {
                           ...baseProgress[subjectId],
                           ...savedProgress[subjectId],
                           videos: {
                             ...baseProgress[subjectId].videos,
                             ...(savedProgress[subjectId].videos || {})
                           }
                         };
                    }
                }
                setProgress(merged);
            } else {
                setProgress(baseProgress);
            }
        } catch (error) {
            console.error("Failed to load progress from localStorage", error);
            setProgress(getInitialProgress());
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProgress = useCallback((newProgress: UserProgress) => {
        try {
            const newProgressJSON = JSON.stringify(newProgress);
            localStorage.setItem(PROGRESS_STORAGE_KEY, newProgressJSON);
            setProgress(newProgress);
        } catch (error) {
            console.error("Failed to save progress to localStorage", error);
        }
    }, []);

    return { progress, loading, updateProgress };
};
