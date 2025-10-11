
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { DetailPanel } from './components/DetailPanel';
import { AboutModal } from './components/AboutModal';
import { FavoritesModal } from './components/FavoritesModal';
import { DetailModal } from './components/DetailModal';
import { Button } from './components/ui/Button';
import { StarIcon } from './components/icons/StarIcon';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { generateContent } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import type { FilterState, GeneratedItem } from './types';
import { v4 as uuidv4 } from 'uuid';


const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [filters, setFilters] = useState<FilterState>({
        category: 'Arma',
        rarity: 'Aleatória',
        era: 'Aleatória',
        breathingStyles: [],
        demonArts: [],
        tone: 'investigação',
        intensity: 3,
        scale: 'local',
        protagonist: '',
        targets: '',
        moodModifiers: '',
    });

    const [items, setItems] = useState<GeneratedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('legend-forge-favorites', []);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Auto-select the newest item
    useEffect(() => {
        if (items.length > 0) {
            const latestItem = items[items.length - 1];
            setSelectedItem(latestItem);
            if (window.innerWidth < 1024) { // On mobile, open detail modal automatically
                setIsDetailModalOpen(true);
            }
        }
    }, [items]);

    const handleGenerate = useCallback(async (count: number = 1, promptModifier?: string, originalItem?: GeneratedItem) => {
        setIsLoading(true);
        setError(null);
        try {
            const newItems = await generateContent(filters, count, promptModifier);
            const itemsWithIds = newItems.map(item => ({ ...item, id: uuidv4() }));
            
            // If it's a variant, add diff info
            if (originalItem && itemsWithIds.length > 0) {
                itemsWithIds[0].diff = {
                    summary: `Variação "${promptModifier}" de "${originalItem.nome}"`,
                    changes: ["Detalhes e mecânicas foram ajustados para refletir a nova variação."]
                }
            }
            
            setItems(prevItems => [...prevItems, ...itemsWithIds]);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    const handleGenerateVariant = (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        const promptModifier = `Crie uma variação **${variantType}** do seguinte item: ${JSON.stringify(item)}. A nova variação deve manter a essência do original, mas com um foco claro no novo estilo.`;
        handleGenerate(1, promptModifier, item);
    };

    const handleToggleFavorite = (item: GeneratedItem) => {
        setFavorites(prev => 
            prev.some(fav => fav.id === item.id)
                ? prev.filter(fav => fav.id !== item.id)
                : [...prev, item]
        );
    };

    const handleSelectItem = (item: GeneratedItem) => {
        setSelectedItem(item);
        if (window.innerWidth < 1024) { // On mobile, open detail modal on select
            setIsDetailModalOpen(true);
        }
    };
    
    const handleUpdateItem = (updatedItem: GeneratedItem) => {
        const update = (list: GeneratedItem[]) => list.map(i => i.id === updatedItem.id ? updatedItem : i);
        setItems(update);
        setFavorites(update);
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    }
    
    const ForgeView = () => (
        <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 p-4 lg:p-6 h-[calc(100vh-81px)]">
            <div className="lg:col-span-3 h-full">
                <FilterPanel filters={filters} onFiltersChange={setFilters} onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
            <div className="hidden lg:block lg:col-span-5 h-full">
                 <DetailPanel
                    item={selectedItem}
                    onGenerateVariant={handleGenerateVariant}
                    isFavorite={selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false}
                    onToggleFavorite={handleToggleFavorite}
                    onUpdate={handleUpdateItem}
                 />
            </div>
            <div className="lg:col-span-4 h-full">
                 <ResultsPanel 
                    items={items} 
                    isLoading={isLoading} 
                    selectedItem={selectedItem}
                    onSelectItem={handleSelectItem}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onGenerateVariant={handleGenerateVariant}
                />
            </div>
        </main>
    );

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col font-sans">
            <Header
                onAboutClick={() => setIsAboutModalOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
            />

            <div className="absolute top-24 right-6 z-50">
                <Button variant="secondary" onClick={() => setIsFavoritesModalOpen(true)}>
                    <StarIcon className="w-5 h-5" />
                    Favoritos ({favorites.length})
                </Button>
            </div>
            
             {error && (
                <div className="p-4 lg:p-6">
                    <ErrorDisplay message={error} onDismiss={() => setError(null)} />
                </div>
            )}
            
            {activeView === 'forge' ? (
                <ForgeView />
            ) : (
                <main className="flex-grow p-4 lg:p-6">
                    <PromptEngineeringPanel />
                </main>
            )}

            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
            <FavoritesModal 
                isOpen={isFavoritesModalOpen} 
                onClose={() => setIsFavoritesModalOpen(false)} 
                favorites={favorites}
                onSelect={(item) => {
                    handleSelectItem(item);
                    setIsFavoritesModalOpen(false);
                }}
                onToggleFavorite={handleToggleFavorite}
            />
             <DetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                item={selectedItem}
                onGenerateVariant={(item, type) => {
                    handleGenerateVariant(item, type);
                    setIsDetailModalOpen(false);
                }}
                isFavorite={selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false}
                onToggleFavorite={handleToggleFavorite}
                onUpdate={handleUpdateItem}
            />
        </div>
    );
};

export default App;
