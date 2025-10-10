// FIX: Import `useState` from React to resolve 'Cannot find name' errors.
import React, { useState } from 'react';
import type { GeneratedItem, MissionNPC, MissionItem, Tone } from '../types';
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

const NpcCard: React.FC<{ npc: MissionNPC }> = ({ npc }) => (
    <Card className="!p-3 !bg-gray-800/70">
        <h5 className="font-bold text-white">{npc.name} <span className="text-xs text-gray-400 font-normal">({npc.role})</span></h5>
        <p className="text-xs italic text-indigo-300">"{npc.dialogue_example}"</p>
        <p className="text-xs text-gray-400 mt-1"><strong>Traço Físico:</strong> {npc.physical_trait}</p>
        <p className="text-xs text-gray-400"><strong>Objetivo:</strong> {npc.goal}</p>
        <p className="text-xs text-gray-400"><strong>Segredo:</strong> {npc.secret}</p>
    </Card>
);

const ItemCard: React.FC<{ item: MissionItem }> = ({ item }) => (
     <Card className="!p-3 !bg-gray-800/70">
        <h5 className="font-bold text-white">{item.appearance}</h5>
        <p className="text-xs text-gray-400 mt-1"><strong>Origem:</strong> {item.origin}</p>
        <p className="text-xs text-gray-400"><strong>Desgaste:</strong> {item.wear}</p>
        <p className="text-xs text-gray-400"><strong>Propriedade Estranha:</strong> {item.quirk}</p>
        <p className="text-xs text-gray-400"><strong>Uso:</strong> {item.use}</p>
    </Card>
);


const MissionDetailView: React.FC<{ item: GeneratedItem }> = ({ item }) => (
    <>
        <DetailSection title="Sinopse">{item.logline || 'N/A'}</DetailSection>
        <DetailSection title="Resumo da Missão">{item.summary || 'N/A'}</DetailSection>
        <DetailSection title="Ganchos e Objetivos">
            <ul className="list-disc pl-5 space-y-1">
                {item.objectives?.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>
        </DetailSection>
        <DetailSection title="Complicações Possíveis">
             <ul className="list-disc pl-5 space-y-1">
                {item.complications?.map((comp, i) => <li key={i}>{comp}</li>)}
            </ul>
        </DetailSection>
        <DetailSection title="Ambiente (Visão, Som, Cheiro)">{item.environment || 'N/A'}</DetailSection>
        
        {item.protagonist_desc && (
            <DetailSection title="Descrição do Protagonista">
                <p>{item.protagonist_desc.silhouette}</p>
                <p>{item.protagonist_desc.face}</p>
                <p>{item.protagonist_desc.attire}</p>
                <p>{item.protagonist_desc.movement}</p>
                <p>{item.protagonist_desc.defining_feature}</p>
            </DetailSection>
        )}
        
        {item.oni_desc && (
            <DetailSection title="Descrição do Oni">
                <p>{item.oni_desc.scale}</p>
                <p>{item.oni_desc.skin}</p>
                <p>{item.oni_desc.appendages}</p>
                <p>{item.oni_desc.eyes}</p>
                <p>{item.oni_desc.sound_smell}</p>
                <p>{item.oni_desc.mystic_sign}</p>
            </DetailSection>
        )}
        
        {item.key_npcs && item.key_npcs.length > 0 && (
            <DetailSection title="NPCs Relevantes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.key_npcs.map(npc => <NpcCard key={npc.id} npc={npc} />)}
                </div>
            </DetailSection>
        )}
        
        {item.relevant_items && item.relevant_items.length > 0 && (
             <DetailSection title="Itens Relevantes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.relevant_items.map((missionItem, i) => <ItemCard key={i} item={missionItem} />)}
                </div>
            </DetailSection>
        )}
        
         <DetailSection title="Ganchos Secundários e Escalada">{item.scaling_hooks || 'N/A'}</DetailSection>
    </>
);


export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onGenerateVariant, isFavorite, onToggleFavorite, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<GeneratedItem | null>(item);

  React.useEffect(() => {
    setEditedItem(item);
    setIsEditing(false); // Always reset editing state when item changes
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
  
  const isMission = item.categoria === 'Missão/Cenário';

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
                 <h2 className="text-xl font-bold text-white font-gangofthree">
                    {isEditing && !isMission ? <input value={editedItem?.nome || ''} onChange={e => handleEditChange('nome', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-1 text-lg" /> : (item.title || item.nome)}
                 </h2>
                 <p className="text-sm text-indigo-400 pt-1 capitalize">
                    {isMission ? `${item.categoria} • Tom ${item.tone || 'N/A'}` : `${item.categoria} • ${item.raridade} (Nível ${item.nivel_sugerido})`}
                 </p>
            </div>
            <div className="flex gap-2">
                {!isMission && <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancelar' : 'Editar'}</Button>}
                {isEditing && !isMission && <Button onClick={handleSave}>Salvar</Button>}
                <button 
                    onClick={() => onToggleFavorite(item)}
                    className="p-2 text-gray-400 hover:text-yellow-400 rounded-full hover:bg-gray-700 transition-colors"
                    title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                >
                    <StarIcon className="w-6 h-6" filled={isFavorite} />
                </button>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
            {isMission ? <MissionDetailView item={item} /> : (
                <>
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
                    
                    {((item.status_aplicado && item.status_aplicado !== "Nenhum") || (item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum")) && (
                       <DetailSection title="Efeitos Adicionais">
                            <div className="space-y-2">
                                {item.status_aplicado && item.status_aplicado !== "Nenhum" && <p><strong>Status Aplicado:</strong> {isEditing ? renderField('Status Aplicado', 'status_aplicado') : item.status_aplicado}</p>}
                                {item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum" && <p><strong>Efeitos Secundários:</strong> {isEditing ? renderField('Efeitos Secundários', 'efeitos_secundarios') : item.efeitos_secundarios}</p>}
                            </div>
                       </DetailSection>
                    )}
                </>
            )}
        </div>
        
        {!isEditing && !isMission && (
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
