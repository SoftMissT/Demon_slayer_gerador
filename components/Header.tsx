
import React from 'react';
import { StarIcon } from './icons/StarIcon';
import { HelpIcon } from './icons/HelpIcon';
import { Button } from './ui/Button';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
    onShowFavorites: () => void;
    onShowHelp: () => void;
    onShowPromptEngineering: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowFavorites, onShowHelp, onShowPromptEngineering }) => {
  return (
    <header className="py-4 px-6 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-2xl font-bold text-white font-gangofthree tracking-wider">
        Kime<span className="text-indigo-400">tsu</span> Forge
      </h1>
      <div className="flex items-center gap-2">
         <Button variant="ghost" onClick={onShowPromptEngineering}>
          <SparklesIcon className="w-5 h-5" />
          <span className="hidden sm:inline ml-2">Prompt Engineer</span>
        </Button>
        <Button variant="ghost" onClick={onShowFavorites} aria-label="Mostrar favoritos">
            <StarIcon className="w-5 h-5" />
            <span className="hidden sm:inline ml-2">Favoritos</span>
        </Button>
        <Button variant="ghost" onClick={onShowHelp} aria-label="Ajuda">
            <HelpIcon className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
