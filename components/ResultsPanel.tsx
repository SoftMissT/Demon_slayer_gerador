
import React from 'react';
import type { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';
import { LoadingIndicator } from './LoadingIndicator';
import { SparklesIcon } from './icons/SparklesIcon';

interface ResultsPanelProps {
  items: GeneratedItem[];
  isLoading: boolean;
  selectedItem: GeneratedItem | null;
  onSelectItem: (item: GeneratedItem) => void;
  favorites: GeneratedItem[];
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ items, isLoading, selectedItem, onSelectItem, favorites, onToggleFavorite, onGenerateVariant }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-4 font-gangofthree">Resultados</h2>
      {isLoading && items.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <LoadingIndicator text="Forjando novas lendas..." />
        </div>
      ) : items.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 5V3m0 18v-2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M12 12a5 5 0 11-10 0 5 5 0 0110 0z" />
            </svg>
            <h3 className="font-semibold text-gray-400">Nenhum item forjado ainda.</h3>
            <p className="text-sm">Escolha seus filtros e acenda a forja.</p>
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
              onGenerateVariant={onGenerateVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
};
