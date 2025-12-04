import React from "react";
import { Play, Pause, Heart } from "lucide-react";
import { Song } from "../types";

interface SongCardProps {
    song: Song;
    isPlaying: boolean;
    isCurrent: boolean;
    isLiked?: boolean;
    onToggleLike?: (e: React.MouseEvent) => void;
    onClick: () => void;
}

const SongCard: React.FC<SongCardProps> = ({
    song,
    isPlaying,
    isCurrent,
    isLiked,
    onToggleLike,
    onClick,
}) => {
    return (
        <div
            className={`group relative flex flex-col p-2 rounded-2xl transition-all duration-300 cursor-pointer
                ${
                    isCurrent
                        ? "p-4 bg-white/10 ring-1 ring-white/20 shadow-xl"
                        : "hover:bg-white/5 hover:shadow-lg"
                }
            `}
            onClick={onClick}
        >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg mb-4">
                <div className="absolute inset-0">
                    <img
                        src={song.coverUrl}
                        alt=""
                        className="w-full h-full object-cover blur-xl opacity-60 scale-110"
                    />
                </div>

                <img
                    src={song.coverUrl}
                    alt={song.title}
                    className={`relative z-10 w-full h-full object-contain transition-transform duration-500 ${
                        isCurrent ? "scale-105" : "group-hover:scale-105"
                    }`}
                />

                {(isLiked || onToggleLike) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike && onToggleLike(e);
                        }}
                        className={`absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer
        ${
            isLiked
                ? "bg-violet-500/20 text-violet-400 opacity-100"
                : "bg-black/20 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/40"
        }
    `}
                    >
                        <Heart
                            className={`w-5 h-5 ${
                                isLiked ? "fill-current" : ""
                            }`}
                        />
                    </button>
                )}

                <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300
                    ${
                        isCurrent
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                    }
                `}
                >
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110">
                        {isCurrent && isPlaying ? (
                            <Pause className="w-6 h-6 text-white fill-current" />
                        ) : (
                            <Play className="w-6 h-6 text-white fill-current pl-1" />
                        )}
                    </div>
                </div>

                {isCurrent && isPlaying && (
                    <div className="absolute bottom-2 right-2 flex gap-1 items-end h-4">
                        <span className="w-1 bg-violet-400 animate-[bounce_1s_infinite] h-2"></span>
                        <span className="w-1 bg-violet-400 animate-[bounce_1.2s_infinite] h-4"></span>
                        <span className="w-1 bg-violet-400 animate-[bounce_0.8s_infinite] h-3"></span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <h3
                    className={`font-semibold truncate text-lg ${
                        isCurrent ? "text-violet-300" : "text-white"
                    }`}
                >
                    {song.title}
                </h3>
                <p className="text-sm text-slate-400 truncate">{song.artist}</p>
            </div>
        </div>
    );
};

export default SongCard;
