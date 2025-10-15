import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { User, AppView } from '../types';
import { ShareButton } from './ShareButton';
import { ForgeIcon } from './icons/ForgeIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { HelpIcon } from './icons/HelpIcon';
import { Tooltip } from './ui/Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { DiscordIcon } from './icons/DiscordIcon';

interface HeaderProps {
    activeView: AppView;
    onViewChange: (view: AppView) => void;
    onOpenAbout: () => void;
    onOpenHowItWorks: () => void;
    user: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
}

const NavButton: React.FC<{
    tooltip: string;
    onClick?: () => void;
    isActive?: boolean;
    children: React.ReactNode;
}> = ({ tooltip, onClick, isActive = false, children }) => (
    <Tooltip text={tooltip} position="bottom">
        <button
            onClick={onClick}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200
                ${isActive ? 'text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {children}
            {isActive && (
                <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
        </button>
    </Tooltip>
);


export const Header: React.FC<HeaderProps> = ({
    activeView,
    onViewChange,
    onOpenAbout,
    onOpenHowItWorks,
    user,
    onLoginClick,
    onLogout,
}) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="relative z-20 flex items-center justify-between p-2 sm:p-3 bg-gray-900/60 backdrop-blur-sm border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
                <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10" />
                <h1 className="text-xl sm:text-2xl font-bold font-gangofthree text-white hidden sm:block">
                    Kimetsu Forge
                </h1>
                <div className="h-8 w-[1px] bg-gray-700 hidden md:block ml-2"></div>
                {/* Main Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    <NavButton tooltip="Modo Forja" onClick={() => onViewChange('forge')} isActive={activeView === 'forge'}>
                        <ForgeIcon className="w-5 h-5" /> Forja
                    </NavButton>
                    <NavButton tooltip="Modo Alquimia" onClick={() => onViewChange('alchemist')} isActive={activeView === 'alchemist'}>
                        <MagicWandIcon className="w-5 h-5" /> Alquimia
                    </NavButton>
                </nav>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                {/* Right side controls */}
                <Tooltip text="Como Funciona">
                    <button onClick={onOpenHowItWorks} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700/50">
                        <HelpIcon className="w-6 h-6" />
                    </button>
                </Tooltip>
                <Tooltip text="Sobre">
                    <button onClick={onOpenAbout} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700/50">
                        <InfoIcon className="w-6 h-6" />
                    </button>
                </Tooltip>
                <ShareButton />

                <div className="h-8 w-[1px] bg-gray-700 mx-2"></div>

                {user ? (
                    <div className="relative" ref={profileMenuRef}>
                        <Tooltip text={user.username} position="bottom">
                             <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="focus:outline-none rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--accent-primary)]">
                                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-[var(--accent-primary)] transition-colors" />
                            </button>
                        </Tooltip>
                        <AnimatePresence>
                            {isProfileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 origin-top-right"
                                >
                                    <div className="p-2 text-sm text-white truncate border-b border-gray-700 font-semibold">{user.username}</div>
                                    <button
                                        onClick={() => { onLogout(); setIsProfileMenuOpen(false); }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/50 rounded-b-md"
                                    >
                                        Sair
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <Tooltip text="Logar com o Discord" position="bottom">
                        <button
                            onClick={onLoginClick}
                            className="flex items-center justify-center h-10 px-4 bg-gray-800 rounded-md hover:bg-[#5865F2] group transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#5865F2]"
                            aria-label="Logar com o Discord"
                        >
                            <DiscordIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            <span className="ml-2 text-sm font-semibold text-white hidden sm:inline">Entrar</span>
                        </button>
                    </Tooltip>
                )}
            </div>
        </header>
    );
};
