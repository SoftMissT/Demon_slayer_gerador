import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedItem } from '../types';
import { Card } from './ui/Card';
import { StarIcon } from './icons/StarIcon';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';

interface ResultCardProps {
  item: GeneratedItem;
  onSelect: (item: GeneratedItem) => void;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item, onSelect, isSelected, isFavorite, onToggleFavorite, onGenerateVariant }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const canHaveVariants = item.categoria !== 'Missão/Cenário' && item.categoria !== 'NPC';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(item);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  };

  const handleVariantClick = (e: React.MouseEvent, variant: 'agressiva' | 'técnica' | 'defensiva') => {
    e.stopPropagation();
    onGenerateVariant(item, variant);
    setMenuOpen(false);
  };

  // FIX: Added 'N/A' to the rarityColor map to satisfy the Rarity type.
  const rarityColor: { [key in GeneratedItem['raridade']]: string } = {
    'Aleatória': 'text-gray-400',
    'Comum': 'text-gray-400',
    'Incomum': 'text-green-400',
    'Raro': 'text-blue-400',
    'Épico': 'text-purple-400',
    'Lendário': 'text-yellow-400',
    'Amaldiçoado': 'text-red-500',
    'N/A': 'text-gray-400',
  };

  return (
    <Card 
      onClick={() => onSelect(item)} 
      className={`relative !p-3 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500' : 'hover:border-indigo-600'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-16">
          <h3 className="font-bold text-sm truncate text-white">{item.nome}</h3>
          <p className="text-xs text-gray-400">{item.categoria}</p>
        </div>
        
        <div className="absolute top-2 right-2 flex items-center gap-0">
          <button onClick={handleFavoriteClick} className="p-1 text-gray-500 hover:text-yellow-400 rounded-full" title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
              <StarIcon className="w-5 h-5" filled={isFavorite} />
          </button>
          
          {canHaveVariants && (
            <div ref={menuRef} className="relative">
              <button onClick={handleMenuToggle} className="p-1 text-gray-500 hover:text-white rounded-full" title="Gerar Variação">
                  <DotsVerticalIcon className="w-5 h-5" />
              </button>
              {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-10">
                      <ul className="py-1">
                          <li className="px-3 py-1 text-xs text-gray-400 font-semibold">Gerar Variação</li>
                          <li><button onClick={(e) => handleVariantClick(e, 'agressiva')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white rounded-sm">Agressiva</button></li>
                          <li><button onClick={(e) => handleVariantClick(e, 'técnica')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white rounded-sm">Técnica</button></li>
                          <li><button onClick={(e) => handleVariantClick(e, 'defensiva')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white rounded-sm">Defensiva</button></li>
                      </ul>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.descricao_curta}</p>
      <div className="mt-2 text-xs">
        <span className={rarityColor[item.raridade] || 'text-gray-400'}>{item.raridade}</span>
        <span className="text-gray-500"> • Nv. {item.nivel_sugerido}</span>
      </div>
    </Card>
  );
};