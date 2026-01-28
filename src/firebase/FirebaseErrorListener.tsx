'use client';

import { useEffect } from 'react';
import { errorEmitter } from './error-emitter';
import type { FirestorePermissionError } from './errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error: FirestorePermissionError) => {
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        console.error(error);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}

