import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { Playlist } from "../types";

interface AddToPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    playlists: Playlist[];
    onCreatePlaylist: (name: string) => void;
    onTogglePlaylist: (playlistId: string) => void;
    selectedSongPlaylists: string[];
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
    isOpen,
    onClose,
    playlists,
    onCreatePlaylist,
    onTogglePlaylist,
    selectedSongPlaylists,
}) => {
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    if (!isOpen) return null;

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            onCreatePlaylist(newPlaylistName.trim());
            setNewPlaylistName("");
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-lg font-bold text-white">
                        Add to Playlist
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {playlists.map((playlist) => {
                        const isSelected = selectedSongPlaylists.includes(
                            playlist.id
                        );
                        return (
                            <button
                                key={playlist.id}
                                onClick={() => onTogglePlaylist(playlist.id)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-left cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            isSelected
                                                ? "bg-violet-500"
                                                : "bg-slate-800 group-hover:bg-slate-700"
                                        }`}
                                    >
                                        {isSelected ? (
                                            <Check className="w-5 h-5 text-white" />
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400">
                                                {playlist.name[0]}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p
                                            className={`font-medium ${
                                                isSelected
                                                    ? "text-violet-300"
                                                    : "text-white"
                                            }`}
                                        >
                                            {playlist.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {playlist.songs.length} songs
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-white/10 bg-slate-900">
                    {isCreating ? (
                        <form onSubmit={handleCreate} className="flex gap-2">
                            <input
                                type="text"
                                value={newPlaylistName}
                                onChange={(e) =>
                                    setNewPlaylistName(e.target.value)
                                }
                                placeholder="Playlist name"
                                className="flex-1 bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 outline-none"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!newPlaylistName.trim()}
                                className="bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="text-slate-400 px-2 hover:text-white cursor-pointer"
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 hover:bg-white/5 transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                New Playlist
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;
