import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ForgeInterface } from './components/ForgeInterface';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';
import { FavoritesModal } from './components/FavoritesModal';
import { HistoryModal } from './components/HistoryModal';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { MatrixBackground } from './components/MatrixBackground';
import useLocalStorage from './hooks/useLocalStorage';
import type { GeneratedItem } from './types';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [isFavoritesModalOpen, setFavoritesModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-favorites', []);
    const [history, setHistory] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-history', []);

    const handleError = useCallback((message: string | null) => {
        setError(message);
        if (message) {
            setTimeout(() => setError(null), 8000);
        }
    }, []);

    const handleToggleFavorite = useCallback((item: GeneratedItem) => {
        setFavorites(prev =>
            prev.some(fav => fav.id === item.id)
                ? prev.filter(fav => fav.id !== item.id)
                : [...prev, item]
        );
    }, [setFavorites]);
    
    const handleAddToHistory = useCallback((newItems: GeneratedItem[]) => {
        setHistory(prev => [...newItems, ...prev]);
    }, [setHistory]);

    const handleDeleteFromHistory = useCallback((itemId: string) => {
        setHistory(prev => prev.filter(item => item.id !== itemId));
    }, [setHistory]);

    const handleClearHistory = useCallback(() => {
        if (window.confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
            setHistory([]);
        }
    }, [setHistory]);

    const updateItemInStorages = (updatedItem: GeneratedItem) => {
        setFavorites(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        setHistory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
            <MatrixBackground />
            <Header
                onAboutClick={() => setAboutModalOpen(true)}
                onFavoritesClick={() => setFavoritesModalOpen(true)}
                onHistoryClick={() => setHistoryModalOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
            />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                {activeView === 'forge' ? (
                    <ForgeInterface
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                        onAddToHistory={handleAddToHistory}
                        onError={handleError}
                        onUpdateItem={updateItemInStorages}
                    />
                ) : (
                    <PromptEngineeringPanel onError={handleError} />
                )}
            </main>
            <Footer onAboutClick={() => setAboutModalOpen(true)} />

            <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
            <FavoritesModal
                isOpen={isFavoritesModalOpen}
                onClose={() => setFavoritesModalOpen(false)}
                favorites={favorites}
                onSelect={(item) => { /* This is handled inside ForgeInterface which controls the selected item state */ }}
                onToggleFavorite={handleToggleFavorite}
            />
            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                history={history}
                onSelect={(item) => { /* This is handled inside ForgeInterface which controls the selected item state */ }}
                onDelete={handleDeleteFromHistory}
                onClear={handleClearHistory}
            />
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};

export default App;
