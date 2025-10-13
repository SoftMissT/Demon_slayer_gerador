import React, { useState, useEffect } from 'react';
import type { GeneratedItem, ProvenanceEntry, Kekkijutsu, GeneratedOni, GeneratedHunter, GeneratedWeapon } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StarIcon } from './icons/StarIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CopyIcon } from './icons/CopyIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SaveIcon } from './icons/SaveIcon';
import { buildPlainTextForItem } from '../lib/textFormatters';
import { Tooltip } from './ui/Tooltip';
import { TagIcon } from './icons/TagIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { TextArea } from './ui/TextArea';
import { TextInput } from './ui/TextInput';
// FIX: Imported ClipboardIcon to resolve reference error.
import { ClipboardIcon } from './icons/ClipboardIcon';

interface DetailPanelProps {
    item: GeneratedItem | null;
    onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
    isFavorite: boolean;
    onToggleFavorite: (item: GeneratedItem) => void;
    onUpdate: (item: GeneratedItem) => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-bold text-indigo-400 mb-2 font-gangofthree text-lg uppercase tracking-wider">{title}</h4>
        <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 text-gray-300">{children}</div>
    </div>
);

const ProvenanceItem: React.FC<{ entry: ProvenanceEntry }> = ({ entry }) => {
    let statusColor = 'text-gray-400';
    if (entry.status === 'success') statusColor = 'text-green-400';
    if (entry.status === 'failed') statusColor = 'text-red-400';

    return (
        <li className="flex items-center justify-between text-xs">
            <div>
                <span className="font-semibold">{entry.step}</span>
                <span className="text-gray-500"> ({entry.model})</span>
            </div>
            <span className={`font-mono capitalize ${statusColor}`}>{entry.status}</span>
        </li>
    );
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onGenerateVariant, isFavorite, onToggleFavorite, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableItem, setEditableItem] = useState<GeneratedItem | null>(item);
    const [copied, setCopied] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);

    useEffect(() => {
        setEditableItem(item);
        setIsEditing(false); 
    }, [item]);

    if (!item || !editableItem) {
        return (
            <div className="flex items-center justify-center h-full text-center text-gray-500 bg-gray-800/30 rounded-lg">
                 <div>
                    <img src="https://i.imgur.com/jGyL5aE.png" alt="Katana descansando" className="w-24 h-24 mx-auto opacity-50" />
                    <p className="mt-4">Selecione um item para ver seus segredos.</p>
                </div>
            </div>
        );
    }
    
    const handleFieldChange = (field: keyof GeneratedItem, value: any) => {
        setEditableItem(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSave = () => {
        if (editableItem) {
            onUpdate(editableItem);
        }
        setIsEditing(false);
    };

    const handleDownload = () => {
        const text = buildPlainTextForItem(item);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = (item.nome || item.title || 'item').replace(/[\s/]/g, '_');
        a.download = `${filename}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const handleCopy = () => {
        const text = buildPlainTextForItem(item);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyPrompt = () => {
        if (item.imagePromptDescription) {
            navigator.clipboard.writeText(item.imagePromptDescription);
            setCopiedPrompt(true);
            setTimeout(() => setCopiedPrompt(false), 2000);
        }
    }

    const currentName = ('title' in editableItem && editableItem.title) || editableItem.nome;
    
    return (
        <Card className="h-full flex flex-col bg-gray-800/30">
            <header className="p-4 border-b border-gray-700 flex justify-between items-start gap-4 flex-shrink-0">
                <div className="flex-grow">
                    {isEditing ? (
                         <TextInput label="" value={currentName} onChange={e => handleFieldChange('nome', e.target.value)} />
                    ) : (
                        <h2 className="text-2xl font-bold text-white font-gangofthree">{currentName}</h2>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1 flex-wrap">
                        <TagIcon className="w-4 h-4" />
                        <span>{item.categoria}</span>
                        {item.raridade && <><span>•</span><span>{item.raridade}</span></>}
                        {item.nivel_sugerido && <><span>•</span><span>Nível {item.nivel_sugerido}</span></>}
                    </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {isEditing ? (
                        <Tooltip text="Salvar Alterações">
                            <Button variant="primary" className="!p-2" onClick={handleSave}>
                                <SaveIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    ) : (
                         <Tooltip text="Editar Item">
                            <Button variant="ghost" className="!p-2" onClick={() => setIsEditing(true)}>
                                <PencilIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip text={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}>
                        <Button variant="ghost" className="!p-2" onClick={() => onToggleFavorite(item)}>
                            <StarIcon className={`w-5 h-5 ${isFavorite ? 'text-yellow-400' : ''}`} filled={isFavorite} />
                        </Button>
                    </Tooltip>
                </div>
            </header>
            <div className="flex-grow p-4 overflow-y-auto space-y-6 inner-scroll">
                <DetailSection title="Descrição Curta">
                    {isEditing ? <TextArea value={editableItem.descricao_curta} onChange={e => handleFieldChange('descricao_curta', e.target.value)} rows={3}/> : <p>{item.descricao_curta}</p>}
                </DetailSection>
                 <DetailSection title="Descrição Detalhada">
                    {isEditing ? <TextArea value={editableItem.descricao || ''} onChange={e => handleFieldChange('descricao', e.target.value)} rows={8}/> : <p>{item.descricao}</p>}
                </DetailSection>

                {item.ganchos_narrativos && (
                     <DetailSection title="Ganchos Narrativos">
                        {Array.isArray(item.ganchos_narrativos) ? (
                            <ul className="list-disc list-inside">{item.ganchos_narrativos.map((g, i) => <li key={i}>{g}</li>)}</ul>
                        ) : <p>{item.ganchos_narrativos}</p>}
                    </DetailSection>
                )}
                 {item.provenance && (
                    <DetailSection title="Proveniência da IA">
                        <ul className="space-y-1">
                            {item.provenance.map((p, i) => <ProvenanceItem key={i} entry={p} />)}
                        </ul>
                    </DetailSection>
                )}
            </div>
             <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                {item.imagePromptDescription && (
                    <div className="mb-4">
                        <label className="text-xs font-semibold text-gray-400 uppercase">PROMPT DE IMAGEM</label>
                        <div className="relative">
                             <p className="text-sm font-mono p-2 pr-10 bg-gray-900 rounded text-gray-300 mt-1">{item.imagePromptDescription}</p>
                             <Button variant="ghost" className="!p-1.5 absolute top-1/2 right-1.5 -translate-y-1/2" onClick={handleCopyPrompt}>
                                {copiedPrompt ? <ClipboardCheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                             </Button>
                        </div>
                    </div>
                )}
                <div className="flex justify-end items-center gap-2">
                    <Button variant="secondary" onClick={handleDownload}><DownloadIcon className="w-5 h-5"/> Baixar TXT</Button>
                    <Button variant="secondary" onClick={handleCopy}>
                        {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5"/>}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                </div>
            </footer>
        </Card>
    );
};