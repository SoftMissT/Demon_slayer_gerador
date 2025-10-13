import React, { useState, useCallback, useEffect } from 'react';
// FIX: Added Variants to fix a type error with the ease property in Framer Motion transitions.
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Header } from './components/Header';
import { ForgeInterface } from './components/ForgeInterface';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';
import { HistoryModal } from './components/HistoryModal';
import { FavoritesModal } from './components/FavoritesModal';
import useLocalStorage from './hooks/useLocalStorage';
import type { User, GeneratedItem, AlchemyHistoryItem, HistoryItem, FavoriteItem } from './types';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { AnimatedThemedBackground } from './components/AnimatedThemedBackground';

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
    const [selectedAlchemyItem, setSelectedAlchemyItem] = useState<AlchemyHistoryItem | null>(null);


    // Modal States
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
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

    const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
        if ('categoria' in item) { // It's a GeneratedItem
            setSelectedItem(item as GeneratedItem);
            setSelectedAlchemyItem(null);
            setActiveView('forge');
        } else { // It's an AlchemyHistoryItem
            setSelectedAlchemyItem(item as AlchemyHistoryItem);
            setSelectedItem(null);
            setActiveView('alchemist');
        }
        setIsHistoryModalOpen(false);
    }, [setSelectedItem, setActiveView, setSelectedAlchemyItem]);

    const handleSelectFavoriteItem = useCallback((item: FavoriteItem) => {
        if ('categoria' in item) { // It's a GeneratedItem
            setSelectedItem(item as GeneratedItem);
            setActiveView('forge');
        } else { // It's an AlchemyHistoryItem
            setSelectedAlchemyItem(item as AlchemyHistoryItem);
            setActiveView('alchemist');
        }
        setIsFavoritesModalOpen(false);
    }, [setSelectedItem, setActiveView, setSelectedAlchemyItem]);
    
    const viewVariants: Variants = {
        hidden: { opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' } },
        visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeInOut' } },
    };

    return (
        <div className={`app-container h-screen overflow-hidden ${activeView === 'forge' ? 'theme-forge' : 'theme-alchemist'}`}>
            <AnimatedThemedBackground view={activeView} />
            <div className="relative z-10 flex flex-col h-full">
                <Header 
                    activeView={activeView}
                    onViewChange={setActiveView}
                    onOpenAbout={() => setIsAboutModalOpen(true)}
                    onOpenHistory={() => setIsHistoryModalOpen(true)}
                    onOpenFavorites={() => setIsFavoritesModalOpen(true)}
                    user={user}
                    onLoginClick={handleLoginClick}
                    onLogout={handleLogout}
                    favoritesCount={forgeFavorites.length + alchemyFavorites.length}
                />

                <main className="flex-grow p-2 overflow-hidden relative backdrop-blur-[2px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={viewVariants}
                            className="h-full w-full"
                        >
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
                                     selectedItem={selectedAlchemyItem}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
                
                <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />

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
                            setForgeFavorites(f => f.some(i => i.id === item.id) ? f.filter(i => i.id !== item.id) : [item as GeneratedItem, ...f]);
                        } else {
                            setAlchemyFavorites(f => f.some(i => i.id === item.id) ? f.filter(i => i.id !== item.id) : [item as AlchemyHistoryItem, ...f]);
                        }
                    }}
                    activeView={activeView}
                />
                <ErrorDisplay message={appError} onDismiss={() => setAppError(null)} />
            </div>
        </div>
    );
}