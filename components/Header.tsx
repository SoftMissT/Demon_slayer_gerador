import React from 'react';
import type { User, AppView } from '../types';
import { ForgeIcon } from './icons/ForgeIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { StarIcon } from './icons/StarIcon';
import { HelpIcon } from './icons/HelpIcon';
import { DiscordLoginButton } from './DiscordLoginButton';
import { AboutTooltip } from './AboutTooltip';
import { Tooltip } from './ui/Tooltip';
import { ShareButton } from './ShareButton';

interface HeaderProps {
    activeView: AppView;
    onViewChange: (view: AppView) => void;
    onOpenAbout: () => void;
    onOpenHistory: () => void;
    onOpenFavorites: () => void;
    onOpenHowItWorks: () => void;
    user: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
    favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
    activeView,
    onViewChange,
    onOpenAbout,
    onOpenHistory,
    onOpenFavorites,
    onOpenHowItWorks,
    user,
    onLoginClick,
    onLogout,
    favoritesCount
}) => {
    return (
        <header className="flex items-center justify-between p-2 sm:p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
                <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10" />
                <h1 className="text-xl sm:text-2xl font-bold font-gangofthree text-white hidden sm:block">
                    Kimetsu Forge
                </h1>
            </div>

            <div className="flex-grow flex items-center justify-center">
                <div className="p-1 bg-gray-800 rounded-lg flex items-center gap-1">
                    <Tooltip text="Modo Forja">
                        <button
                            onClick={() => onViewChange('forge')}
                            className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${activeView === 'forge' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        >
                            <ForgeIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Forja</span>
                        </button>
                    </Tooltip>
                     <Tooltip text="Modo Alquimia">
                        <button
                            onClick={() => onViewChange('alchemist')}
                            className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${activeView === 'alchemist' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        >
                            <MagicWandIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Alquimia</span>
                        </button>
                    </Tooltip>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <Tooltip text="Histórico">
                    <button onClick={onOpenHistory} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700">
                        <HistoryIcon className="w-6 h-6" />
                    </button>
                </Tooltip>
                <Tooltip text="Favoritos">
                    <button onClick={onOpenFavorites} className="text-gray-400 hover:text-white transition-colors relative p-2 rounded-full hover:bg-gray-700">
                        <StarIcon className="w-6 h-6" />
                        {favoritesCount > 0 && (
                            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                                {favoritesCount > 9 ? '9+' : favoritesCount}
                            </span>
                        )}
                    </button>
                </Tooltip>
                 <Tooltip text="Como Funciona">
                    <button onClick={onOpenHowItWorks} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700">
                        <HelpIcon className="w-6 h-6" />
                    </button>
                </Tooltip>
                <ShareButton />
                 <AboutTooltip onClick={onOpenAbout} />

                {user ? (
                    <div className="relative group">
                        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-600 group-hover:border-indigo-500" />
                        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                            <div className="p-2 text-sm text-white truncate border-b border-gray-700">{user.username}</div>
                            <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/50">
                                Sair
                            </button>
                        </div>
                    </div>
                ) : (
                    <DiscordLoginButton onClick={onLoginClick} />
                )}
            </div>
        </header>
    );
};