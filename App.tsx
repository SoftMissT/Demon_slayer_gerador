import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ResultsPanel } from './components/ResultsPanel';
import { Footer } from './components/Footer';
import { AboutModal } from './components/AboutModal';
import { FavoritesModal } from './components/FavoritesModal';
import { HistoryModal } from './components/HistoryModal';
import { DetailModal } from './components/DetailModal';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import type { GeneratedItem, FilterState } from './types';
import { generateContent } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import { INITIAL_FILTERS } from './constants';
import { ForgeInterface } from './components/ForgeInterface';

const App: React.FC = () => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-favorites', []);
    const [history, setHistory] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-history', []);
    
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [isFavoritesModalOpen, setFavoritesModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');

    const handleGenerateContent = useCallback(async (count: number, promptModifier?: string) => {
        setIsLoading(true);
        setError(null);
        if (!promptModifier) {
            // Don't clear selection on variant generation
            // setSelectedItem(null); 
        }

        try {
            // Use a temporary filter state for variant generation
            const currentFilters = promptModifier ? { ...INITIAL_FILTERS, category: selectedItem?.categoria || filters.category } : filters;
            
            const newItems = await generateContent(currentFilters, count, promptModifier);

            setGeneratedItems(prev => [...newItems, ...prev]);
            setHistory(prev => [...newItems, ...prev]);

            if (newItems.length > 0) {
                setSelectedItem(newItems[0]);
                if (window.innerWidth < 1024) { // On smaller screens, open modal for better view
                    setDetailModalOpen(true);
                }
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [filters, selectedItem, setHistory]);


    const handleGenerateVariant = useCallback((item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        const promptModifier = `Gere uma variação deste item com uma abordagem mais ${variantType}. Mantenha o conceito central, mas altere detalhes, habilidades ou a lore para refletir a nova abordagem.\n\nItem Original:\n${JSON.stringify(item)}`;
        setSelectedItem(item);
        handleGenerateContent(1, promptModifier);
    }, [handleGenerateContent]);


    const handleToggleFavorite = useCallback((item: GeneratedItem) => {
        setFavorites(prev => 
            prev.some(fav => fav.id === item.id)
            ? prev.filter(fav => fav.id !== item.id)
            : [item, ...prev]
        );
    }, [setFavorites]);


    const handleUpdateItem = useCallback((updatedItem: GeneratedItem) => {
        const updateList = (prev: GeneratedItem[]) => prev.map(i => i.id === updatedItem.id ? updatedItem : i);
        setGeneratedItems(updateList);
        setFavorites(updateList);
        setHistory(updateList);

        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    }, [selectedItem, setGeneratedItems, setFavorites, setHistory, setSelectedItem]);

    const handleSelectItem = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        if (window.innerWidth < 1024) { // On smaller screens, open modal for better view
            setDetailModalOpen(true);
        }
    }, [setSelectedItem, setDetailModalOpen]);

    const handleHistorySelect = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        setHistoryModalOpen(false);
        setFavoritesModalOpen(false);
        setActiveView('forge');
        setDetailModalOpen(true);
    }, [setSelectedItem, setHistoryModalOpen, setFavoritesModalOpen, setActiveView, setDetailModalOpen]);
    
    const handleDeleteFromHistory = useCallback((itemId: string) => {
        setHistory(prev => prev.filter(item => item.id !== itemId));
    }, [setHistory]);
    
    const handleClearHistory = useCallback(() => {
        if(window.confirm("Tem certeza que deseja apagar todo o histórico? Esta ação não pode ser desfeita.")) {
            setHistory([]);
        }
    }, [setHistory]);
    
    const handleClearResults = useCallback(() => {
        setGeneratedItems([]);
        setSelectedItem(null);
    }, [setGeneratedItems, setSelectedItem]);

    const onAboutClose = useCallback(() => setAboutModalOpen(false), []);
    const onFavoritesClose = useCallback(() => setFavoritesModalOpen(false), []);
    const onHistoryClose = useCallback(() => setHistoryModalOpen(false), []);
    const onDetailClose = useCallback(() => {
        setDetailModalOpen(false);
        // On larger screens, closing the modal doesn't deselect the item
        if (window.innerWidth < 1024) {
            setSelectedItem(null);
        }
    }, []);
    const onErrorDismiss = useCallback(() => setError(null), []);

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
            <Header 
                onAboutClick={() => setAboutModalOpen(true)}
                onFavoritesClick={() => setFavoritesModalOpen(true)}
                onHistoryClick={() => setHistoryModalOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
            />

            <main className="flex-grow flex flex-col">
                {activeView === 'forge' ? (
                   <ForgeInterface
                        filters={filters}
                        onFiltersChange={setFilters}
                        onGenerate={(count) => handleGenerateContent(count)}
                        isLoading={isLoading}
                        items={generatedItems}
                        selectedItem={selectedItem}
                        onSelectItem={handleSelectItem}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                        onGenerateVariant={handleGenerateVariant}
                        onUpdate={handleUpdateItem}
                        onClearResults={handleClearResults}
                    />
                ) : (
                    <div className="w-full h-full overflow-y-auto p-4 md:p-6 lg:p-8">
                        <PromptEngineeringPanel />
                    </div>
                )}
            </main>
            
            <Footer onAboutClick={() => setAboutModalOpen(true)} />

            <ErrorDisplay message={error} onDismiss={onErrorDismiss} />

            <AboutModal isOpen={isAboutModalOpen} onClose={onAboutClose} />
            <FavoritesModal 
                isOpen={isFavoritesModalOpen}
                onClose={onFavoritesClose}
                favorites={favorites}
                onSelect={handleHistorySelect}
                onToggleFavorite={handleToggleFavorite}
            />
            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={onHistoryClose}
                history={history}
                onSelect={handleHistorySelect}
                onDelete={handleDeleteFromHistory}
                onClear={handleClearHistory}
            />
            <DetailModal
                isOpen={isDetailModalOpen}
                onClose={onDetailClose}
                item={selectedItem}
                onGenerateVariant={handleGenerateVariant}
                isFavorite={selectedItem ? favorites.some(f => f.id === selectedItem.id) : false}
                onToggleFavorite={handleToggleFavorite}
                onUpdate={handleUpdateItem}
            />
        </div>
    );
};

export default App;
