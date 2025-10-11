import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { DetailPanel } from './components/DetailPanel';
import { AboutModal } from './components/AboutModal';
import { DetailModal } from './components/DetailModal';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { PromptEngineeringPanel } from './components/PromptEngineeringPanel';
import { generateContent } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import type { FilterState, GeneratedItem } from './types';
import { v4 as uuidv4 } from 'uuid';

const initialFilterState: FilterState = {
    category: 'Arma',
    rarity: '',
    era: '',
    missionTone: 'investigação',
    intensity: 3,
    missionScale: 'local',
    protagonist: '',
    targets: '',
    moodModifiers: '',
    profession: '',
    relation_with_pcs: '',
    level_detail: 'Médio',
    origem: '',
    hunterWeapon: '',
    hunterBreathingStyles: [],
    hunterTone: 'investigação',
    hunterPersonality: '',
    hunterArchetype: '',
    oniWeapon: '',
    oniInspirationBreathing: 'Nenhuma',
    oniPowerLevel: '',
    oniInspirationKekkijutsu: 'Nenhuma',
    accessoryInspirationKekkijutsu: 'Nenhuma',
    accessoryInspirationBreathing: 'Nenhuma',
    accessoryWeaponInspiration: 'Nenhuma',
    accessoryOriginInspiration: '',
    weaponMetalColor: '',
    locationTone: 'aventura',
    locationCountry: '',
    locationTerrain: '',
    wbTone: 'aventura',
    wbCountry: '',
    wbScale: 'local',
    baseBreathingStyle: '',
    breathingFormWeapon: '',
    breathingFormTone: 'ação',
    breathingFormOrigin: '',
    breathingFormArchetype: '',
    kekkijutsuInspiration: 'Nenhuma',
    kekkijutsuInspirationBreathing: 'Nenhuma',
    kekkijutsuWeapon: '',
};


const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [filters, setFilters] = useState<FilterState>(initialFilterState);

    const [items, setItems] = useState<GeneratedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('legend-forge-favorites', []);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Auto-select the newest item
    useEffect(() => {
        if (items.length > 0) {
            const latestItem = items[items.length - 1];
            setSelectedItem(latestItem);
            // On screens smaller than desktop, open detail modal automatically
            if (window.innerWidth < 1024) { 
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
        if (window.innerWidth < 1024) {
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

    const handleClearResults = useCallback(() => {
        setItems([]);
        setSelectedItem(null);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(initialFilterState);
    }, []);
    
    const ForgeView = () => (
        <main className="flex-grow flex flex-row overflow-x-auto lg:flex-col lg:overflow-x-visible p-4 lg:p-6 gap-6 h-[calc(100vh-85px)]">
            {/* The panels will have min-width for mobile's flex-row and will stack in desktop's flex-col */}
            <div className="lg:w-full min-w-[340px] h-full">
                <FilterPanel filters={filters} onFiltersChange={setFilters} onGenerate={handleGenerate} isLoading={isLoading} onResetFilters={handleResetFilters} />
            </div>
            <div className="lg:w-full min-w-[400px] h-full">
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
            <div className="lg:w-full min-w-[420px] h-full">
                 <DetailPanel
                    item={selectedItem}
                    onGenerateVariant={handleGenerateVariant}
                    isFavorite={selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false}
                    onToggleFavorite={handleToggleFavorite}
                    onUpdate={handleUpdateItem}
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
            
            {/* Loading Bar */}
            <div className={`relative w-full h-1 ${isLoading ? 'visible' : 'invisible'}`}>
                <div className="absolute top-0 h-1 w-full bg-indigo-900/50 overflow-hidden">
                    {isLoading && <div className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-loading-bar"></div>}
                </div>
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