import React from 'react';
import { Modal } from './ui/Modal';
import type { GeneratedItem, AlchemyHistoryItem, FavoriteItem } from '../types';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onSelect: (item: FavoriteItem) => void;
  onToggleFavorite: (item: FavoriteItem) => void;
  activeView: 'forge' | 'prompt';
}

const FavoriteListItem: React.FC<{
    item: FavoriteItem;
    onSelect: (item: FavoriteItem) => void;
    onToggleFavorite: (item: FavoriteItem) => void;
}> = ({ item, onSelect, onToggleFavorite }) => {
    const isForgeItem = 'categoria' in item;
    const name = isForgeItem ? (('title' in item && item.title) || item.nome) : (item as AlchemyHistoryItem).inputs.basePrompt || 'Geração de Prompt';
    const type = isForgeItem ? (item as GeneratedItem).categoria : 'Alquimia';
    const typeColor = isForgeItem ? 'text-indigo-400' : 'text-purple-400';

    return (
        <div className="bg-gray-900/50 p-3 rounded-lg flex items-center justify-between gap-4 transition-all duration-200 hover:bg-gray-800/70 border border-gray-700 hover:border-indigo-500 hover:scale-105">
            <div className="flex-grow overflow-hidden">
                <p className="font-bold truncate text-white">{name}</p>
                <p className={`text-sm ${typeColor}`}>{type}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="secondary" size="sm" onClick={() => onSelect(item)}>Ver</Button>
                <button 
                    onClick={() => onToggleFavorite(item)} 
                    className="p-2 text-yellow-400 hover:text-yellow-500 transition-colors"
                    title="Remover dos favoritos"
                >
                    <StarIcon className="w-5 h-5" filled />
                </button>
            </div>
        </div>
    );
};

const FavoritesModalComponent: React.FC<FavoritesModalProps> = ({ isOpen, onClose, favorites, onSelect, onToggleFavorite }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="ITENS FAVORITOS"
      panelClassName="forge-panel !p-0"
    >
      <div className="max-h-[70vh] overflow-y-auto p-6">
        {favorites.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Você ainda não favoritou nenhum item.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...favorites].reverse().map(item => (
                <FavoriteListItem
                    key={item.id}
                    item={item}
                    onSelect={onSelect}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export const FavoritesModal = React.memo(FavoritesModalComponent);