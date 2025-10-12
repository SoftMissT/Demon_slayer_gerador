
import React from 'react';
import { AboutTooltip } from './components/AboutTooltip';
import { StarIcon } from './components/icons/StarIcon';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { Button } from './components/ui/Button';

interface HeaderProps {
  onAboutClick: () => void;
  onFavoritesClick: () => void;
  onHistoryClick: () => void;
  activeView: 'forge' | 'prompt';
  onViewChange: (view: 'forge' | 'prompt') => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onFavoritesClick, onHistoryClick, activeView, onViewChange }) => {
    
    const getButtonClasses = (view: 'forge' | 'prompt') => {
        const base = "px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200";
        if (activeView === view) {
            return `${base} bg-indigo-600 text-white`;
        }
        return `${base} bg-gray-700 text-gray-300 hover:bg-gray-600`;
    }

  return (
    <header className="py-4 px-6 md:px-8 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-2xl font-bold font-kimetsu tracking-wider bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent">
          Kimetsu Forge
        </h1>
      </div>
      
      <nav className="hidden md:flex items-center gap-2 p-1 bg-gray-800 rounded-lg">
        <button onClick={() => onViewChange('forge')} className={getButtonClasses('forge')}>
            Forja
        </button>
        <button onClick={() => onViewChange('prompt')} className={getButtonClasses('prompt')}>
            Alquimia
        </button>
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onFavoritesClick} className="!p-2" aria-label="Favoritos">
            <StarIcon className="w-6 h-6" />
        </Button>
        <Button variant="ghost" onClick={onHistoryClick} className="!p-2" aria-label="Histórico">
            <HistoryIcon className="w-6 h-6" />
        </Button>
        <AboutTooltip onClick={onAboutClick} />
      </div>
    </header>
  );
};
