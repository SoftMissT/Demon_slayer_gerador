import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { HistoryItem, GeneratedItem, AlchemyHistoryItem, AppView } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ForgeIcon } from './icons/ForgeIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
    activeView: AppView;
}

const HistoryListItem: React.FC<{ item: HistoryItem; onSelect: (item: HistoryItem) => void; onDelete: (id: string) => void; }> = ({ item, onSelect, onDelete }) => {
    const isForgeItem = 'categoria' in item;
    const alchemyItem = item as AlchemyHistoryItem;
    const name = isForgeItem 
        ? (item as GeneratedItem).nome || (item as GeneratedItem).title 
        : (alchemyItem.inputs ? alchemyItem.inputs.basePrompt : 'Item de Alquimia Antigo');
    // FIX: Added defensive check for alchemyItem.outputs to prevent crashes with old localStorage data.
    const description = isForgeItem 
        ? (item as GeneratedItem).descricao_curta 
        : (alchemyItem.outputs ? Object.values(alchemyItem.outputs).filter(Boolean).join(' | ') : 'Prompt não gerado');
    const createdAt = new Date(item.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    return (
        <li className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors group">
            <button onClick={() => onSelect(item)} className="flex-grow text-left flex items-start gap-4 min-w-0">
                 <div className="flex-shrink-0 mt-1">
                    {isForgeItem ? <ForgeIcon className="w-5 h-5 text-indigo-400"/> : <MagicWandIcon className="w-5 h-5 text-purple-400"/>}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{name}</p>
                    <p className="text-sm text-gray-400 truncate">{description}</p>
                </div>
            </button>
            <div className="flex-shrink-0 ml-4 flex items-center gap-2">
                <span className="text-xs text-gray-500 hidden sm:block">{createdAt}</span>
                <Button variant="ghost" className="!p-2 opacity-0 group-hover:opacity-100" onClick={() => onDelete(item.id)}>
                    <TrashIcon className="w-5 h-5 text-red-500" />
                </Button>
            </div>
        </li>
    );
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect, onDelete, onClear, activeView }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Histórico - ${activeView === 'forge' ? 'Forja' : 'Alquimia'}`} variant="drawer-left">
            <div className="flex flex-col h-full">
                {history.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-6">
                        <p>Nenhum item no histórico.</p>
                    </div>
                ) : (
                    <ul className="flex-grow overflow-y-auto p-2">
                        {history.map(item => (
                            <HistoryListItem key={item.id} item={item} onSelect={onSelect} onDelete={onDelete} />
                        ))}
                    </ul>
                )}
                 <div className="p-4 border-t border-gray-700">
                    <Button variant="danger" onClick={onClear} disabled={history.length === 0} className="w-full">
                        <TrashIcon className="w-5 h-5" />
                        Limpar Histórico
                    </Button>
                </div>
            </div>
        </Modal>
    );
};