import React, { useState, useCallback } from 'react';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailPanel } from './DetailPanel';
import { AuthOverlay } from './AuthOverlay';
import { Button } from './ui/Button';
import { HammerIcon } from './icons/HammerIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { Checkbox } from './ui/Checkbox';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import type { User, GeneratedItem, FilterState, AIFlags } from '../types';
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
    user,
}) => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS as FilterState);
    const [promptModifier, setPromptModifier] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiFlags, setAiFlags] = useState<AIFlags>({ useGemini: true, useGpt: true, useDeepSeek: false });

    const handleUpdateItem = (updatedItem: GeneratedItem) => {
        setHistory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
        setFavorites(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };
    
    const handleToggleFavorite = useCallback((item: GeneratedItem) => {
        setFavorites(prev => {
            const isFav = prev.some(fav => fav.id === item.id);
            if (isFav) {
                return prev.filter(fav => fav.id !== item.id);
            } else {
                return [item, ...prev];
            }
        });
    }, [setFavorites]);

    const handleForgeClick = async () => {
        if (!filters.category) {
            setError('Por favor, selecione uma categoria para forjar.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const newItem = await orchestrateGeneration(filters, promptModifier, aiFlags, user);
            setHistory(prev => [newItem, ...prev]);
            setSelectedItem(newItem);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_420px] gap-4 h-full relative">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} view="forge" />}

            {/* Filter Panel */}
            <div className="hidden lg:flex flex-col h-full">
                <FilterPanel filters={filters} setFilters={setFilters} />
                <div className="p-4 border-t border-gray-700 space-y-3 flex-shrink-0 bg-gray-800">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <Checkbox label="Gemini" checked={aiFlags.useGemini} onChange={(e) => setAiFlags(f => ({...f, useGemini: e.target.checked}))} />
                        <Checkbox label="GPT-4o" checked={aiFlags.useGpt} onChange={(e) => setAiFlags(f => ({...f, useGpt: e.target.checked}))} />
                        <Checkbox label="DeepSeek" checked={aiFlags.useDeepSeek} onChange={(e) => setAiFlags(f => ({...f, useDeepSeek: e.target.checked}))} />
                    </div>
                    <Button onClick={handleForgeClick} disabled={isLoading || !filters.category} className="w-full forge-button">
                        <HammerIcon className="w-5 h-5" />
                        {isLoading ? 'Forjando...' : 'Forjar'}
                    </Button>
                </div>
            </div>

            {/* Results Panel */}
            <div className="h-full">
                <ResultsPanel
                    history={history}
                    selectedItem={selectedItem}
                    onSelect={setSelectedItem}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onGenerateVariant={() => {}} // Placeholder
                    isLoading={isLoading}
                    activeFilters={filters}
                />
            </div>

            {/* Detail Panel */}
            <div className="hidden xl:block h-full">
                <DetailPanel
                    item={selectedItem}
                    onGenerateVariant={() => {}} // Placeholder
                    isFavorite={selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false}
                    onToggleFavorite={handleToggleFavorite}
                    onUpdate={handleUpdateItem}
                />
            </div>

            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};
