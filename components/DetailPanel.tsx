import React, { useState, useEffect } from 'react';
import type { GeneratedItem, ProvenanceEntry } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SaveIcon } from './icons/SaveIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { buildPlainTextForItem } from '../lib/textFormatters';
import { AnvilIcon } from './icons/AnvilIcon';

interface DetailPanelProps {
  item: GeneratedItem | null;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onUpdate: (item: GeneratedItem) => void;
}

const ProvenanceStep: React.FC<{ entry: ProvenanceEntry }> = ({ entry }) => {
    const statusClasses = {
        success: 'border-green-500/50 text-green-400',
        failed: 'border-red-500/50 text-red-400',
        skipped: 'border-gray-600/50 text-gray-500'
    };
    return (
        <div className={`p-2 border rounded-md text-xs ${statusClasses[entry.status]}`}>
            <p><strong>{entry.step} ({entry.model})</strong></p>
            <p>Status: <span className="font-semibold">{entry.status}</span></p>
            {entry.error && <p className="text-red-500 mt-1">Error: {entry.error}</p>}
            {entry.reason && <p className="text-gray-400 mt-1">Reason: {entry.reason}</p>}
        </div>
    );
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ item, isFavorite, onToggleFavorite, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState<GeneratedItem | null>(item);

    useEffect(() => {
        setEditedItem(item);
        setIsEditing(false); // Reset editing state when item changes
    }, [item]);

    const handleSave = () => {
        if (editedItem) {
            onUpdate(editedItem);
            setIsEditing(false);
        }
    };
    
    const handleDownload = () => {
        if (!item) return;
        const text = buildPlainTextForItem(item);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `${item.nome?.replace(/\s+/g, '_') || 'item'}.txt`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!item || !editedItem) {
        return (
             <div className="h-full flex flex-col items-center justify-center bg-gray-800/30 rounded-lg p-4 text-center text-gray-500">
                <AnvilIcon className="w-24 h-24 mx-auto opacity-50" />
                <p className="mt-4">Selecione um item para ver seus detalhes.</p>
            </div>
        );
    }

    const currentName = ('title' in item && item.title) || item.nome;

    return (
        <Card className="h-full flex flex-col !p-0">
            <header className="p-4 border-b border-gray-700 flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div className="flex-grow pr-4">
                        <h2 className="text-xl font-bold text-white font-gangofthree">{currentName}</h2>
                        <p className="text-sm text-indigo-400">{item.categoria} • {item.raridade}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                        {isEditing ? (
                            <Button onClick={handleSave} size="sm"><SaveIcon className="w-4 h-4" /> Salvar</Button>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} size="sm" variant="secondary"><PencilIcon className="w-4 h-4" /> Editar</Button>
                        )}
                        <Button onClick={() => onToggleFavorite(item)} variant="ghost" className="!p-2">
                            <StarIcon className="w-5 h-5" filled={isFavorite} />
                        </Button>
                    </div>
                </div>
            </header>
            <div className="flex-grow overflow-y-auto p-4 inner-scroll prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-headings:font-gangofthree prose-headings:text-indigo-400 prose-ul:list-disc prose-ul:pl-5">
                {isEditing ? (
                    <div className="space-y-4">
                        <textarea className="w-full bg-gray-900 rounded p-2 text-sm" rows={3} value={editedItem.descricao_curta} onChange={e => setEditedItem({...editedItem, descricao_curta: e.target.value})} />
                        <textarea className="w-full bg-gray-900 rounded p-2 text-sm" rows={10} value={editedItem.descricao} onChange={e => setEditedItem({...editedItem, descricao: e.target.value})} />
                    </div>
                ) : (
                    <>
                        <p className="italic text-gray-300">{item.descricao_curta}</p>
                        <h4>Descrição Completa</h4>
                        <p>{item.descricao}</p>
                        
                        {item.ganchos_narrativos && (
                            <>
                                <h4>Ganchos Narrativos</h4>
                                {Array.isArray(item.ganchos_narrativos) ? (
                                    <ul>{item.ganchos_narrativos.map((hook, i) => <li key={i}>{hook}</li>)}</ul>
                                ) : (
                                    <p>{item.ganchos_narrativos}</p>
                                )}
                            </>
                        )}
                        {item.imagePromptDescription && (
                            <>
                                <h4>Prompt de Imagem Sugerido</h4>
                                <code className="block bg-gray-900/50 p-2 rounded text-xs font-mono break-all">{item.imagePromptDescription}</code>
                            </>
                        )}
                    </>
                )}
            </div>
            <footer className="p-4 border-t border-gray-700 flex-shrink-0 space-y-3">
                 <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-gray-400">Processo de Geração</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {item.provenance.map((p, i) => <ProvenanceStep key={i} entry={p} />)}
                    </div>
                </div>
                <Button onClick={handleDownload} variant="secondary" className="w-full"><DownloadIcon className="w-5 h-5" /> Baixar como .txt</Button>
            </footer>
        </Card>
    );
};
