import React from 'react';
import { Modal } from './ui/Modal';
import { StarIcon } from './icons/StarIcon';
import { KatanaIcon } from './icons/KatanaIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import type { FavoriteItem, GeneratedItem, AlchemyHistoryItem, AppView } from '../types';
import { Button } from './ui/Button';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onSelect: (item: FavoriteItem) => void;
  onToggleFavorite: (item: FavoriteItem) => void;
  activeView: AppView;
}


const FavoriteListItem: React.FC<{ item: FavoriteItem, onSelect: (item: FavoriteItem) => void, onToggleFavorite: (item: FavoriteItem) => void }> = ({ item, onSelect, onToggleFavorite }) => {
    const isForgeItem = 'categoria' in item;

    const handleClick = () => onSelect(item);
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(item);
    };

    let title = 'Favorito';
    let description = '[Favorito antigo]';
    let details = '';
    const Icon = isForgeItem ? KatanaIcon : MagicWandIcon;

    if (isForgeItem) {
        const forgeItem = item as GeneratedItem;
        title = forgeItem.nome;
        description = forgeItem.descricao_curta;
        details = `${forgeItem.categoria} • ${forgeItem.tematica || 'Geral'}`;
    } else {
        const alchemyItem = item as AlchemyHistoryItem;
        title = `Alquimia de Prompt`;
        description = alchemyItem.inputs?.basePrompt;
        details = `Gerou ${Object.keys(alchemyItem.outputs).length} prompt(s)`;
    }

    return (
        <li
            onClick={handleClick}
            className="flex items-start gap-4 p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors group"
        >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mt-1">
                <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-grow min-w-0">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-white truncate">{title}</p>
                        <p className="text-xs text-indigo-400">{details}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="!p-1 -mr-1" onClick={handleToggle}>
                        <StarIcon className="w-5 h-5 text-yellow-400" filled={true} />
                    </Button>
                </div>
                <p className="text-sm text-gray-400 truncate mt-1">{description}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
        </li>
    );
};

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelect,
  onToggleFavorite,
  activeView,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Itens Favoritos" panelClassName="!max-w-2xl">
      <div className="flex flex-col h-[70vh]">
        <div className="flex-grow overflow-y-auto p-2">
          {favorites.length > 0 ? (
             <ul className="space-y-1">
                {favorites.map(item => (
                    <FavoriteListItem key={item.id} item={item} onSelect={onSelect} onToggleFavorite={onToggleFavorite} />
                ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <p className="text-lg">Você não tem favoritos.</p>
                <p className="mt-2">Clique na estrela em um item para salvá-lo aqui.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
