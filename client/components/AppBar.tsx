import React, { useState, useRef, useEffect } from "react";
import { Search, Music, Menu, X, Clock } from "lucide-react";

interface AppBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onLogoClick: () => void;
    onMenuClick: () => void;
    searchHistory: string[];
    onRemoveHistoryItem: (item: string) => void;
    onSelectHistoryItem: (item: string) => void;
    onSearchSubmit: (query: string) => void;
}

const AppBar: React.FC<AppBarProps> = ({
    searchQuery,
    onSearchChange,
    onLogoClick,
    onMenuClick,
    searchHistory,
    onRemoveHistoryItem,
    onSelectHistoryItem,
    onSearchSubmit,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/80 border-b border-white/10 shadow-lg">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">

                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 mr-2 text-slate-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>


                    <div
                        className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={onLogoClick}
                    >
                        <img
                            src="/icon.png"
                            alt="LiMuzic"
                            className="w-8 h-8 rounded-full shadow-lg shadow-violet-500/20"
                        />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
                            LiMuzic
                        </span>
                    </div>


                    <div
                        className="flex-1 w-full max-w-3xl ml-2 sm:mx-4 lg:mx-0 lg:flex-none lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:w-[32rem] lg:max-w-none relative"
                        ref={searchContainerRef}
                    >
                        <div className="relative group flex items-center">
                            <input
                                type="text"
                                className="block w-full pl-4 pr-12 py-2 border border-white/10 rounded-full leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-violet-500/50 focus:border-transparent sm:text-sm transition-all shadow-inner"
                                placeholder="Search songs, artists..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onSearchSubmit(searchQuery);
                                        setIsFocused(false);
                                    }
                                }}
                            />
                            <button
                                className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-r-full"
                                onClick={() => {
                                    onSearchSubmit(searchQuery);
                                    setIsFocused(false);
                                }}
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>


                        {isFocused && searchHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.1s_ease-out] z-50">
                                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/5 flex justify-between items-center">
                                    <span>Recent Searches</span>
                                </div>
                                <ul>
                                    {searchHistory.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer"
                                        >
                                            <div
                                                className="flex-1 px-4 py-3 flex items-center gap-3 text-slate-300 hover:text-white"
                                                onMouseDown={(e) => {
                                                    
                                                    e.preventDefault();
                                                    onSelectHistoryItem(item);
                                                    setIsFocused(false);
                                                }}
                                            >
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                <span>{item}</span>
                                            </div>
                                            <button
                                                className="p-3 text-slate-500 hover:text-red-400 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onRemoveHistoryItem(item);
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default AppBar;
