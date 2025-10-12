import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ForgeInterface } from './components/ForgeInterface';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [theme, setTheme] = useState('forge-theme');
    const [favoritesCount, setFavoritesCount] = useState(0);

    useEffect(() => {
        // This still applies non-background styles from themes
        document.body.classList.remove('forge-theme', 'alchemist-theme');
        const newTheme = activeView === 'prompt' ? 'alchemist-theme' : 'forge-theme';
        document.body.classList.add(newTheme);
        setTheme(newTheme);
        
        return () => {
            document.body.classList.remove('forge-theme', 'alchemist-theme');
        }
    }, [activeView]);
    
    return (
        <>
            <div className={`relative z-10 flex flex-col min-h-screen bg-transparent text-white font-sans kimetsu-forge-app ${theme}`}>
                <Header
                    activeView={activeView}
                    onViewChange={setActiveView}
                    onAboutClick={() => setIsAboutOpen(true)}
                    onFavoritesClick={() => setIsFavoritesOpen(true)}
                    onHistoryClick={() => setIsHistoryOpen(true)}
                    favoritesCount={favoritesCount}
                />
                <main className="flex-grow flex flex-col w-full max-w-screen-2xl mx-auto px-4 md:px-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="flex-grow flex flex-col py-6"
                        >
                            {activeView === 'forge' ? (
                                <ForgeInterface
                                    isFavoritesOpen={isFavoritesOpen}
                                    onFavoritesClose={() => setIsFavoritesOpen(false)}
                                    isHistoryOpen={isHistoryOpen}
                                    onHistoryClose={() => setIsHistoryOpen(false)}
                                    onFavoritesCountChange={setFavoritesCount}
                                />
                            ) : (
                                <PromptEngineeringPanel />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
                <Footer onAboutClick={() => setIsAboutOpen(true)} />
                <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            </div>
        </>
    );
};

export default App;