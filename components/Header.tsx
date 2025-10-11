import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';
import { Tooltip } from './ui/Tooltip';

interface HeaderProps {
  onHistoryClick: () => void;
  activeView: 'forge' | 'prompt' | 'sobre';
  onViewChange: (view: 'forge' | 'prompt' | 'sobre') => void;
}

export const Header: React.FC<HeaderProps> = ({ onHistoryClick, activeView, onViewChange }) => {
    
    const getButtonClasses = (view: 'forge' | 'prompt' | 'sobre') => {
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
        <h1 className="text-2xl font-bold text-red-500 font-kimetsu tracking-wider">
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
        <button onClick={() => onViewChange('sobre')} className={getButtonClasses('sobre')}>
            Sobre
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
      </div>
    </header>
  );
};