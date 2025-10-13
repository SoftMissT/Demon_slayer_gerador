
import React, { useState } from 'react';
import type { User } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { ForgeIcon } from './icons/ForgeIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { StarIcon } from './icons/StarIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { HelpIcon } from './icons/HelpIcon';
import { BookIcon } from './icons/BookIcon';
import { KeyIcon } from './icons/KeyIcon';
import { Tooltip } from './ui/Tooltip';
import { Button } from './ui/Button';

type AppView = 'forge' | 'alchemist';

interface HeaderProps {
    activeView: AppView;
    onViewChange: (view: AppView) => void;
    onOpenAbout: () => void;
    onOpenApiKeys: () => void;
    onOpenHistory: () => void;
    onOpenFavorites: () => void;
    onOpenHowItWorks: () => void;
    user: User | null;
    onLogout: () => void;
}

const ViewToggleButton: React.FC<{ activeView: AppView, onViewChange: (view: AppView) => void }> = ({ activeView, onViewChange }) => (
    <div className="flex items-center bg-gray-900/50 border border-gray-700/50 rounded-lg p-1">
        <Tooltip text="Forja de Itens">
            <button
                onClick={() => onViewChange('forge')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${activeView === 'forge' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
                <ForgeIcon className="w-5 h-5" />
                <span className="hidden md:inline">Forja</span>
            </button>
        </Tooltip>
        <Tooltip text="Alquimista de Prompts">
            <button
                onClick={() => onViewChange('alchemist')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${activeView === 'alchemist' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
                <MagicWandIcon className="w-5 h-5" />
                <span className="hidden md:inline">Alquimia</span>
            </button>
        </Tooltip>
    </div>
);


export const Header: React.FC<HeaderProps> = ({
    activeView, onViewChange, onOpenAbout, onOpenApiKeys, onOpenHistory, onOpenFavorites, onOpenHowItWorks, user, onLogout
}) => {
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <header className="flex-shrink-0 flex items-center justify-between p-2 border-b border-gray-800">
            <div className="flex items-center gap-2 md:gap-4">
                 <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10" />
                <h1 className="text-xl md:text-2xl font-bold font-gangofthree hidden sm:block text-white">
                    Kimetsu Forge
                </h1>
            </div>

            <div className="flex-grow flex justify-center">
                 <ViewToggleButton activeView={activeView} onViewChange={onViewChange} />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <Tooltip text="Favoritos">
                    <button onClick={onOpenFavorites} className="p-2 text-gray-400 hover:text-white transition-colors"><StarIcon className="w-6 h-6" /></button>
                </Tooltip>
                <Tooltip text="Histórico">
                    <button onClick={onOpenHistory} className="p-2 text-gray-400 hover:text-white transition-colors"><HistoryIcon className="w-6 h-6" /></button>
                </Tooltip>
                
                <div className="relative">
                    <Tooltip text="Ajuda & Configurações">
                        <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-2 text-gray-400 hover:text-white transition-colors"><SettingsIcon className="w-6 h-6" /></button>
                    </Tooltip>
                    {settingsOpen && (
                        <div 
                            className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 py-1"
                            onMouseLeave={() => setSettingsOpen(false)}
                        >
                            <button onClick={() => { onOpenHowItWorks(); setSettingsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                <BookIcon className="w-5 h-5"/> Como Funciona
                            </button>
                            <button onClick={() => { onOpenApiKeys(); setSettingsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                <KeyIcon className="w-5 h-5"/> Chaves de API
                            </button>
                             <button onClick={() => { onOpenAbout(); setSettingsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                <HelpIcon className="w-5 h-5"/> Sobre & Ajuda
                            </button>
                        </div>
                    )}
                </div>

                {user && (
                    <div className="flex items-center gap-2 pl-2 border-l border-gray-700">
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full"/>
                        <div className="hidden lg:block">
                            <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                            <button onClick={onLogout} className="text-xs text-gray-400 hover:text-red-400">Sair</button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
