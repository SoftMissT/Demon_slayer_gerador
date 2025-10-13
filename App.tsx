import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ForgeInterface } from './components/ForgeInterface';
import { AboutModal } from './components/AboutModal';
import { HistoryModal } from './components/HistoryModal';
import { FavoritesModal } from './components/FavoritesModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import useLocalStorage from './hooks/useLocalStorage';
import type { User, GeneratedItem } from './types';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { AnimatedThemedBackground } from './components/AnimatedThemedBackground';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('kimetsu-forge-auth', false);
    const [user, setUser] = useLocalStorage<User | null>('kimetsu-forge-user', null);
    
    // State has been simplified to only handle the 'forge' view
    const [history, setHistory] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-history', []);
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-favorites', []);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);

    // Modal States
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
    const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);
    const [appError, setAppError] = useState<string | null>(null);
    
    const handleLoginClick = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/discord/url');
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to get auth URL');
            }
            const { url } = await res.json();
            if (url) {
                window.location.href = url;
            }
        } catch (error: any) {
            console.error("Failed to get Discord auth URL", error);
            setAppError(`Login Error: ${error.message}`);
        }
    }, []);

    const handleLogout = useCallback(() => {
        setIsAuthenticated(false);
        setUser(null);
    }, [setIsAuthenticated, setUser]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code && !isAuthenticated) {
            const authenticate = async () => {
                try {
                    const response = await fetch('/api/auth/discord/callback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code }),
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        setIsAuthenticated(true);
                    } else {
                        const errorData = await response.json();
                        setAppError(`Authentication failed: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                    setAppError('An error occurred during authentication.');
                } finally {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            };
            authenticate();
        }
    }, [isAuthenticated, setIsAuthenticated, setUser]);

    const handleSelectHistoryItem = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        setIsHistoryModalOpen(false);
    }, [setSelectedItem]);

    const handleSelectFavoriteItem = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        setIsFavoritesModalOpen(false);
    }, [setSelectedItem]);
    
    const handleToggleFavorite = (item: GeneratedItem) => {
        setFavorites(f => f.some(i => i.id === item.id) ? f.filter(i => i.id !== item.id) : [item, ...f]);
    };

    return (
        <div className="app-container h-screen overflow-hidden theme-forge">
            <AnimatedThemedBackground />
            <div className="relative z-10 flex flex-col h-full">
                <Header 
                    onOpenAbout={() => setIsAboutModalOpen(true)}
                    onOpenHistory={() => setIsHistoryModalOpen(true)}
                    onOpenFavorites={() => setIsFavoritesModalOpen(true)}
                    onOpenHowItWorks={() => setIsHowItWorksModalOpen(true)}
                    user={user}
                    onLoginClick={handleLoginClick}
                    onLogout={handleLogout}
                    favoritesCount={favorites.length}
                />

                <main className="flex-grow p-2 overflow-hidden relative backdrop-blur-[2px]">
                    <ForgeInterface 
                        isAuthenticated={isAuthenticated}
                        onLoginClick={handleLoginClick}
                        history={history}
                        setHistory={setHistory}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        user={user}
                    />
                </main>
                
                <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
                <HowItWorksModal isOpen={isHowItWorksModalOpen} onClose={() => setIsHowItWorksModalOpen(false)} />

                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    history={history}
                    onSelect={handleSelectHistoryItem}
                    onDelete={(id) => setHistory(h => h.filter(i => i.id !== id))}
                    onClear={() => setHistory([])}
                />
                <FavoritesModal
                    isOpen={isFavoritesModalOpen}
                    onClose={() => setIsFavoritesModalOpen(false)}
                    favorites={favorites}
                    onSelect={handleSelectFavoriteItem}
                    onToggleFavorite={handleToggleFavorite}
                />
                <ErrorDisplay message={appError} onDismiss={() => setAppError(null)} />
            </div>
        </div>
    );
}