import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import { KatanaIcon } from './icons/KatanaIcon';
import { CrystalIcon } from './icons/CrystalIcon';

interface HeaderProps {
  onAboutClick: () => void;
  onHowItWorksClick: () => void;
  activeView: 'forge' | 'prompt';
  onViewChange: (view: 'forge' | 'prompt') => void;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    onAboutClick, 
    onHowItWorksClick,
    activeView, 
    onViewChange, 
    user,
    onLoginClick,
    onLogoutClick
}) => {
    const isForge = activeView === 'forge';
    const slashRef = useRef<HTMLDivElement>(null);
    const bloomRef = useRef<HTMLDivElement>(null);

    const handleViewChange = (view: 'forge' | 'prompt') => {
        if (activeView !== view) {
            onViewChange(view);
        }
    };

    useEffect(() => {
        if (isForge) {
            const slashEl = slashRef.current;
            if (slashEl) {
                slashEl.classList.remove('animate');
                void slashEl.offsetWidth; // Trigger reflow
                slashEl.classList.add('animate');
            }
        } else {
            const bloomEl = bloomRef.current;
            if (bloomEl) {
                bloomEl.classList.remove('animate');
                void bloomEl.offsetWidth; // Trigger reflow
                bloomEl.classList.add('animate');
            }
        }
    }, [isForge]);

    const handleKeyDown = (e: React.KeyboardEvent, view: 'forge' | 'prompt') => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleViewChange(view);
        }
    };
    
  return (
    <header className="site-header" role="banner">
        <div className="brand">
            <div className="logo-circle" title="Kimetsu Forge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 15s2-3 6-3" />
                </svg>
            </div>
            <div className="titles">
                <span className="name">KIMETSU FORGE</span>
                <span className="tag">Forjando Lendas em Aço e Magia</span>
            </div>
        </div>

        <div className="center">
            <div className="mode-pill" role="tablist" aria-label="Modo">
                <div className="mode-active" style={{ transform: isForge ? 'translateX(6px)' : 'translateX(calc(100% - 6px))' }}></div>

                <div className="mode-option" role="tab" aria-pressed={isForge} tabIndex={0} onClick={() => handleViewChange('forge')} onKeyDown={(e) => handleKeyDown(e, 'forge')}>
                    <KatanaIcon className="w-5 h-5" />
                    Forja
                </div>

                <div className="mode-option" role="tab" aria-pressed={!isForge} tabIndex={0} onClick={() => handleViewChange('prompt')} onKeyDown={(e) => handleKeyDown(e, 'prompt')}>
                    <CrystalIcon className="w-5 h-5" />
                    Alquimia
                </div>
            </div>
        </div>

        <div className="actions" role="navigation" aria-label="Ações">
            <a href="#" onClick={(e) => { e.preventDefault(); onHowItWorksClick(); }} title="Passo-a-Passo">Passo-a-Passo</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} title="Sobre">Sobre</a>
            {user ? (
                 <div className="avatar" title={user.username}>
                    <img alt="avatar" src={user.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} onClick={onLogoutClick} />
                </div>
            ) : (
                 <button className="essential" onClick={onLoginClick} title="Login com Discord">Login</button>
            )}
        </div>

        <div className="effect-overlay" aria-hidden="true">
            <div ref={slashRef} className="slash"></div>
            <div ref={bloomRef} className="bloom"></div>
        </div>
    </header>
  );
};
