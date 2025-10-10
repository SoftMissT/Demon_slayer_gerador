
import React from 'react';
import type { GeneratedItem } from '../types';
import { StarIcon } from './icons/StarIcon';

interface ResultCardProps {
  item: GeneratedItem;
  onSelect: (item: GeneratedItem) => void;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item, onSelect, isSelected, isFavorite, onToggleFavorite }) => {
  const baseClasses = "p-3 rounded-lg cursor-pointer transition-all duration-200 border flex items-start gap-3";
  const selectedClasses = "bg-indigo-900/50 border-indigo-600";
  const unselectedClasses = "bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when favoriting
    onToggleFavorite(item);
  };

  return (
    <div className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`} onClick={() => onSelect(item)}>
      <div className="flex-grow overflow-hidden">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-md text-gray-100 truncate pr-2 font-gangofthree">{item.nome}</h3>
          <button 
            onClick={handleFavoriteClick} 
            className="text-gray-400 hover:text-yellow-400 transition-colors flex-shrink-0 -mr-1 -mt-1 p-1"
            title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          >
            <StarIcon className="w-5 h-5" filled={isFavorite} />
          </button>
        </div>

        <p className="text-sm text-indigo-400">{item.tipo} - {item.subcategoria}</p>
        <p className="text-sm text-gray-400 mt-1 italic truncate">{item.descricao_curta}</p>
      </div>
    </div>
  );
};