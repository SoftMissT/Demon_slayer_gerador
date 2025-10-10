
import React, { useState } from 'react';
import type { GeneratedItem } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface DetailPanelProps {
  item: GeneratedItem | null;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onUpdate: (item: GeneratedItem) => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`mb-4 ${className}`}>
    <h4 className="text-sm font-bold text-indigo-400 mb-1 font-gangofthree tracking-wide">{title}</h4>
    <div className="text-gray-300 text-sm prose prose-sm prose-invert max-w-none">{children}</div>
  </div>
);


export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onGenerateVariant, isFavorite, onToggleFavorite, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<GeneratedItem | null>(item);

  React.useEffect(() => {
    setEditedItem(item);
    setIsEditing(false);
  }, [item]);

  if (!item) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <SparklesIcon className="w-12 h-12 mx-auto mb-2" />
          <p>Selecione um item para ver os detalhes</p>
        </div>
      </Card>
    );
  }
  
  const handleSave = () => {
    if (editedItem) {
        onUpdate(editedItem);
        setIsEditing(false);
    }
  };
  
  const handleEditChange = (field: keyof GeneratedItem, value: any) => {
    if(editedItem) {
        setEditedItem({...editedItem, [field]: value});
    }
  }

  const handleFavoriteClick = () => {
      onToggleFavorite(item);
  };
  
  const renderField = (label: string, field: keyof GeneratedItem, type: 'text' | 'textarea' | 'number' = 'text') => {
    if (!editedItem) return null;
    const value = editedItem[field] as string || '';
    
    if (isEditing) {
        if (type === 'textarea') {
             return <textarea value={value} onChange={e => handleEditChange(field, e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm" rows={4} />;
        }
        return <input type={type} value={value} onChange={e => handleEditChange(field, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm" />;
    }
    return <p className="whitespace-pre-wrap">{value || 'N/A'}</p>;
  }


  return (
    <Card className="h-full flex flex-col">
        <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <div>
                 <h2 className="text-xl font-bold text-white font-gangofthree">{isEditing ? <input value={editedItem?.nome || ''} onChange={e => handleEditChange('nome', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-1 text-lg" /> : item.nome}</h2>
                 <p className="text-sm text-indigo-400 pt-1">{item.categoria} • {item.raridade} (Nível {item.nivel_sugerido})</p>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancelar' : 'Editar'}</Button>
                {isEditing && <Button onClick={handleSave}>Salvar</Button>}
                <button 
                    onClick={handleFavoriteClick} 
                    className="p-2 text-gray-400 hover:text-yellow-400 rounded-full hover:bg-gray-700 transition-colors"
                    title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                >
                    <StarIcon className="w-6 h-6" filled={isFavorite} />
                </button>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
            <DetailSection title="Descrição Curta">
                {renderField('Descrição Curta', 'descricao_curta', 'textarea')}
            </DetailSection>

            <DetailSection title="Descrição Longa">
              {renderField('Descrição Longa', 'descricao', 'textarea')}
            </DetailSection>

            {(item.ganchos_narrativos && item.ganchos_narrativos !== "N/A") && <DetailSection title="Ganchos Narrativos">
              {renderField('Ganchos Narrativos', 'ganchos_narrativos', 'textarea')}
            </DetailSection>}

            <DetailSection title="Mecânicas de Combate">
                <div className="space-y-2">
                    <p><strong>Dano:</strong> {isEditing ? renderField('Dano', 'dano') : (item.dano || 'N/A')}</p>
                    <p><strong>Dados:</strong> {isEditing ? renderField('Dados', 'dados') : (item.dados || 'N/A')}</p>
                    <p><strong>Tipo de Dano:</strong> {isEditing ? renderField('Tipo de Dano', 'tipo_de_dano') : (item.tipo_de_dano || 'N/A')}</p>
                </div>
            </DetailSection>
            
            {((item.status_aplicado && item.status_aplicado !== "Nenhum") || (item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum")) ? (
               <DetailSection title="Efeitos Adicionais">
                    <div className="space-y-2">
                        {item.status_aplicado && item.status_aplicado !== "Nenhum" && <p><strong>Status Aplicado:</strong> {isEditing ? renderField('Status Aplicado', 'status_aplicado') : item.status_aplicado}</p>}
                        {item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum" && <p><strong>Efeitos Secundários:</strong> {isEditing ? renderField('Efeitos Secundários', 'efeitos_secundarios') : item.efeitos_secundarios}</p>}
                    </div>
               </DetailSection>
            ) : null}
        </div>
        
        {!isEditing && (
            <div className="mt-4 pt-4 border-t border-gray-700 flex-shrink-0">
                <h4 className="text-sm font-bold text-indigo-400 mb-2 font-gangofthree">Gerar Variação</h4>
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="secondary" onClick={() => onGenerateVariant(item, 'agressiva')}>Agressiva</Button>
                    <Button variant="secondary" onClick={() => onGenerateVariant(item, 'técnica')}>Técnica</Button>
                    <Button variant="secondary" onClick={() => onGenerateVariant(item, 'defensiva')}>Defensiva</Button>
                </div>
            </div>
        )}
    </Card>
  );
};
