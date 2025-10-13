
import React from 'react';
import type { GeneratedItem, FilterState } from '../types';
import { LazyResultCard } from './LazyResultCard';
import { ForgeLoadingIndicator } from './ForgeLoadingIndicator';
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
  aiFocus: Record<string, string> | null;
  activeFilters: FilterState | null;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  items,
  isLoading,
  selectedItem,
  onSelectItem,
  favorites,
  onToggleFavorite,
  onGenerateVariant,
  onClearResults,
  aiFocus,
}) => {
    
  const WelcomeState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-24 h-24 mb-6 opacity-30" />
        <h2 className="text-2xl font-bold font-gangofthree text-white">Bem-vindo à Forja</h2>
        <p className="text-gray-400 mt-2 max-w-md">Use os filtros no painel da Bigorna para começar a criar armas, inimigos, NPCs e mais. Suas criações aparecerão aqui.</p>
    </div>
  );
  
  return (
    <div className="results-panel h-full flex flex-col bg-gray-900/50 rounded-lg border border-gray-700/50">
       <div className="p-4 flex items-center justify-between border-b border-gray-700/50 flex-shrink-0">
            <h2 className="text-xl font-bold font-gangofthree text-white">Resultados da Forja</h2>
            {items.length > 0 && !isLoading && (
                 <Button variant="ghost" onClick={onClearResults} className="text-xs">
                    <TrashIcon className="w-4 h-4" /> Limpar
                </Button>
            )}
       </div>
       
       <div className="flex-grow p-4 overflow-y-auto inner-scroll">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <ForgeLoadingIndicator aiFocus={aiFocus} />
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {items.map(item => (
                        <LazyResultCard
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
            ) : (
                <WelcomeState />
            )}
       </div>
    </div>
  );
};
