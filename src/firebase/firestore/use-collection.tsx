'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, type Query } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T>(query: Query | null) {
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setData(null);
            setLoading(false);
            return;
        }
        
        const unsubscribe = onSnapshot(query, 
            (querySnapshot) => {
                const data: T[] = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as T);
                });
                setData(data);
                setLoading(false);
            },
            async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: (query as any)._query.path.segments.join('/'),
                    operation: 'list',
                });
                errorEmitter.emit('permission-error', permissionError);
                setLoading(false);
                setData(null);
            }
        );

        return () => unsubscribe();
    }, [query]);

    return { data, loading };
}

