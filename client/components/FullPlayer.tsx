import React, { useEffect } from "react";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Repeat1,
    ChevronDown,
    Heart,
    ListMusic,
    Volume2,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { Song } from "../types";

interface FullPlayerProps {
    currentSong: Song;
    nextSong: Song | null;
    isPlaying: boolean;
    progress: number; 
    currentTime: number; 
    duration: number; 
    volume: number; 
    isLiked: boolean;
    isShuffle: boolean;
    repeatMode: "off" | "all" | "one";
    onTogglePlay: () => void;
    onNext: () => void;
    onPrev: () => void;
    onToggleShuffle: () => void;
    onToggleRepeat: () => void;
    onClose: () => void;
    onSeek: (percentage: number) => void;
    onVolumeChange: (percentage: number) => void;
    onToggleLike: () => void;
    onPlaylistClick: () => void;
}

const FullPlayer: React.FC<FullPlayerProps> = ({
    currentSong,
    nextSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isLiked,
    isShuffle,
    repeatMode,
    onTogglePlay,
    onNext,
    onPrev,
    onToggleShuffle,
    onToggleRepeat,
    onClose,
    onSeek,
    onVolumeChange,
    onToggleLike,
    onPlaylistClick,
}) => {
    
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const formatTime = (secs: number) => {
        if (!secs && secs !== 0) return "0:00";
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900 text-white overflow-hidden animate-[fadeIn_0.3s_ease-out]">

            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-black" />
                <img
                    src={currentSong.coverUrl}
                    alt="Background"
                    className="w-full h-full object-cover opacity-30 blur-3xl scale-125"
                />
            </div>


            <div className="relative z-10 flex items-center justify-between px-6 py-4 flex-shrink-0">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
                >
                    <ChevronDown className="w-8 h-8 text-slate-300" />
                </button>
                <span className="text-sm font-medium tracking-widest uppercase text-slate-400">
                    Now Playing
                </span>
                <button
                    onClick={onPlaylistClick}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
                >
                    <ListMusic className="w-6 h-6 text-slate-300" />
                </button>
            </div>



            <div className="relative z-10 flex-1 w-full min-h-0 flex flex-col landscape:flex-row items-center justify-evenly landscape:justify-center px-6 pb-6 landscape:pb-4 gap-4 landscape:gap-12">


                <div className="relative flex-shrink-1 min-h-0 w-auto h-auto max-h-[45vh] landscape:max-h-[70vh] aspect-square max-w-full group rounded-3xl shadow-2xl overflow-hidden bg-slate-800">

                    <div className="absolute inset-0">
                        <img
                            src={currentSong.coverUrl}
                            alt=""
                            className="w-full h-full object-cover blur-2xl opacity-60 scale-110"
                        />
                    </div>


                    <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className={`relative z-10 w-full h-full object-contain rounded-3xl transition-transform duration-700 ease-out 
                ${isPlaying ? "scale-100" : "scale-95"}
              `}
                    />
                </div>


                <div className="w-full max-w-md flex flex-col justify-center gap-5 landscape:gap-3 flex-shrink-0">

                    <div className="flex items-end justify-between">
                        <div className="space-y-0.5 overflow-hidden flex-1 min-w-0 mr-4">
                            <Marquee
                                gradient={false}
                                speed={40}
                                pauseOnHover
                                delay={2}
                            >
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white pr-12">
                                    {currentSong.title}
                                </h1>
                            </Marquee>
                            <p className="text-lg text-slate-400 font-medium pr-12">
                                {currentSong.artist}
                            </p>
                        </div>
                        <button
                            onClick={onToggleLike}
                            className={`p-2 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                                isLiked
                                    ? "text-pink-500 bg-pink-500/10"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Heart
                                className={`w-6 h-6 sm:w-7 sm:h-7 ${
                                    isLiked ? "fill-current" : ""
                                }`}
                            />
                        </button>
                    </div>


                    <div className="space-y-1.5">
                        <div
                            className="relative group cursor-pointer h-2 py-1 select-none touch-none"
                            onPointerDown={(e) => {
                                const element = e.currentTarget;
                                const rect = element.getBoundingClientRect();
                                const updateProgress = (clientX: number) => {
                                    const x = clientX - rect.left;
                                    const percentage = Math.min(
                                        Math.max((x / rect.width) * 100, 0),
                                        100
                                    );
                                    onSeek(percentage);
                                };

                                updateProgress(e.clientX);

                                const onPointerMove = (
                                    moveEvent: PointerEvent
                                ) => {
                                    updateProgress(moveEvent.clientX);
                                };

                                const onPointerUp = () => {
                                    window.removeEventListener(
                                        "pointermove",
                                        onPointerMove
                                    );
                                    window.removeEventListener(
                                        "pointerup",
                                        onPointerUp
                                    );
                                };

                                window.addEventListener(
                                    "pointermove",
                                    onPointerMove
                                );
                                window.addEventListener(
                                    "pointerup",
                                    onPointerUp
                                );
                            }}
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 relative transition-all duration-75 ease-linear"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-400">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>


                    <div className="flex items-center justify-between -mx-2">
                        <button
                            onClick={onToggleShuffle}
                            className={`p-2 transition-colors cursor-pointer ${
                                isShuffle
                                    ? "text-violet-400"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Shuffle className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        <button
                            onClick={onPrev}
                            className="text-slate-200 hover:text-white transition-transform hover:-translate-x-1 p-2 cursor-pointer"
                        >
                            <SkipBack className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                        </button>

                        <button
                            onClick={onTogglePlay}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all cursor-pointer"
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                            ) : (
                                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                            )}
                        </button>

                        <button
                            onClick={onNext}
                            className="text-slate-200 hover:text-white transition-transform hover:translate-x-1 p-2 cursor-pointer"
                        >
                            <SkipForward className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                        </button>

                        <button
                            onClick={onToggleRepeat}
                            className={`p-2 transition-colors cursor-pointer ${
                                repeatMode !== "off"
                                    ? "text-violet-400"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            {repeatMode === "one" ? (
                                <Repeat1 className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Repeat className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>
                    </div>


                    <div className="flex items-center gap-3 px-1">
                        <Volume2 className="w-5 h-5 text-slate-400" />
                        <div
                            className="flex-1 h-1 bg-slate-700/50 rounded-full cursor-pointer group py-2 relative select-none touch-none"
                            onPointerDown={(e) => {
                                const element = e.currentTarget;
                                const rect = element.getBoundingClientRect();
                                const updateVolume = (clientX: number) => {
                                    const x = clientX - rect.left;
                                    const percentage = Math.min(
                                        Math.max((x / rect.width) * 100, 0),
                                        100
                                    );
                                    onVolumeChange(percentage);
                                };

                                updateVolume(e.clientX);

                                const onPointerMove = (
                                    moveEvent: PointerEvent
                                ) => {
                                    updateVolume(moveEvent.clientX);
                                };

                                const onPointerUp = () => {
                                    window.removeEventListener(
                                        "pointermove",
                                        onPointerMove
                                    );
                                    window.removeEventListener(
                                        "pointerup",
                                        onPointerUp
                                    );
                                };

                                window.addEventListener(
                                    "pointermove",
                                    onPointerMove
                                );
                                window.addEventListener(
                                    "pointerup",
                                    onPointerUp
                                );
                            }}
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-slate-700/50 rounded-full"></div>
                            <div
                                className="h-1 bg-slate-400 group-hover:bg-violet-400 rounded-full relative transition-colors absolute top-1/2 -translate-y-1/2"
                                style={{ width: `${volume}%` }}
                            ></div>
                        </div>
                    </div>


                    {nextSong && (
                        <div
                            onClick={onNext}
                            className="bg-white/5 backdrop-blur-md rounded-xl p-2.5 flex items-center gap-3 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={nextSong.coverUrl}
                                    alt="Next"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-[10px] text-violet-300 font-semibold uppercase tracking-wider mb-0.5">
                                    Up Next
                                </p>
                                <p className="text-sm font-medium text-white truncate group-hover:text-violet-200 transition-colors">
                                    {nextSong.title}
                                </p>
                            </div>
                            <div className="p-2">
                                <SkipForward className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FullPlayer;
