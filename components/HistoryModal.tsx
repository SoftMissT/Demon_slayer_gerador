import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';
import { KatanaIcon } from './icons/KatanaIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import type { HistoryItem, GeneratedItem, AlchemyHistoryItem, AppView } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  activeView: AppView;
}

const HistoryListItem: React.FC<{ item: HistoryItem, onSelect: (item: HistoryItem) => void, onDelete: (id: string) => void }> = ({ item, onSelect, onDelete }) => {
    const isForgeItem = 'categoria' in item;

    const handleClick = () => onSelect(item);
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(item.id);
    };

    const title = isForgeItem ? (item as GeneratedItem).nome : `Alquimia de Prompt`;
    const description = isForgeItem ? (item as GeneratedItem).descricao_curta : (item as AlchemyHistoryItem).inputs.basePrompt;
    const Icon = isForgeItem ? KatanaIcon : MagicWandIcon;

    return (
        <li
            onClick={handleClick}
            className="flex items-center gap-4 p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors group"
        >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-white truncate">{title}</p>
                <p className="text-sm text-gray-400 truncate">{description}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={handleDelete}>
                <TrashIcon className="w-4 h-4" />
            </Button>
        </li>
    );
};


export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClear,
  activeView,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Histórico de Atividade" panelClassName="!max-w-2xl">
      <div className="flex flex-col h-[70vh]">
        <div className="p-4 flex-shrink-0">
          {history.length > 0 && (
            <Button onClick={onClear} variant="danger" size="sm">
              <TrashIcon className="w-4 h-4" /> Limpar Histórico
            </Button>
          )}
        </div>
        <div className="flex-grow overflow-y-auto px-4">
          {history.length > 0 ? (
            <ul className="space-y-2">
                {history.map(item => (
                    <HistoryListItem key={item.id} item={item} onSelect={onSelect} onDelete={onDelete} />
                ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <p className="text-lg">Seu histórico está vazio.</p>
                <p className="mt-2">Itens gerados ou prompts destilados aparecerão aqui.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
