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
import { ClipboardIcon } from './icons/ClipboardIcon';
import { KatanaIcon } from './icons/KatanaIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface DetailPanelProps {
    item: GeneratedItem | null;
    onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
    isFavorite: boolean;
    onToggleFavorite: (item: GeneratedItem) => void;
    onUpdate: (item: GeneratedItem) => void;
    onNavigateNext: () => void;
    onNavigatePrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
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

const EditableField: React.FC<{
    isEditing: boolean;
    label: string;
    value: string | undefined;
    onChange: (value: string) => void;
    as?: 'input' | 'textarea';
}> = ({ isEditing, label, value, onChange, as = 'input' }) => (
    <div className="prose-p:!my-1">
        <p>
            <strong className="text-gray-400">{label}: </strong>
            {!isEditing ? (
                 <span className="text-white">{value || 'N/A'}</span>
            ) : as === 'input' ? (
                 <TextInput label="" value={value || ''} onChange={e => onChange(e.target.value)} className="!py-1 !px-2 !text-sm mt-1" />
            ) : (
                 <TextArea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} className="!py-1 !px-2 !text-sm mt-1" />
            )}
        </p>
    </div>
);


export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onGenerateVariant, isFavorite, onToggleFavorite, onUpdate, onNavigateNext, onNavigatePrevious, hasNext, hasPrevious }) => {
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
                    <KatanaIcon className="w-24 h-24 mx-auto opacity-50" />
                    <p className="mt-4">Selecione um item para ver seus segredos.</p>
                </div>
            </div>
        );
    }
    
    // FIX: Widened the type of 'field' from 'keyof GeneratedItem' to 'string' to allow updates to properties specific to item subtypes (e.g., 'dano' for GeneratedWeapon).
    // The component's logic ensures only valid properties are updated for the given item type.
    const handleFieldChange = (field: string, value: any) => {
        setEditableItem(prev => {
            if (!prev) return null;
            const updatedItem = { ...prev } as any;
            updatedItem[field] = value;
            return updatedItem;
        });
    };
    
    // FIX: Widened the type of 'parentField' to 'string' to allow updates on nested objects within specific item subtypes (e.g., 'kekkijutsu' for GeneratedOni).
    const handleNestedFieldChange = (parentField: string, childField: string, value: any) => {
        setEditableItem(prev => {
            if (!prev) return null;
            const updatedItem = { ...prev } as any;
            const parentObject = updatedItem[parentField] || {};
            updatedItem[parentField] = {
                ...parentObject,
                [childField]: value,
            };
            return updatedItem;
        });
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
    const weaponItem = editableItem as GeneratedWeapon;
    const hunterItem = editableItem as GeneratedHunter;
    const oniItem = editableItem as GeneratedOni;
    
    return (
        <Card className="h-full flex flex-col bg-gray-800/30">
            <header className="p-4 border-b border-gray-700 flex justify-between items-center gap-2 flex-shrink-0">
                 <Tooltip text="Item Anterior">
                    <div className="flex-shrink-0">
                        <Button variant="ghost" className="!p-2" onClick={onNavigatePrevious} disabled={!hasPrevious} aria-label="Item Anterior">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </Button>
                    </div>
                </Tooltip>

                <div className="flex-grow text-center min-w-0">
                    {isEditing ? (
                         <TextInput label="" value={currentName} onChange={e => handleFieldChange('nome', e.target.value)} />
                    ) : (
                        <h2 className="text-2xl font-bold text-white font-gangofthree truncate" title={currentName}>{currentName}</h2>
                    )}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-1 flex-wrap">
                        <TagIcon className="w-4 h-4" />
                        <span>{item.categoria}</span>
                        {item.raridade && <><span>•</span><span>{item.raridade}</span></>}
                        {item.nivel_sugerido && <><span>•</span><span>Nível {item.nivel_sugerido}</span></>}
                        {item.preco_sugerido && <><span>•</span><span>{new Intl.NumberFormat('pt-BR').format(item.preco_sugerido)} ryo</span></>}
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
                     <Tooltip text="Próximo Item">
                        <div className="flex-shrink-0">
                            <Button variant="ghost" className="!p-2" onClick={onNavigateNext} disabled={!hasNext} aria-label="Próximo Item">
                                <ChevronRightIcon className="w-6 h-6" />
                            </Button>
                        </div>
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

                {/* --- CATEGORY SPECIFIC SECTIONS --- */}
                {(item.categoria === 'Arma' || item.categoria === 'Acessório') && (
                    <DetailSection title="Mecânicas de Jogo">
                        <div className="space-y-2">
                           <EditableField isEditing={isEditing} label="Dano" value={weaponItem.dano} onChange={v => handleFieldChange('dano', v)} />
                           <EditableField isEditing={isEditing} label="Dados" value={weaponItem.dados} onChange={v => handleFieldChange('dados', v)} />
                           <EditableField isEditing={isEditing} label="Tipo de Dano" value={weaponItem.tipo_de_dano} onChange={v => handleFieldChange('tipo_de_dano', v)} />
                           <EditableField isEditing={isEditing} label="Status Aplicado" value={weaponItem.status_aplicado} onChange={v => handleFieldChange('status_aplicado', v)} />
                           <EditableField isEditing={isEditing} label="Efeitos Secundários" value={weaponItem.efeitos_secundarios} onChange={v => handleFieldChange('efeitos_secundarios', v)} as="textarea" />
                        </div>
                    </DetailSection>
                )}
                
                {(item.categoria === 'Caçador' || item.categoria === 'NPC') && (
                    <DetailSection title="Detalhes do Personagem">
                        <div className="space-y-2">
                            <EditableField isEditing={isEditing} label="Classe/Arquétipo" value={hunterItem.classe} onChange={v => handleFieldChange('classe', v)} />
                            <EditableField isEditing={isEditing} label="Personalidade" value={hunterItem.personalidade} onChange={v => handleFieldChange('personalidade', v)} as="textarea" />
                            <EditableField isEditing={isEditing} label="Background" value={hunterItem.background} onChange={v => handleFieldChange('background', v)} as="textarea" />
                        </div>
                    </DetailSection>
                )}

                {item.categoria === 'Inimigo/Oni' && (
                    <DetailSection title="Detalhes do Oni">
                        <div className="space-y-2">
                            <EditableField isEditing={isEditing} label="Nível de Poder" value={oniItem.power_level} onChange={v => handleFieldChange('power_level', v)} />
                            {oniItem.kekkijutsu && (
                                <div className="p-2 border border-gray-700 rounded-md">
                                    <h5 className="font-semibold text-sm text-indigo-300 mb-1">Kekkijutsu</h5>
                                    <EditableField isEditing={isEditing} label="Nome" value={oniItem.kekkijutsu.nome} onChange={v => handleNestedFieldChange('kekkijutsu', 'nome', v)} />
                                    <EditableField isEditing={isEditing} label="Descrição" value={oniItem.kekkijutsu.descricao} onChange={v => handleNestedFieldChange('kekkijutsu', 'descricao', v)} as="textarea" />
                                </div>
                            )}
                             {oniItem.comportamento_combate && (
                                <div>
                                    <strong className="text-gray-400">Comportamento em Combate:</strong>
                                    {isEditing ? (
                                        <TextArea
                                            value={Array.isArray(oniItem.comportamento_combate) ? oniItem.comportamento_combate.join('\n') : (oniItem.comportamento_combate || '')}
                                            onChange={e => handleFieldChange('comportamento_combate', e.target.value.split('\n'))}
                                            rows={4}
                                            className="!py-1 !px-2 !text-sm mt-1"
                                            placeholder="Um comportamento por linha"
                                        />
                                    ) : (
                                        Array.isArray(oniItem.comportamento_combate) ? (
                                            <ul className="list-disc list-inside mt-1">
                                                {oniItem.comportamento_combate.map((b, i) => <li key={i}>{b}</li>)}
                                            </ul>
                                        ) : <p>{oniItem.comportamento_combate}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </DetailSection>
                )}
                {/* --- END OF CATEGORY SPECIFIC SECTIONS --- */}


                {item.ganchos_narrativos && (
                     <DetailSection title="Ganchos Narrativos">
                        {isEditing ? (
                             <TextArea
                                value={Array.isArray(editableItem.ganchos_narrativos) ? editableItem.ganchos_narrativos.join('\n') : (editableItem.ganchos_narrativos || '')}
                                onChange={e => handleFieldChange('ganchos_narrativos', e.target.value.split('\n'))}
                                rows={4}
                                placeholder="Um gancho por linha"
                            />
                        ) : (
                            Array.isArray(item.ganchos_narrativos) ? (
                                <ul className="list-disc list-inside">{item.ganchos_narrativos.map((g, i) => <li key={i}>{g}</li>)}</ul>
                            ) : <p>{item.ganchos_narrativos}</p>
                        )}
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