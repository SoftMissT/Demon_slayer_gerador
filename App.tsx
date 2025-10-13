
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ForgeInterface } from './components/ForgeInterface';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';
import { AnimatePresence, motion } from 'framer-motion';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { Spinner } from './components/ui/Spinner';
import type { User } from './types';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
    
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [theme, setTheme] = useState('forge-theme');
    const [favoritesCount, setFavoritesCount] = useState(0);

    const [user, setUser] = useState<User | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    
    // Handles both localStorage session check and Discord OAuth callback on initial load
    useEffect(() => {
        const handleAuthentication = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            if (code) {
                // This is a callback from Discord
                try {
                    const response = await fetch('/api/auth/discord/callback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Falha na autenticação.');
                    }

                    const userData: User = await response.json();
                    setUser(userData);
                    localStorage.setItem('kimetsu-forge-user', JSON.stringify(userData));
                    setAuthError(null);

                } catch (error: any) {
                    console.error("Discord callback error:", error);
                    setAuthError(error.message);
                } finally {
                    // Clean the URL of the code parameter
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } else {
                // No callback code, check for a stored session
                try {
                    const storedUser = localStorage.getItem('kimetsu-forge-user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    console.error("Failed to parse user from localStorage", error);
                    localStorage.removeItem('kimetsu-forge-user');
                }
            }
            
            // Authentication process is complete
            setIsAuthenticating(false);
        };

        handleAuthentication();
    }, []);


    useEffect(() => {
        document.body.classList.remove('forge-theme', 'alchemist-theme');
        const newTheme = activeView === 'prompt' ? 'alchemist-theme' : 'forge-theme';
        document.body.classList.add(newTheme);
        setTheme(newTheme);
    }, [activeView]);
    
    const handleLogin = async () => {
        try {
            const response = await fetch('/api/auth/discord/url');
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setAuthError(data.message || "A API de autenticação não retornou uma URL. Verifique a configuração do servidor.");
            }
        } catch (error) {
            console.error("Failed to get Discord auth URL", error);
            setAuthError("Não foi possível iniciar o login com o Discord. Tente novamente mais tarde.");
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('kimetsu-forge-user');
    };
    
    if (isAuthenticating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
                <Spinner size="lg" />
                <p className="text-lg text-gray-400">Autenticando...</p>
            </div>
        );
    }

    return (
        <>
            <div className={`relative z-10 flex flex-col min-h-screen bg-transparent text-white font-sans kimetsu-forge-app ${theme}`}>
                <Header
                    activeView={activeView}
                    onViewChange={setActiveView}
                    onAboutClick={() => setIsAboutOpen(true)}
                    onFavoritesClick={() => setIsFavoritesOpen(true)}
                    onHistoryClick={() => setIsHistoryOpen(true)}
                    onHowItWorksClick={() => setIsHowItWorksOpen(true)}
                    user={user}
                    onLoginClick={handleLogin}
                    onLogoutClick={handleLogout}
                    favoritesCount={favoritesCount}
                />
                <main className="flex-grow flex flex-col w-full max-w-screen-2xl mx-auto px-4 md:px-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex-grow flex flex-col py-6"
                        >
                            {activeView === 'forge' ? (
                                <ForgeInterface
                                    isFavoritesOpen={isFavoritesOpen}
                                    onFavoritesClose={() => setIsFavoritesOpen(false)}
                                    isHistoryOpen={isHistoryOpen}
                                    onHistoryClose={() => setIsHistoryOpen(false)}
                                    onFavoritesCountChange={setFavoritesCount}
                                    isAuthenticated={!!user}
                                    onLoginClick={handleLogin}
                                />
                            ) : (
                                <PromptEngineeringPanel 
                                    isAuthenticated={!!user}
                                    onLoginClick={handleLogin}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
                <Footer onAboutClick={() => setIsAboutOpen(true)} />
                <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
                <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
                <ErrorDisplay message={authError} onDismiss={() => setAuthError(null)} />
            </div>
        </>
    );
};

export default App;
