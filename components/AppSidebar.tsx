import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, AppView } from '../types';
import { ForgeIcon } from './icons/ForgeIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { StarIcon } from './icons/StarIcon';
import { HelpIcon } from './icons/HelpIcon';
import { DiscordLoginButton } from './DiscordLoginButton';
import { AboutTooltip } from './AboutTooltip';
import { Tooltip } from './ui/Tooltip';
import { InfoIcon } from './icons/InfoIcon';
// FIX: Imported the DiscordIcon component to resolve the "Cannot find name 'DiscordIcon'" error.
import { DiscordIcon } from './icons/DiscordIcon';

interface AppSidebarProps {
    activeView: AppView;
    onViewChange: (view: AppView) => void;
    onOpenAbout: () => void;
    onOpenHowItWorks: () => void;
    user: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
    favoritesCount: number;
}

const NavButton: React.FC<{
    tooltip: string;
    onClick?: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    badgeCount?: number;
}> = ({ tooltip, onClick, isActive = false, children, badgeCount }) => (
    <Tooltip text={tooltip} position="right">
        <button
            onClick={onClick}
            className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 group
                ${isActive ? 'bg-[var(--accent-primary)] text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
        >
            {children}
            <div className={`absolute left-0 h-8 w-1 bg-white rounded-r-full transition-all duration-200 ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></div>
            {badgeCount && badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center border-2 border-gray-900">
                    {badgeCount > 9 ? '9+' : badgeCount}
                </span>
            )}
        </button>
    </Tooltip>
);


export const AppSidebar: React.FC<AppSidebarProps> = ({
    activeView,
    onViewChange,
    onOpenAbout,
    onOpenHowItWorks,
    user,
    onLoginClick,
    onLogout,
    favoritesCount
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
        <aside className="h-full w-20 bg-gray-900 flex flex-col items-center justify-between py-4 px-2 flex-shrink-0 z-20 border-r border-gray-800">
            <nav className="flex flex-col items-center gap-4">
                <NavButton tooltip="Modo Forja" onClick={() => onViewChange('forge')} isActive={activeView === 'forge'}>
                    <ForgeIcon className="w-6 h-6" />
                </NavButton>
                <NavButton tooltip="Modo Alquimia" onClick={() => onViewChange('alchemist')} isActive={activeView === 'alchemist'}>
                    <MagicWandIcon className="w-6 h-6" />
                </NavButton>
            </nav>

            <div className="flex flex-col items-center gap-4">
                 <NavButton tooltip="Como Funciona" onClick={onOpenHowItWorks}>
                    <HelpIcon className="w-6 h-6" />
                </NavButton>
                 <NavButton tooltip="Sobre" onClick={onOpenAbout}>
                    <InfoIcon className="w-6 h-6" />
                </NavButton>

                {user ? (
                    <div className="relative" ref={profileMenuRef}>
                        <Tooltip text={user.username} position="right">
                             <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="focus:outline-none rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
                                <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-600 hover:border-indigo-500 transition-colors" />
                            </button>
                        </Tooltip>
                        <AnimatePresence>
                            {isProfileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: 10 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute bottom-0 left-full ml-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 origin-bottom-left"
                                >
                                    <div className="p-2 text-sm text-white truncate border-b border-gray-700">{user.username}</div>
                                    <button
                                        onClick={() => {
                                            onLogout();
                                            setIsProfileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/50 rounded-b-md"
                                    >
                                        Sair
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <Tooltip text="Logar com o Discord" position="right">
                        <button
                            onClick={onLoginClick}
                            className="flex items-center justify-center w-12 h-12 bg-[#5865F2] rounded-full hover:bg-[#4752C4] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                            aria-label="Logar com o Discord"
                        >
                            <DiscordIcon className="w-7 h-7 text-white" />
                        </button>
                    </Tooltip>
                )}
            </div>
        </aside>
    );
};