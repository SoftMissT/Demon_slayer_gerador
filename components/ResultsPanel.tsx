
import React from 'react';
import type { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';
import { LoadingIndicator } from './LoadingIndicator';

interface ResultsPanelProps {
  items: GeneratedItem[];
  isLoading: boolean;
  selectedItem: GeneratedItem | null;
  onSelectItem: (item: GeneratedItem) => void;
  favorites: GeneratedItem[];
  onToggleFavorite: (item: GeneratedItem) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ items, isLoading, selectedItem, onSelectItem, favorites, onToggleFavorite }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-4 font-gangofthree">Resultados</h2>
      {isLoading && items.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <LoadingIndicator text="Forjando novas lendas..." />
        </div>
      ) : items.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Nenhum item gerado ainda. Use os filtros e clique em "Gerar".</p>
        </div>
      ) : (
        <div className="overflow-y-auto space-y-2 pr-2 flex-grow">
          {[...items].reverse().map((item) => (
            <ResultCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              isSelected={selectedItem?.id === item.id}
              isFavorite={favorites.some(fav => fav.id === item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};