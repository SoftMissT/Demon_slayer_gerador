import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailPanel } from './DetailPanel';
import { FavoritesModal } from './FavoritesModal';
import { HistoryModal } from './HistoryModal';
import { DetailModal } from './DetailModal';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { Button } from './ui/Button';
import { FilterIcon } from './icons/FilterIcon';
import { Modal } from './ui/Modal';
import type { FilterState, GeneratedItem } from '../types';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import useLocalStorage from '../hooks/useLocalStorage';
import { DiscordIcon } from './icons/DiscordIcon';

interface ForgeInterfaceProps {
    isFavoritesOpen: boolean;
    onFavoritesClose: () => void;
    isHistoryOpen: boolean;
    onHistoryClose: () => void;
    onFavoritesCountChange: (count: number) => void;
    isAuthenticated: boolean;
    onLoginClick: () => void;
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

const AuthOverlay: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <h3 className="text-2xl font-bold font-gangofthree text-white mb-4">Acesso Restrito</h3>
        <p className="text-gray-300 mb-6">Por favor, entre com sua conta do Discord para usar a Forja.</p>
        <Button onClick={onLoginClick} className="!w-auto !flex-row !gap-2 !px-6 !py-3 !text-base">
            <DiscordIcon className="w-6 h-6" />
            Entrar com Discord
        </Button>
    </div>
);


export const ForgeInterface: React.FC<ForgeInterfaceProps> = ({ 
    isFavoritesOpen, onFavoritesClose, 
    isHistoryOpen, onHistoryClose, 
    onFavoritesCountChange, 
    isAuthenticated, onLoginClick
}) => {
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-favorites', []);
    const [history, setHistory] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-history', []);
    const { width } = useWindowSize();
    const isMobile = useMemo(() => (width || 0) < 1024, [width]);

    const [items, setItems] = useState<GeneratedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentAiFocus, setCurrentAiFocus] = useState<Record<string, string> | null>(null);
    const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    useEffect(() => {
        onFavoritesCountChange(favorites.length);
    }, [favorites, onFavoritesCountChange]);

    const handleGenerate = useCallback(async (filters: FilterState, count: number, promptModifier?: string) => {
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
        if (isMobile) setIsFilterPanelOpen(false);

        try {
            const promises = Array.from({ length: count }).map(() => 
                orchestrateGeneration(filters, promptModifier)
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
    }, [isMobile, setHistory, isAuthenticated, onLoginClick]);

    const handleSelectItem = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        if (isMobile) {
            setIsDetailModalOpen(true);
        }
    }, [isMobile]);

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
    }, [selectedItem, setFavorites, setHistory]);

    const handleGenerateVariant = useCallback(async (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }

        const modifier = `Gere uma variação deste item com um foco mais ${variantType}. Mantenha a essência, mas altere as mecânicas e a descrição para refletir a nova abordagem. Item base: ${item.nome} - ${item.descricao_curta}`;
        
        const filters: Partial<FilterState> = { category: item.categoria };
        if (item.categoria === 'Arma') {
            filters.weaponRarity = item.raridade;
        } else if (item.categoria === 'Acessório') {
            filters.accessoryRarity = item.raridade;
        }
        
        setIsLoading(true);
        setError(null);
        if (isMobile && isDetailModalOpen) setIsDetailModalOpen(false);

        try {
            const variant = await orchestrateGeneration(filters as FilterState, modifier);
            variant.nome = `${item.nome} (Variante ${variantType})`;
            
            setItems(prev => [variant, ...prev]);
            setSelectedItem(variant);
            setHistory(prev => [variant, ...prev]);

        } catch (err: any) {
            setError(err.message || 'Falha ao gerar variante.');
        } finally {
            setIsLoading(false);
        }
    }, [setHistory, isMobile, isDetailModalOpen, isAuthenticated, onLoginClick]);

    const handleDeleteFromHistory = useCallback((itemId: string) => {
        setHistory(prev => prev.filter(item => item.id !== itemId));
    }, [setHistory]);

    const handleClearHistory = useCallback(() => {
        setHistory([]);
        onHistoryClose();
    }, [setHistory, onHistoryClose]);

    const handleClearResults = useCallback(() => {
        setItems([]);
        setSelectedItem(null);
        setActiveFilters(null);
    }, []);

    const isFavorite = useMemo(() => {
        if (!selectedItem) return false;
        return favorites.some(fav => fav.id === selectedItem.id);
    }, [selectedItem, favorites]);

    return (
        <div className="forge-interface h-full relative">
             {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} />}
            <div className={`forge-layout-wrapper ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="forge-column-filters">
                    <FilterPanel 
                        onGenerate={handleGenerate} 
                        isLoading={isLoading}
                        isAuthenticated={isAuthenticated}
                        onLoginClick={onLoginClick}
                    />
                </div>

                <div className="forge-column-results">
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
                    <AnimatePresence>
                        {selectedItem && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex-shrink-0"
                            >
                                <DetailPanel
                                    item={selectedItem}
                                    onGenerateVariant={handleGenerateVariant}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={handleToggleFavorite}
                                    onUpdate={handleUpdateItem}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {isMobile && (
                <>
                    <Button onClick={() => setIsFilterPanelOpen(true)} className="fixed bottom-4 right-4 z-30 !rounded-full !p-4 shadow-lg" aria-label="Abrir Filtros">
                        <FilterIcon className="w-6 h-6" />
                    </Button>
                    <Modal isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} variant="drawer-left" title="Filtros da Forja">
                       <div className="p-4 h-full">
                           <FilterPanel 
                                onGenerate={handleGenerate} 
                                isLoading={isLoading} 
                                isAuthenticated={isAuthenticated}
                                onLoginClick={onLoginClick}
                           />
                        </div>
                    </Modal>
                    {selectedItem && (
                      <DetailModal
                          isOpen={isDetailModalOpen}
                          onClose={() => setIsDetailModalOpen(false)}
                          item={selectedItem}
                          onGenerateVariant={handleGenerateVariant}
                          isFavorite={isFavorite}
                          onToggleFavorite={handleToggleFavorite}
                          onUpdate={handleUpdateItem}
                      />
                    )}
                </>
            )}

            <FavoritesModal isOpen={isFavoritesOpen} onClose={onFavoritesClose} favorites={favorites} onSelect={(item) => { handleSelectItem(item); onFavoritesClose(); }} onToggleFavorite={handleToggleFavorite} />
            <HistoryModal isOpen={isHistoryOpen} onClose={onHistoryClose} history={history} onSelect={(item) => { handleSelectItem(item); onHistoryClose(); }} onDelete={handleDeleteFromHistory} onClear={handleClearHistory} />
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};