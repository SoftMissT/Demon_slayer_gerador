import React, { useState } from 'react';
import { Modal } from './ui/Modal';
// FIX: Corrected type import from the now separate types.ts file.
import type { GeneratedItem } from '../types';
// FIX: Corrected import path for the text formatter utility.
import { buildPlainTextForItem } from '../lib/textFormatters';
import { Button } from './ui/Button';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { TrashIcon } from './icons/TrashIcon';
import { Tooltip } from './ui/Tooltip';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedItem[];
  onSelect: (item: GeneratedItem) => void;
  onDelete: (itemId: string) => void;
  onClear: () => void;
}

const ITEMS_PER_PAGE = 10;

const HistoryItem: React.FC<{
    item: GeneratedItem;
    onSelect: (item: GeneratedItem) => void;
    onDelete: (itemId: string) => void;
}> = ({ item, onSelect, onDelete }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const textToCopy = buildPlainTextForItem(item);
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(item.id);
    };
    
    const formattedDate = item.createdAt 
        ? new Date(item.createdAt).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'Data desconhecida';

    return (
        <div 
            className="bg-gray-700 p-3 rounded-lg flex items-center justify-between gap-4 transition-colors hover:bg-gray-600 cursor-pointer"
            onClick={() => onSelect(item)}
        >
            <div className="flex-grow overflow-hidden">
                {/* FIX: The check for 'title' in item is now type-safe due to updates in types.ts */}
                <p className="font-bold truncate text-white">{('title' in item && item.title) || item.nome || 'Item Sem Nome'}</p>
                <p className="text-xs text-indigo-400">{item.categoria} <span className="text-gray-500">• {formattedDate}</span></p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                 <Tooltip text={copied ? "Copiado!" : "Copiar Texto"}>
                    <Button variant="ghost" onClick={handleCopy} className="!p-2">
                         {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                    </Button>
                </Tooltip>
                 <Tooltip text="Deletar">
                    <Button variant="ghost" onClick={handleDelete} className="!p-2 text-gray-400 hover:!text-red-500">
                        <TrashIcon className="w-5 h-5" />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};


const HistoryModalComponent: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect, onDelete, onClear }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const reversedHistory = React.useMemo(() => [...history].reverse(), [history]);
  
  const pageCount = Math.ceil(reversedHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = reversedHistory.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );
  
  React.useEffect(() => {
      if (!isOpen) {
          setCurrentPage(1);
      }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Histórico de Gerações">
        <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">Salvo localmente neste navegador.</p>
            <Button variant="danger" onClick={onClear} disabled={history.length === 0}>
                Limpar Histórico
            </Button>
        </div>
      <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum item no histórico ainda.</p>
        ) : (
          paginatedHistory.map(item => (
            <HistoryItem 
                key={item.id} 
                item={item}
                onSelect={onSelect}
                onDelete={onDelete}
            />
          ))
        )}
      </div>
      {pageCount > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-gray-700">
              <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} size="sm">Anterior</Button>
              <span className="text-sm text-gray-400">
                  Página {currentPage} de {pageCount}
              </span>
              <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === pageCount} size="sm">Próxima</Button>
          </div>
      )}
    </Modal>
  );
};

export const HistoryModal = React.memo(HistoryModalComponent);