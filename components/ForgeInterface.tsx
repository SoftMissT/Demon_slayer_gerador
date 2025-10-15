import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailPanel } from './DetailPanel';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import type { GeneratedItem, FilterState, User, AIFlags, Category, Rarity } from '../types';
import { AuthOverlay } from './AuthOverlay';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { CollapsibleColumn } from './CollapsibleColumn';

const INITIAL_FILTERS: FilterState = {
    category: 'Aleatório',
    subCategory: 'Aleatório',
    hunterWeapon: 'Aleatório',
    quantity: 1,
    tematica: 'Aleatória',
    pais: 'Aleatório',
    origins: [],
    breathingStyles: [],
    professions: [],
    rarity: 'Aleatória',
    level: 10,
    suggestedPrice: 500,
    promptModifier: '',
    styleReferences: '',
    aiFocusGemini: '',
    aiFocusGpt: '',
    aiFocusDeepSeek: '',
    missionType: 'Aleatório',
    eventType: 'Aleatório',
    terrainType: 'Aleatório',
    kekkijutsuInspirations: [],
    weaponDamage: '',
    weaponEffects: '',
    characterClass: '',
    characterBackground: '',
};

const INITIAL_AI_FLAGS: AIFlags = {
    useGemini: true,
    useGpt: true,
    useDeepSeek: true,
};

const useIsMobile = (query: string = '(max-width: 1023px)') => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        // Set initial state
        listener();
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [query]);
    return matches;
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
    const [collapsedColumns, setCollapsedColumns] = useState({ left: false, middle: false, right: false });
    const [activeResultsTab, setActiveResultsTab] = useState<'history' | 'favorites'>('history');
    
    const isMobile = useIsMobile();
    const [mobileView, setMobileView] = useState<'filters' | 'results' | 'details'>('filters');

    const handleFilterChange = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);
    
    const handleAIFlagChange = useCallback((key: keyof AIFlags, value: boolean) => {
        setAIFlags(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setActiveResultsTab('history');
        try {
            const results: GeneratedItem[] = [];
            for (let i = 0; i < filters.quantity; i++) {
                const result = await orchestrateGeneration(filters, filters.promptModifier, aiFlags, user);
                results.push(result);
            }
            setHistory(prev => [...results, ...prev]);
            setSelectedItem(results[0]);
            if (isMobile) {
                setMobileView('results');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [filters, aiFlags, user, setHistory, setSelectedItem, isMobile]);
    
    const handleResetFilters = useCallback(() => {
        if (window.confirm('Tem certeza de que deseja resetar todos os filtros? Isso restaurará todas as opções para seus valores padrão.')) {
            setFilters(INITIAL_FILTERS);
            setAIFlags(INITIAL_AI_FLAGS);
        }
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

    const handleDeleteItem = useCallback((id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
        if (selectedItem?.id === id) {
            setSelectedItem(null);
        }
    }, [setHistory, selectedItem]);

    const handleClearHistory = useCallback(() => {
        if (window.confirm('Tem certeza de que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
            setHistory([]);
            setSelectedItem(null);
        }
    }, [setHistory, setSelectedItem]);

    const handleClearFavorites = useCallback(() => {
        if (window.confirm('Tem certeza de que deseja limpar todos os seus favoritos?')) {
            setFavorites([]);
        }
    }, [setFavorites]);
    
    const handleUpdateItem = useCallback((updatedItem: GeneratedItem) => {
        const updateList = (list: GeneratedItem[]) => list.map(item => item.id === updatedItem.id ? updatedItem : item);
        setHistory(prev => updateList(prev));
        setFavorites(prev => updateList(prev));
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    }, [setHistory, setFavorites, selectedItem, setSelectedItem]);
    
    const handleSelect = (item: GeneratedItem) => {
        setSelectedItem(item);
        if (isMobile) {
            setMobileView('details');
        }
    };
    
    const handleTabChange = useCallback((tab: 'history' | 'favorites') => {
        if (activeResultsTab !== tab) {
            setSelectedItem(null); 
        }
        setActiveResultsTab(tab);
    }, [activeResultsTab, setSelectedItem]);

    const activeList = useMemo(() => 
        activeResultsTab === 'favorites' ? favorites : history
    , [activeResultsTab, favorites, history]);

    const isFavorite = useMemo(() => {
        if (!selectedItem) return false;
        return favorites.some(fav => fav.id === selectedItem.id);
    }, [selectedItem, favorites]);

    const currentIndex = useMemo(() => 
        selectedItem ? activeList.findIndex(h => h.id === selectedItem.id) : -1
    , [selectedItem, activeList]);

    const hasNext = useMemo(() => 
        currentIndex !== -1 && currentIndex < activeList.length - 1
    , [currentIndex, activeList]);
    
    const hasPrevious = useMemo(() => 
        currentIndex > 0
    , [currentIndex]);

    const handleNavigateNext = useCallback(() => {
        if (hasNext) {
            setSelectedItem(activeList[currentIndex + 1]);
        }
    }, [hasNext, currentIndex, activeList, setSelectedItem]);

    const handleNavigatePrevious = useCallback(() => {
        if (hasPrevious) {
            setSelectedItem(activeList[currentIndex - 1]);
        }
    }, [hasPrevious, currentIndex, activeList, setSelectedItem]);

    const motionVariants = {
        hidden: { opacity: 0, x: -20, transition: { duration: 0.25 } },
        visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
        exit: { opacity: 0, x: 20, transition: { duration: 0.25 } },
    };

    const desktopLayout = (
        <div className="flex gap-4 h-full">
            <CollapsibleColumn
                isCollapsed={collapsedColumns.left}
                onToggle={() => setCollapsedColumns(p => ({ ...p, left: !p.left }))}
                position="left"
                className="basis-[22rem] flex-grow max-w-sm"
            >
                <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onGenerate={handleGenerate}
                    onReset={handleResetFilters}
                    isLoading={isLoading}
                    aiFlags={aiFlags}
                    onAIFlagChange={handleAIFlagChange}
                />
            </CollapsibleColumn>

            <CollapsibleColumn
                isCollapsed={collapsedColumns.middle}
                onToggle={() => setCollapsedColumns(p => ({ ...p, middle: !p.middle }))}
                position="middle"
                className="basis-1/2 flex-grow-[3] min-w-0"
            >
                <ResultsPanel
                    history={history}
                    selectedItem={selectedItem}
                    onSelect={handleSelect}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onDeleteItem={handleDeleteItem}
                    onClearHistory={handleClearHistory}
                    onClearFavorites={handleClearFavorites}
                    onGenerateVariant={() => {}}
                    isLoading={isLoading}
                    activeFilters={filters}
                    onNavigateNext={handleNavigateNext}
                    onNavigatePrevious={handleNavigatePrevious}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                    currentIndex={currentIndex}
                    totalItems={activeList.length}
                    activeTab={activeResultsTab}
                    onTabChange={handleTabChange}
                />
            </CollapsibleColumn>
            
            <CollapsibleColumn
                isCollapsed={collapsedColumns.right}
                onToggle={() => setCollapsedColumns(p => ({ ...p, right: !p.right }))}
                position="right"
                className="hidden lg:block basis-[28rem] flex-grow max-w-lg"
            >
                <DetailPanel
                    item={selectedItem}
                    onGenerateVariant={() => {}}
                    isFavorite={isFavorite}
                    onToggleFavorite={selectedItem ? () => handleToggleFavorite(selectedItem) : () => {}}
                    onUpdate={handleUpdateItem}
                    onNavigateNext={handleNavigateNext}
                    onNavigatePrevious={handleNavigatePrevious}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                />
            </CollapsibleColumn>
        </div>
    );

    const mobileLayout = (
        <div className="h-full w-full overflow-hidden relative">
            <AnimatePresence mode="wait">
                {mobileView === 'filters' && (
                    <motion.div key="filters" variants={motionVariants} initial="hidden" animate="visible" exit="exit" className="h-full">
                        <FilterPanel
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onGenerate={handleGenerate}
                            onReset={handleResetFilters}
                            isLoading={isLoading}
                            aiFlags={aiFlags}
                            onAIFlagChange={handleAIFlagChange}
                            isMobile={true}
                            onViewResults={() => setMobileView('results')}
                            historyCount={history.length}
                        />
                    </motion.div>
                )}
                {mobileView === 'results' && (
                    <motion.div key="results" variants={motionVariants} initial="hidden" animate="visible" exit="exit" className="h-full">
                        <ResultsPanel
                            history={history}
                            selectedItem={selectedItem}
                            onSelect={handleSelect}
                            favorites={favorites}
                            onToggleFavorite={handleToggleFavorite}
                            onDeleteItem={handleDeleteItem}
                            onClearHistory={handleClearHistory}
                            onClearFavorites={handleClearFavorites}
                            onGenerateVariant={() => {}}
                            isLoading={isLoading}
                            activeFilters={filters}
                            onNavigateNext={handleNavigateNext}
                            onNavigatePrevious={handleNavigatePrevious}
                            hasNext={hasNext}
                            hasPrevious={hasPrevious}
                            currentIndex={currentIndex}
                            totalItems={activeList.length}
                            activeTab={activeResultsTab}
                            onTabChange={handleTabChange}
                            isMobile={true}
                            onBackToFilters={() => setMobileView('filters')}
                        />
                    </motion.div>
                )}
                {mobileView === 'details' && selectedItem && (
                     <motion.div key="details" variants={motionVariants} initial="hidden" animate="visible" exit="exit" className="h-full">
                        <DetailPanel
                            item={selectedItem}
                            onGenerateVariant={() => {}}
                            isFavorite={isFavorite}
                            onToggleFavorite={selectedItem ? () => handleToggleFavorite(selectedItem) : () => {}}
                            onUpdate={handleUpdateItem}
                            onNavigateNext={handleNavigateNext}
                            onNavigatePrevious={handleNavigatePrevious}
                            hasNext={hasNext}
                            hasPrevious={hasPrevious}
                            isMobile={true}
                            onBackToResults={() => setMobileView('results')}
                        />
                     </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="h-full relative">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} view="forge" />}
            {isMobile ? mobileLayout : desktopLayout}
            <ErrorDisplay message={error} onDismiss={() => setError(null)} activeView="forge" />
        </div>
    );
};