import React from 'react';
import { StarIcon } from './icons/StarIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { ShareButton } from './ShareButton';
import { HelpIcon } from './icons/HelpIcon';

interface HeaderProps {
  onAboutClick: () => void;
  onFavoritesClick: () => void;
  onHistoryClick: () => void;
  activeView: 'forge' | 'prompt';
  onViewChange: (view: 'forge' | 'prompt') => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onFavoritesClick, onHistoryClick, activeView, onViewChange, favoritesCount }) => {
    
    const getButtonClasses = (view: 'forge' | 'prompt') => {
        const base = "px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200";
        if (activeView === view) {
            return `${base} header-button-active`; // Use a generic class for theme-based styling
        }
        return `${base} bg-gray-700 text-gray-300 hover:bg-gray-600`;
    }

  return (
    <header className="main-header py-8 px-6 md:px-8 bg-gray-900/50 backdrop-blur-sm flex items-center sticky top-0 z-40">
      {/* Left section for alignment */}
      <div className="flex-1 flex justify-start">
        <nav className="hidden md:flex items-center gap-2 p-1 bg-gray-800 rounded-lg flex-shrink-0">
          <button onClick={() => onViewChange('forge')} className={getButtonClasses('forge')}>
              Forja
          </button>
          <button onClick={() => onViewChange('prompt')} className={getButtonClasses('prompt')}>
              Alquimia
          </button>
        </nav>
      </div>
      
      {/* Center section */}
      <div className="flex items-center gap-4">
          <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-12 h-12 rounded-full" />
          <div className="header-logo-title text-center">
              <h1 className="font-bold font-kimetsu tracking-wider">
                  KIMETSU FORGE
              </h1>
              <p className="subtitle">Forjando Lendas em Aço e Magia</p>
          </div>
      </div>

      {/* Right section for alignment */}
      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-2">
          <ShareButton />
          <button className="button relative" onClick={onFavoritesClick}>
              <StarIcon className="w-5 h-5" />
              <span>Favoritos</span>
              {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-black">
                      {favoritesCount}
                  </span>
              )}
          </button>
          <button className="button" onClick={onHistoryClick}>
              <HistoryIcon className="w-5 h-5" />
              <span>Histórico</span>
          </button>
          <button className="button" onClick={onAboutClick}>
              <HelpIcon className="w-5 h-5" />
              <span>Sobre</span>
          </button>
        </div>
      </div>
      <div className="header-glow"></div>
    </header>
  );
};
