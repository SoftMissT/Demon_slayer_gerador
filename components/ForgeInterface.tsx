import React, { useState, useCallback, useMemo } from 'react';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailPanel } from './DetailPanel';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import type { GeneratedItem, FilterState, User, AIFlags, Category, Rarity } from '../types';
import { AuthOverlay } from './AuthOverlay';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { DetailModal } from './DetailModal';

const INITIAL_FILTERS: FilterState = {
    category: 'Aleatório',
    subCategory: 'Aleatório',
    hunterWeapon: 'Aleatório',
    quantity: 1,
    tematica: 'Aleatória',
    origins: [],
    breathingStyles: [],
    professions: [],
    rarity: 'Aleatória',
    level: 10,
    suggestedPrice: 500,
    promptModifier: '',
    aiFocusGemini: '',
    aiFocusGpt: '',
    aiFocusDeepSeek: '',
};

const INITIAL_AI_FLAGS: AIFlags = {
    useGemini: true,
    useGpt: true,
    useDeepSeek: true,
};


interface ForgeInterfaceProps {
    isAuthenticated: boolean;
    onLoginClick: () => void;
    history: GeneratedItem[];
    setHistory: React.Dispatch<React.SetStateAction<GeneratedItem[]>>;
    favorites: GeneratedItem[];
    setFavorites: React.Dispatch<React.SetStateAction<GeneratedItem[]>>;
    selectedItem: GeneratedItem | null;
    setSelectedItem: React.Dispatch<React.SetStateAction<GeneratedItem | null>>;
    user: User | null;
}

export const ForgeInterface: React.FC<ForgeInterfaceProps> = ({
    isAuthenticated,
    onLoginClick,
    history,
    setHistory,
    favorites,
    setFavorites,
    selectedItem,
    setSelectedItem,
    user,
}) => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [aiFlags, setAIFlags] = useState<AIFlags>(INITIAL_AI_FLAGS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleFilterChange = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);
    
    const handleAIFlagChange = useCallback((key: keyof AIFlags, value: boolean) => {
        setAIFlags(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const results: GeneratedItem[] = [];
            for (let i = 0; i < filters.quantity; i++) {
                const result = await orchestrateGeneration(filters, filters.promptModifier, aiFlags, user);
                results.push(result);
            }
            setHistory(prev => [...results, ...prev]);
            setSelectedItem(results[0]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [filters, aiFlags, user, setHistory, setSelectedItem]);
    
    const handleResetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
        setAIFlags(INITIAL_AI_FLAGS);
    }, []);

    const handleToggleFavorite = useCallback((item: GeneratedItem) => {
        setFavorites(prev => {
            const isFav = prev.some(fav => fav.id === item.id);
            if (isFav) {
                return prev.filter(fav => fav.id !== item.id);
            }
            return [item, ...prev];
        });
    }, [setFavorites]);
    
    const handleUpdateItem = useCallback((updatedItem: GeneratedItem) => {
        const updateList = (list: GeneratedItem[]) => list.map(item => item.id === updatedItem.id ? updatedItem : item);
        setHistory(updateList);
        setFavorites(updateList);
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    }, [setHistory, setFavorites, selectedItem, setSelectedItem]);
    
    const handleSelect = (item: GeneratedItem) => {
        setSelectedItem(item);
        // On smaller screens, open a modal for the detail view
        if (window.innerWidth < 1024) {
            setIsDetailModalOpen(true);
        }
    };

    const isFavorite = useMemo(() => {
        if (!selectedItem) return false;
        return favorites.some(fav => fav.id === selectedItem.id);
    }, [selectedItem, favorites]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full relative">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} view="forge" />}

            <div className="lg:col-span-3 h-full">
                <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onGenerate={handleGenerate}
                    onReset={handleResetFilters}
                    isLoading={isLoading}
                    aiFlags={aiFlags}
                    onAIFlagChange={handleAIFlagChange}
                />
            </div>
            <div className="lg:col-span-5 h-full">
                <ResultsPanel
                    history={history}
                    selectedItem={selectedItem}
                    onSelect={handleSelect}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onGenerateVariant={() => {}} // Placeholder for now
                    isLoading={isLoading}
                    activeFilters={filters}
                />
            </div>
            <div className="hidden lg:block lg:col-span-4 h-full">
                <DetailPanel
                    item={selectedItem}
                    onGenerateVariant={() => {}} // Placeholder for now
                    isFavorite={isFavorite}
                    onToggleFavorite={selectedItem ? () => handleToggleFavorite(selectedItem) : () => {}}
                    onUpdate={handleUpdateItem}
                />
            </div>
            <DetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                item={selectedItem}
                isFavorite={isFavorite}
                onToggleFavorite={selectedItem ? () => handleToggleFavorite(selectedItem) : () => {}}
                onUpdate={handleUpdateItem}
                onGenerateVariant={() => {}}
            />
            <ErrorDisplay message={error} onDismiss={() => setError(null)} activeView="forge" />
        </div>
    );
};