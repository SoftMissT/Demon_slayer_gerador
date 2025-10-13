import React from 'react';
import type { User, AppView } from '../types';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { AboutTooltip } from './AboutTooltip';
import { AnvilIcon } from './icons/AnvilIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { DiscordLoginButton } from './DiscordLoginButton';

interface HeaderProps {
    activeView: AppView;
    onViewChange: (view: AppView) => void;
    onOpenAbout: () => void;
    onOpenHistory: () => void;
    onOpenFavorites: () => void;
    user: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
    favoritesCount: number;
}


const UserAvatar: React.FC<{ user: User; onLogout: () => void; }> = ({ user, onLogout }) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)}>
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full border-2 border-gray-600 hover:border-indigo-500 transition-colors" />
            </button>
            {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 py-1">
                    <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                        <p className="text-xs text-gray-400 truncate">ID: {user.id}</p>
                    </div>
                    <button
                        onClick={() => {
                            onLogout();
                            setMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({
    activeView,
    onViewChange,
    onOpenAbout,
    onOpenHistory,
    onOpenFavorites,
    user,
    onLoginClick,
    onLogout,
    favoritesCount
}) => {
    return (
        <header className="flex-shrink-0 p-3 bg-gray-900/50 border-b border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                         <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10" />
                        <h1 className="text-2xl font-bold text-white font-gangofthree hidden sm:block">Kimetsu Forge</h1>
                    </div>
                    <div className="p-1 bg-gray-800 rounded-lg flex items-center">
                        <Button 
                            variant={activeView === 'forge' ? 'primary' : 'ghost'} 
                            size="sm"
                            onClick={() => onViewChange('forge')}
                            className={`!rounded-md ${activeView === 'forge' ? 'forge-button' : ''}`}
                        >
                            <AnvilIcon className="w-4 h-4" /> Forja
                        </Button>
                        <Button 
                            variant={activeView === 'alchemist' ? 'primary' : 'ghost'} 
                            size="sm"
                            onClick={() => onViewChange('alchemist')}
                             className={`!rounded-md ${activeView === 'alchemist' ? 'alchemist-button' : ''}`}
                        >
                            <MagicWandIcon className="w-4 h-4" /> Alquimia
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onOpenHistory} aria-label="Histórico">
                        <HistoryIcon className="w-6 h-6" />
                    </Button>
                     <Button variant="ghost" onClick={onOpenFavorites} className="relative" aria-label="Favoritos">
                        <StarIcon className="w-6 h-6" />
                        {favoritesCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                                {favoritesCount}
                            </span>
                        )}
                    </Button>
                    <AboutTooltip onClick={onOpenAbout} />
                    
                    <div className="w-px h-8 bg-gray-700"></div>

                    {user ? (
                        <UserAvatar user={user} onLogout={onLogout} />
                    ) : (
                        <DiscordLoginButton onClick={onLoginClick} />
                    )}
                </div>
            </div>
        </header>
    );
};
