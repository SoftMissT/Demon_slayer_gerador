import React, { useState, useEffect } from 'react';
import type { GeneratedItem, MissionNPC, MissionItem } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { buildPlainTextForItem } from '../lib/textFormatters';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';


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
        <p className="text-xs text-red-400"><strong>Reviravolta:</strong> {npc.twist}</p>
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
        {'logline' in item && <DetailSection title="Sinopse">{item.logline || 'N/A'}</DetailSection>}
        {'summary' in item && <DetailSection title="Resumo da Missão">{item.summary || 'N/A'}</DetailSection>}

        {'objectives' in item && item.objectives && item.objectives.length > 0 && (
            <DetailSection title="Ganchos e Objetivos">
                <ul className="list-disc pl-5 space-y-1">
                    {/* FIX: Explicitly type 'obj' to resolve implicit 'any' error. */}
                    {item.objectives?.map((obj: any, i: number) => <li key={i}>{obj}</li>)}
                </ul>
            </DetailSection>
        )}
        
        {'complications' in item && item.complications && item.complications.length > 0 && (
            <DetailSection title="Complicações Possíveis">
                 <ul className="list-disc pl-5 space-y-1">
                    {item.complications?.map((comp: any, i: number) => <li key={i}>{comp}</li>)}
                </ul>
            </DetailSection>
        )}

        {'failure_states' in item && item.failure_states && item.failure_states.length > 0 && (
            <DetailSection title="Condições de Falha">
                <ul className="list-disc pl-5 space-y-1">
                    {item.failure_states.map((state: any, i: number) => <li key={i}>{state}</li>)}
                </ul>
            </DetailSection>
        )}

        {'rewards' in item && item.rewards && item.rewards.length > 0 && (
            <DetailSection title="Recompensas">
                <ul className="list-disc pl-5 space-y-1">
                    {item.rewards.map((reward: any, i: number) => <li key={i}>{reward}</li>)}
                </ul>
            </DetailSection>
        )}

        {'numberOfSessions' in item && item.numberOfSessions && item.numberOfSessions > 0 && (
            <DetailSection title="Duração Estimada">
                <p>{item.numberOfSessions} {item.numberOfSessions > 1 ? 'sessões' : 'sessão'}</p>
            </DetailSection>
        )}

        {'environment' in item && <DetailSection title="Ambiente (Visão, Som, Cheiro)">{item.environment || 'N/A'}</DetailSection>}
        
        {'protagonist_desc' in item && item.protagonist_desc && (
            <DetailSection title="Descrição do Protagonista">
                <p>{item.protagonist_desc.silhouette}</p>
                <p>{item.protagonist_desc.face}</p>
                <p>{item.protagonist_desc.attire}</p>
                <p>{item.protagonist_desc.movement}</p>
                <p>{item.protagonist_desc.defining_feature}</p>
            </DetailSection>
        )}
        
        {'oni_desc' in item && item.oni_desc && (
            <DetailSection title="Descrição do Oni">
                <p>{item.oni_desc.scale}</p>
                <p>{item.oni_desc.skin}</p>
                <p>{item.oni_desc.appendages}</p>
                <p>{item.oni_desc.eyes}</p>
                <p>{item.oni_desc.sound_smell}</p>
                <p>{item.oni_desc.mystic_sign}</p>
            </DetailSection>
        )}
        
        {'demonBloodArtType' in item && item.demonBloodArtType && (
            <DetailSection title="Kekkijutsu do Vilão">
                <p>{item.demonBloodArtType}</p>
            </DetailSection>
        )}

        {'key_npcs' in item && item.key_npcs && item.key_npcs.length > 0 && (
            <DetailSection title="NPCs Relevantes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.key_npcs.map((npc: MissionNPC) => <NpcCard key={npc.id} npc={npc} />)}
                </div>
            </DetailSection>
        )}
        
        {'relevant_items' in item && item.relevant_items && item.relevant_items.length > 0 && (
             <DetailSection title="Itens Relevantes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.relevant_items.map((missionItem: MissionItem, i: number) => <ItemCard key={i} item={missionItem} />)}
                </div>
            </DetailSection>
        )}
        
         {'scaling_hooks' in item && <DetailSection title="Ganchos Secundários e Escalada">{item.scaling_hooks || 'N/A'}</DetailSection>}

        {'tone_variations' in item && item.tone_variations && typeof item.tone_variations === 'object' && Object.keys(item.tone_variations).length > 0 && (
            <DetailSection title="Variações de Tom">
                <div className="space-y-1 text-xs">
                    {Object.entries(item.tone_variations).map(([key, value]) => (
                        <p key={key}><strong className="capitalize text-indigo-300">{key}:</strong> {String(value)}</p>
                    ))}
                </div>
            </DetailSection>
        )}

        {'sensitive_flags' in item && item.sensitive_flags && item.sensitive_flags.length > 0 && (
            <DetailSection title="Alertas de Conteúdo Sensível">
                 <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-3 rounded-lg flex gap-3 text-sm">
                    <AlertTriangleIcon className="w-6 h-6 flex-shrink-0 text-yellow-400" />
                    <ul className="list-disc pl-4">
                        {item.sensitive_flags.map((flag: any, i: number) => <li key={i}>{flag}</li>)}
                    </ul>
                </div>
            </DetailSection>
        )}
        
        {'diff' in item && item.diff && (
            <DetailSection title="Notas de Design (Diff)">
                <p className="italic text-gray-400">"{item.diff.summary}"</p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
                    {item.diff.changes?.map((change: any, i: number) => <li key={i}>{change}</li>)}
                </ul>
            </DetailSection>
        )}

        {'micro_variants' in item && item.micro_variants && item.micro_variants.length > 0 && (
            <DetailSection title="Micro-Variantes">
                <ul className="list-disc pl-5 space-y-1 text-xs">
                    {item.micro_variants.map((variant: any, i: number) => (
                        <li key={i}>
                            {typeof variant === 'string'
                                ? variant
                                : Object.entries(variant).map(([key, value]) => `${key}: ${String(value)}`).join(', ')}
                        </li>
                    ))}
                </ul>
            </DetailSection>
        )}
    </>
);

const NpcDetailView: React.FC<{ item: GeneratedItem }> = ({ item }) => (
    <>
        {'origem' in item && item.origem && <DetailSection title="Origem">{item.origem}</DetailSection>}
        <DetailSection title="Descrição Curta (Aparência)">{item.descricao_curta || 'N/A'}</DetailSection>
        <DetailSection title="História e Aparência Completa">{item.descricao || 'N/A'}</DetailSection>
        {'voice_and_mannerisms' in item && <DetailSection title="Voz e Maneirismos">{item.voice_and_mannerisms || 'N/A'}</DetailSection>}
        {'inventory_focal' in item && <DetailSection title="Item Focal / Propriedade">{item.inventory_focal || 'N/A'}</DetailSection>}
        {'motivation' in item && <DetailSection title="Motivação">{item.motivation || 'N/A'}</DetailSection>}
        {'secret' in item && <DetailSection title="Segredo">{item.secret || 'N/A'}</DetailSection>}

        {item.ganchos_narrativos && Array.isArray(item.ganchos_narrativos) && item.ganchos_narrativos.length > 0 && (
            <DetailSection title="Ganchos de Aventura">
                <ul className="list-disc pl-5 space-y-1">
                    {item.ganchos_narrativos.map((hook, i) => <li key={i}>{hook}</li>)}
                </ul>
            </DetailSection>
        )}

        {'dialogue_lines' in item && item.dialogue_lines && item.dialogue_lines.length > 0 && (
            <DetailSection title="Exemplos de Diálogo">
                <ul className="pl-5 space-y-2 italic text-indigo-200">
                    {item.dialogue_lines?.map((line: any, i: number) => <li key={i}>"{line}"</li>)}
                </ul>
            </DetailSection>
        )}
    </>
);

const HunterDetailView: React.FC<{ item: GeneratedItem }> = ({ item }) => (
    <>
        {'classe' in item && <DetailSection title="Arquétipo (Classe)">{item.classe || 'N/A'}</DetailSection>}
        {'personalidade' in item && <DetailSection title="Personalidade">{item.personalidade || 'N/A'}</DetailSection>}
        {'descricao_fisica' in item && <DetailSection title="Descrição Física">{item.descricao_fisica || 'N/A'}</DetailSection>}
        {'background' in item && <DetailSection title="Background">{item.background || 'N/A'}</DetailSection>}
        
        {'arsenal' in item && item.arsenal && (
            <DetailSection title="Arsenal">
                <p><strong>Arma:</strong> {item.arsenal.arma}</p>
                <p><strong>Estilo de Combate:</strong> {item.arsenal.empunhadura.nome}</p>
                <p className="text-xs text-gray-400 mt-1">{item.arsenal.empunhadura.descricao}</p>
            </DetailSection>
        )}
        
        {'habilidades_especiais' in item && item.habilidades_especiais && (
            <DetailSection title="Habilidades Especiais">
                <p><strong>Respiração:</strong> {item.habilidades_especiais.respiracao}</p>
                {item.habilidades_especiais.variacoes_tecnica && item.habilidades_especiais.variacoes_tecnica.length > 0 && (
                    <>
                        <h5 className="text-sm font-semibold text-gray-200 mt-2 mb-1">Técnicas Notáveis:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            {item.habilidades_especiais.variacoes_tecnica.map((tech: any, i: number) => <li key={i}>{tech}</li>)}
                        </ul>
                    </>
                )}
            </DetailSection>
        )}

        {'acessorio' in item && item.acessorio && (
            <DetailSection title="Acessório Distintivo">
                <h5 className="font-semibold text-white">{item.acessorio.nome}</h5>
                <p>{item.acessorio.descricao}</p>
            </DetailSection>
        )}

        {item.ganchos_narrativos && Array.isArray(item.ganchos_narrativos) && item.ganchos_narrativos.length > 0 && (
            <DetailSection title="Ganchos Narrativos">
                <ul className="list-disc pl-5 space-y-1">
                    {item.ganchos_narrativos.map((hook, i) => <li key={i}>{hook}</li>)}
                </ul>
            </DetailSection>
        )}

        {'uso_em_cena' in item && item.uso_em_cena && item.uso_em_cena.length > 0 && (
            <DetailSection title="Uso em Cena">
                 <ul className="list-disc pl-5 space-y-1">
                    {item.uso_em_cena.map((uso: any, i: number) => <li key={i}>{uso}</li>)}
                </ul>
            </DetailSection>
        )}
    </>
);

const OniDetailView: React.FC<{ item: GeneratedItem }> = ({ item }) => (
    <>
        {'power_level' in item && item.power_level && <DetailSection title="Nível de Poder">{item.power_level}</DetailSection>}
        {'descricao_fisica_detalhada' in item && <DetailSection title="Descrição Física Detalhada">{item.descricao_fisica_detalhada || item.descricao_curta || 'N/A'}</DetailSection>}
        
        {'kekkijutsu' in item && item.kekkijutsu && item.kekkijutsu.nome && item.kekkijutsu.nome.toLowerCase() !== 'nenhum' ? (
            <DetailSection title="Kekkijutsu (Arte Demoníaca de Sangue)">
                <h5 className="font-semibold text-white">{item.kekkijutsu.nome}</h5>
                <p>{item.kekkijutsu.descricao}</p>
            </DetailSection>
        ) : (
            <DetailSection title="Kekkijutsu (Arte Demoníaca de Sangue)">
                <p>Nenhum</p>
            </DetailSection>
        )}
        
        {'comportamento_combate' in item && item.comportamento_combate && item.comportamento_combate.length > 0 && (
            <DetailSection title="Comportamento em Combate">
                <ul className="list-disc pl-5 space-y-1">
                    {item.comportamento_combate.map((behavior: any, i: number) => <li key={i}>{behavior}</li>)}
                </ul>
            </DetailSection>
        )}

        {'comportamento_fora_combate' in item && item.comportamento_fora_combate && item.comportamento_fora_combate.length > 0 && (
            <DetailSection title="Comportamento Fora de Combate">
                <ul className="list-disc pl-5 space-y-1">
                    {item.comportamento_fora_combate.map((behavior: any, i: number) => <li key={i}>{behavior}</li>)}
                </ul>
            </DetailSection>
        )}

        {'fraquezas_unicas' in item && item.fraquezas_unicas && item.fraquezas_unicas.length > 0 && (
            <DetailSection title="Fraquezas Únicas">
                <ul className="list-disc pl-5 space-y-1">
                    {item.fraquezas_unicas.map((weakness: any, i: number) => <li key={i}>{weakness}</li>)}
                </ul>
            </DetailSection>
        )}

        {'trofeus_loot' in item && item.trofeus_loot && item.trofeus_loot.length > 0 && (
            <DetailSection title="Troféus / Loot">
                <ul className="list-disc pl-5 space-y-1">
                    {item.trofeus_loot.map((loot: any, i: number) => <li key={i}>{loot}</li>)}
                </ul>
            </DetailSection>
        )}
        
        {item.ganchos_narrativos && Array.isArray(item.ganchos_narrativos) && item.ganchos_narrativos.length > 0 && (
            <DetailSection title="Ganchos Narrativos">
                <ul className="list-disc pl-5 space-y-1">
                    {item.ganchos_narrativos.map((hook, i) => <li key={i}>{hook}</li>)}
                </ul>
            </DetailSection>
        )}
    </>
);

const WorldBuildingDetailView: React.FC<{ item: GeneratedItem }> = ({ item }) => (
    <>
        <DetailSection title="Conceito Central">{item.descricao_curta || 'N/A'}</DetailSection>

        {'plot_threads' in item && item.plot_threads && item.plot_threads.length > 0 && (
            <DetailSection title="Tramas Principais">
                <div className="space-y-3">
                    {item.plot_threads.map((plot: any, i: number) => (
                        <div key={i} className="p-2 bg-gray-900/50 rounded-md border-l-2 border-indigo-500">
                            <h5 className="font-semibold text-white">{plot.title}</h5>
                            <p className="text-xs text-gray-400">{plot.description}</p>
                        </div>
                    ))}
                </div>
            </DetailSection>
        )}

        {'adventure_hooks' in item && item.adventure_hooks && item.adventure_hooks.length > 0 && (
            <DetailSection title="Ganchos de Aventura">
                <ul className="list-disc pl-5 space-y-1">
                    {item.adventure_hooks.map((hook: any, i: number) => <li key={i}>{hook}</li>)}
                </ul>
            </DetailSection>
        )}

        {'key_npcs_wb' in item && item.key_npcs_wb && item.key_npcs_wb.length > 0 && (
            <DetailSection title="NPCs Importantes">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.key_npcs_wb.map((npc: any, i: number) => (
                         <Card key={i} className="!p-3 !bg-gray-800/70">
                            <h5 className="font-bold text-white">{npc.name} <span className="text-xs text-gray-400 font-normal">({npc.role})</span></h5>
                            <p className="text-xs text-gray-400 mt-1">{npc.description}</p>
                        </Card>
                    ))}
                </div>
            </DetailSection>
        )}

        {'points_of_interest' in item && item.points_of_interest && item.points_of_interest.length > 0 && (
            <DetailSection title="Locais de Interesse">
                <div className="space-y-3">
                    {item.points_of_interest.map((poi: any, i: number) => (
                        <div key={i} className="p-2 bg-gray-900/50 rounded-md">
                            <h5 className="font-semibold text-white">{poi.name} <span className="text-xs text-gray-400 font-normal">({poi.type})</span></h5>
                            <p className="text-xs text-gray-400">{poi.description}</p>
                        </div>
                    ))}
                </div>
            </DetailSection>
        )}

        {'mini_missions' in item && item.mini_missions && item.mini_missions.length > 0 && (
            <DetailSection title="Mini-Missões">
                <div className="space-y-3">
                    {item.mini_missions.map((mission: any, i: number) => (
                         <div key={i} className="p-2 bg-gray-900/50 rounded-md">
                            <h5 className="font-semibold text-white">{mission.title}</h5>
                            <p className="text-xs text-gray-400"><strong>Objetivo:</strong> {mission.objective}</p>
                            <p className="text-xs text-indigo-300"><strong>Recompensa:</strong> {mission.reward}</p>
                        </div>
                    ))}
                </div>
            </DetailSection>
        )}
    </>
);

const BreathingFormDetailView: React.FC<{ item: GeneratedItem }> = ({ item }) => (
    <>
        {'base_breathing_id' in item && <DetailSection title="Derivação">{`${'derivation_type' in item ? item.derivation_type : ''} da ${item.base_breathing_id}`}</DetailSection>}
        {'name_native' in item && item.name_native && <p className="text-xs text-gray-400 italic mb-2">{item.name_native}</p>}
        {'description_flavor' in item && <DetailSection title="Descrição (Flavor)">{item.description_flavor || 'N/A'}</DetailSection>}

        {'requirements' in item && item.requirements && (
            <DetailSection title="Requisitos e Custos">
                <p><strong>Rank Mínimo:</strong> {item.requirements.min_rank}</p>
                <p><strong>Custo de Exaustão:</strong> {item.requirements.exhaustion_cost}</p>
                <p><strong>Cooldown:</strong> {item.requirements.cooldown}</p>
            </DetailSection>
        )}

        {'mechanics' in item && item.mechanics && (
            <DetailSection title="Mecânicas">
                <p><strong>Ativação:</strong> {item.mechanics.activation}</p>
                <p><strong>Alvo:</strong> {item.mechanics.target}</p>
                <p><strong>Teste Inicial:</strong> {item.mechanics.initial_test.type} vs DC {item.mechanics.initial_test.dc_formula}</p>
                <p><strong>Em Sucesso (Alvo):</strong> {item.mechanics.on_success_target}</p>
                <p><strong>Em Falha (Alvo):</strong> {item.mechanics.on_fail_target}</p>
            </DetailSection>
        )}
        
        {'mechanics' in item && item.mechanics?.damage_formula_rank && (
            <DetailSection title="Dano por Rank">
                 {Object.entries(item.mechanics.damage_formula_rank).map(([rank, formula]) => (
                    <p key={rank}><strong>{rank}:</strong> {formula as string}</p>
                 ))}
            </DetailSection>
        )}
        
        {'level_scaling' in item && item.level_scaling && (
            <DetailSection title="Escala por Nível">
                {Object.entries(item.level_scaling).map(([rank, scaling]: [string, any]) => (
                    <div key={rank}>
                        <h5 className="font-semibold text-white text-sm mt-1">{rank}</h5>
                        {Object.entries(scaling).map(([stat, value]) => (
                           <p key={stat} className="text-xs pl-2">{stat}: {value as string}</p>
                        ))}
                    </div>
                ))}
            </DetailSection>
        )}

        {'micro_variants' in item && item.micro_variants && item.micro_variants.length > 0 && (
            <DetailSection title="Micro-Variantes">
                <ul className="list-disc pl-5 space-y-2 text-xs">
                     {item.micro_variants.map((variant: any, i: number) => (
                        <li key={i}>
                            {typeof variant === 'string' ? variant : Object.entries(variant).map(([key, value]) => `${key}: ${String(value)}`).join(', ')}
                        </li>
                    ))}
                </ul>
            </DetailSection>
        )}
    </>
);


export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onGenerateVariant, isFavorite, onToggleFavorite, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<GeneratedItem | null>(item);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditedItem(item);
    setIsEditing(false); // Always reset editing state when item changes
  }, [item]);
  
  const handleCopy = () => {
    if (item) {
        const textToCopy = buildPlainTextForItem(item);
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };


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
  const isNpc = item.categoria === 'NPC';
  const isHunter = item.categoria === 'Caçador';
  const isOni = item.categoria === 'Inimigo/Oni';
  const isWorldBuilding = item.categoria === 'World Building';
  const isBreathingForm = item.categoria === 'Forma de Respiração';
  const isKekkijutsu = item.categoria === 'Kekkijutsu';
  
  const canEdit = !isMission && !isNpc && !isHunter && !isOni && !isWorldBuilding && !isBreathingForm && !isKekkijutsu;
  const canGenerateVariant = canEdit;

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
    const value = (editedItem as any)[field] as string | number | undefined || '';
    
    if (isEditing) {
        if (type === 'textarea') {
             return <textarea value={value} onChange={e => handleEditChange(field, e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm" rows={4} />;
        }
        return <input type={type} value={value} onChange={e => handleEditChange(field, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm" />;
    }
    return <p className="whitespace-pre-wrap">{String(value) || 'N/A'}</p>;
  }


  return (
    <Card className="h-full flex flex-col">
        <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <div>
                 <h2 className="text-xl font-bold text-white font-gangofthree">
                    {isEditing && canEdit ? <input value={editedItem?.nome || ''} onChange={e => handleEditChange('nome', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-1 text-lg" /> : (('name_pt' in item && item.name_pt) || ('title' in item && item.title) || item.nome)}
                 </h2>
                 <p className="text-sm text-indigo-400 pt-1 capitalize">
                    {isMission ? `${item.categoria} • Tom ${'tone' in item && item.tone || 'N/A'}` : 
                     isNpc ? `${('role' in item && item.role) || ('profession' in item && item.profession) || item.categoria} • ${('origem' in item && item.origem) || ('relationship_to_pcs' in item && item.relationship_to_pcs)}` :
                     isHunter ? `${item.categoria} • ${'origem' in item && item.origem || 'N/A'} • ${'classe' in item && item.classe || 'N/A'}` :
                     isOni ? `${item.categoria} • ${'power_level' in item && item.power_level || `${item.raridade} (Nível ${item.nivel_sugerido})`}` :
                     isWorldBuilding ? `${item.categoria}` :
                     isBreathingForm ? `${item.categoria} • Derivada de ${'base_breathing_id' in item && item.base_breathing_id}` :
                     isKekkijutsu ? `${item.categoria} • Nível ${item.nivel_sugerido}` :
                     `${item.categoria} • ${item.raridade} (Nível ${item.nivel_sugerido})`}
                 </p>
            </div>
            <div className="flex gap-1 items-center">
                <Button variant="ghost" onClick={handleCopy} className="!p-2">
                    {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                </Button>
                {canEdit && <Button variant="secondary" onClick={() => setIsEditing(!isEditing)} className="text-xs !py-1 !px-2">{isEditing ? 'Cancelar' : 'Editar'}</Button>}
                {isEditing && canEdit && <Button onClick={handleSave} className="text-xs !py-1 !px-2">Salvar</Button>}
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
            {isMission ? <MissionDetailView item={item} /> :
             isNpc ? <NpcDetailView item={item} /> :
             isHunter ? <HunterDetailView item={item} /> :
             isOni ? <OniDetailView item={item} /> :
             isWorldBuilding ? <WorldBuildingDetailView item={item} /> :
             isBreathingForm ? <BreathingFormDetailView item={item} /> :
             isKekkijutsu ? (
                <>
                    <DetailSection title="Descrição Curta">
                        {renderField('Descrição Curta', 'descricao_curta', 'textarea')}
                    </DetailSection>

                    <DetailSection title="Descrição Longa">
                      {renderField('Descrição Longa', 'descricao', 'textarea')}
                    </DetailSection>

                    {(typeof item.ganchos_narrativos === 'string' && item.ganchos_narrativos && item.ganchos_narrativos !== "N/A") && 
                        <DetailSection title="Ganchos Narrativos">
                            {renderField('Ganchos Narrativos', 'ganchos_narrativos', 'textarea')}
                        </DetailSection>
                    }
                </>
             ) :
            (
                <>
                    <DetailSection title="Descrição Curta">
                        {renderField('Descrição Curta', 'descricao_curta', 'textarea')}
                    </DetailSection>

                    <DetailSection title="Descrição Longa">
                      {renderField('Descrição Longa', 'descricao', 'textarea')}
                    </DetailSection>

                    {(typeof item.ganchos_narrativos === 'string' && item.ganchos_narrativos && item.ganchos_narrativos !== "N/A") && 
                        <DetailSection title="Ganchos Narrativos">
                            {renderField('Ganchos Narrativos', 'ganchos_narrativos', 'textarea')}
                        </DetailSection>
                    }

                    <DetailSection title="Mecânicas de Combate">
                        <div className="space-y-2">
                            <p><strong>Dano:</strong> {isEditing ? renderField('Dano', 'dano') : (('dano' in item && item.dano) || 'N/A')}</p>
                            <p><strong>Dados:</strong> {isEditing ? renderField('Dados', 'dados') : (('dados' in item && item.dados) || 'N/A')}</p>
                            <p><strong>Tipo de Dano:</strong> {isEditing ? renderField('Tipo de Dano', 'tipo_de_dano') : (('tipo_de_dano' in item && item.tipo_de_dano) || 'N/A')}</p>
                        </div>
                    </DetailSection>
                    
                    {'status_aplicado' in item && ('efeitos_secundarios' in item) && ((item.status_aplicado && item.status_aplicado !== "Nenhum") || (item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum")) && (
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
        
        {!isEditing && canGenerateVariant && (
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
