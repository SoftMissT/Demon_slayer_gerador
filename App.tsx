import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { FilterState, GeneratedItem } from './types';
import { generateContent } from './services/geminiService';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { DetailPanel } from './components/DetailPanel';
import { Footer } from './components/Footer';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { AboutModal } from './components/AboutModal';
import { FavoritesModal } from './components/FavoritesModal';
import { HistoryModal } from './components/HistoryModal';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { DetailModal } from './components/DetailModal';

const initialFilters: FilterState = {
  category: 'Caçador',
  hunterWeapon: 'Aleatória',
  hunterBreathingStyles: [],
  hunterAccessory: 'Aleatória',
  hunterEra: 'Aleatória',
  hunterPersonality: 'Aleatória',
  hunterOrigin: 'Aleatória',
  hunterArchetype: 'Aleatória',
  accessoryRarity: 'Aleatória',
  accessoryEra: 'Aleatória',
  accessoryKekkijutsuInspiration: 'Nenhuma',
  accessoryBreathingInspiration: 'Nenhuma',
  accessoryWeaponInspiration: 'Nenhuma',
  accessoryOrigin: 'Aleatória',
  weaponRarity: 'Aleatória',
  weaponMetalColor: 'Aleatória',
  weaponEra: 'Aleatória',
  weaponType: 'Aleatória',
  locationTone: 'aventura',
  locationCountry: 'Aleatório',
  locationEra: 'Aleatória',
  locationTerrain: 'Aleatório',
  wbTone: 'aventura',
  wbCountry: 'Aleatório',
  wbEra: 'Aleatória',
  wbThreatScale: 'Aleatória',
  wbLocation: 'Aleatória',
  breathingFormEra: 'Aleatória',
  breathingFormWeapon: 'Aleatória',
  baseBreathingStyles: [],
  breathingFormTone: 'ação',
  breathingFormOrigin: 'Aleatória',
  breathingFormArchetype: 'Aleatória',
  kekkijutsuEra: 'Aleatória',
  kekkijutsuKekkijutsuInspiration: 'Nenhuma',
  kekkijutsuBreathingInspiration: 'Nenhuma',
  kekkijutsuWeaponInspiration: 'Nenhuma',
  npcOrigin: 'Aleatória',
  npcProfession: 'Aleatória',
  npcEra: 'Aleatória',
  oniPowerLevel: 'Aleatório',
  oniInspirationKekkijutsu: 'Nenhuma',
  oniInspirationBreathing: 'Nenhuma',
  oniWeapon: 'Aleatória',
  missionTone: 'mistério',
  intensity: 3,
  missionScale: 'local',
  protagonist: 'Um caçador recém-formado com um passado misterioso.',
  targets: 'Um oni que se esconde em uma vila isolada.',
  moodModifiers: 'chuvoso, sombrio, silencioso',
};


const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [items, setItems] = useLocalStorage<GeneratedItem[]>('generatedItems_v2', []);
    const [history, setHistory] = useLocalStorage<GeneratedItem[]>('generationHistory_v2', []);
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('favoriteItems_v2', []);
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Auto-select first item or last generated item
    useEffect(() => {
        if (!selectedItem && items.length > 0) {
            setSelectedItem(items[items.length - 1]);
        } else if (selectedItem && !items.find(i => i.id === selectedItem.id)) {
            // If selected item was deleted, select the last one or null
            setSelectedItem(items.length > 0 ? items[items.length - 1] : null);
        }
    }, [items, selectedItem]);
    
    const handleGenerate = useCallback(async (count: number = 1, promptModifier?: string) => {
        setIsLoading(true);
        setError(null);
        if(count > 1) setSelectedItem(null);

        try {
            const newItems = await generateContent(filters, count, promptModifier);
            setItems(prev => [...prev, ...newItems]);
            setHistory(prev => [...prev, ...newItems]);
            if (newItems.length > 0) {
                setSelectedItem(newItems[newItems.length - 1]);
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [filters, setItems, setHistory]);
    
    const handleGenerateVariant = useCallback(async (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        const promptModifier = `Gere uma variação deste item com uma abordagem mais ${variantType}. Foque em como essa abordagem altera suas habilidades, aparência e lore.\n\nItem Original:\n${JSON.stringify(item, null, 2)}`;
        await handleGenerate(1, promptModifier);
    }, [handleGenerate]);

    const handleToggleFavorite = useCallback((item: GeneratedItem) => {
        setFavorites(prev => {
            const isFav = prev.some(fav => fav.id === item.id);
            if (isFav) {
                return prev.filter(fav => fav.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    }, [setFavorites]);

    const handleUpdateItem = useCallback((updatedItem: GeneratedItem) => {
        const updateList = (list: GeneratedItem[]) => list.map(item => item.id === updatedItem.id ? updatedItem : item);
        setItems(updateList);
        setHistory(updateList);
        if (favorites.some(fav => fav.id === updatedItem.id)) {
            setFavorites(updateList);
        }
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    }, [setItems, setHistory, setFavorites, favorites, selectedItem]);

    const handleSelectItem = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true); // For mobile view
    }, []);

    const handleClearResults = useCallback(() => {
        setItems([]);
        setSelectedItem(null);
    }, [setItems]);

    const handleDeleteFromHistory = useCallback((itemId: string) => {
        setHistory(prev => prev.filter(item => item.id !== itemId));
    }, [setHistory]);
    
    const handleClearHistory = useCallback(() => {
        setHistory([]);
    }, [setHistory]);

    const handleSelectFromModal = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        setIsFavoritesModalOpen(false);
        setIsHistoryModalOpen(false);
        setIsDetailModalOpen(true); // For mobile view
    }, []);

    const isFavorite = selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false;

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200 font-sans">
            <Header
                onAboutClick={() => setIsAboutModalOpen(true)}
                onFavoritesClick={() => setIsFavoritesModalOpen(true)}
                onHistoryClick={() => setIsHistoryModalOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
            />
            
            <main className="flex-grow p-4 md:p-6 lg:p-8">
                {activeView === 'forge' ? (
                    <div className="flex flex-col gap-4 md:gap-6 h-full">
                        {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full flex-grow">
                            <div className="lg:col-span-3 h-full">
                                <FilterPanel 
                                    filters={filters}
                                    onFiltersChange={setFilters}
                                    onGenerate={handleGenerate}
                                    isLoading={isLoading}
                                />
                            </div>
                            <div className="lg:col-span-3 h-full">
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
                            <div className="lg:col-span-6 h-full hidden lg:block">
                                <DetailPanel
                                    item={selectedItem}
                                    onGenerateVariant={handleGenerateVariant}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={handleToggleFavorite}
                                    onUpdate={handleUpdateItem}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <PromptEngineeringPanel />
                )}
            </main>
            
            <Footer onAboutClick={() => setIsAboutModalOpen(true)} />

            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
            <FavoritesModal 
                isOpen={isFavoritesModalOpen} 
                onClose={() => setIsFavoritesModalOpen(false)}
                favorites={favorites}
                onSelect={handleSelectFromModal}
                onToggleFavorite={handleToggleFavorite}
            />
            <HistoryModal 
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                history={history}
                onSelect={handleSelectFromModal}
                onDelete={handleDeleteFromHistory}
                onClear={handleClearHistory}
            />
            <div className="lg:hidden">
                <DetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    item={selectedItem}
                    onGenerateVariant={handleGenerateVariant}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    onUpdate={handleUpdateItem}
                />
            </div>
        </div>
    );
};

export default App;
