import React from 'react';
import { StarIcon } from './icons/StarIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { ShareButton } from './ShareButton';
import { HelpIcon } from './icons/HelpIcon';
import { InfoIcon } from './icons/InfoIcon';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAboutClick: () => void;
  onFavoritesClick: () => void;
  onHistoryClick: () => void;
  onHowItWorksClick: () => void;
  activeView: 'forge' | 'prompt';
  onViewChange: (view: 'forge' | 'prompt') => void;
  favoritesCount: number;
}

const TABS = [
    { id: 'forge', label: 'Forja' },
    { id: 'prompt', label: 'Alquimia' },
];

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onFavoritesClick, onHistoryClick, onHowItWorksClick, activeView, onViewChange, favoritesCount }) => {
    
  return (
    <header className="main-header py-4 px-6 md:px-8 flex items-center sticky top-0 z-40">
      {/* Left section for alignment */}
      <div className="flex-1 flex justify-start">
        <nav className="hidden md:flex items-center tab-switcher flex-shrink-0">
          {TABS.map(tab => (
            <button 
                key={tab.id} 
                onClick={() => onViewChange(tab.id as 'forge' | 'prompt')} 
                className={`tab-switcher-button ${activeView === tab.id ? 'active' : ''}`}
            >
              {activeView === tab.id && (
                <motion.div
                    layoutId="active-pill"
                    className="active-indicator"
                    style={{ borderRadius: 6 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
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
          <button className="button" onClick={onHowItWorksClick}>
              <InfoIcon className="w-5 h-5" />
              <span>Passo-a-Passo</span>
          </button>
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