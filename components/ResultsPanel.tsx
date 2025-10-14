import React from 'react';
import type { GeneratedItem, FilterState } from '../types';
import { LazyResultCard } from './LazyResultCard';
import { ForgeLoadingIndicator } from './ForgeLoadingIndicator';
import { AnvilIcon } from './icons/AnvilIcon';
import { Button } from './ui/Button';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ResultsPanelProps {
  history: GeneratedItem[];
  selectedItem: GeneratedItem | null;
  onSelect: (item: GeneratedItem) => void;
  favorites: GeneratedItem[];
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isLoading: boolean;
  activeFilters: FilterState;
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  currentIndex: number;
  totalItems: number;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  history,
  selectedItem,
  onSelect,
  favorites,
  onToggleFavorite,
  onGenerateVariant,
  isLoading,
  activeFilters,
  onNavigateNext,
  onNavigatePrevious,
  hasNext,
  hasPrevious,
  currentIndex,
  totalItems,
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-800/30 rounded-lg">
      <div className="p-4 border-b border-gray-700 flex-shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white font-gangofthree">Resultados da Forja</h2>
          <p className="text-sm text-gray-400">Aqui estão suas criações. Clique para ver detalhes.</p>
        </div>
        {history.length > 0 && !isLoading && (
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
      <div className="flex-grow overflow-y-auto p-4 inner-scroll relative">
        {isLoading ? (
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
        ) : history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <AnvilIcon className="w-24 h-24 mx-auto opacity-50" />
              <p className="mt-4">A forja está fria.<br/>Use os filtros para criar algo novo.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {history.map(item => (
              <LazyResultCard
                key={item.id}
                item={item}
                isSelected={selectedItem?.id === item.id}
                onSelect={onSelect}
                isFavorite={favorites.some(fav => fav.id === item.id)}
                onToggleFavorite={onToggleFavorite}
                onGenerateVariant={onGenerateVariant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};