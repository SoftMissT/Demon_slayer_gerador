import React, { useState, useCallback } from 'react';
import type { User, GeneratedItem, FilterState, AIFlags } from '../types';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailPanel } from './DetailPanel';
import { DetailModal } from './DetailModal';
import { AuthOverlay } from './AuthOverlay';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import { INITIAL_FILTERS } from '../constants';
import { ErrorDisplay } from './ui/ErrorDisplay';

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
    user
}) => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [aiFlags, setAiFlags] = useState<AIFlags>({ useDeepSeek: true, useGemini: true, useGpt: true });


    const handleFilterChange = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleAiFlagChange = useCallback((key: keyof AIFlags, value: boolean) => {
        setAiFlags(prev => ({...prev, [key]: value}));
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    const handleGenerate = useCallback(async (promptModifier: string = '') => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const newItem = await orchestrateGeneration(filters, promptModifier, aiFlags, user);
            setHistory(prev => [newItem, ...prev]);
            setSelectedItem(newItem);
        } catch (err: any) {
            console.error("Generation failed:", err);
            setError(`ERRO NA GERAÇÃO|A combinação de filtros atual pode ter causado um problema. Tente simplificar a sua seleção ou alterar o tipo de geração.|${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [filters, user, isAuthenticated, onLoginClick, setHistory, setSelectedItem, aiFlags]);

    const handleGenerateVariant = useCallback(async (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        const modifier = `Gere uma variação **${variantType}** do seguinte item: ${item.nome}.`;
        const baseFilters = { ...INITIAL_FILTERS, category: item.categoria, styleReferences: filters.styleReferences };
        
        setIsLoading(true);
        setError(null);
        try {
            const newItem = await orchestrateGeneration(baseFilters, modifier, aiFlags, user);
            newItem.nome = `${item.nome} (Variante ${variantType})`;
            setHistory(prev => [newItem, ...prev]);
            setSelectedItem(newItem);
        } catch (err: any) {
             console.error("Variant generation failed:", err);
            setError(`ERRO NA GERAÇÃO DA VARIANTE|Não foi possível gerar a variante.|${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [user, setHistory, setSelectedItem, filters.styleReferences, aiFlags]);

    const handleToggleFavorite = useCallback((item: GeneratedItem) => {
        setFavorites(prev =>
            prev.some(fav => fav.id === item.id)
                ? prev.filter(fav => fav.id !== item.id)
                : [item, ...prev]
        );
    }, [setFavorites]);
    
    const handleSelectItem = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        if (window.innerWidth < 1024) { // lg breakpoint
            setIsDetailModalOpen(true);
        }
    }, [setSelectedItem]);
    
     const handleUpdateItem = (updatedItem: GeneratedItem) => {
        setHistory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        if (favorites.some(fav => fav.id === updatedItem.id)) {
            setFavorites(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        }
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full relative">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} view="forge" />}

            <div className="lg:col-span-3 h-full">
                <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onGenerate={() => handleGenerate()}
                    onReset={handleResetFilters}
                    isLoading={isLoading}
                    aiFlags={aiFlags}
                    onAiFlagChange={handleAiFlagChange}
                    setError={setError}
                />
            </div>
            
            <div className="lg:col-span-5 h-full">
                <ResultsPanel
                    history={history}
                    selectedItem={selectedItem}
                    onSelect={handleSelectItem}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onGenerateVariant={handleGenerateVariant}
                    isLoading={isLoading}
                    activeFilters={filters}
                />
            </div>

            <div className="hidden lg:block lg:col-span-4 h-full">
                 <DetailPanel
                    item={selectedItem}
                    onGenerateVariant={handleGenerateVariant}
                    isFavorite={selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false}
                    onToggleFavorite={selectedItem ? () => handleToggleFavorite(selectedItem) : () => {}}
                    onUpdate={handleUpdateItem}
                />
            </div>
            
             <DetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                item={selectedItem}
                onGenerateVariant={handleGenerateVariant}
                isFavorite={selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false}
                onToggleFavorite={selectedItem ? () => handleToggleFavorite(selectedItem) : () => {}}
                onUpdate={handleUpdateItem}
            />

            <ErrorDisplay message={error} onDismiss={() => setError(null)} activeView="forge" />
        </div>
    );
};