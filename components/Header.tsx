import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import { DiscordLoginButton } from './DiscordLoginButton';
import { StarIcon } from './icons/StarIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { Tooltip } from './ui/Tooltip';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import { KatanaIcon } from './icons/KatanaIcon';
import { CrystalIcon } from './icons/CrystalIcon';

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
    { id: 'forge', label: 'Forja', icon: <KatanaIcon className="w-5 h-5" /> },
    { id: 'prompt', label: 'Alquimia', icon: <CrystalIcon className="w-5 h-5" /> },
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleShare = () => {
        navigator.clipboard.writeText('https://demon-slayer-gerador.vercel.app/');
        setShareText('Copiado!');
        setTimeout(() => setShareText('Compartilhar'), 2000);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <header className="main-header py-3 px-6 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left section: Logo and Title */}
      <div className="flex items-center gap-3">
          <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-12 h-12 rounded-full" />
          <div className="header-logo-title">
              <h1 className="title-gradient font-kimetsu">
                  KIMETSU FORGE
              </h1>
              <p className="subtitle">
                {activeView === 'forge' ? 'Martelo, faísca e tradição.' : 'Pele de porcelana. Segredos cristalizados.'}
              </p>
          </div>
      </div>
      
      {/* Center section: Tabs */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <nav className="tab-switcher">
          {TABS.map(tab => (
            <button 
                key={tab.id} 
                onClick={() => onViewChange(tab.id as 'forge' | 'prompt')} 
                className={`tab-switcher-button ${activeView === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-2">
          {/* Desktop visible buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="header-action-button" onClick={handleShare}>
                {shareText}
            </button>
            <button className="header-action-button" onClick={onHowItWorksClick}>
                Passo-a-Passo
            </button>
            <button className="header-action-button" onClick={onAboutClick}>
                Sobre
            </button>
          </div>

          <div className="w-px h-6 bg-gray-700 mx-2"></div>

          <Tooltip text="Favoritos">
            <button className="header-action-button relative !p-2" onClick={onFavoritesClick}>
                <StarIcon className="w-5 h-5" />
                {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-1 ring-black">
                        {favoritesCount}
                    </span>
                )}
            </button>
          </Tooltip>
          <Tooltip text="Histórico">
            <button className="header-action-button !p-2" onClick={onHistoryClick}>
                <HistoryIcon className="w-5 h-5" />
            </button>
          </Tooltip>
          
          {user ? (
              <>
                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                <div className="flex items-center gap-2 bg-gray-800/50 p-1 pr-3 rounded-full border border-gray-700">
                    <img src={user.avatar} alt="Avatar do usuário" className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-semibold text-white hidden sm:inline">{user.username}</span>
                    <button className="text-xs text-red-400 hover:underline" onClick={onLogoutClick}>(Sair)</button>
                </div>
              </>
          ) : (
             <DiscordLoginButton onClick={onLoginClick} />
          )}

          {/* Mobile dropdown menu */}
           <div className="relative lg:hidden" ref={menuRef}>
                <Tooltip text="Mais Opções">
                    <button className="header-action-button !p-2" onClick={() => setIsMenuOpen(prev => !prev)}>
                        <DotsVerticalIcon className="w-5 h-5" />
                    </button>
                </Tooltip>
                {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 py-1">
                         <button className="header-action-button w-full justify-start" onClick={() => { handleShare(); setIsMenuOpen(false); }}>
                            {shareText}
                        </button>
                        <button className="header-action-button w-full justify-start" onClick={() => { onHowItWorksClick(); setIsMenuOpen(false); }}>
                            Passo-a-Passo
                        </button>
                        <button className="header-action-button w-full justify-start" onClick={() => { onAboutClick(); setIsMenuOpen(false); }}>
                            Sobre
                        </button>
                    </div>
                )}
           </div>
        </div>
    </header>
  );
};