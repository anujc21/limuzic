import React, { useState, useEffect, useRef, useCallback } from "react";
import { Song, Playlist } from "./types";
import { fetchHome, fetchSearch, fetchArtists, fetchTrending } from "./api";
import AppBar from "./components/AppBar";
import SongCard from "./components/SongCard";
import FullPlayer from "./components/FullPlayer";
import YouTubePlayer from "./components/YouTubePlayer";
import Sidebar, { View } from "./components/Sidebar";
import AddToPlaylistModal from "./components/AddToPlaylistModal";
import { Trash2, Play, Plus } from "lucide-react";
import Marquee from "react-fast-marquee";

const App: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [activeSearchQuery, setActiveSearchQuery] = useState("");
    const [searchInputValue, setSearchInputValue] = useState("");
    const [currentSongId, setCurrentSongId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentView, setCurrentView] = useState<View>("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
        null
    );

    const [volume, setVolume] = useState(80);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

    const [playlists, setPlaylists] = useState<Playlist[]>(() => {
        const saved = localStorage.getItem("playlists");
        if (saved) return JSON.parse(saved);
        return [
            { id: "favorites", name: "Favorites", songs: [], isDefault: true },
        ];
    });

    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        const saved = localStorage.getItem("searchHistory");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }, [searchHistory]);

    const addToHistory = (query: string) => {
        if (!query.trim()) return;
        setSearchHistory((prev) => {
            const filtered = prev.filter(
                (item) => item.toLowerCase() !== query.toLowerCase()
            );
            return [query, ...filtered].slice(0, 5);
        });
    };

    const removeFromHistory = (item: string) => {
        setSearchHistory((prev) => prev.filter((i) => i !== item));
    };

    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
        useState(false);
    const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(
        null
    );

    useEffect(() => {
        localStorage.setItem("playlists", JSON.stringify(playlists));
    }, [playlists]);

    const createPlaylist = (name: string) => {
        const newPlaylist: Playlist = {
            id: Date.now().toString(),
            name,
            songs: [],
        };
        setPlaylists([...playlists, newPlaylist]);
    };

    const deletePlaylist = (id: string) => {
        setPlaylists(playlists.filter((p) => p.id !== id));
        if (selectedPlaylistId === id) {
            setSelectedPlaylistId(null);
        }
    };

    const toggleSongInPlaylist = (playlistId: string, song: Song) => {
        setPlaylists(
            playlists.map((p) => {
                if (p.id === playlistId) {
                    const exists = p.songs.some((s) => s.id === song.id);
                    if (exists) {
                        return {
                            ...p,
                            songs: p.songs.filter((s) => s.id !== song.id),
                        };
                    } else {
                        return { ...p, songs: [...p.songs, song] };
                    }
                }
                return p;
            })
        );
    };

    const openAddToPlaylistModal = (song: Song) => {
        setSongToAddToPlaylist(song);
        setIsAddToPlaylistModalOpen(true);
    };

    const playerRef = useRef<any>(null);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            let data: Song[] = [];

            if (activeSearchQuery) {
                data = await fetchSearch(activeSearchQuery);
            } else {
                switch (currentView) {
                    case "home":
                        data = await fetchHome();
                        break;
                    case "artists":
                        data = await fetchArtists();
                        break;
                    case "trending":
                        data = await fetchTrending();
                        break;
                    case "playlist":
                        if (selectedPlaylistId) {
                            const playlist = playlists.find(
                                (p) => p.id === selectedPlaylistId
                            );
                            data = playlist ? playlist.songs : [];
                        } else {
                            data = [];
                        }
                        break;
                    case "about":
                        data = [];
                        break;
                }
            }
            const unique = Array.from(
                new Map(data.map((s) => [s.id, s])).values()
            );
            setSongs(unique);
        } catch (err) {
            console.error(err);
            setError("Failed to load content. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    }, [currentView, activeSearchQuery, selectedPlaylistId, playlists]);

    useEffect(() => {
        if (
            currentView !== "playlist" ||
            activeSearchQuery ||
            selectedPlaylistId
        ) {
            loadData();
        } else {
            setIsLoading(false);
        }
    }, [currentView, activeSearchQuery, selectedPlaylistId]);

    const currentSongIndex = songs.findIndex((s) => s.id === currentSongId);
    const [playingSong, setPlayingSong] = useState<Song | null>(null);

    useEffect(() => {
        if (currentSongId) {
            let found = songs.find((s) => s.id === currentSongId);
            if (!found) {
                for (const p of playlists) {
                    found = p.songs.find((s) => s.id === currentSongId);
                    if (found) break;
                }
            }
            if (found) setPlayingSong(found);
        }
    }, [currentSongId, songs, playlists]);

    const nextSong =
        currentSongIndex >= 0 && currentSongIndex < songs.length - 1
            ? songs[currentSongIndex + 1]
            : songs[0];

    const handleSongClick = (song: Song) => {
        if (currentSongId === song.id) {
            if (!isPlayerOpen) {
                setIsPlayerOpen(true);
            } else {
                setIsPlaying(!isPlaying);
            }
        } else {
            setCurrentSongId(song.id);
            setPlayingSong(song);
            setIsPlaying(true);
            setIsPlayerOpen(true);
        }
    };

    const handleNext = useCallback(() => {
        if (songs.length === 0) return;

        let nextIndex = 0;
        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * songs.length);

            if (songs.length > 1 && nextIndex === currentSongIndex) {
                nextIndex = (nextIndex + 1) % songs.length;
            }
        } else {
            if (currentSongIndex !== -1) {
                nextIndex = (currentSongIndex + 1) % songs.length;

                if (
                    repeatMode === "off" &&
                    currentSongIndex === songs.length - 1
                ) {
                    setIsPlaying(false);
                    return;
                }
            }
        }

        const next = songs[nextIndex];
        setCurrentSongId(next.id);
        setPlayingSong(next);
        setIsPlaying(true);
    }, [currentSongIndex, songs, isShuffle, repeatMode]);

    const handleSongEnd = useCallback(() => {
        if (repeatMode === "one" && playerRef.current) {
            playerRef.current.seekTo(0);
            setIsPlaying(true);
        } else {
            handleNext();
        }
    }, [repeatMode, handleNext]);

    const handlePrev = useCallback(() => {
        if (songs.length === 0) return;
        let prevIndex = 0;
        if (currentSongIndex !== -1) {
            prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        }
        const prev = songs[prevIndex];
        setCurrentSongId(prev.id);
        setPlayingSong(prev);
        setIsPlaying(true);
    }, [currentSongIndex, songs]);

    const handleSeek = (percentage: number) => {
        if (playerRef.current && duration > 0) {
            const newTime = (percentage / 100) * duration;
            playerRef.current.seekTo(newTime, true);
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
    };

    const progressPercentage =
        duration > 0 ? (currentTime / duration) * 100 : 0;

    const renderContent = () => {
        if (currentView === "about" && !activeSearchQuery) {
            return (
                <div className="max-w-2xl mx-auto text-center py-12 animate-[fadeIn_0.5s_ease-out]">
                    <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        About LiMuzic
                    </h2>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                        LiMuzic is your ultimate destination for ad-free music
                        streaming. Powered by YouTube, we bring you the best
                        tracks, trending hits, and your favorite artists in a
                        sleek, modern interface designed for music lovers.
                    </p>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <p className="text-sm text-slate-400">Version 1.0.0</p>
                        <p className="text-sm text-slate-500 mt-2">
                            Built with React, Vite, and Tailwind CSS
                        </p>
                    </div>
                </div>
            );
        }

        if (
            currentView === "playlist" &&
            !selectedPlaylistId &&
            !activeSearchQuery
        ) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.5s_ease-out]">
                    <button
                        onClick={() => {
                            setSongToAddToPlaylist(null);
                            setIsAddToPlaylistModalOpen(true);
                        }}
                        className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-violet-500/50 hover:bg-white/5 transition-all h-48"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <span className="font-medium text-slate-300 group-hover:text-white">
                            Create New Playlist
                        </span>
                    </button>

                    {playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            onClick={() => setSelectedPlaylistId(playlist.id)}
                            className="group relative bg-white/5 hover:bg-white/10 rounded-2xl p-6 transition-all cursor-pointer border border-white/5 hover:border-white/10 h-48 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                                    {playlist.name}
                                </h3>
                                <p className="text-slate-400">
                                    {playlist.songs.length} songs
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex -space-x-2 overflow-hidden">
                                    {playlist.songs.slice(0, 3).map((s) => (
                                        <img
                                            key={`${playlist.id}-${s.id}`}
                                            src={s.coverUrl}
                                            alt=""
                                            className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {!playlist.isDefault && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deletePlaylist(playlist.id);
                                            }}
                                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                            title="Delete Playlist"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <div className="p-2 bg-violet-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform translate-y-2 group-hover:translate-y-0">
                                        <Play className="w-5 h-5 fill-current pl-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <>
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="text-center py-20 text-red-400">
                        <p>{error}</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {songs.map((song, index) => (
                            <div
                                key={song.id}
                                className="animate-[fadeInUp_0.5s_ease-out]"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <SongCard
                                    song={song}
                                    isCurrent={currentSongId === song.id}
                                    isPlaying={isPlaying}
                                    isLiked={playlists.some((p) =>
                                        p.songs.some((s) => s.id === song.id)
                                    )}
                                    onToggleLike={() =>
                                        openAddToPlaylistModal(song)
                                    }
                                    onClick={() => handleSongClick(song)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && songs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <p className="text-xl font-medium">No songs found</p>
                        <p className="text-sm">
                            Try searching for a different artist or title.
                        </p>
                    </div>
                )}
            </>
        );
    };

    const getHeaderTitle = () => {
        if (activeSearchQuery) return "Search Results";
        if (currentView === "playlist" && selectedPlaylistId) {
            const p = playlists.find((pl) => pl.id === selectedPlaylistId);
            return p ? p.name : "Playlist";
        }
        switch (currentView) {
            case "home":
                return "Featured Tracks";
            case "artists":
                return "Top Artists";
            case "trending":
                return "Trending Now";
            case "playlist":
                return "Your Library";
            case "about":
                return "About Us";
            default:
                return "LiMuzic";
        }
    };

    const getHeaderSubtitle = () => {
        if (activeSearchQuery)
            return `Found ${songs.length} tracks matching "${activeSearchQuery}"`;
        if (currentView === "playlist" && selectedPlaylistId)
            return "Manage your playlist.";
        switch (currentView) {
            case "home":
                return "Curated just for you based on your listening history.";
            case "artists":
                return "Discover songs from popular artists.";
            case "trending":
                return "See what's popular right now.";
            case "playlist":
                return "Your personal collection of favorites.";
            case "about":
                return "Learn more about the project.";
            default:
                return "";
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-slate-900 text-white font-sans selection:bg-violet-500/30 flex flex-col">
            <AppBar
                searchQuery={searchInputValue}
                onSearchChange={setSearchInputValue}
                onLogoClick={() => {
                    setSearchInputValue("");
                    setActiveSearchQuery("");
                    setCurrentView("home");
                    setSelectedPlaylistId(null);
                    setIsPlayerOpen(false);
                }}
                onMenuClick={() => setIsMobileMenuOpen(true)}
                searchHistory={searchHistory}
                onRemoveHistoryItem={removeFromHistory}
                onSelectHistoryItem={(item) => {
                    setSearchInputValue(item);
                    setActiveSearchQuery(item);
                    addToHistory(item);
                }}
                onSearchSubmit={(query) => {
                    setActiveSearchQuery(query);
                    addToHistory(query);
                }}
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    currentView={currentView}
                    onChangeView={(view) => {
                        setCurrentView(view);
                        setSearchInputValue("");
                        setActiveSearchQuery("");
                        setSelectedPlaylistId(null);
                    }}
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 animate-[fadeIn_0.5s_ease-out] flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-2">
                                    {getHeaderTitle()}
                                </h2>
                                <p className="text-slate-400">
                                    {getHeaderSubtitle()}
                                </p>
                            </div>

                            {currentView === "playlist" &&
                                selectedPlaylistId &&
                                !activeSearchQuery && (
                                    <button
                                        onClick={() =>
                                            setSelectedPlaylistId(null)
                                        }
                                        className="text-sm text-slate-400 hover:text-white underline"
                                    >
                                        Back to Playlists
                                    </button>
                                )}
                        </div>

                        {renderContent()}
                    </div>
                </main>
            </div>

            {playingSong && (
                <YouTubePlayer
                    videoId={playingSong.id}
                    isPlaying={isPlaying}
                    volume={volume}
                    onProgress={(curr, dur) => {
                        setCurrentTime(curr);
                        setDuration(dur);
                    }}
                    onEnded={handleSongEnd}
                    onReady={(player) => {
                        playerRef.current = player;
                    }}
                />
            )}

            {!isPlayerOpen && playingSong && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-800/90 backdrop-blur-xl border-t border-white/5 animate-[slideUp_0.3s_ease-out] lg:left-64 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                        <div
                            className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setIsPlayerOpen(true)}
                        >
                            <img
                                src={playingSong.coverUrl}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover shadow-sm"
                            />
                            <div className="flex flex-col min-w-0">
                                <div className="block sm:hidden min-w-0">
                                    <Marquee
                                        gradient={false}
                                        speed={40}
                                        pauseOnHover
                                        className="min-w-0 leading-tight"
                                    >
                                        <span className="text-sm font-semibold text-white pr-6">
                                            {playingSong.title}
                                        </span>
                                    </Marquee>

                                    <Marquee
                                        gradient={false}
                                        speed={35}
                                        pauseOnHover
                                        className="min-w-0 leading-tight"
                                    >
                                        <span className="text-xs text-slate-400 pr-6">
                                            {playingSong.artist}
                                        </span>
                                    </Marquee>
                                </div>

                                <div className="hidden sm:block min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {playingSong.title}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {playingSong.artist}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePrev}
                                className="p-2 text-slate-300 hover:text-white cursor-pointer"
                            >
                                <span className="sr-only">Prev</span>
                                <svg
                                    className="w-5 h-5 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-3 bg-white text-slate-900 rounded-full hover:scale-105 transition-transform cursor-pointer"
                            >
                                {isPlaying ? (
                                    <svg
                                        className="w-5 h-5 fill-current"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5 fill-current ml-0.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={handleNext}
                                className="p-2 text-slate-300 hover:text-white cursor-pointer"
                            >
                                <span className="sr-only">Next</span>
                                <svg
                                    className="w-5 h-5 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="absolute top-0 left-0 h-1 bg-slate-700 w-full">
                        <div
                            className="h-full bg-violet-500 transition-all duration-100 ease-linear"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {isPlayerOpen && playingSong && (
                <FullPlayer
                    currentSong={playingSong}
                    nextSong={nextSong}
                    isPlaying={isPlaying}
                    progress={progressPercentage}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    isShuffle={isShuffle}
                    repeatMode={repeatMode}
                    onToggleShuffle={() => setIsShuffle(!isShuffle)}
                    onToggleRepeat={() => {
                        setRepeatMode((current) => {
                            if (current === "off") return "all";
                            if (current === "all") return "one";
                            return "off";
                        });
                    }}
                    isLiked={playlists.some((p) =>
                        p.songs.some((s) => s.id === playingSong.id)
                    )}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onClose={() => setIsPlayerOpen(false)}
                    onSeek={handleSeek}
                    onVolumeChange={handleVolumeChange}
                    onToggleLike={() => openAddToPlaylistModal(playingSong)}
                    onPlaylistClick={() => {
                        setIsPlayerOpen(false);
                        setCurrentView("playlist");
                    }}
                />
            )}

            <AddToPlaylistModal
                isOpen={isAddToPlaylistModalOpen}
                onClose={() => setIsAddToPlaylistModalOpen(false)}
                playlists={playlists}
                onCreatePlaylist={createPlaylist}
                onTogglePlaylist={(playlistId) => {
                    if (songToAddToPlaylist) {
                        toggleSongInPlaylist(playlistId, songToAddToPlaylist);
                    }
                }}
                selectedSongPlaylists={
                    songToAddToPlaylist
                        ? playlists
                              .filter((p) =>
                                  p.songs.some(
                                      (s) => s.id === songToAddToPlaylist.id
                                  )
                              )
                              .map((p) => p.id)
                        : []
                }
            />
        </div>
    );
};

export default App;
