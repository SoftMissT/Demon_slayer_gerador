import React from 'react';
import type { User, AppView } from '../types';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { HelpIcon } from './icons/HelpIcon';
import { Tooltip } from './ui/Tooltip';
import { ForgeIcon } from './icons/ForgeIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { SunIcon } from './icons/SunIcon';
import { InfoIcon } from './icons/InfoIcon';


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

const ViewSwitcherButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  activeClass: string;
}> = ({ label, icon, isActive, onClick, activeClass }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${isActive ? `${activeClass} text-white shadow-lg` : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
  >
    {icon}
    {label}
  </button>
);

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
    <header className="flex justify-between items-center p-2 border-b border-gray-700/50 bg-gray-900/30 flex-shrink-0 backdrop-blur-[2px]">
      <div className="flex items-center gap-2">
        <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold font-gangofthree text-white hidden md:block">Kimetsu Forge</h1>
      </div>

      <div className="flex-grow flex justify-center">
        <div className="bg-gray-800/50 border border-gray-700/50 p-1 rounded-lg flex items-center gap-1">
          <ViewSwitcherButton label="Forja" icon={<ForgeIcon className="w-5 h-5" />} isActive={activeView === 'forge'} onClick={() => onViewChange('forge')} activeClass="bg-gradient-to-r from-red-600 to-orange-500" />
          <ViewSwitcherButton label="Alquimia" icon={<MagicWandIcon className="w-5 h-5" />} isActive={activeView === 'alchemist'} onClick={() => onViewChange('alchemist')} activeClass="bg-gradient-to-r from-purple-600 to-indigo-500" />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Tooltip text="Favoritos">
          <button onClick={onOpenFavorites} className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <StarIcon className="w-6 h-6" />
            {favoritesCount > 0 && <span className="absolute top-0 right-0 text-xs bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center">{favoritesCount}</span>}
          </button>
        </Tooltip>
        <Tooltip text="Histórico">
          <button onClick={onOpenHistory} className="p-2 text-gray-400 hover:text-white transition-colors">
            <HistoryIcon className="w-6 h-6" />
          </button>
        </Tooltip>
        <Tooltip text="Como Funciona">
          <button onClick={onOpenHowItWorks} className="p-2 text-gray-400 hover:text-white transition-colors">
            <HelpIcon className="w-6 h-6" />
          </button>
        </Tooltip>
        <Tooltip text="Sobre">
          <button onClick={onOpenAbout} className="p-2 text-gray-400 hover:text-white transition-colors">
             <InfoIcon className="w-6 h-6" /> 
          </button>
        </Tooltip>
        <div className="w-px h-6 bg-gray-700 mx-2"></div>
        {user ? (
          <div className="flex items-center gap-2">
            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
            <div className="hidden md:block">
                <p className="text-sm font-semibold text-white truncate max-w-[100px]">{user.username}</p>
                 <button onClick={onLogout} className="text-xs text-gray-400 hover:text-red-400 text-left">Sair</button>
            </div>
          </div>
        ) : (
          <Button onClick={onLoginClick} variant="primary">Login</Button>
        )}
      </div>
    </header>
  );
};
