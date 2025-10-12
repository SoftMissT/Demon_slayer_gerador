import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedItem } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface ResultCardProps {
  item: GeneratedItem;
  isSelected: boolean;
  onSelect: (item: GeneratedItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
}

const VariantMenu: React.FC<{ onGenerate: (type: 'agressiva' | 'técnica' | 'defensiva') => void }> = ({ onGenerate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type: 'agressiva' | 'técnica' | 'defensiva') => {
    onGenerate(type);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsOpen(prev => !prev); }} className="!p-1.5">
        <DotsVerticalIcon className="w-5 h-5" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
          <ul>
            <li className="px-3 py-1 text-xs text-gray-400">Gerar Variante:</li>
            <li><button onClick={() => handleSelect('agressiva')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700">Agressiva</button></li>
            <li><button onClick={() => handleSelect('técnica')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700">Técnica</button></li>
            <li><button onClick={() => handleSelect('defensiva')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700">Defensiva</button></li>
          </ul>
        </div>
      )}
    </div>
  );
};


export const ResultCard: React.FC<ResultCardProps> = ({ item, isSelected, onSelect, isFavorite, onToggleFavorite, onGenerateVariant }) => {
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(item);
  };

  const handleGenerateVariant = (variantType: 'agressiva' | 'técnica' | 'defensiva') => {
    onGenerateVariant(item, variantType);
  };

  const cardClasses = `result-card cursor-pointer transition-all duration-200 border ${
    isSelected ? 'border-indigo-500 bg-gray-700/50' : 'border-gray-700 hover:border-indigo-600'
  }`;

  const itemName = ('title' in item && item.title) || item.nome;

  return (
    <Card onClick={() => onSelect(item)} className={`${cardClasses} !p-3 flex flex-col`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-grow overflow-hidden min-w-0">
          <p className="font-bold text-white" title={itemName}>{itemName}</p>
          <p className="text-sm text-indigo-400">{item.categoria} <span className="text-gray-500 text-xs">• {item.raridade}</span></p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleToggleFavorite} className="!p-1.5" aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
            <StarIcon className={`w-5 h-5 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`} filled={isFavorite} />
          </Button>
          <VariantMenu onGenerate={handleGenerateVariant} />
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-400 flex-grow">
        <p className="line-clamp-3">{item.descricao_curta}</p>
      </div>
    </Card>
  );
};