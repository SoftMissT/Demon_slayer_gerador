import React from 'react';
import { Modal } from './ui/Modal';
import type { HistoryItem, GeneratedItem, AlchemyHistoryItem } from '../types';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
    activeView: 'forge' | 'prompt';
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
    isOpen,
    onClose,
    history,
    onSelect,
    onDelete,
    onClear,
    activeView
}) => {
    const renderHistoryItem = (item: HistoryItem) => {
        const isForgeItem = 'categoria' in item;

        // Defensive check for malformed AlchemyHistoryItem from older localStorage data
        if (!isForgeItem && !(item as AlchemyHistoryItem).inputs) {
            return (
                <li key={item.id} className="flex items-center justify-between p-3 bg-red-900/50 rounded-lg group">
                    <div className="text-left flex-grow min-w-0">
                        <p className="font-semibold text-red-300 truncate">Item de Histórico Inválido</p>
                        <p className="text-sm text-red-400 truncate mt-1">Este item pode estar corrompido.</p>
                    </div>
                    <Button variant="ghost" onClick={() => onDelete(item.id)} className="!p-2 flex-shrink-0 ml-4 opacity-100">
                        <TrashIcon className="w-5 h-5 text-red-500" />
                    </Button>
                </li>
            );
        }

        const name = isForgeItem ? (item as GeneratedItem).nome : `Prompt de ${new Date((item as AlchemyHistoryItem).createdAt).toLocaleTimeString()}`;
        const description = isForgeItem ? (item as GeneratedItem).descricao_curta : (item as AlchemyHistoryItem).inputs.basePrompt;

        return (
            <li key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg group">
                <button onClick={() => onSelect(item)} className="text-left flex-grow min-w-0">
                    <p className="font-semibold text-white truncate">{name}</p>
                    <p className="text-sm text-gray-400 truncate mt-1">{description}</p>
                </button>
                <Button variant="ghost" onClick={() => onDelete(item.id)} className="!p-2 flex-shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrashIcon className="w-5 h-5 text-red-500" />
                </Button>
            </li>
        );
    }
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Histórico - ${activeView === 'forge' ? 'Forja' : 'Alquimia'}`}
            variant="drawer-left"
        >
           <div className="p-4 h-full flex flex-col">
                {history.length > 0 ? (
                    <>
                        <ul className="space-y-2 flex-grow overflow-y-auto pr-2 -mr-2">
                            {history.map(renderHistoryItem)}
                        </ul>
                        <div className="mt-4 flex-shrink-0">
                            <Button variant="danger" size="sm" onClick={onClear} className="w-full">
                                Limpar Histórico
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
                        <p className="font-semibold">Histórico vazio.</p>
                        <p className="text-sm mt-1">Suas gerações recentes aparecerão aqui.</p>
                    </div>
                )}
           </div>
        </Modal>
    );
};