import React from 'react';
import type { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';

interface ResultsPanelProps {
  results: GeneratedItem[];
  onSelect: (item: GeneratedItem) => void;
  isLoading: boolean;
  selectedItemId?: string | null;
  isFavorite: (itemId: string) => boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  imageLoadingId?: string | null;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onSelect, isLoading, selectedItemId, isFavorite, onToggleFavorite, imageLoadingId }) => {
  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-indigo-400 flex-shrink-0 font-gangofthree">Resultados Gerados</h2>
      <div className="flex-grow overflow-y-auto pr-2 relative">
        {isLoading && results.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-800/80">
            <Spinner size="lg" />
            <p className="text-gray-400">Gerando inspiração...</p>
          </div>
        )}
        {!isLoading && results.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Seus resultados aparecerão aqui.</p>
          </div>
        )}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((item) => (
              <ResultCard 
                key={item.id} 
                item={item} 
                onSelect={onSelect} 
                isSelected={item.id === selectedItemId}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={onToggleFavorite}
                isImageLoading={imageLoadingId === item.id}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};