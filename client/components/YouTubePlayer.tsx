import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface YouTubePlayerProps {
    videoId: string;
    isPlaying: boolean;
    volume: number;
    onProgress: (currentTime: number, duration: number) => void;
    onEnded: () => void;
    onReady?: (player: any) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
    videoId,
    isPlaying,
    volume,
    onProgress,
    onEnded,
    onReady
}) => {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressInterval = useRef<any>(null);

    useEffect(() => {
        if (!window.YT) return;

        const initPlayer = () => {
            if (playerRef.current) return;

            playerRef.current = new window.YT.Player(containerRef.current, {
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: {
                    playsinline: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                },
                events: {
                    onReady: (event: any) => {
                        if (isPlaying) {
                            event.target.playVideo();
                        }
                        event.target.setVolume(volume);
                        if (onReady) onReady(event.target);
                    },
                    onStateChange: (event: any) => {
            
                        if (event.data === 0) {
                            onEnded();
                        }
                    },
                },
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
      
            const existingOnReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (existingOnReady) existingOnReady();
                initPlayer();
            };
        }

        return () => {
            if (playerRef.current) {
                try {
                        playerRef.current.destroy();
                } catch (e) {
                        console.error("Error destroying player", e);
                }
                playerRef.current = null;
            }
        };
    }, []);

  
    useEffect(() => {
        if (playerRef.current && playerRef.current.loadVideoById) {
            playerRef.current.loadVideoById(videoId);
            if (isPlaying) {
                playerRef.current.playVideo();
            }
        }
    }, [videoId]);

  
    useEffect(() => {
        if (playerRef.current && playerRef.current.playVideo) {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying]);

  
    useEffect(() => {
        if (playerRef.current && playerRef.current.setVolume) {
            playerRef.current.setVolume(volume);
        }
    }, [volume]);

  
    useEffect(() => {
        if (isPlaying) {
            progressInterval.current = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    const currentTime = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();
                    if (duration > 0) {
                        onProgress(currentTime, duration);
                    }
                }
            }, 1000);
        } else {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [isPlaying, onProgress]);

    return (
        <div style={{ display: 'none' }}>
            <div ref={containerRef} />
        </div>
    );
};

export default YouTubePlayer;
