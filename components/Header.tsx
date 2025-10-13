
import React, { useState } from 'react';
import type { User } from '../types';
import { DiscordLoginButton } from './DiscordLoginButton';
import { SparklesIcon } from './icons/SparklesIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { StarIcon } from './icons/StarIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { BookIcon } from './icons/BookIcon';
import { HelpIcon } from './icons/HelpIcon';
import { KeyIcon } from './icons/KeyIcon';
import { ApiKeysModal } from './ApiKeysModal';

interface HeaderProps {
  activeView: 'forge' | 'prompt';
  onViewChange: (view: 'forge' | 'prompt') => void;
  onAboutClick: () => void;
  onFavoritesClick: () => void;
  onHistoryClick: () => void;
  onHowItWorksClick: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  onAboutClick,
  onFavoritesClick,
  onHistoryClick,
  onHowItWorksClick,
  user,
  onLoginClick,
  onLogoutClick,
  favoritesCount,
}) => {
  const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-3 md:p-4 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-indigo-500/50" />
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-white font-gangofthree -mb-1">Kimetsu Forge</h1>
            <p className="text-xs text-gray-400">Forjando Lendas em Aço e Magia</p>
          </div>
        </div>
        
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-800/80 border border-gray-700 p-1 rounded-full">
            <button 
                onClick={() => onViewChange('forge')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors ${activeView === 'forge' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <SparklesIcon className="w-4 h-4" />
                Forja
            </button>
            <button 
                onClick={() => onViewChange('prompt')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors ${activeView === 'prompt' ? 'alchemist-button text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <MagicWandIcon className="w-4 h-4" />
                Alquimia
            </button>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
            <button onClick={onFavoritesClick} className="p-2 text-gray-400 hover:text-white relative" aria-label="Favoritos">
                <StarIcon className="w-6 h-6" />
                {favoritesCount > 0 && <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{favoritesCount}</span>}
            </button>
            <button onClick={onHistoryClick} className="p-2 text-gray-400 hover:text-white" aria-label="Histórico">
                <HistoryIcon className="w-6 h-6" />
            </button>
             <button onClick={onHowItWorksClick} className="p-2 text-gray-400 hover:text-white" aria-label="Como Funciona">
                <BookIcon className="w-6 h-6" />
            </button>
            <button onClick={onAboutClick} className="p-2 text-gray-400 hover:text-white" aria-label="Sobre">
                <HelpIcon className="w-6 h-6" />
            </button>

            <div className="h-6 w-px bg-gray-700 mx-1"></div>

            {user ? (
                <div className="group relative">
                    <img src={user.avatar} alt={user.username} className="w-9 h-9 rounded-full cursor-pointer"/>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <div className="p-2 border-b border-gray-700">
                            <p className="font-semibold text-white truncate">{user.username}</p>
                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                        </div>
                        <button onClick={() => setIsApiKeysModalOpen(true)} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                            <KeyIcon className="w-4 h-4" /> Chaves de API
                        </button>
                        <button onClick={onLogoutClick} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/50">Sair</button>
                    </div>
                </div>
            ) : (
                <DiscordLoginButton onClick={onLoginClick} />
            )}
        </div>
      </header>
      <ApiKeysModal isOpen={isApiKeysModalOpen} onClose={() => setIsApiKeysModalOpen(false)} />
    </>
  );
};
