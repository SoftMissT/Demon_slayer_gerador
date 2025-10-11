import React, { useState, useEffect, useCallback, useRef } from 'react';
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


const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'forge' | 'prompt'>('forge');
    const [filters, setFilters] = useState<FilterState>({
        category: 'Arma',
        rarity: 'Aleatória',
        era: 'Aleatória',
        // Mission filters
        missionTone: 'investigação',
        intensity: 3,
        missionScale: 'local',
        protagonist: '',
        targets: '',
        moodModifiers: '',
        // NPC Filters
        profession: 'Aleatória',
        relation_with_pcs: 'Aleatória',
        level_detail: 'Médio',
        // Hunter/NPC Origin
        origem: '',
        // Hunter Filters
        hunterWeapon: '',
        hunterBreathingStyles: [],
        hunterTone: 'investigação',
        hunterPersonality: '',
        hunterArchetype: '',
        // Oni Filters
        oniWeapon: '',
        oniInspirationBreathing: 'Nenhuma',
        oniPowerLevel: '',
        oniInspirationKekkijutsu: 'Nenhuma',
        // Accessory Filters
        accessoryInspirationKekkijutsu: 'Nenhuma',
        accessoryInspirationBreathing: 'Nenhuma',
        accessoryWeaponInspiration: 'Nenhuma',
        accessoryOriginInspiration: '',
        // Weapon Filters
        weaponMetalColor: '',
        // Location Filters
        locationTone: 'aventura',
        locationCountry: '',
        locationTerrain: '',
        // World Building Filters
        wbTone: 'aventura',
        wbCountry: '',
        wbScale: 'local',
        // Breathing Form Filters
        baseBreathingStyles: [],
        breathingFormWeapon: '',
        breathingFormTone: 'ação',
        breathingFormOrigin: '',
        breathingFormArchetype: '',
        // Kekkijutsu Filters
        kekkijutsuInspiration: 'Nenhuma',
        kekkijutsuInspirationBreathing: 'Nenhuma',
        kekkijutsuWeapon: '',
    });

    const [items, setItems] = useState<GeneratedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('legend-forge-favorites', []);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    // Dynamically set header height for full-page layout
    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                const height = headerRef.current.getBoundingClientRect().height;
                document.documentElement.style.setProperty('--header-height', `${Math.ceil(height)}px`);
            }
        };

        window.addEventListener('resize', updateHeaderHeight);
        updateHeaderHeight(); // Initial call

        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);


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

    const handleClearResults = useCallback(() => {
        setItems([]);
        setSelectedItem(null);
    }, []);
    
    const ForgeView = () => (
        <main className="main-grid-container">
            <div className="grid-column-wrapper">
                <FilterPanel filters={filters} onFiltersChange={setFilters} onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
            <div className="grid-column-wrapper">
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
            <div className="hidden lg:block grid-column-wrapper">
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
        <div className="bg-gray-900 text-gray-200 h-screen flex flex-col font-sans">
            <Header
                ref={headerRef}
                onAboutClick={() => setIsAboutModalOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
            />
            
             {error && (
                <div className="p-4 lg:p-6">
                    <ErrorDisplay message={error} onDismiss={() => setError(null)} />
                </div>
            )}
            
            {activeView === 'forge' ? (
                <ForgeView />
            ) : (
                <main className="flex-grow p-4 lg:p-6 overflow-y-auto">
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