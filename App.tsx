import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { DetailPanel } from './components/DetailPanel';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';
import { HistoryModal } from './components/HistoryModal';
import { DetailModal } from './components/DetailModal';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import type { FilterState, GeneratedItem } from './types';
import { generateContent } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';

const INITIAL_FILTERS: FilterState = {
    category: 'Aleatória',
    rarity: 'Aleatória',
    era: 'Aleatória',
    missionTone: 'aventura',
    intensity: 3,
    missionScale: 'local',
    protagonist: '',
    targets: '',
    moodModifiers: '',
    baseBreathingStyle: 'Aleatória',
    kekkijutsuInspiration: 'Nenhuma',
};

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [items, setItems] = useLocalStorage<GeneratedItem[]>('kf-generated-items', []);
    const [history, setHistory] = useLocalStorage<GeneratedItem[]>('kf-history', []);
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('kf-favorites', []);
    
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Select the first item on initial load if items exist
    useEffect(() => {
        if (items.length > 0 && !selectedItem) {
            setSelectedItem(items[items.length - 1]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdateItem = (updatedItem: GeneratedItem) => {
        const updateList = (list: GeneratedItem[]) => list.map(item => item.id === updatedItem.id ? updatedItem : item);
        setItems(updateList);
        setHistory(updateList);
        if (favorites.some(fav => fav.id === updatedItem.id)) {
            setFavorites(updateList);
        }
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    };
    
    const handleGenerate = useCallback(async (count: number = 1, promptModifier?: string, itemToVary?: GeneratedItem) => {
        setIsLoading(true);
        setError(null);
        if (count === 1 && !promptModifier) { // Only clear selection for brand new items
            setSelectedItem(null);
        }

        try {
            const currentFilters = itemToVary ? { category: itemToVary.categoria, rarity: itemToVary.raridade, era: itemToVary.era } as FilterState : filters;
            const newItems = await generateContent(currentFilters, count, promptModifier);
            
            setItems(prev => [...prev, ...newItems]);
            setHistory(prev => [...prev, ...newItems]);
            setSelectedItem(newItems[newItems.length - 1]);

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [filters, setItems, setHistory]);
    
    const handleGenerateVariant = (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        const prompt = `Gere uma variação da seguinte ficha de item, com uma abordagem mais ${variantType}. Mantenha o nome e a essência, mas altere as mecânicas e a descrição para refletir o novo estilo. Item original para variar: ${JSON.stringify(item)}`;
        handleGenerate(1, prompt, item);
    };
    
    const handleSelectItem = (item: GeneratedItem) => {
        setSelectedItem(item);
        if (window.innerWidth < 1024) { // On smaller screens, open a modal for details
            setDetailModalOpen(true);
        }
    };
    
    const handleToggleFavorite = (item: GeneratedItem) => {
        if (favorites.some(fav => fav.id === item.id)) {
            setFavorites(favorites.filter(fav => fav.id !== item.id));
        } else {
            setFavorites([...favorites, item]);
        }
    };
    
    const isFavorite = useMemo(() => {
        return selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false;
    }, [selectedItem, favorites]);
    
    const handleClearResults = () => {
        setItems([]);
        setSelectedItem(null);
    };

    const handleResetFilters = () => {
        setFilters(INITIAL_FILTERS);
    };

    const handleHistorySelect = (item: GeneratedItem) => {
        handleSelectItem(item);
        setHistoryModalOpen(false);
    };
    
    const handleHistoryDelete = (itemId: string) => {
        setHistory(history.filter(item => item.id !== itemId));
    };

    const handleHistoryClear = () => {
        setHistory([]);
    };
    
    const ForgeView = () => (
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 flex-grow max-h-[calc(100vh-80px)] overflow-hidden">
            <div className="lg:col-span-3 h-full overflow-y-auto">
                <FilterPanel 
                    filters={filters} 
                    onFiltersChange={setFilters} 
                    onGenerate={handleGenerate} 
                    isLoading={isLoading}
                    onResetFilters={handleResetFilters}
                />
            </div>
            <div className="lg:col-span-3 h-full overflow-y-auto">
                <ResultsPanel
                    items={items}
                    isLoading={isLoading}
                    selectedItem={selectedItem}
                    onSelectItem={handleSelectItem}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onGenerateVariant={handleGenerateVariant}
                    onClearResults={handleClearResults}
                />
            </div>
            <div className="hidden lg:block lg:col-span-6 h-full overflow-y-auto">
                <DetailPanel
                    item={selectedItem}
                    onGenerateVariant={handleGenerateVariant}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    onUpdate={handleUpdateItem}
                />
            </div>
        </main>
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
            <Header
                onAboutClick={() => setAboutModalOpen(true)}
                onHistoryClick={() => setHistoryModalOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
            />
            
            {error && <div className="p-4"><ErrorDisplay message={error} onDismiss={() => setError(null)} /></div>}
            
            {activeView === 'forge' ? (
                <ForgeView />
            ) : (
                <div className="p-4 flex-grow max-h-[calc(100vh-80px)] overflow-y-auto">
                    <PromptEngineeringPanel />
                </div>
            )}
            
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
            <HistoryModal 
                isOpen={isHistoryModalOpen} 
                onClose={() => setHistoryModalOpen(false)}
                history={history}
                onSelect={handleHistorySelect}
                onDelete={handleHistoryDelete}
                onClear={handleHistoryClear}
            />
            {/* For mobile/tablet view */}
            <DetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                item={selectedItem}
                onGenerateVariant={handleGenerateVariant}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onUpdate={handleUpdateItem}
            />
        </div>
    );
};

export default App;