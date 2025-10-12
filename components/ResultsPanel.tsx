
import React from 'react';
import type { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';
import { ResultCardSkeleton } from './ResultCardSkeleton';
import { ForgeIcon } from './icons/ForgeIcon';
import { Button } from './ui/Button';

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

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  items,
  isLoading,
  selectedItem,
  onSelectItem,
  favorites,
  onToggleFavorite,
  onGenerateVariant,
  onClearResults
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-white font-gangofthree">Resultados da Forja</h2>
        {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearResults}>
                Limpar Resultados
            </Button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <ResultCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <ForgeIcon className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400">A forja está pronta.</h3>
            <p>Use os filtros para gerar seus itens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <ResultCard
                key={item.id}
                item={item}
                isSelected={selectedItem?.id === item.id}
                onSelect={onSelectItem}
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
