
import React from 'react';
import type { GeneratedItem } from '../types';
import { Card } from './ui/Card';
import { StarIcon } from './icons/StarIcon';

interface ResultCardProps {
  item: GeneratedItem;
  onSelect: (item: GeneratedItem) => void;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item, onSelect, isSelected, isFavorite, onToggleFavorite }) => {

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking favorite
    onToggleFavorite(item);
  };

  const rarityColor: { [key in GeneratedItem['raridade']]: string } = {
    'Comum': 'text-gray-400',
    'Incomum': 'text-green-400',
    'Raro': 'text-blue-400',
    'Épico': 'text-purple-400',
    'Lendário': 'text-yellow-400',
    'Amaldiçoado': 'text-red-500',
  };

  return (
    <Card 
      onClick={() => onSelect(item)} 
      className={`relative !p-3 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500' : 'hover:border-indigo-600'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-8">
          <h3 className="font-bold text-sm truncate text-white">{item.nome}</h3>
          <p className="text-xs text-gray-400">{item.categoria}</p>
        </div>
        <button onClick={handleFavoriteClick} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-yellow-400" title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            <StarIcon className="w-5 h-5" filled={isFavorite} />
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.descricao_curta}</p>
      <div className="mt-2 text-xs">
        <span className={rarityColor[item.raridade] || 'text-gray-400'}>{item.raridade}</span>
        <span className="text-gray-500"> • Nv. {item.nivel_sugerido}</span>
      </div>
    </Card>
  );
};
