import React from 'react';
import { Modal } from './ui/Modal';
// FIX: Corrected type import from the now separate types.ts file.
import type { GeneratedItem } from '../types';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: GeneratedItem[];
  onSelect: (item: GeneratedItem) => void;
  onToggleFavorite: (item: GeneratedItem) => void;
}

const FavoritesModalComponent: React.FC<FavoritesModalProps> = ({ isOpen, onClose, favorites, onSelect, onToggleFavorite }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Itens Favoritos">
      <div className="max-h-[70vh] overflow-y-auto p-4 -m-6">
        {favorites.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Você ainda não favoritou nenhum item.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...favorites].reverse().map(item => (
              <div key={item.id} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between gap-4 transition-colors hover:bg-gray-600">
                <div className="flex-grow overflow-hidden">
                  <p className="font-bold truncate text-white">{('title' in item && item.title) || item.nome}</p>
                  <p className="text-sm text-indigo-400">{item.categoria}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="secondary" onClick={() => onSelect(item)}>Ver</Button>
                  <button 
                    onClick={() => onToggleFavorite(item)} 
                    className="p-2 text-yellow-400 hover:text-yellow-500 transition-colors"
                    title="Remover dos favoritos"
                  >
                    <StarIcon className="w-5 h-5" filled />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export const FavoritesModal = React.memo(FavoritesModalComponent);