import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailModal } from './DetailModal';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { Button } from './ui/Button';
import { FilterIcon } from './icons/FilterIcon';
import { Modal } from './ui/Modal';
import type { FilterState, GeneratedItem, User, AIFlags, Rarity } from '../types';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { AuthOverlay } from './AuthOverlay';

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

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(false);

    useEffect(() => {
      if (selectedItem && !isDetailModalOpen) {
          setIsDetailModalOpen(true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem]);

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

        if (count === 1) {
            setItems([]);
        }
        setSelectedItem(null);
        if (!isDesktop) setIsFilterPanelOpen(false);

        try {
            const promises = Array.from({ length: count }).map(() => 
                orchestrateGeneration(filters, promptModifier, aiFlags, user)
            );
            const newItems = await Promise.all(promises);
            
            setItems(prev => [...newItems, ...prev]);
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
            // FIX: Cast `item.raridade` to `Rarity | ''` to resolve a type mismatch.
            // The `GeneratedItem` type allows `raridade` to be a generic string,
            // while `FilterState` requires a more specific rarity type.
            filters.weaponRarity = item.raridade as Rarity | '';
        } else if (item.categoria === 'Acessório') {
            // FIX: Cast `item.raridade` to `Rarity | ''` to resolve a type mismatch.
            // The `GeneratedItem` type allows `raridade` to be a generic string,
            // while `FilterState` requires a more specific rarity type.
            filters.accessoryRarity = item.raridade as Rarity | '';
        }
        
        setIsLoading(true);
        setError(null);
        if (isDetailModalOpen) setIsDetailModalOpen(false);
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
    }, [setHistory, isDetailModalOpen, isAuthenticated, onLoginClick, setSelectedItem, user]);

    const handleClearResults = useCallback(() => {
        setItems([]);
        setSelectedItem(null);
        setActiveFilters(null);
    }, [setSelectedItem]);

    const isFavorite = useMemo(() => {
        if (!selectedItem) return false;
        return favorites.some(fav => fav.id === selectedItem.id);
    }, [selectedItem, favorites]);

    const resultsPanelContent = (
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
    );
    const filterPanelContent = (
        <FilterPanel 
            onGenerate={handleGenerate} 
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            onLoginClick={onLoginClick}
        />
    );


    return (
        <div className="forge-interface h-full relative">
             {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} />}
            <div className={`h-full ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                {isDesktop ? (
                    <div className="flex h-full gap-2">
                        <motion.div
                            animate={{ 
                                width: isFilterPanelCollapsed ? 0 : 'clamp(480px, 33vw, 620px)',
                                marginRight: isFilterPanelCollapsed ? 0 : -8 // to hide the gap
                            }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="flex-shrink-0 h-full overflow-hidden"
                        >
                            <div style={{ width: 'clamp(480px, 33vw, 620px)' }} className="h-full">
                                {filterPanelContent}
                            </div>
                        </motion.div>
                        
                        <div className="flex-grow flex min-w-0 h-full">
                             <Button
                                variant="secondary"
                                onClick={() => setIsFilterPanelCollapsed(!isFilterPanelCollapsed)}
                                className="!p-2 h-12 self-center -ml-3 z-20"
                                title={isFilterPanelCollapsed ? "Mostrar Filtros" : "Ocultar Filtros"}
                                aria-expanded={!isFilterPanelCollapsed}
                            >
                                {isFilterPanelCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
                            </Button>
                            <div className="flex-grow min-w-0 h-full overflow-y-auto ml-2">
                                {resultsPanelContent}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="h-full overflow-y-auto">
                            {resultsPanelContent}
                        </div>
                        <Button onClick={() => setIsFilterPanelOpen(true)} className="fixed bottom-4 right-4 z-30 !rounded-full !p-4 shadow-lg" aria-label="Abrir Filtros">
                            <FilterIcon className="w-6 h-6" />
                        </Button>
                        <Modal isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} variant="drawer-left" title="BIGORNA">
                           <div className="p-4 h-full">
                               {filterPanelContent}
                            </div>
                        </Modal>
                    </>
                )}
            </div>

            <DetailModal
                isOpen={isDetailModalOpen}
                onClose={() => { setIsDetailModalOpen(false); setSelectedItem(null); }}
                item={selectedItem}
                onGenerateVariant={handleGenerateVariant}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onUpdate={handleUpdateItem}
            />
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};
