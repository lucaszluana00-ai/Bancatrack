"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

// Singleton promise to ensure the YouTube API script is loaded only once.
let scriptLoadingPromise: Promise<void> | null = null;
const loadYouTubeIframeAPI = (): Promise<void> => {
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // If the API is already loaded, resolve immediately.
    if (window.YT && window.YT.Player) {
      return resolve();
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;

    (window as any).onYouTubeIframeAPIReady = () => {
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error("Failed to load YouTube IFrame API"));
      scriptLoadingPromise = null;
    }

    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
};

interface YouTubePlayerProps {
  videoId: string;
  onProgress: (videoId: string, progress: number) => void;
  initialProgress?: number;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onProgress, initialProgress = 0 }) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<YT.Player | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const seekedRef = useRef(false);

  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const initialProgressRef = useRef(initialProgress);
  useEffect(() => {
    initialProgressRef.current = initialProgress;
  }, [initialProgress]);

  // Effect to load the YouTube API
  useEffect(() => {
    loadYouTubeIframeAPI().then(() => setIsApiReady(true)).catch(console.error);
  }, []);

  // Effect to create and manage the player instance
  useEffect(() => {
    if (!isApiReady || !playerContainerRef.current) {
      return;
    }
    
    seekedRef.current = false;

    // A new div is created for each player instance to avoid conflicts
    const playerDiv = document.createElement('div');
    playerContainerRef.current.appendChild(playerDiv);

    const isPlaylist = videoId.includes('videoseries');
    
    const player = new window.YT.Player(playerDiv, {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            iv_load_policy: 3,
        },
        events: {
            onReady: (event) => {
                playerInstanceRef.current = player;
                if (isPlaylist) {
                    event.target.loadPlaylist({listType: 'playlist', list: videoId.split('=')[1]});
                } else {
                    event.target.loadVideoById(videoId);
                }
                setIsPlayerReady(true);
            },
            onStateChange: (event) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                    if (!seekedRef.current) {
                        const duration = player.getDuration();
                        const progressToSeek = initialProgressRef.current;
                        if (duration > 0 && progressToSeek > 0) {
                            const startTime = (progressToSeek / 100) * duration;
                            player.seekTo(startTime, true);
                        }
                        seekedRef.current = true;
                    }

                    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = setInterval(() => {
                        const currentPlayer = playerInstanceRef.current;
                        if (currentPlayer && typeof currentPlayer.getCurrentTime === 'function' && typeof currentPlayer.getDuration === 'function') {
                            const currentTime = currentPlayer.getCurrentTime();
                            const duration = currentPlayer.getDuration();
                            if (duration > 0) {
                                const progress = (currentTime / duration) * 100;
                                onProgressRef.current(videoId, Math.min(progress, 100));
                            }
                        }
                    }, 1000);
                } else {
                    if (progressIntervalRef.current) {
                        clearInterval(progressIntervalRef.current);
                        progressIntervalRef.current = null;
                    }
                }
            },
        },
    });

    return () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        if (player && typeof player.destroy === 'function') {
            player.destroy();
        }
        if (playerContainerRef.current) {
            playerContainerRef.current.innerHTML = '';
        }
        playerInstanceRef.current = null;
        setIsPlayerReady(false);
    };
  }, [videoId, isApiReady]);

  const showSkeleton = !isPlayerReady;

  return (
    <div className="relative h-full w-full bg-black">
      {showSkeleton && <Skeleton className="absolute inset-0" />}
      <div
        ref={playerContainerRef}
        className={`h-full w-full transition-opacity duration-500 ${showSkeleton ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

export default YouTubePlayer;
