import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { HistoryItem, GeneratedItem, AlchemyHistoryItem, AppView } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ForgeIcon } from './icons/ForgeIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { VirtualizedList } from './ui/VirtualizedList';
import { MidjourneyIcon } from './icons/MidjourneyIcon';
import { GptIcon } from './icons/GptIcon';
import { GeminiIcon } from './icons/GeminiIcon';
import { Tooltip } from './ui/Tooltip';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
    activeView: AppView;
}

const getRarityStyles = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
        case 'comum': return { color: '#9CA3AF', backgroundColor: 'rgba(107, 114, 128, 0.2)' }; // gray-400
        case 'incomum': return { color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.2)' }; // green-400
        case 'rara': return { color: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.2)' }; // blue-400
        case 'épica': return { color: '#C084FC', backgroundColor: 'rgba(192, 132, 252, 0.2)' }; // purple-400
        case 'lendária': return { color: '#FBBF24', backgroundColor: 'rgba(251, 191, 36, 0.2)' }; // amber-400
        default: return { color: '#9CA3AF', backgroundColor: 'rgba(107, 114, 128, 0.2)' };
    }
};

const HistoryListItem: React.FC<{ item: HistoryItem; onSelect: (item: HistoryItem) => void; onDelete: (id: string) => void; }> = ({ item, onSelect, onDelete }) => {
    const isForgeItem = 'categoria' in item;
    
    const name = isForgeItem 
        ? (item as GeneratedItem).nome || (item as GeneratedItem).title 
        : (item as AlchemyHistoryItem).inputs?.basePrompt || 'Item de Alquimia Antigo';

    const createdAt = new Date(item.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors group h-full">
            <button onClick={() => onSelect(item)} className="flex-grow text-left flex items-start gap-4 min-w-0 h-full">
                 <div className="flex-shrink-0 mt-1">
                    {isForgeItem ? <ForgeIcon className="w-5 h-5 text-indigo-400"/> : <MagicWandIcon className="w-5 h-5 text-purple-400"/>}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{name}</p>
                    
                    {isForgeItem ? (
                        <div className="flex items-center gap-2 text-xs mt-1 flex-wrap">
                            {(item as GeneratedItem).categoria && <span className="bg-gray-700/80 text-gray-300 px-1.5 py-0.5 rounded-md">{(item as GeneratedItem).categoria}</span>}
                            {(item as GeneratedItem).raridade && 
                                <span 
                                    className="font-medium px-1.5 py-0.5 rounded-md" 
                                    style={getRarityStyles((item as GeneratedItem).raridade)}
                                >
                                    {(item as GeneratedItem).raridade}
                                </span>}
                            {(item as GeneratedItem).nivel_sugerido && <span className="text-gray-400">Nível {(item as GeneratedItem).nivel_sugerido}</span>}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-gray-500">Prompts para:</span>
                            {(item as AlchemyHistoryItem).inputs?.generateFor?.midjourney && (
                                <Tooltip text="Midjourney" position="top">
                                    <MidjourneyIcon className="w-4 h-4 text-gray-400" />
                                </Tooltip>
                            )}
                            {(item as AlchemyHistoryItem).inputs?.generateFor?.gpt && (
                                <Tooltip text="GPT/DALL-E" position="top">
                                    <GptIcon className="w-4 h-4 text-gray-400" />
                                </Tooltip>
                            )}
                            {(item as AlchemyHistoryItem).inputs?.generateFor?.gemini && (
                                <Tooltip text="Gemini" position="top">
                                    <GeminiIcon className="w-4 h-4 text-gray-400" />
                                </Tooltip>
                            )}
                        </div>
                    )}

                </div>
            </button>
            <div className="flex-shrink-0 ml-4 flex items-center gap-2">
                <span className="text-xs text-gray-500 hidden sm:block">{createdAt}</span>
                <Button variant="ghost" className="!p-2 opacity-0 group-hover:opacity-100" onClick={() => onDelete(item.id)}>
                    <TrashIcon className="w-5 h-5 text-red-500" />
                </Button>
            </div>
        </div>
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
                    <div className="flex-grow p-2">
                        <VirtualizedList
                            items={history}
                            renderItem={(item) => <HistoryListItem item={item} onSelect={onSelect} onDelete={onDelete} />}
                            itemHeight={76}
                        />
                    </div>
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