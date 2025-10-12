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
import { generateContent } from '../services/geminiService';
import useLocalStorage from '../hooks/useLocalStorage';

interface ForgeInterfaceProps {
    isFavoritesOpen: boolean;
    onFavoritesClose: () => void;
    isHistoryOpen: boolean;
    onHistoryClose: () => void;
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

export const ForgeInterface: React.FC<ForgeInterfaceProps> = ({ isFavoritesOpen, onFavoritesClose, isHistoryOpen, onHistoryClose }) => {
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-favorites', []);
    const [history, setHistory] = useLocalStorage<GeneratedItem[]>('kimetsu-forge-history', []);
    const { width } = useWindowSize();
    const isMobile = useMemo(() => (width || 0) < 1024, [width]);

    const [items, setItems] = useState<GeneratedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentAiFocus, setCurrentAiFocus] = useState<Record<string, string> | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const handleGenerate = useCallback(async (filters: FilterState, count: number, promptModifier?: string) => {
        setIsLoading(true);
        setError(null);
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
            const newItems = await generateContent(filters, count, promptModifier);
            setItems(prev => [...newItems, ...prev]);
            if (newItems.length > 0) {
                setSelectedItem(newItems[0]);
                setHistory(prev => [...newItems, ...prev].slice(0, 100));
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
            setCurrentAiFocus(null);
        }
    }, [isMobile, setHistory]);

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
        const modifier = `Gere uma variação deste item com um foco mais ${variantType}. Mantenha a essência, mas altere as mecânicas e a descrição para refletir a nova abordagem. Item base: ${item.nome} - ${item.descricao_curta}`;
        
        // FIX: Object literal may only specify known properties, and 'raridade' does not exist in type 'Partial<FilterState>'.
        // The filter state was being constructed with an invalid `raridade` property. This has been corrected
        // to use the appropriate category-specific rarity properties (`weaponRarity` or `accessoryRarity`).
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
            const newItems = await generateContent(filters as FilterState, 1, modifier);
            if (newItems.length > 0) {
                const variant = { ...newItems[0], nome: `${item.nome} (Variante ${variantType})`};
                setItems(prev => [variant, ...prev]);
                setSelectedItem(variant);
                setHistory(prev => [variant, ...prev]);
            }
        } catch (err: any) {
            setError(err.message || 'Falha ao gerar variante.');
        } finally {
            setIsLoading(false);
        }
    }, [setHistory, isMobile, isDetailModalOpen]);

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
    }, []);

    const isFavorite = useMemo(() => {
        if (!selectedItem) return false;
        return favorites.some(fav => fav.id === selectedItem.id);
    }, [selectedItem, favorites]);

    return (
        <div className="forge-interface h-full relative">
            <div className="grid grid-cols-12 gap-6 h-full">
                {!isMobile && (
                    <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full">
                        <FilterPanel onGenerate={handleGenerate} isLoading={isLoading} />
                    </div>
                )}

                <div className="col-span-12 lg:col-span-8 xl:col-span-9 grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-12 xl:col-span-7 h-full">
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
                        />
                    </div>
                    {!isMobile && (
                         <div className="hidden xl:block xl:col-span-5 h-full">
                           <AnimatePresence>
                             {selectedItem && (
                               <motion.div
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -20 }}
                                 transition={{ duration: 0.3 }}
                                 className="h-full"
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
                    )}
                </div>
            </div>

            {isMobile && (
                <>
                    <Button onClick={() => setIsFilterPanelOpen(true)} className="fixed bottom-4 right-4 z-30 !rounded-full !p-4 shadow-lg" aria-label="Abrir Filtros">
                        <FilterIcon className="w-6 h-6" />
                    </Button>
                    <Modal isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} variant="drawer-left" title="Filtros da Forja">
                       <div className="p-4 h-full"><FilterPanel onGenerate={handleGenerate} isLoading={isLoading} /></div>
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