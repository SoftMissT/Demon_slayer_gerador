import React from 'react';
import { AboutTooltip } from './AboutTooltip';
import { HistoryIcon } from './icons/HistoryIcon';
import { Tooltip } from './ui/Tooltip';

interface HeaderProps {
  onAboutClick: () => void;
  onHistoryClick: () => void;
  activeView: 'forge' | 'prompt';
  onViewChange: (view: 'forge' | 'prompt') => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onHistoryClick, activeView, onViewChange }) => {
    
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
        <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-white font-gangofthree tracking-wider bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent">
          Kimetsu Forge
        </h1>
      </div>
      
      <nav className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg">
        <button onClick={() => onViewChange('forge')} className={getButtonClasses('forge')}>
            Forja
        </button>
        <button onClick={() => onViewChange('prompt')} className={getButtonClasses('prompt')}>
            Alquimia
        </button>
      </nav>

      <div className="flex items-center gap-4">
        <Tooltip text="Histórico de Gerações">
            <button 
                onClick={onHistoryClick}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Histórico de Gerações"
            >
                <HistoryIcon className="w-6 h-6" />
            </button>
        </Tooltip>
        <AboutTooltip onClick={onAboutClick} />
      </div>
    </header>
  );
};