import React from 'react';
import { Home, Mic2, TrendingUp, Library, Info, X } from 'lucide-react';

export type View = 'home' | 'artists' | 'trending' | 'playlist' | 'about';

interface SidebarProps {
    currentView: View;
    onChangeView: (view: View) => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose }) => {
    const menuItems: { id: View; label: string; icon: React.ElementType }[] = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'artists', label: 'Artists', icon: Mic2 },
        { id: 'trending', label: 'Trending', icon: TrendingUp },
        { id: 'playlist', label: 'Playlist', icon: Library },
        { id: 'about', label: 'About', icon: Info },
    ];

    const handleItemClick = (view: View) => {
        onChangeView(view);
        onClose(); 
    };

    return (
        <>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}


            <aside 
                className={`
                    fixed top-0 left-0 z-50 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:h-full lg:bg-transparent lg:border-r-0 flex-shrink-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-full flex flex-col p-4">

                    <div className="flex items-center justify-between mb-8 lg:hidden">
                        <span className="text-xl font-bold text-white">Menu</span>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>


                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
              
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer
                                        ${isActive 
                                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>


                    <div className="mt-auto pt-8 border-t border-white/5">
                        <p className="text-xs text-slate-500 text-center">
                            &copy; 2024 LiMuzic
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
