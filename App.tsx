
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ForgeInterface } from './components/ForgeInterface';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { MatrixBackground } from './components/MatrixBackground';
import { AboutModal } from './components/AboutModal';
import { ApiKeysModal } from './components/ApiKeysModal';
import { HistoryModal } from './components/HistoryModal';
import { FavoritesModal } from './components/FavoritesModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import useLocalStorage from './hooks/useLocalStorage';
import type { User, GeneratedItem, AlchemyHistoryItem, HistoryItem, FavoriteItem } from './types';
import { constructAvatarUrl } from './lib/discord';

type AppView = 'forge' | 'alchemist';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('kimetsu-forge-auth', false);
    const [user, setUser] = useLocalStorage<User | null>('kimetsu-forge-user', null);
    
    const [activeView, setActiveView] = useLocalStorage<AppView>('kimetsu-forge-view', 'forge');
    
    // Forge State
    const [forgeHistory, setForgeHistory] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-history', []);
    const [forgeFavorites, setForgeFavorites] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-favorites', []);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);

    // Alchemy State
    const [alchemyHistory, setAlchemyHistory] = useLocalStorage<AlchemyHistoryItem[]>('kimetsu-alchemy-history', []);
    const [alchemyFavorites, setAlchemyFavorites] = useLocalStorage<AlchemyHistoryItem[]>('kimetsu-alchemy-favorites', []);

    // Modal States
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
    const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);
    
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
            alert(`Login Error: ${error.message}`);
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
                        alert(`Authentication failed: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                    alert('An error occurred during authentication.');
                } finally {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            };
            authenticate();
        }
    }, [isAuthenticated, setIsAuthenticated, setUser]);

    const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
        if ('categoria' in item) { // It's a GeneratedItem
            setSelectedItem(item as GeneratedItem);
            setActiveView('forge');
        }
        setIsHistoryModalOpen(false);
    }, [setSelectedItem]);

    const handleSelectFavoriteItem = useCallback((item: FavoriteItem) => {
        if ('categoria' in item) { // It's a GeneratedItem
            setSelectedItem(item as GeneratedItem);
            setActiveView('forge');
        }
        setIsFavoritesModalOpen(false);
    }, [setSelectedItem]);
    
    return (
        <>
            <div className={`app-background ${activeView === 'forge' ? 'theme-forge' : 'theme-alchemist'}`}></div>
            <div className="flex flex-col h-screen text-white font-sans overflow-hidden">
                <Header 
                    activeView={activeView}
                    onViewChange={setActiveView}
                    onOpenAbout={() => setIsAboutModalOpen(true)}
                    onOpenApiKeys={() => setIsApiKeysModalOpen(true)}
                    onOpenHistory={() => setIsHistoryModalOpen(true)}
                    onOpenFavorites={() => setIsFavoritesModalOpen(true)}
                    onOpenHowItWorks={() => setIsHowItWorksModalOpen(true)}
                    user={user}
                    onLogout={handleLogout}
                    favoritesCount={forgeFavorites.length + alchemyFavorites.length}
                />

                <main className="flex-grow p-2 overflow-hidden relative">
                    {activeView === 'forge' ? (
                        <ForgeInterface 
                            isAuthenticated={isAuthenticated}
                            onLoginClick={handleLoginClick}
                            history={forgeHistory}
                            setHistory={setForgeHistory}
                            favorites={forgeFavorites}
                            setFavorites={setForgeFavorites}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                            user={user}
                        />
                    ) : (
                        <PromptEngineeringPanel 
                             isAuthenticated={isAuthenticated}
                             onLoginClick={handleLoginClick}
                             history={alchemyHistory}
                             setHistory={setAlchemyHistory}
                             favorites={alchemyFavorites}
                             setFavorites={setAlchemyFavorites}
                        />
                    )}
                </main>
                
                <ApiKeysModal isOpen={isApiKeysModalOpen} onClose={() => setIsApiKeysModalOpen(false)} />
                <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
                <HowItWorksModal isOpen={isHowItWorksModalOpen} onClose={() => setIsHowItWorksModalOpen(false)} />

                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    history={activeView === 'forge' ? forgeHistory : alchemyHistory}
                    onSelect={handleSelectHistoryItem}
                    onDelete={(id) => {
                        if (activeView === 'forge') setForgeHistory(h => h.filter(i => i.id !== id));
                        else setAlchemyHistory(h => h.filter(i => i.id !== id));
                    }}
                    onClear={() => {
                        if (activeView === 'forge') setForgeHistory([]);
                        else setAlchemyHistory([]);
                    }}
                    activeView={activeView}
                />
                <FavoritesModal
                    isOpen={isFavoritesModalOpen}
                    onClose={() => setIsFavoritesModalOpen(false)}
                    favorites={activeView === 'forge' ? forgeFavorites : alchemyFavorites}
                    onSelect={handleSelectFavoriteItem}
                    onToggleFavorite={(item) => {
                         if ('categoria' in item) {
                            setForgeFavorites(f => f.some(i => i.id === item.id) ? f.filter(i => i.id !== item.id) : [item, ...f]);
                        } else {
                            setAlchemyFavorites(f => f.some(i => i.id === item.id) ? f.filter(i => i.id !== item.id) : [item, ...f]);
                        }
                    }}
                    activeView={activeView}
                />
            </div>
        </>
    );
}