// FIX: Implemented the FilterPanel component to resolve module not found errors. This component provides the UI for filtering and configuring the item generation process.
import React from 'react';
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
    PROFESSION_OPTIONS
} from '../constants';
import { CATEGORIES, RARITIES } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onGenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
  aiFlags: AIFlags;
  onAIFlagChange: (key: keyof AIFlags, value: boolean) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onGenerate,
  onReset,
  isLoading,
  aiFlags,
  onAIFlagChange,
}) => {
    const isHunterCategory = filters.category === 'Caçador' || filters.category === 'NPC';
    const isWeaponCategory = filters.category === 'Arma' || filters.category === 'Acessório';

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex-shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <FilterIcon className="w-6 h-6" />
            <h2 className="text-lg font-bold text-white font-gangofthree">Filtros da Forja</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={isLoading}>
            <RefreshIcon className="w-4 h-4" /> Resetar
        </Button>
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

        {isHunterCategory && (
            <CollapsibleSection title="Detalhes do Caçador" defaultOpen>
                 <div className="space-y-4 pt-2">
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
                    <SearchableMultiSelect
                        label="Profissões"
                        options={PROFESSION_OPTIONS}
                        selected={filters.professions}
                        onChange={value => onFilterChange('professions', value)}
                    />
                </div>
            </CollapsibleSection>
        )}
        
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
        <Button onClick={onGenerate} disabled={isLoading} className="w-full forge-button">
          <SparklesIcon className="w-5 h-5" />
          {isLoading ? 'Forjando...' : 'Forjar'}
        </Button>
      </div>
    </Card>
  );
};
