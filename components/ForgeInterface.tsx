import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailPanel } from './DetailPanel';
import { DetailModal } from './DetailModal';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { Button } from './ui/Button';
import { FilterIcon } from './icons/FilterIcon';
import { Modal } from './ui/Modal';
import type { FilterState, GeneratedItem, User, AIFlags, Rarity } from '../types';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import { AuthOverlay } from './AuthOverlay';
import { KatanaIcon } from './icons/KatanaIcon';

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

const useWindowSize = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

const DetailPlaceholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700/50">
        <KatanaIcon className="w-24 h-24 mb-6 opacity-20 text-gray-500" />
        <h2 className="text-2xl font-bold font-gangofthree text-white">Vitrine</h2>
        <p className="text-gray-400 mt-2 max-w-md">Selecione um item forjado para ver seus detalhes aqui.</p>
    </div>
);

export const ForgeInterface: React.FC<ForgeInterfaceProps> = ({ 
    isAuthenticated, onLoginClick,
    history, setHistory,
    favorites, setFavorites,
    selectedItem, setSelectedItem,
    user,
}) => {
    const { width } = useWindowSize();
    const isDesktop = useMemo(() => (width || 0) >= 1024, [width]);

    const [items, setItems] = useState<GeneratedItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentAiFocus, setCurrentAiFocus] = useState<Record<string, string> | null>(null);
    const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    useEffect(() => {
        // This effect will select the first item when a new list is generated
        if (items.length > 0 && !selectedItem && !isLoading) {
             setSelectedItem(items[0]);
        }
    // This dependency array ensures it runs only when items list changes or loading stops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, isLoading]);


    const handleGenerate = useCallback(async (filters: FilterState, count: number, promptModifier: string, aiFlags: AIFlags) => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }

        setIsLoading(true);
        setError(null);
        setActiveFilters(filters);
        setCurrentAiFocus({
            aiFocusGemini: filters.aiFocusGemini,
            aiFocusGpt: filters.aiFocusGpt,
            aiFocusDeepSeek: filters.aiFocusDeepSeek,
        });

        setItems([]);
        setSelectedItem(null);
        if (!isDesktop) setIsFilterPanelOpen(false);

        try {
            const promises = Array.from({ length: count }).map(() => 
                orchestrateGeneration(filters, promptModifier, aiFlags, user)
            );
            const newItems = await Promise.all(promises);
            
            setItems(newItems);
            if (newItems.length > 0) {
                setSelectedItem(newItems[0]);
                setHistory(prev => [...newItems, ...prev].slice(0, 100));
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido durante a geração.');
        } finally {
            setIsLoading(false);
            setCurrentAiFocus(null);
        }
    }, [isDesktop, setHistory, isAuthenticated, onLoginClick, setSelectedItem, user]);

    const handleSelectItem = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
    }, [setSelectedItem]);

    const handleToggleFavorite = useCallback((itemToToggle: GeneratedItem) => {
        setFavorites(prev => {
            const isFav = prev.some(item => item.id === itemToToggle.id);
            if (isFav) {
                return prev.filter(item => item.id !== itemToToggle.id);
            } else {
                return [itemToToggle, ...prev];
            }
        });
    }, [setFavorites]);
    
    const handleUpdateItem = useCallback((updatedItem: GeneratedItem) => {
        const updateList = (list: GeneratedItem[]) => list.map(i => i.id === updatedItem.id ? updatedItem : i);
        setItems(updateList);
        setHistory(updateList);
        setFavorites(updateList);
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    }, [selectedItem, setFavorites, setHistory, setSelectedItem]);

    const handleGenerateVariant = useCallback(async (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }

        const modifier = `Gere uma variação deste item com um foco mais ${variantType}. Mantenha a essência, mas altere as mecânicas e a descrição para refletir a nova abordagem. Item base: ${item.nome} - ${item.descricao_curta}`;
        
        const filters: Partial<FilterState> = { category: item.categoria };
        if (item.categoria === 'Arma') {
            filters.weaponRarity = item.raridade as Rarity | '';
        } else if (item.categoria === 'Acessório') {
            filters.accessoryRarity = item.raridade as Rarity | '';
        }
        
        setIsLoading(true);
        setError(null);
        setSelectedItem(null);

        try {
            const variant = await orchestrateGeneration(filters as FilterState, modifier, { useDeepSeek: true, useGemini: true, useGpt: true }, user);
            variant.nome = `${item.nome} (Variante ${variantType})`;
            
            setItems(prev => [variant, ...prev]);
            setSelectedItem(variant);
            setHistory(prev => [variant, ...prev]);

        } catch (err: any) {
            setError(err.message || 'Falha ao gerar variante.');
        } finally {
            setIsLoading(false);
        }
    }, [setHistory, isAuthenticated, onLoginClick, setSelectedItem, user]);

    const handleClearResults = useCallback(() => {
        setItems([]);
        setSelectedItem(null);
        setActiveFilters(null);
    }, [setSelectedItem]);

    const isFavorite = useMemo(() => {
        if (!selectedItem) return false;
        return favorites.some(fav => fav.id === selectedItem.id);
    }, [selectedItem, favorites]);

    return (
        <div className="forge-interface h-full relative">
             {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} view="forge" />}
            <div className={`h-full ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                {isDesktop ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
                        {/* Column 1: Bigorna */}
                        <div className="h-full">
                            <FilterPanel 
                                onGenerate={handleGenerate} 
                                isLoading={isLoading}
                                isAuthenticated={isAuthenticated}
                                onLoginClick={onLoginClick}
                            />
                        </div>
                        {/* Column 2: Forjando */}
                        <div className="h-full">
                             <ResultsPanel
                                items={items}
                                isLoading={isLoading && items.length === 0}
                                selectedItem={selectedItem}
                                onSelectItem={handleSelectItem}
                                favorites={favorites}
                                onToggleFavorite={handleToggleFavorite}
                                onGenerateVariant={handleGenerateVariant}
                                onClearResults={handleClearResults}
                                aiFocus={currentAiFocus}
                                activeFilters={activeFilters}
                            />
                        </div>
                        {/* Column 3: Vitrine */}
                        <div className="h-full">
                            {selectedItem ? (
                                <DetailPanel
                                    item={selectedItem}
                                    onGenerateVariant={handleGenerateVariant}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={handleToggleFavorite}
                                    onUpdate={handleUpdateItem}
                                />
                            ) : (
                                <DetailPlaceholder />
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="h-full overflow-y-auto">
                            <ResultsPanel
                                items={items}
                                isLoading={isLoading && items.length === 0}
                                selectedItem={selectedItem}
                                onSelectItem={(item) => {
                                    setSelectedItem(item);
                                }}
                                favorites={favorites}
                                onToggleFavorite={handleToggleFavorite}
                                onGenerateVariant={handleGenerateVariant}
                                onClearResults={handleClearResults}
                                aiFocus={currentAiFocus}
                                activeFilters={activeFilters}
                            />
                        </div>
                        <Button onClick={() => setIsFilterPanelOpen(true)} className="fixed bottom-4 right-4 z-30 !rounded-full !p-4 shadow-lg" aria-label="Abrir Filtros">
                            <FilterIcon className="w-6 h-6" />
                        </Button>
                        <Modal isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} variant="drawer-left" title="BIGORNA">
                           <div className="p-4 h-full">
                               <FilterPanel 
                                    onGenerate={handleGenerate} 
                                    isLoading={isLoading}
                                    isAuthenticated={isAuthenticated}
                                    onLoginClick={onLoginClick}
                                />
                            </div>
                        </Modal>
                        <DetailModal
                            isOpen={!!selectedItem}
                            onClose={() => setSelectedItem(null)}
                            item={selectedItem}
                            onGenerateVariant={handleGenerateVariant}
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                            onUpdate={handleUpdateItem}
                        />
                    </>
                )}
            </div>
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};