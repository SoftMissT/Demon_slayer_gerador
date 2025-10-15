import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { ForgeInterface } from './components/ForgeInterface';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import useLocalStorage from './hooks/useLocalStorage';
import type { User, GeneratedItem, AlchemyHistoryItem } from './types';
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
    
    const handleViewChange = useCallback((view: AppView) => {
        setActiveView(view);
    }, [setActiveView]);

    return (
        <div className={`app-container h-screen overflow-hidden flex flex-col ${activeView === 'forge' ? 'theme-forge' : 'theme-alchemist'}`}>
            <AnimatedThemedBackground view={activeView} />
            <Header
                activeView={activeView}
                onViewChange={handleViewChange}
                onOpenAbout={() => setIsAboutModalOpen(true)}
                onOpenHowItWorks={() => setIsHowItWorksModalOpen(true)}
                user={user}
                onLoginClick={handleLoginClick}
                onLogout={handleLogout}
            />
            <main className="relative z-10 flex-grow p-4 overflow-hidden backdrop-blur-[2px]">
                <AnimatePresence mode="wait">
                    {activeView === 'forge' ? (
                        <motion.div
                            key="forge"
                            className="h-full"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                            exit={{ 
                                opacity: 0, 
                                filter: 'blur(5px) brightness(1.2)', 
                                scale: 1.02,
                                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } 
                            }}
                        >
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
                        </motion.div>
                    ) : (
                        <motion.div
                            key="alchemist"
                            className="h-full"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                            exit={{ 
                                opacity: 0, 
                                scale: 0.95,
                                rotate: -5,
                                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                            }}
                        >
                            <PromptEngineeringPanel 
                                    isAuthenticated={isAuthenticated}
                                    onLoginClick={handleLoginClick}
                                    history={alchemyHistory}
                                    setHistory={setAlchemyHistory}
                                    favorites={alchemyFavorites}
                                    setFavorites={setAlchemyFavorites}
                                    selectedItem={selectedAlchemyItem}
                                    setSelectedItem={setSelectedAlchemyItem}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
            <HowItWorksModal isOpen={isHowItWorksModalOpen} onClose={() => setIsHowItWorksModalOpen(false)} />

            <ErrorDisplay message={appError} onDismiss={() => setAppError(null)} />
        </div>
    );
}