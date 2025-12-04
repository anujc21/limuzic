export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    duration: string; 
    durationSec: number; 
}

export interface Playlist {
    id: string;
    name: string;
    songs: Song[];
    isDefault?: boolean;
}

export type ViewState = 'home' | 'player';