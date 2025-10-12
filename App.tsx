import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
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
                setDetailModalOpen(true);
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [filters, selectedItem, setHistory]);


    const handleGenerateVariant = (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        const promptModifier = `Gere uma variação deste item com uma abordagem mais ${variantType}. Mantenha o conceito central, mas altere detalhes, habilidades ou a lore para refletir a nova abordagem.\n\nItem Original:\n${JSON.stringify(item)}`;
        setSelectedItem(item);
        handleGenerateContent(1, promptModifier);
    };


    const handleToggleFavorite = (item: GeneratedItem) => {
        setFavorites(prev => 
            prev.some(fav => fav.id === item.id)
            ? prev.filter(fav => fav.id !== item.id)
            : [item, ...prev]
        );
    };

    const updateItemInState = (updater: React.Dispatch<React.SetStateAction<GeneratedItem[]>>, updatedItem: GeneratedItem) => {
        updater(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    };

    const handleUpdateItem = (updatedItem: GeneratedItem) => {
        updateItemInState(setGeneratedItems, updatedItem);
        updateItemInState(setFavorites, updatedItem);
        updateItemInState(setHistory, updatedItem);
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    };

    const handleSelectItem = (item: GeneratedItem) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    const handleHistorySelect = (item: GeneratedItem) => {
        setSelectedItem(item);
        setHistoryModalOpen(false);
        setFavoritesModalOpen(false);
        setActiveView('forge');
        setDetailModalOpen(true);
    };
    
    const handleDeleteFromHistory = (itemId: string) => {
        setHistory(prev => prev.filter(item => item.id !== itemId));
    };
    
    const handleClearHistory = () => {
        if(window.confirm("Tem certeza que deseja apagar todo o histórico? Esta ação não pode ser desfeita.")) {
            setHistory([]);
        }
    };
    
    const handleClearResults = () => {
        setGeneratedItems([]);
        setSelectedItem(null);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
            <Header 
                onAboutClick={() => setAboutModalOpen(true)}
                onFavoritesClick={() => setFavoritesModalOpen(true)}
                onHistoryClick={() => setHistoryModalOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
            />

            <main className="flex-grow p-4 md:p-6 lg:p-8 grid gap-4 md:gap-6 lg:gap-8 grid-cols-12 h-[calc(100vh-100px)]">
                {activeView === 'forge' ? (
                    <>
                        <div className="col-span-12 lg:col-span-4 h-full min-h-0">
                            <FilterPanel 
                                filters={filters}
                                onFiltersChange={setFilters}
                                onGenerate={(count) => handleGenerateContent(count)}
                                isLoading={isLoading}
                                onResetFilters={() => setFilters(INITIAL_FILTERS)}
                            />
                        </div>
                        <div className="col-span-12 lg:col-span-8 h-full min-h-0">
                            <ResultsPanel 
                                items={generatedItems}
                                isLoading={isLoading}
                                selectedItem={selectedItem}
                                onSelectItem={handleSelectItem}
                                favorites={favorites}
                                onToggleFavorite={handleToggleFavorite}
                                onGenerateVariant={handleGenerateVariant}
                                onClearResults={handleClearResults}
                            />
                        </div>
                    </>
                ) : (
                    <div className="col-span-12 h-full overflow-y-auto">
                        <PromptEngineeringPanel />
                    </div>
                )}
            </main>
            
            <Footer onAboutClick={() => setAboutModalOpen(true)} />

            <ErrorDisplay message={error} onDismiss={() => setError(null)} />

            <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
            <FavoritesModal 
                isOpen={isFavoritesModalOpen}
                onClose={() => setFavoritesModalOpen(false)}
                favorites={favorites}
                onSelect={handleHistorySelect}
                onToggleFavorite={handleToggleFavorite}
            />
            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                history={history}
                onSelect={handleHistorySelect}
                onDelete={handleDeleteFromHistory}
                onClear={handleClearHistory}
            />
            <DetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setDetailModalOpen(false)}
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