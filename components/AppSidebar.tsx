import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, AppView } from '../types';
import { ForgeIcon } from './icons/ForgeIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { HelpIcon } from './icons/HelpIcon';
import { Tooltip } from './ui/Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { DiscordIcon } from './icons/DiscordIcon';

interface AppSidebarProps {
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
    <Tooltip text={tooltip} position="right">
        <button
            onClick={onClick}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 z-10
                ${isActive ? 'text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
        >
            {children}
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
    
    // The total vertical space for one button + gap is h-12 (48px) + gap-4 (16px) = 64px.
    const indicatorY = activeView === 'forge' ? 0 : 64;

    return (
        <aside className="h-full w-20 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-between py-5 px-2 flex-shrink-0 z-20 border-r border-gray-800/50">
            {/* Logo */}
            <Tooltip text="Kimetsu Forge" position="right">
                <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-12 h-12 cursor-pointer" onClick={() => window.location.reload()} />
            </Tooltip>

            {/* Main Navigation */}
            <nav className="relative flex flex-col items-center gap-4">
                <motion.div
                    className="absolute top-0 left-0 w-12 h-12 bg-[var(--accent-primary)] rounded-full z-0"
                    animate={{ y: indicatorY }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
                <NavButton tooltip="Modo Forja" onClick={() => onViewChange('forge')} isActive={activeView === 'forge'}>
                    <ForgeIcon className="w-6 h-6" />
                </NavButton>
                <NavButton tooltip="Modo Alquimia" onClick={() => onViewChange('alchemist')} isActive={activeView === 'alchemist'}>
                    <MagicWandIcon className="w-6 h-6" />
                </NavButton>
            </nav>

            {/* Bottom Controls */}
            <div className="flex flex-col items-center gap-4">
                 <NavButton tooltip="Como Funciona" onClick={onOpenHowItWorks}>
                    <HelpIcon className="w-6 h-6" />
                </NavButton>
                 <NavButton tooltip="Sobre" onClick={onOpenAbout}>
                    <InfoIcon className="w-6 h-6" />
                </NavButton>

                <div className="w-full h-[1px] bg-gray-700 my-2"></div>

                {user ? (
                    <div className="relative" ref={profileMenuRef}>
                        <Tooltip text={user.username} position="right">
                             <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="focus:outline-none rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--accent-primary)]">
                                <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-600 hover:border-[var(--accent-primary)] transition-colors" />
                            </button>
                        </Tooltip>
                        <AnimatePresence>
                            {isProfileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: 10 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute bottom-0 left-full ml-3 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 origin-bottom-left"
                                >
                                    <div className="p-2 text-sm text-white truncate border-b border-gray-700 font-semibold">{user.username}</div>
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
                            className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full hover:bg-[#5865F2] group transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#5865F2]"
                            aria-label="Logar com o Discord"
                        >
                            <DiscordIcon className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                    </Tooltip>
                )}
            </div>
        </aside>
    );
};