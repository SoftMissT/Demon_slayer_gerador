
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { GeneratedItem, HunterItem, OniItem, NpcItem, WeaponItem, AccessoryItem, KekkijutsuItem, BreathingFormItem, MissionItemDetails, WorldBuildingItem, EventItem } from '../types';
import { AccordionSection } from './AccordionSection';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { HammerIcon } from './icons/HammerIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SaveIcon } from './icons/SaveIcon';
import { CopyIcon } from './icons/CopyIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { buildPlainTextForItem } from '../lib/textFormatters';
import { Tooltip } from './ui/Tooltip';

interface DetailPanelProps {
  item: GeneratedItem;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onUpdate: (item: GeneratedItem) => void;
}

const DetailField: React.FC<{ label: string, value?: string | number | string[] | null }> = ({ label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            {Array.isArray(value) ? (
                <ul className="list-disc list-inside">
                    {value.map((v, i) => <li key={i}>{v}</li>)}
                </ul>
            ) : (
                <p className="text-gray-200">{value}</p>
            )}
        </div>
    )
};


export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onGenerateVariant, isFavorite, onToggleFavorite, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(item.descricao);
    const [variantMenuOpen, setVariantMenuOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Ensure state is updated when the selected item changes
    useEffect(() => {
        setEditedDescription(item.descricao);
        setIsEditing(false); // Reset editing state
    }, [item]);


    const handleSave = () => {
        onUpdate({ ...item, descricao: editedDescription });
        setIsEditing(false);
    };

    const handleCopyText = () => {
        navigator.clipboard.writeText(buildPlainTextForItem(item));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };
    
    const handleVariantClick = (variant: 'agressiva' | 'técnica' | 'defensiva') => {
        onGenerateVariant(item, variant);
        setVariantMenuOpen(false);
    }
    
    const renderItemDetails = () => {
        switch (item.categoria) {
            case 'Arma':
            case 'Kekkijutsu':
                const weapon = item as WeaponItem | KekkijutsuItem;
                return <>
                    <DetailField label="Dano" value={weapon.dano} />
                    <DetailField label="Tipo de Dano" value={weapon.tipo_de_dano} />
                    <DetailField label="Status Aplicado" value={weapon.status_aplicado} />
                    <DetailField label="Efeitos Secundários" value={weapon.efeitos_secundarios} />
                </>;
            case 'Acessório':
                const accessory = item as AccessoryItem;
                return <>
                    <DetailField label="Efeitos Passivos" value={accessory.efeitos_passivos} />
                    <DetailField label="Efeitos Ativos" value={accessory.efeitos_ativos} />
                    <DetailField label="Condição de Ativação" value={accessory.condicao_ativacao} />
                </>;
            case 'Caçador':
                const hunter = item as HunterItem;
                return <>
                    <DetailField label="Classe" value={hunter.classe} />
                    <DetailField label="Personalidade" value={hunter.personalidade} />
                    <DetailField label="Background" value={hunter.background} />
                </>;
            case 'Inimigo/Oni':
                const oni = item as OniItem;
                return <>
                    <DetailField label="Nível de Poder" value={oni.power_level} />
                    <DetailField label="Comportamento em Combate" value={oni.comportamento_combate} />
                    <DetailField label="Fraquezas Únicas" value={oni.fraquezas_unicas} />
                </>
             case 'NPC':
                const npc = item as NpcItem;
                return <>
                    <DetailField label="Origem" value={npc.origem} />
                    <DetailField label="Motivação" value={npc.motivation} />
                    <DetailField label="Segredo" value={npc.secret} />
                </>
            default: return null;
        }
    }
    
    const currentName = ('title' in item && item.title) || item.nome;

    return (
    <div className="bg-gray-900/50 text-white h-full flex flex-col rounded-lg border border-gray-700/50">
      <header className="p-3 flex justify-between items-start border-b border-gray-700/50 flex-shrink-0">
        <div className="flex-grow min-w-0 pr-4">
          <h2 className="text-xl font-bold font-gangofthree text-white truncate" title={currentName}>{currentName}</h2>
          <div className="flex items-center gap-3 text-sm text-gray-400 mt-1 flex-wrap">
            <span>{item.categoria}</span>
            <span className="text-gray-600">•</span>
            <span>{item.raridade}</span>
            <span className="text-gray-600">•</span>
            <span>Nível {item.nivel_sugerido}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
            <Tooltip text={copySuccess ? "Copiado!" : "Copiar como Texto"}>
                <Button variant="ghost" className="!p-2" onClick={handleCopyText}>
                    {copySuccess ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </Button>
            </Tooltip>
            <Tooltip text={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}>
                <Button variant="ghost" className="!p-2" onClick={() => onToggleFavorite(item)}>
                    <StarIcon className="w-5 h-5" filled={isFavorite} />
                </Button>
            </Tooltip>
             <div className="relative">
                 <Tooltip text="Gerar Variação">
                    <Button variant="ghost" className="!p-2" onClick={() => setVariantMenuOpen(prev => !prev)}>
                        <HammerIcon className="w-5 h-5" />
                    </Button>
                 </Tooltip>
                {variantMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-36 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10 py-1">
                        <button onClick={() => handleVariantClick('agressiva')} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Agressiva</button>
                        <button onClick={() => handleVariantClick('técnica')} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Técnica</button>
                        <button onClick={() => handleVariantClick('defensiva')} className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">Defensiva</button>
                    </div>
                )}
            </div>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-4 inner-scroll">
            <div className="prose prose-sm prose-invert max-w-none prose-p:my-2">
                <p className="text-indigo-300 italic">{item.descricao_curta}</p>
                
                {isEditing ? (
                    <div>
                        <textarea 
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white resize-y"
                            rows={10}
                        />
                        <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={handleSave}><SaveIcon className="w-4 h-4" /> Salvar</Button>
                            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        </div>
                    </div>
                ) : (
                    <div className="relative group">
                        <p>{item.descricao}</p>
                        <Button variant="ghost" size="sm" className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity !p-1" onClick={() => setIsEditing(true)}>
                            <PencilIcon className="w-4 h-4"/>
                        </Button>
                    </div>
                )}
            </div>
            
            <div className="mt-6">
                <AccordionSection title="Detalhes & Mecânicas">
                    <div className="space-y-3">
                         {renderItemDetails()}
                    </div>
                </AccordionSection>
                
                {item.ganchos_narrativos && (
                    <AccordionSection title="Ganchos Narrativos">
                         <ul className="list-disc list-inside space-y-1">
                            {Array.isArray(item.ganchos_narrativos) ? 
                                item.ganchos_narrativos.map((hook, i) => <li key={i}>{hook}</li>) :
                                <li>{item.ganchos_narrativos}</li>
                            }
                        </ul>
                    </AccordionSection>
                )}

                {item.provenance && (
                    <AccordionSection title="Dados de Geração">
                        <ul className="text-xs font-mono space-y-1">
                            {item.provenance.map((p, i) => (
                                <li key={i} className={`flex items-center gap-2 ${p.status === 'failed' ? 'text-red-400' : 'text-gray-400'}`}>
                                    <span className={`w-2 h-2 rounded-full ${p.status === 'success' ? 'bg-green-500' : p.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                    <span>{p.step} ({p.model}): {p.status}</span>
                                </li>
                            ))}
                        </ul>
                    </AccordionSection>
                )}
            </div>
      </div>
    </div>
  );
};