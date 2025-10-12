
import React, { useState, useEffect } from 'react';
import type { GeneratedItem, Provenance } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StarIcon } from './icons/StarIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SaveIcon } from './icons/SaveIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { AnvilIcon } from './icons/AnvilIcon';
import { HammerIcon } from './icons/HammerIcon';

interface DetailPanelProps {
  item: GeneratedItem | null;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onUpdate: (item: GeneratedItem) => void;
}

const ProvenanceDisplay: React.FC<{ provenance?: Provenance[] }> = ({ provenance }) => {
    if (!provenance || provenance.length === 0) {
        return <p className="text-xs text-gray-500 italic">Linhagem de IA não registrada.</p>;
    }

    const getStatusColor = (status: 'success' | 'skipped' | 'failed') => {
        switch (status) {
            case 'success': return 'bg-green-500';
            case 'skipped': return 'bg-gray-500';
            case 'failed': return 'bg-red-500';
            default: return 'bg-gray-600';
        }
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400">Linhagem:</span>
            {provenance.map((p, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-gray-700 px-2 py-0.5 rounded-full text-xs" title={`${p.step} - ${p.status}`}>
                   <span className={`w-2 h-2 rounded-full ${getStatusColor(p.status)}`}></span>
                   <span>{p.model}</span>
                </div>
            ))}
        </div>
    );
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onGenerateVariant, isFavorite, onToggleFavorite, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (item) {
      setEditedDescription(item.descricao);
      setIsEditing(false); // Reset editing state on item change
    }
  }, [item]);

  if (!item) {
    return (
      <Card className="detail-panel forge-panel rounded-lg p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center text-gray-500">
          <AnvilIcon className="w-12 h-12 mx-auto mb-2" />
          <p>Selecione um item para ver os detalhes</p>
        </div>
      </Card>
    );
  }

  const handleSave = () => {
    onUpdate({ ...item, descricao: editedDescription });
    setIsEditing(false);
  };
  
  const handleCopyPrompt = () => {
    if (item.imagePromptDescription) {
      navigator.clipboard.writeText(item.imagePromptDescription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderMechanics = () => {
    if (item.categoria === 'Arma' || item.categoria === 'Acessório' || item.categoria === 'Kekkijutsu') {
        const specificItem = item as any; // Cast to access properties
        if (!specificItem.dano && !specificItem.dados) return null;
        return (
            <>
                <h4 className="font-bold text-indigo-400 mt-4 mb-2">Mecânicas de Jogo</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {specificItem.dano && <p><strong>Dano:</strong> {specificItem.dano}</p>}
                    {specificItem.dados && <p><strong>Dados:</strong> {specificItem.dados}</p>}
                    {specificItem.tipo_de_dano && <p><strong>Tipo:</strong> {specificItem.tipo_de_dano}</p>}
                    {specificItem.status_aplicado && <p><strong>Status:</strong> {specificItem.status_aplicado}</p>}
                </div>
                {specificItem.efeitos_secundarios && <p className="text-sm mt-2"><strong>Efeitos:</strong> {specificItem.efeitos_secundarios}</p>}
            </>
        );
    }
    return null;
  };

  const itemName = ('title' in item && item.title) || item.nome;

  return (
    <Card className="detail-panel forge-panel rounded-lg p-4 md:p-6 flex flex-col">
      <div className="flex justify-between items-start gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="text-2xl font-bold text-white font-gangofthree">{itemName}</h3>
          <p className="text-indigo-400">{item.categoria} <span className="text-gray-500">• {item.raridade} • Nível {item.nivel_sugerido || 'N/A'}</span></p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" onClick={() => onToggleFavorite(item)} className="!p-2" aria-label={isFavorite ? 'Desfavoritar' : 'Favoritar'}>
            <StarIcon className={`w-6 h-6 ${isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`} filled={isFavorite} />
          </Button>
          <Button variant="ghost" onClick={() => setIsEditing(!isEditing)} className="!p-2" aria-label="Editar">
            <PencilIcon className="w-5 h-5" />
          </Button>
          {isEditing && (
            <Button variant="secondary" onClick={handleSave} className="!p-2" aria-label="Salvar">
              <SaveIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full h-64 bg-gray-900 border border-gray-600 rounded-md p-2 text-white resize-y"
          />
        ) : (
          <p className="text-gray-300 whitespace-pre-wrap">{item.descricao}</p>
        )}

        {renderMechanics()}
        
        {item.ganchos_narrativos && item.ganchos_narrativos.length > 0 && (
            <>
                <h4 className="font-bold text-indigo-400 mt-4 mb-2">Ganchos Narrativos</h4>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {Array.isArray(item.ganchos_narrativos) 
                        ? item.ganchos_narrativos.map((hook, i) => <li key={i}>{hook}</li>)
                        : <li>{item.ganchos_narrativos}</li>
                    }
                </ul>
            </>
        )}
        
        {item.imagePromptDescription && (
             <>
                <h4 className="font-bold text-indigo-400 mt-4 mb-2">Prompt de Imagem Sugerido</h4>
                <div className="bg-gray-900/50 p-3 rounded-md flex justify-between items-center gap-2">
                    <code className="text-sm text-gray-300 flex-grow">{item.imagePromptDescription}</code>
                    <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                        {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400"/> : <ClipboardIcon className="w-5 h-5"/>}
                    </Button>
                </div>
            </>
        )}
        
        <div className="border-t border-gray-700 pt-4 mt-4 space-y-3">
             <div className="flex items-center gap-2">
                <HammerIcon className="w-5 h-5 text-gray-400"/>
                <h4 className="font-bold text-indigo-400">Forjar Variações</h4>
             </div>
             <div className="flex gap-2 flex-wrap">
                <Button variant="secondary" size="sm" onClick={() => onGenerateVariant(item, 'agressiva')}>Agressiva</Button>
                <Button variant="secondary" size="sm" onClick={() => onGenerateVariant(item, 'técnica')}>Técnica</Button>
                <Button variant="secondary" size="sm" onClick={() => onGenerateVariant(item, 'defensiva')}>Defensiva</Button>
            </div>
        </div>

        <div className="border-t border-gray-700 pt-3 mt-3">
            <ProvenanceDisplay provenance={item.provenance} />
        </div>
      </div>
    </Card>
  );
};
