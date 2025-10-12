import React, { useState } from 'react';
import type { User } from '../types';
import { DiscordLoginButton } from './DiscordLoginButton';

interface HeaderProps {
  onAboutClick: () => void;
  onFavoritesClick: () => void;
  onHistoryClick: () => void;
  onHowItWorksClick: () => void;
  activeView: 'forge' | 'prompt';
  onViewChange: (view: 'forge' | 'prompt') => void;
  favoritesCount: number;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const TABS = [
    { id: 'forge', label: 'Forja' },
    { id: 'prompt', label: 'Alquimia' },
];

export const Header: React.FC<HeaderProps> = ({ 
    onAboutClick, 
    onFavoritesClick, 
    onHistoryClick, 
    onHowItWorksClick, 
    activeView, 
    onViewChange, 
    favoritesCount,
    user,
    onLoginClick,
    onLogoutClick
}) => {
    const [shareText, setShareText] = useState('Compartilhar');

    const handleShare = () => {
        navigator.clipboard.writeText('https://demon-slayer-gerador.vercel.app/');
        setShareText('Copiado!');
        setTimeout(() => setShareText('Compartilhar'), 2000);
    };

  return (
    <header className="main-header py-4 px-6 md:px-8 flex items-center sticky top-0 z-40">
      {/* Left section for alignment */}
      <div className="flex-1 flex justify-start">
        <nav className="tab-switcher">
          {TABS.map(tab => (
            <button 
                key={tab.id} 
                onClick={() => onViewChange(tab.id as 'forge' | 'prompt')} 
                className={`tab-switcher-button ${activeView === tab.id ? 'active' : ''}`}
            >
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Center section */}
      <div className="flex items-center gap-4">
          <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-12 h-12 rounded-full" />
          <div className="header-logo-title text-center">
              <h1 className={`font-bold font-kimetsu tracking-wider ${activeView === 'forge' ? 'kimetsu-title-forge' : 'kimetsu-title-alchemy'}`}>
                  KIMETSU FORGE
              </h1>
              <p className="subtitle">Forjando Lendas em Aço e Magia</p>
          </div>
      </div>

      {/* Right section for alignment */}
      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="button-share-pill" onClick={handleShare}>
              {shareText}
          </button>
          <button className="button" onClick={onHowItWorksClick}>
              Passo-a-Passo
          </button>
          <button className="button relative" onClick={onFavoritesClick}>
              Favoritos
              {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-black">
                      {favoritesCount}
                  </span>
              )}
          </button>
          <button className="button" onClick={onHistoryClick}>
              Histórico
          </button>
          {user ? (
              <div className="flex items-center gap-3 bg-gray-800/50 p-1.5 pr-3 rounded-full border border-gray-700">
                  <img src={user.avatar} alt="Avatar do usuário" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-semibold text-white">{user.username}</span>
                  <button className="text-xs text-red-400 hover:underline" onClick={onLogoutClick}>(Sair)</button>
              </div>
          ) : (
             <DiscordLoginButton onClick={onLoginClick} />
          )}
          <button className="button" onClick={onAboutClick}>
              Sobre
          </button>
        </div>
      </div>
    </header>
  );
};