import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GeneratedItem, FilterState } from '../types';
import { LazyResultCard } from './LazyResultCard';
import { ForgeLoadingIndicator } from './ForgeLoadingIndicator';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';
import { KatanaIcon } from './icons/KatanaIcon';
import { SparklesIcon } from './icons/SparklesIcon';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};


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
  activeFilters
}) => {
  if (isLoading) {
    return <ForgeLoadingIndicator aiFocus={aiFocus} activeFilters={activeFilters} />;
  }

  if (items.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <KatanaIcon className="w-24 h-24 mb-6 opacity-20 text-gray-500" />
            <h2 className="text-2xl font-bold font-gangofthree text-white">Bigorna Pronta</h2>
            <p className="text-gray-400 mt-2 max-w-md">Selecione seus filtros e clique em "Forjar" para começar a criar seus itens, personagens e histórias.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-2">
        <header className="flex justify-between items-center p-2 mb-2 flex-shrink-0">
            <h2 className="text-xl font-bold font-gangofthree text-white flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-indigo-400" />
                Resultados da Forja
            </h2>
            <Button variant="ghost" size="sm" onClick={onClearResults}>
                <TrashIcon className="w-4 h-4"/> Limpar
            </Button>
        </header>

        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 overflow-y-auto flex-grow inner-scroll"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <AnimatePresence>
            {items.map((item) => (
                <motion.div key={item.id} variants={itemVariants} layout>
                    <LazyResultCard
                        item={item}
                        isSelected={selectedItem?.id === item.id}
                        onSelect={onSelectItem}
                        isFavorite={favorites.some(fav => fav.id === item.id)}
                        onToggleFavorite={onToggleFavorite}
                        onGenerateVariant={onGenerateVariant}
                    />
                </motion.div>
            ))}
            </AnimatePresence>
        </motion.div>
    </div>
  );
};
