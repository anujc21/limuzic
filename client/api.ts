import { Song } from './types';

const API_BASE_URL = 'http://localhost:3000';

interface ApiResult {
    id: {
        videoId: string;
    };
    title: string;
    duration_raw: string;
    snippet: {
        thumbnails: {
            url: string;
            high: {
                url: string;
            };
        };
    };
}

const parseDuration = (durationStr: string | undefined | null): number => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
};

const mapResultToSong = (result: ApiResult): Song => {
    return {
        id: result.id.videoId,
        title: result.title,
        artist: result.title.split('-')[0].trim() || 'Unknown Artist', 
        album: 'YouTube',
        coverUrl: result.snippet.thumbnails.high?.url || result.snippet.thumbnails.url,
        duration: result.duration_raw || '0:00',
        durationSec: parseDuration(result.duration_raw),
    };
};

export const fetchHome = async (): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/home`);
    if (!response.ok) throw new Error('Failed to fetch home');
    const data = await response.json();
    return data.map(mapResultToSong);
};

export const fetchSearch = async (query: string): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch search results');
    const data = await response.json();
    return data.map(mapResultToSong);
};

export const fetchArtists = async (): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/artists`);
    if (!response.ok) throw new Error('Failed to fetch artists');
    const data = await response.json();
    return data.map(mapResultToSong);
};

export const fetchTrending = async (): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/trending`);
    if (!response.ok) throw new Error('Failed to fetch trending');
    const data = await response.json();
    return data.map(mapResultToSong);
};
