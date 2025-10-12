import React from 'react';
// FIX: Corrected type import from the now separate types.ts file.
import type { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';
import { ResultCardSkeleton } from './ResultCardSkeleton';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';

interface ResultsPanelProps {
  items: GeneratedItem[];
  isLoading: boolean;
  selectedItem: GeneratedItem | null;
  onSelectItem: (item: GeneratedItem) => void;
  favorites: GeneratedItem[];
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  onClearResults: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ items, isLoading, selectedItem, onSelectItem, favorites, onToggleFavorite, onGenerateVariant, onClearResults }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-lg md:text-xl font-bold text-white font-gangofthree">Resultados</h2>
        <Button
            variant="secondary"
            onClick={onClearResults}
            disabled={items.length === 0}
            className="text-xs !py-1 !px-2"
        >
            <TrashIcon className="w-4 h-4 mr-1" />
            Limpar Tudo
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 content-start">
            {/* Show skeleton loader at the top when loading a new item */}
            {isLoading && <ResultCardSkeleton />}

            {/* Render the list of generated items */}
            {items.length > 0 && 
                [...items].reverse().map((item) => (
                    <ResultCard
                      key={item.id}
                      item={item}
                      onSelect={onSelectItem}
                      isSelected={selectedItem?.id === item.id}
                      isFavorite={favorites.some(fav => fav.id === item.id)}
                      onToggleFavorite={onToggleFavorite}
                      onGenerateVariant={onGenerateVariant}
                    />
                ))
            }
        </div>

        {/* Show empty state only if not loading and no items exist */}
        {!isLoading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full pt-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 5V3m0 18v-2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M12 12a5 5 0 11-10 0 5 5 0 0110 0z" />
                </svg>
                <h3 className="font-semibold text-gray-400">Nenhum item forjado ainda.</h3>
                <p className="text-sm">Escolha seus filtros e acenda a forja.</p>
            </div>
        )}
      </div>
    </div>
  );
};