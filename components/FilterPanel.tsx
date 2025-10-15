// FIX: Implemented the FilterPanel component to resolve module not found errors. This component provides the UI for filtering and configuring the item generation process.
import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterState, AIFlags, Category, Rarity } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { NumberInput } from './ui/NumberInput';
import { Slider } from './ui/Slider';
import { TextArea } from './ui/TextArea';
import { TextInput } from './ui/TextInput';
import { Switch } from './ui/Switch';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { SparklesIcon } from './icons/SparklesIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { FilterIcon } from './icons/FilterIcon';
import {
    RARITY_OPTIONS,
    PAIS_OPTIONS,
    THEME_OPTIONS,
    ORIGIN_OPTIONS,
    BREATHING_STYLE_OPTIONS,
    WEAPON_TYPE_OPTIONS,
    KEKKIJUTSU_INSPIRATION_OPTIONS,
    TERRAIN_TYPE_OPTIONS,
    MISSION_TYPE_OPTIONS,
    EVENT_TYPE_OPTIONS
} from '../constants';
import { CATEGORIES, RARITIES } from '../types';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { Tooltip } from './ui/Tooltip';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onGenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
  aiFlags: AIFlags;
  onAIFlagChange: (key: keyof AIFlags, value: boolean) => void;
  isMobile?: boolean;
  onViewResults?: () => void;
  historyCount?: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onGenerate,
  onReset,
  isLoading,
  aiFlags,
  onAIFlagChange,
  isMobile,
  onViewResults,
  historyCount = 0
}) => {
    // Category-based flags for conditional rendering
    const isHunterCategory = filters.category === 'Caçador';
    const isNpcCategory = filters.category === 'NPC';
    const isWeaponCategory = filters.category === 'Arma' || filters.category === 'Acessório';
    const isKekkijutsuCategory = filters.category === 'Kekkijutsu';
    const isLocationCategory = filters.category === 'Local/Cenário';
    const isMissionCategory = filters.category === 'Missões';
    const isEventCategory = filters.category === 'Evento';
    
    // Flag for categories that have Rarity and Level
    const hasGameParams = ['Arma', 'Acessório', 'Caçador', 'Inimigo/Oni', 'Kekkijutsu', 'Respiração', 'NPC'].includes(filters.category);
    
    const professionOptionsForTheme = useMemo(() => {
        const professions = PROFESSIONS_BY_TEMATICA[filters.tematica] || PROFESSIONS_BY_TEMATICA.all;
        return professions.map(p => ({ value: p, label: p }));
    }, [filters.tematica]);

    useEffect(() => {
        const validProfessions = (PROFESSIONS_BY_TEMATICA[filters.tematica] || PROFESSIONS_BY_TEMATICA.all);
        const currentProfessions = filters.professions;

        const updatedProfessions = currentProfessions.filter(p => validProfessions.includes(p));

        if (updatedProfessions.length !== currentProfessions.length) {
            onFilterChange('professions', updatedProfessions);
        }
    }, [filters.tematica, filters.professions, onFilterChange]);

    const categorySpecificFilterVariants = {
        hidden: { opacity: 0, y: -15, transition: { duration: 0.2 } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex-shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <FilterIcon className="w-6 h-6" />
            <h2 className="text-lg font-bold text-white font-gangofthree">Filtros da Forja</h2>
        </div>
        <Tooltip text="Resetar Filtros">
            <Button variant="ghost" size="sm" onClick={onReset} disabled={isLoading} className="!p-2" aria-label="Resetar filtros">
                <RefreshIcon className="w-5 h-5" />
            </Button>
        </Tooltip>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto inner-scroll">
        <div className="grid grid-cols-2 gap-4">
            <Select 
                label="Categoria"
                options={CATEGORIES}
                value={filters.category}
                onChange={value => onFilterChange('category', value as Category)}
            />
            <NumberInput 
                label="Quantidade"
                value={filters.quantity}
                onChange={value => onFilterChange('quantity', value)}
                min={1} max={5}
            />
        </div>
        
        <SearchableSelect 
            label="Temática Principal"
            options={THEME_OPTIONS}
            value={filters.tematica}
            onChange={value => onFilterChange('tematica', value)}
        />
        
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={filters.category}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={categorySpecificFilterVariants}
                className="space-y-4"
            >
                {isMissionCategory && (
                    <SearchableSelect 
                        label="Tipo de Missão"
                        options={MISSION_TYPE_OPTIONS}
                        value={filters.missionType}
                        onChange={value => onFilterChange('missionType', value)}
                    />
                )}
                {isEventCategory && (
                    <SearchableSelect 
                        label="Tipo de Evento"
                        options={EVENT_TYPE_OPTIONS}
                        value={filters.eventType}
                        onChange={value => onFilterChange('eventType', value)}
                    />
                )}
                {isLocationCategory && (
                     <SearchableSelect 
                        label="Tipo de Terreno"
                        options={TERRAIN_TYPE_OPTIONS}
                        value={filters.terrainType}
                        onChange={value => onFilterChange('terrainType', value)}
                    />
                )}
                {isKekkijutsuCategory && (
                    <SearchableMultiSelect
                        label="Inspirações Elementais/Conceituais"
                        options={KEKKIJUTSU_INSPIRATION_OPTIONS}
                        selected={filters.kekkijutsuInspirations}
                        onChange={value => onFilterChange('kekkijutsuInspirations', value)}
                    />
                )}
                {isWeaponCategory && (
                    <CollapsibleSection title="Detalhes da Arma/Acessório" defaultOpen>
                        <div className="space-y-4 pt-2">
                            <TextInput
                                label="Dano Sugerido"
                                value={filters.weaponDamage}
                                onChange={e => onFilterChange('weaponDamage', e.target.value)}
                                placeholder="Ex: '2d8 Corte', 'Variável'"
                            />
                            <TextArea
                                label="Efeitos Secundários"
                                value={filters.weaponEffects}
                                onChange={e => onFilterChange('weaponEffects', e.target.value)}
                                rows={2}
                                placeholder="Ex: 'Aplica Lentidão no acerto crítico.'"
                            />
                        </div>
                    </CollapsibleSection>
                )}
                {(isHunterCategory || isNpcCategory) && (
                    <CollapsibleSection title={isHunterCategory ? "Detalhes do Caçador" : "Detalhes do NPC"} defaultOpen>
                         <div className="space-y-4 pt-2">
                            {isHunterCategory && (
                                <>
                                    <SearchableMultiSelect
                                        label="Estilos de Respiração"
                                        options={BREATHING_STYLE_OPTIONS}
                                        selected={filters.breathingStyles}
                                        onChange={value => onFilterChange('breathingStyles', value)}
                                    />
                                     <SearchableSelect
                                        label="Arma Principal"
                                        options={WEAPON_TYPE_OPTIONS}
                                        value={filters.hunterWeapon}
                                        onChange={value => onFilterChange('hunterWeapon', value)}
                                    />
                                </>
                            )}
                             <TextInput
                                label="Classe/Arquétipo"
                                value={filters.characterClass}
                                onChange={e => onFilterChange('characterClass', e.target.value)}
                                placeholder="Ex: 'Duelista Ágil', 'Especialista em Suporte'"
                            />
                             <TextArea
                                label="Background/História"
                                value={filters.characterBackground}
                                onChange={e => onFilterChange('characterBackground', e.target.value)}
                                rows={3}
                                placeholder="Ex: 'Órfão de uma vila destruída por um Oni.'"
                            />
                            <SearchableMultiSelect
                                label="Profissões / Papel Social"
                                options={professionOptionsForTheme}
                                selected={filters.professions}
                                onChange={value => onFilterChange('professions', value)}
                            />
                        </div>
                    </CollapsibleSection>
                )}
                 {hasGameParams && (
                    <CollapsibleSection title="Parâmetros de Jogo">
                         <div className="space-y-4 pt-2">
                            <Select 
                                label="Raridade"
                                options={RARITIES}
                                value={filters.rarity}
                                onChange={value => onFilterChange('rarity', value as Rarity)}
                            />
                             <Slider
                                label="Nível/Poder Sugerido"
                                value={filters.level}
                                onChange={e => onFilterChange('level', parseInt(e.target.value, 10))}
                                min={1} max={100} step={1}
                            />
                            {isWeaponCategory && (
                                <Slider
                                    label="Preço Sugerido (Ryo)"
                                    value={filters.suggestedPrice}
                                    onChange={e => onFilterChange('suggestedPrice', parseInt(e.target.value, 10))}
                                    min={10} max={100000} step={10}
                                />
                            )}
                        </div>
                    </CollapsibleSection>
                )}
            </motion.div>
        </AnimatePresence>

        <CollapsibleSection title="Detalhes do Mundo">
            <div className="space-y-4 pt-2">
                <SearchableSelect 
                    label="País/Cultura de Inspiração"
                    options={PAIS_OPTIONS}
                    value={filters.pais}
                    onChange={value => onFilterChange('pais', value)}
                />
                <SearchableMultiSelect
                    label="Origens"
                    options={ORIGIN_OPTIONS}
                    selected={filters.origins}
                    onChange={value => onFilterChange('origins', value)}
                />
            </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Instruções para a IA">
            <div className="space-y-4 pt-2">
                <TextArea
                    label="Modificador de Prompt"
                    value={filters.promptModifier}
                    onChange={e => onFilterChange('promptModifier', e.target.value)}
                    rows={3}
                    placeholder="Ex: 'Foque em um design sombrio e gótico' ou 'Crie algo cômico e inesperado'."
                />
                 <TextInput
                    label="Referências de Estilo (Visual)"
                    value={filters.styleReferences}
                    onChange={e => onFilterChange('styleReferences', e.target.value)}
                    placeholder="Ex: 'art by yoshitaka amano, final fantasy'"
                />
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Configurações de IA">
            <div className="space-y-3 pt-2">
                <p className="text-xs text-gray-400">Selecione quais modelos de IA usar no processo de geração em 3 etapas.</p>
                <div className="space-y-2">
                    <Switch label="1. DeepSeek (Conceito)" checked={aiFlags.useDeepSeek} onChange={e => onAIFlagChange('useDeepSeek', e.target.checked)} />
                    <Switch label="2. Gemini (Estrutura)" checked={aiFlags.useGemini} onChange={e => onAIFlagChange('useGemini', e.target.checked)} />
                    <Switch label="3. GPT-4o (Polimento)" checked={aiFlags.useGpt} onChange={e => onAIFlagChange('useGpt', e.target.checked)} />
                </div>
                <div className="pt-2 space-y-2">
                     <TextInput
                        label="Foco para Gemini"
                        value={filters.aiFocusGemini}
                        onChange={e => onFilterChange('aiFocusGemini', e.target.value)}
                        placeholder="Ex: 'desenvolver a lore'"
                    />
                     <TextInput
                        label="Foco para GPT-4o"
                        value={filters.aiFocusGpt}
                        onChange={e => onFilterChange('aiFocusGpt', e.target.value)}
                        placeholder="Ex: 'tornar o texto mais poético'"
                    />
                </div>
            </div>
        </CollapsibleSection>
      </div>

      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className={`flex items-center gap-2 ${isMobile && historyCount > 0 ? 'grid grid-cols-2' : ''}`}>
            <Button onClick={onGenerate} disabled={isLoading} className="w-full forge-button">
              <SparklesIcon className="w-5 h-5" />
              {isLoading ? 'Forjando...' : 'Forjar'}
            </Button>
            {isMobile && historyCount > 0 && (
                <Button onClick={onViewResults} variant="secondary" className="w-full">
                   Ver Resultados ({historyCount}) <ChevronRightIcon className="w-5 h-5" />
                </Button>
            )}
        </div>
      </div>
    </Card>
  );
};