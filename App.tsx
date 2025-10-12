import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ForgeInterface } from './components/ForgeInterface';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';
import { AnimatePresence, motion } from 'framer-motion';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ApiKeysModal } from './components/ApiKeysModal';
import useLocalStorage from './hooks/useLocalStorage';
import { validateAllApiKeys } from './lib/client/validationService';

export interface ApiKeys {
    gemini: string;
    openai: string;
    deepseek: string;
}

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
    
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [theme, setTheme] = useState('forge-theme');
    const [favoritesCount, setFavoritesCount] = useState(0);

    const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState(false);
    const [apiKeys, setApiKeys] = useLocalStorage<ApiKeys>('kimetsu-forge-apikeys', {
        gemini: '',
        openai: '',
        deepseek: '',
    });
    
    const [areApiKeysValidated, setAreApiKeysValidated] = useState(false);

    // Effect for initial validation on load
    useEffect(() => {
        const validateKeysOnLoad = async () => {
            const areKeysPresent = apiKeys.gemini && apiKeys.openai && apiKeys.deepseek;
            if (areKeysPresent) {
                const result = await validateAllApiKeys(apiKeys);
                if (result.errors.length === 0) {
                    setAreApiKeysValidated(true);
                } else {
                    // Clear invalid keys to force re-entry
                    const invalidKeys = { ...apiKeys };
                    if (!result.gemini) invalidKeys.gemini = '';
                    if (!result.openai) invalidKeys.openai = '';
                    if (!result.deepseek) invalidKeys.deepseek = '';
                    setApiKeys(invalidKeys);
                    setAreApiKeysValidated(false);
                }
            } else {
                setAreApiKeysValidated(false);
            }
        };

        validateKeysOnLoad();
    }, [apiKeys.gemini, apiKeys.openai, apiKeys.deepseek]); // Reruns if keys change from other tabs

    useEffect(() => {
        document.body.classList.remove('forge-theme', 'alchemist-theme');
        const newTheme = activeView === 'prompt' ? 'alchemist-theme' : 'forge-theme';
        document.body.classList.add(newTheme);
        setTheme(newTheme);
    }, [activeView]);
    
    const handleApiKeysSave = (keys: ApiKeys) => {
        setApiKeys(keys);
        // After saving, we know they are valid because the modal validated them.
        setAreApiKeysValidated(true);
        setIsApiKeysModalOpen(false);
    };

    const openApiKeysModal = () => setIsApiKeysModalOpen(true);

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
                    onApiKeysClick={openApiKeysModal}
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
                                    areApiKeysValidated={areApiKeysValidated}
                                    openApiKeysModal={openApiKeysModal}
                                    apiKeys={apiKeys}
                                />
                            ) : (
                                <PromptEngineeringPanel 
                                    areApiKeysValidated={areApiKeysValidated}
                                    openApiKeysModal={openApiKeysModal}
                                    apiKeys={apiKeys}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
                <Footer onAboutClick={() => setIsAboutOpen(true)} />
                <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
                <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
                <ApiKeysModal
                    isOpen={isApiKeysModalOpen} 
                    onClose={() => setIsApiKeysModalOpen(false)} 
                    onSave={handleApiKeysSave}
                    currentKeys={apiKeys}
                />
            </div>
        </>
    );
};

export default App;
