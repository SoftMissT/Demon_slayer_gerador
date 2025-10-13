import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailPanel } from './DetailPanel';
import { AuthOverlay } from './AuthOverlay';
import { INITIAL_FILTERS } from '../constants';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import type { User, GeneratedItem, FilterState } from '../types';
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
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promptModifier, setPromptModifier] = useState('');
    const [aiFlags, setAiFlags] = useState({ useDeepSeek: true, useGemini: true, useGpt: true });
    
    const handleGenerate = useCallback(async () => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }
        setIsGenerating(true);
        setError(null);
        try {
            const newItem = await orchestrateGeneration(filters, promptModifier, aiFlags, user);
            setHistory(prev => [newItem, ...prev]);
            setSelectedItem(newItem); // Select the new item automatically
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    }, [filters, promptModifier, user, setHistory, setSelectedItem, aiFlags, isAuthenticated, onLoginClick]);

    const handleToggleFavorite = useCallback((item: GeneratedItem) => {
        setFavorites(prev =>
            prev.some(fav => fav.id === item.id)
                ? prev.filter(fav => fav.id !== item.id)
                : [item, ...prev]
        );
    }, [setFavorites]);
    
    const handleUpdateItem = useCallback((updatedItem: GeneratedItem) => {
        const updateList = (list: GeneratedItem[]) => list.map(item => item.id === updatedItem.id ? updatedItem : item);
        setHistory(updateList);
        if (favorites.some(fav => fav.id === updatedItem.id)) {
            setFavorites(updateList);
        }
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    }, [setHistory, setFavorites, favorites, selectedItem, setSelectedItem]);

    const handleGenerateVariant = (item: GeneratedItem, variantType: string) => {
        console.log(`Generating ${variantType} variant for ${item.nome}`);
    };

    const handleClearResults = () => {
        // For now, this just clears the selection
        setSelectedItem(null);
    };

    if (!isAuthenticated) {
        return <AuthOverlay onLoginClick={onLoginClick} view="forge" />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 h-full">
            <div className="lg:col-span-3 h-full">
                <FilterPanel 
                    filters={filters} 
                    setFilters={setFilters} 
                    onGenerate={handleGenerate} 
                    isGenerating={isGenerating}
                    aiFlags={aiFlags}
                    setAiFlags={setAiFlags}
                />
            </div>
            <div className="lg:col-span-4 h-full">
                 <ResultsPanel
                    items={history}
                    isLoading={isGenerating}
                    selectedItem={selectedItem}
                    onSelectItem={setSelectedItem}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onGenerateVariant={handleGenerateVariant}
                    onClearResults={handleClearResults}
                    aiFocus={{
                        aiFocusDeepSeek: filters.aiFocusDeepSeek,
                        aiFocusGemini: filters.aiFocusGemini,
                        aiFocusGpt: filters.aiFocusGpt
                    }}
                    activeFilters={filters}
                />
            </div>
            <div className="lg:col-span-5 h-full">
                 <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            key={selectedItem.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <DetailPanel
                                item={selectedItem}
                                onGenerateVariant={handleGenerateVariant}
                                isFavorite={favorites.some(fav => fav.id === selectedItem.id)}
                                onToggleFavorite={handleToggleFavorite}
                                onUpdate={handleUpdateItem}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};
