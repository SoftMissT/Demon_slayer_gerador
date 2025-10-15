import React, { useMemo, useState } from 'react';
import type { GeneratedItem, FilterState } from '../types';
import { LazyResultCard } from './LazyResultCard';
import { ForgeLoadingIndicator } from './ForgeLoadingIndicator';
import { AnvilIcon } from './icons/AnvilIcon';
import { Button } from './ui/Button';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { StarIcon } from './icons/StarIcon';
import { TrashIcon } from './icons/TrashIcon';
import { TextInput } from './ui/TextInput';
import { SearchIcon } from './icons/SearchIcon';

type ResultsTab = 'history' | 'favorites';

interface ResultsPanelProps {
  history: GeneratedItem[];
  selectedItem: GeneratedItem | null;
  onSelect: (item: GeneratedItem) => void;
  favorites: GeneratedItem[];
  onToggleFavorite: (item: GeneratedItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onClearFavorites: () => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isLoading: boolean;
  activeFilters: FilterState;
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  currentIndex: number;
  totalItems: number;
  activeTab: ResultsTab;
  onTabChange: (tab: ResultsTab) => void;
}

const TabButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    count: number;
}> = ({ label, icon, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
            isActive
                ? 'border-[var(--accent-primary)] text-white'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
        }`}
    >
        {icon}
        <span>{label}</span>
        <span className="text-xs bg-gray-700 text-gray-300 rounded-full px-2 py-0.5">{count}</span>
    </button>
);


export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  history,
  selectedItem,
  onSelect,
  favorites,
  onToggleFavorite,
  onDeleteItem,
  onClearHistory,
  onClearFavorites,
  onGenerateVariant,
  isLoading,
  activeFilters,
  onNavigateNext,
  onNavigatePrevious,
  hasNext,
  hasPrevious,
  currentIndex,
  totalItems,
  activeTab,
  onTabChange,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const activeList = activeTab === 'favorites' ? favorites : history;
    
    const filteredList = useMemo(() => {
        if (!searchTerm.trim()) {
            return activeList;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return activeList.filter(item => {
            const name = ('title' in item && item.title) || item.nome;
            return name.toLowerCase().includes(lowercasedFilter) ||
                   item.descricao_curta.toLowerCase().includes(lowercasedFilter);
        });
    }, [activeList, searchTerm]);

    const showEmptyState = !isLoading && filteredList.length === 0;

    const emptyStateMessages = {
      history: {
          icon: <AnvilIcon className="w-24 h-24 mx-auto opacity-50" />,
          title: "A forja está fria.",
          subtitle: "Use os filtros para criar algo novo."
      },
      favorites: {
          icon: <StarIcon className="w-24 h-24 mx-auto opacity-50" filled={false}/>,
          title: "Nenhum favorito ainda.",
          subtitle: "Clique na estrela em um item para guardá-lo aqui."
      }
    }
    const currentEmptyState = emptyStateMessages[activeTab];

    return (
        <div className="h-full flex flex-col bg-gray-800/30 rounded-lg">
            <div className="px-4 pt-4 border-b border-gray-700 flex-shrink-0 flex justify-between items-center flex-wrap gap-y-2">
                <div>
                    <h2 className="text-lg font-bold text-white font-gangofthree">Resultados da Forja</h2>
                    <p className="text-sm text-gray-400">Suas criações, histórico e favoritos.</p>
                </div>
                {totalItems > 0 && !isLoading && (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="!p-2" onClick={onNavigatePrevious} disabled={!hasPrevious} aria-label="Item Anterior">
                        <ChevronLeftIcon className="w-6 h-6" />
                        </Button>
                        <span className="font-mono text-sm text-gray-400">
                        {currentIndex + 1} / {totalItems}
                        </span>
                        <Button variant="ghost" className="!p-2" onClick={onNavigateNext} disabled={!hasNext} aria-label="Próximo Item">
                        <ChevronRightIcon className="w-6 h-6" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="px-4 border-b border-gray-700 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TabButton
                        label="Histórico"
                        icon={<HistoryIcon className="w-5 h-5" />}
                        isActive={activeTab === 'history'}
                        onClick={() => onTabChange('history')}
                        count={history.length}
                    />
                    <TabButton
                        label="Favoritos"
                        icon={<StarIcon className="w-5 h-5" />}
                        isActive={activeTab === 'favorites'}
                        onClick={() => onTabChange('favorites')}
                        count={favorites.length}
                    />
                </div>
                {activeTab === 'history' && history.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClearHistory} disabled={isLoading}>
                        <TrashIcon className="w-4 h-4" /> Limpar Histórico
                    </Button>
                )}
                {activeTab === 'favorites' && favorites.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClearFavorites} disabled={isLoading}>
                        <TrashIcon className="w-4 h-4" /> Limpar Favoritos
                    </Button>
                )}
            </div>

            <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <div className="relative">
                    <TextInput
                        label=""
                        placeholder={`Filtrar em ${activeTab === 'history' ? 'Histórico' : 'Favoritos'}...`}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="!pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 inner-scroll relative">
                {isLoading && activeTab === 'history' ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                        <ForgeLoadingIndicator 
                            activeFilters={activeFilters} 
                            aiFocus={{
                                aiFocusGemini: activeFilters.aiFocusGemini,
                                aiFocusGpt: activeFilters.aiFocusGpt,
                                aiFocusDeepSeek: activeFilters.aiFocusDeepSeek
                            }}
                        />
                    </div>
                ) : showEmptyState ? (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <div>
                        {searchTerm ? (
                            <>
                                <SearchIcon className="w-24 h-24 mx-auto opacity-50" />
                                <p className="mt-4 text-lg font-semibold text-white">Nenhum resultado encontrado</p>
                                <p className="mt-1">Tente uma busca diferente para "{searchTerm}".</p>
                            </>
                        ) : (
                            <>
                                {currentEmptyState.icon}
                                <p className="mt-4 text-lg font-semibold text-white">{currentEmptyState.title}</p>
                                <p className="mt-1">{currentEmptyState.subtitle}</p>
                            </>
                        )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredList.map(item => (
                            <LazyResultCard
                                key={item.id}
                                item={item}
                                isSelected={selectedItem?.id === item.id}
                                onSelect={onSelect}
                                isFavorite={favorites.some(fav => fav.id === item.id)}
                                onToggleFavorite={onToggleFavorite}
                                onGenerateVariant={onGenerateVariant}
                                onDelete={activeTab === 'history' ? onDeleteItem : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};