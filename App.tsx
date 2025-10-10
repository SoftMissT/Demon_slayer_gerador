
import React, { useState, useCallback } from 'react';

import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { DetailPanel } from './components/DetailPanel';
import { FavoritesModal } from './components/FavoritesModal';
import { AboutModal } from './components/AboutModal';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';

import { generateContent } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';

import type { FilterState, GeneratedItem, Tone } from './types';
import { CATEGORIES, RARITIES, ERAS, TONES, VILLAIN_MOTIVATIONS, DEMON_BLOOD_ART_TYPES } from './constants';

const DEFAULT_FILTERS: FilterState = {
    category: CATEGORIES[0],
    rarity: RARITIES[0],
    era: ERAS[0],
    breathingStyles: [],
    demonArts: [],
    // Mission Defaults
    tone: TONES[0] as Tone,
    intensity: 3,
    scale: 'local',
    protagonist: 'Caçador ex-militar com cicatriz no rosto',
    targets: 'Oni que se esconde em um teatro abandonado',
    moodModifiers: 'nevoento, cheiro de vela podre',
    demonBloodArtType: DEMON_BLOOD_ART_TYPES[0],
    villainMotivation: VILLAIN_MOTIVATIONS[0],
    powerLevel: 3,
    numberOfSessions: 1,
};


const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

    const [items, setItems] = useLocalStorage<GeneratedItem[]>('generatedItems', []);
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('favoriteItems', []);
    
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    const handleGenerate = useCallback(async (count: number, promptModifier?: string, itemToVary?: GeneratedItem) => {
        setIsLoading(true);
        setError(null);
        if (!itemToVary) {
            setSelectedItem(null);
        }

        try {
            const generationFilters = itemToVary ? {
                ...DEFAULT_FILTERS,
                category: itemToVary.categoria,
                rarity: itemToVary.raridade,
                era: filters.era,
            } : filters;

            const newItems = await generateContent(generationFilters, count, promptModifier);
            const itemsWithIds = newItems.map((item, index) => ({ ...item, id: `${Date.now()}-${index}` }));

            setItems(prevItems => [...prevItems, ...itemsWithIds]);
            if (itemsWithIds.length > 0 && !itemToVary) {
                setSelectedItem(itemsWithIds[0]);
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [filters, setItems]);

    const handleGenerateVariant = (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        const promptModifier = `Gere uma variação ${variantType} do seguinte item: ${JSON.stringify(item)}`;
        handleGenerate(1, promptModifier, item);
    };

    const handleUpdateItem = (updatedItem: GeneratedItem) => {
        const newItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
        setItems(newItems);
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
        if (favorites.some(fav => fav.id === updatedItem.id)) {
            const newFavorites = favorites.map(fav => fav.id === updatedItem.id ? updatedItem : fav);
            setFavorites(newFavorites);
        }
    };

    const handleToggleFavorite = (itemToToggle: GeneratedItem) => {
        const isFavorite = favorites.some(fav => fav.id === itemToToggle.id);
        if (isFavorite) {
            setFavorites(favorites.filter(fav => fav.id !== itemToToggle.id));
        } else {
            setFavorites([...favorites, itemToToggle]);
        }
    };
    
    const handleSelectFavorite = (item: GeneratedItem) => {
        setSelectedItem(item);
        setIsFavoritesModalOpen(false);
        setActiveView('forge');
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
            <Header
                onAboutClick={() => setIsAboutModalOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
            />

            <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-6">
                {activeView === 'forge' ? (
                    <>
                        {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[calc(100vh-150px)]">
                           <div className="lg:col-span-3 h-full">
                               <FilterPanel
                                   filters={filters}
                                   onFiltersChange={setFilters}
                                   onGenerate={(count) => handleGenerate(count)}
                                   isLoading={isLoading}
                               />
                           </div>
                           <div className="lg:col-span-3 h-full">
                               <ResultsPanel
                                   items={items}
                                   isLoading={isLoading}
                                   selectedItem={selectedItem}
                                   onSelectItem={setSelectedItem}
                                   favorites={favorites}
                                   onToggleFavorite={handleToggleFavorite}
                               />
                           </div>
                           <div className="lg:col-span-6 h-full">
                                <DetailPanel
                                    item={selectedItem}
                                    onGenerateVariant={handleGenerateVariant}
                                    isFavorite={selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false}
                                    onToggleFavorite={selectedItem ? () => handleToggleFavorite(selectedItem) : () => {}}
                                    onUpdate={handleUpdateItem}
                                />
                           </div>
                        </div>
                    </>
                ) : (
                    <PromptEngineeringPanel />
                )}
            </main>
            
            <button
                onClick={() => setIsFavoritesModalOpen(true)}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
                title="Ver Favoritos"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                 {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {favorites.length}
                    </span>
                 )}
            </button>


            <FavoritesModal
                isOpen={isFavoritesModalOpen}
                onClose={() => setIsFavoritesModalOpen(false)}
                favorites={favorites}
                onSelect={handleSelectFavorite}
                onToggleFavorite={handleToggleFavorite}
            />
            <AboutModal
                isOpen={isAboutModalOpen}
                onClose={() => setIsAboutModalOpen(false)}
            />
        </div>
    );
};

export default App;