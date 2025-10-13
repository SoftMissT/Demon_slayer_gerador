


import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedItem } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import { Tooltip } from './ui/Tooltip';

interface ResultCardProps {
  item: GeneratedItem;
  isSelected: boolean;
  onSelect: (item: GeneratedItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  item,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onGenerateVariant,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentName = ('title' in item && item.title) || item.nome;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleVariantClick = (variantType: 'agressiva' | 'técnica' | 'defensiva') => {
      onGenerateVariant(item, variantType);
      setMenuOpen(false);
  };
  
  // FIX: Corrected category name from 'Missão/Cenário' to 'Missões' to align with the defined types and fix a type error.
  const canGenerateVariant = item.categoria !== 'Missões' && item.categoria !== 'NPC' && item.categoria !== 'Evento' && item.categoria !== 'Local/Cenário';

  return (
    <Card 
        className={`result-card !p-3 flex flex-col justify-between group relative ${isSelected ? 'selected-card' : ''}`}
        onClick={() => onSelect(item)}
    >
        <div>
            <div className="flex justify-between items-start">
                <div className="flex-grow pr-4 min-w-0">
                    <h3 className="font-bold text-white truncate" title={currentName}>{currentName}</h3>
                    <p className="text-xs text-indigo-400 capitalize">{item.categoria}</p>
                </div>
                <div className="flex-shrink-0 relative">
                     <Tooltip text={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(item);
                            }}
                            className="p-1 text-gray-400 hover:text-yellow-400"
                            >
                            <StarIcon className="w-5 h-5" filled={isFavorite} />
                        </button>
                    </Tooltip>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                {item.descricao_curta}
            </p>
        </div>
        <div className="flex justify-between items-end mt-3">
            <span className="text-xs font-mono bg-gray-700/50 text-gray-400 px-2 py-1 rounded">
                Lvl {item.nivel_sugerido}
            </span>
            <div className="relative" ref={menuRef}>
                {canGenerateVariant && (
                    <Tooltip text="Gerar Variação">
                        <Button 
                            variant="ghost" 
                            className="!p-1 h-7 w-7" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(prev => !prev);
                            }}
                        >
                            <DotsVerticalIcon className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                )}
                {menuOpen && canGenerateVariant && (
                    <div className="absolute bottom-full right-0 mb-2 w-36 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10 py-1">
                        <button onClick={(e) => {e.stopPropagation(); handleVariantClick('agressiva')}} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Agressiva</button>
                        <button onClick={(e) => {e.stopPropagation(); handleVariantClick('técnica')}} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Técnica</button>
                        <button onClick={(e) => {e.stopPropagation(); handleVariantClick('defensiva')}} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Defensiva</button>
                    </div>
                )}
            </div>
        </div>
    </Card>
  );
};
