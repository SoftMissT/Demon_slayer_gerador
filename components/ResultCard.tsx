import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GeneratedItem, Category } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import { Tooltip } from './ui/Tooltip';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { TrashIcon } from './icons/TrashIcon';
import { BookIcon } from './icons/BookIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { KatanaIcon } from './icons/KatanaIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SunIcon } from './icons/SunIcon';
import { UsersIcon } from './icons/UsersIcon';
import { HelpIcon } from './icons/HelpIcon';

interface ResultCardProps {
  item: GeneratedItem;
  isSelected: boolean;
  onSelect: (item: GeneratedItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  onDelete?: (id: string) => void;
}

const CategoryIcon: React.FC<{ category: Category; className?: string }> = ({ category, className = '' }) => {
    switch (category) {
        case 'Arma':
        case 'Acessório':
            return <KatanaIcon className={className} />;
        case 'Caçador':
        case 'NPC':
            return <UsersIcon className={className} />;
        case 'Inimigo/Oni':
        case 'Kekkijutsu':
        case 'Respiração':
            return <SparklesIcon className={className} />;
        case 'Missões':
            return <BookIcon className={className} />;
        case 'Evento':
            return <HistoryIcon className={className} />;
        case 'Local/Cenário':
            return <SunIcon className={className} />;
        case 'Aleatório':
        default:
            return <HelpIcon className={className} />;
    }
};

const getRarityStyles = (rarity: string): React.CSSProperties => {
    switch (rarity?.toLowerCase()) {
        case 'comum': return { color: '#E5E7EB', backgroundColor: 'rgba(107, 114, 128, 0.5)', border: '1px solid rgba(156, 163, 175, 0.5)' };
        case 'incomum': return { color: '#86EFAC', backgroundColor: 'rgba(34, 197, 94, 0.4)', border: '1px solid rgba(74, 222, 128, 0.5)' };
        case 'rara': return { color: '#93C5FD', backgroundColor: 'rgba(59, 130, 246, 0.4)', border: '1px solid rgba(96, 165, 250, 0.5)' };
        case 'épica': return { color: '#D8B4FE', backgroundColor: 'rgba(168, 85, 247, 0.4)', border: '1px solid rgba(192, 132, 252, 0.5)' };
        case 'lendária': return { color: '#FCD34D', backgroundColor: 'rgba(245, 158, 11, 0.4)', border: '1px solid rgba(251, 191, 36, 0.5)' };
        default: return { display: 'none' };
    }
};

export const ResultCard: React.FC<ResultCardProps> = ({
  item,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onGenerateVariant,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
  
  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.imagePromptDescription) {
        navigator.clipboard.writeText(item.imagePromptDescription);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    setMenuOpen(false);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
        onDelete(item.id);
    }
    setMenuOpen(false);
  }
  
  const canGenerateVariant = item.categoria !== 'Missões' && item.categoria !== 'NPC' && item.categoria !== 'Evento' && item.categoria !== 'Local/Cenário';
  const hasMenuOptions = canGenerateVariant || item.imagePromptDescription || onDelete;

  return (
    <Card 
        className={`result-card !p-0 flex flex-col justify-between group relative overflow-hidden h-full ${isSelected ? 'selected-card' : ''}`}
        onClick={() => onSelect(item)}
    >
        <div className="relative aspect-video w-full bg-gray-900/50 flex items-center justify-center border-b border-gray-700/50">
            <CategoryIcon category={item.categoria} className="w-12 h-12 text-gray-600 group-hover:text-[var(--accent-primary)] transition-colors duration-300" />
            <div className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm" style={getRarityStyles(item.raridade)}>
                {item.raridade}
            </div>
        </div>

        <div className="p-3 flex flex-col flex-grow justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div className="flex-grow pr-2 min-w-0">
                        <h3 className="font-bold text-white truncate" title={currentName}>{currentName}</h3>
                        <p className="text-xs text-indigo-400 capitalize">{item.categoria}</p>
                    </div>
                    <div className="flex-shrink-0 relative -mr-1">
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
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {item.descricao_curta}
                </p>
            </div>
            <div className="flex justify-between items-end mt-3">
                <span className="text-xs font-mono bg-gray-700/50 text-gray-400 px-2 py-1 rounded">
                    Lvl {item.nivel_sugerido}
                </span>
                <div className="relative" ref={menuRef}>
                    {hasMenuOptions && (
                        <Tooltip text="Mais Opções">
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
                    <AnimatePresence>
                    {menuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10 py-1 origin-bottom-right"
                        >
                            {canGenerateVariant && (
                                <>
                                    <button onClick={(e) => {e.stopPropagation(); handleVariantClick('agressiva')}} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Variação: Agressiva</button>
                                    <button onClick={(e) => {e.stopPropagation(); handleVariantClick('técnica')}} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Variação: Técnica</button>
                                    <button onClick={(e) => {e.stopPropagation(); handleVariantClick('defensiva')}} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Variação: Defensiva</button>
                                </>
                            )}
                            {(canGenerateVariant && item.imagePromptDescription) && <div className="my-1 border-t border-gray-700" />}
                            {item.imagePromptDescription && (
                                <button onClick={handleCopyPrompt} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">
                                    <ClipboardIcon className="w-4 h-4" /> {copied ? 'Copiado!' : 'Copiar Prompt'}
                                </button>
                            )}
                            {onDelete && (
                               <>
                                {(canGenerateVariant || item.imagePromptDescription) && <div className="my-1 border-t border-gray-700" />}
                                <button onClick={handleDeleteClick} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/50">
                                    <TrashIcon className="w-4 h-4" /> Deletar
                                </button>
                               </>
                            )}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    </Card>
  );
};