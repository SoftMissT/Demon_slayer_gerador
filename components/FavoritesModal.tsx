
import React from 'react';
import { Modal } from './ui/Modal';
import type { FavoriteItem, GeneratedItem, AlchemyHistoryItem } from '../types';
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

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose, favorites, onSelect, onToggleFavorite, activeView }) => {
    
    const renderFavoriteItem = (item: FavoriteItem) => {
        const isForgeItem = 'categoria' in item;
        const name = isForgeItem ? (item as GeneratedItem).nome : `Prompt de ${(item as AlchemyHistoryItem).createdAt}`;
        const description = isForgeItem ? (item as GeneratedItem).descricao_curta : (item as AlchemyHistoryItem).inputs.basePrompt;

        return (
            <li key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg">
                <button onClick={() => onSelect(item)} className="text-left flex-grow">
                    <p className="font-semibold text-white truncate">{name}</p>
                    <p className="text-sm text-gray-400 truncate mt-1">{description}</p>
                </button>
                <Button variant="ghost" onClick={() => onToggleFavorite(item)} className="!p-2 flex-shrink-0 ml-4">
                    <StarIcon className="w-5 h-5 text-yellow-400" filled />
                </Button>
            </li>
        );
    }
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Favoritos - ${activeView === 'forge' ? 'Forja' : 'Alquimia'}`}
            variant="drawer-left"
        >
           <div className="p-4 h-full flex flex-col">
                {favorites.length > 0 ? (
                    <ul className="space-y-2 flex-grow overflow-y-auto">
                        {favorites.map(renderFavoriteItem)}
                    </ul>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
                        <StarIcon className="w-12 h-12 mb-4" />
                        <p className="font-semibold">Nenhum favorito ainda.</p>
                        <p className="text-sm mt-1">Clique na estrela de um item para salvá-lo aqui.</p>
                    </div>
                )}
           </div>
        </Modal>
    );
};
