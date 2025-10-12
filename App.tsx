import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ForgeInterface } from './components/ForgeInterface';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';

// FIX: Implement the main App component to structure the application layout and views.
const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    
    // States for modals that are triggered from the Header but whose data is managed by ForgeInterface
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Add a class to the body when the prompt panel is active for unique styling
    useEffect(() => {
        if (activeView === 'prompt') {
            document.body.classList.add('prompt-engineering-active');
        } else {
            document.body.classList.remove('prompt-engineering-active');
        }
    }, [activeView]);
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans kimetsu-forge-app">
            <Header
                activeView={activeView}
                onViewChange={setActiveView}
                onAboutClick={() => setIsAboutOpen(true)}
                onFavoritesClick={() => setIsFavoritesOpen(true)}
                onHistoryClick={() => setIsHistoryOpen(true)}
            />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-6">
                {activeView === 'forge' ? (
                    <ForgeInterface
                        isFavoritesOpen={isFavoritesOpen}
                        onFavoritesClose={() => setIsFavoritesOpen(false)}
                        isHistoryOpen={isHistoryOpen}
                        onHistoryClose={() => setIsHistoryOpen(false)}
                    />
                ) : (
                    <PromptEngineeringPanel />
                )}
            </main>
            <Footer onAboutClick={() => setIsAboutOpen(true)} />
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        </div>
    );
};

export default App;
