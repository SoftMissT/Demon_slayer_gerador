import React from 'react';
// FIX: Added Rarity to type imports to be used in the onChange handler type assertion.
import type { FilterState, Category, Rarity } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { NumberInput } from './ui/NumberInput';
import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { RefreshIcon } from './icons/RefreshIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { HammerIcon } from './icons/HammerIcon';
import {
    CATEGORY_OPTIONS,
    THEME_OPTIONS,
    ORIGIN_OPTIONS,
    BREATHING_STYLE_OPTIONS,
    PROFESSION_OPTIONS,
    WEAPON_TYPE_OPTIONS,
    GRIP_TYPE_OPTIONS,
    RARITY_OPTIONS
} from '../constants';
import { AIFlags } from '../types';

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
  const handleCategoryChange = (value: string) => {
    onFilterChange('category', value as Category);
    onFilterChange('subCategory', ''); // Reset subcategory on category change
  };

  const isWeaponOrAccessory = filters.category === 'Arma' || filters.category === 'Acessório';
  const isHunter = filters.category === 'Caçador';

  return (
    <Card className="h-full flex flex-col bg-gray-800/30">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-bold text-white font-gangofthree">Filtros da Forja</h2>
        <p className="text-sm text-gray-400">Molde sua criação com precisão.</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4 inner-scroll">
        <SearchableSelect label="Categoria" options={CATEGORY_OPTIONS} value={filters.category} onChange={handleCategoryChange} />
        
        {isWeaponOrAccessory && (
            <SearchableSelect label="Tipo de Arma" options={WEAPON_TYPE_OPTIONS} value={filters.subCategory} onChange={(v) => onFilterChange('subCategory', v)} />
        )}
        
        {isHunter && (
          <>
            <SearchableSelect label="Arma Principal" options={WEAPON_TYPE_OPTIONS} value={filters.hunterWeapon} onChange={(v) => onFilterChange('hunterWeapon', v)} />
            <SearchableSelect label="Estilo de Empunhadura" options={GRIP_TYPE_OPTIONS} value={filters.subCategory} onChange={(v) => onFilterChange('subCategory', v)} />
          </>
        )}

        <NumberInput label="Quantidade" value={filters.quantity} onChange={(v) => onFilterChange('quantity', v)} min={1} max={5} />
        
        <CollapsibleSection title="Detalhes da Criação">
            <div className="space-y-4 pt-2">
                <SearchableSelect label="Temática / Era" options={THEME_OPTIONS} value={filters.tematica} onChange={(v) => onFilterChange('tematica', v)} />
                <SearchableMultiSelect label="Origens" options={ORIGIN_OPTIONS} selected={filters.origins} onChange={(v) => onFilterChange('origins', v)} />
                <SearchableMultiSelect label="Respirações" options={BREATHING_STYLE_OPTIONS} selected={filters.breathingStyles} onChange={(v) => onFilterChange('breathingStyles', v)} />
                <SearchableMultiSelect label="Profissões" options={PROFESSION_OPTIONS} selected={filters.professions} onChange={(v) => onFilterChange('professions', v)} />
                {/* FIX: Removed incorrect .map() on RARITY_OPTIONS which was already formatted, and corrected the type assertion in onChange to use the Rarity type. */}
                <SearchableSelect label="Raridade" options={RARITY_OPTIONS} value={filters.rarity} onChange={(v) => onFilterChange('rarity', v as Rarity)} />
                <Slider label="Nível/Poder Sugerido" value={filters.level} onChange={(e) => onFilterChange('level', parseInt(e.target.value, 10))} min={1} max={20} step={1} />
                {isWeaponOrAccessory && (
                    <Slider 
                        label="Preço Sugerido (ryo)" 
                        value={filters.suggestedPrice} 
                        onChange={(e) => onFilterChange('suggestedPrice', parseInt(e.target.value, 10))} 
                        min={1} 
                        max={10000} 
                        step={50} 
                        tooltip="Influencia a qualidade dos materiais e a raridade percebida."
                    />
                )}
            </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Diretivas Avançadas de IA">
            <div className="space-y-4 pt-2">
                <TextArea label="Modificador de Prompt" placeholder="Ex: 'Com foco em furtividade' ou 'inspirado em mitologia nórdica'" rows={3} value={filters.promptModifier} onChange={(e) => onFilterChange('promptModifier', e.target.value)} />
                <div className="p-2 bg-gray-900/50 rounded-md space-y-3">
                    <h4 className="text-sm font-semibold text-gray-300">Motores de IA</h4>
                    <Switch label="Gemini (Enriquecimento)" checked={aiFlags.useGemini} onChange={e => onAIFlagChange('useGemini', e.target.checked)} />
                    <Switch label="GPT-4o (Polimento)" checked={aiFlags.useGpt} onChange={e => onAIFlagChange('useGpt', e.target.checked)} />
                    <Switch label="DeepSeek (Conceito)" checked={aiFlags.useDeepSeek} onChange={e => onAIFlagChange('useDeepSeek', e.target.checked)} />
                </div>
            </div>
        </CollapsibleSection>
      </div>
      <div className="p-4 border-t border-gray-700 flex-shrink-0 space-y-2">
        <Button onClick={onGenerate} disabled={isLoading} className="w-full forge-button">
            {isLoading ? <SparklesIcon className="w-5 h-5 animate-pulse" /> : <HammerIcon className="w-5 h-5" />}
            {isLoading ? 'Forjando...' : 'Forjar'}
        </Button>
        <Button variant="secondary" onClick={onReset} disabled={isLoading} className="w-full">
            <RefreshIcon className="w-5 h-5" />
            Resetar Filtros
        </Button>
      </div>
    </Card>
  );
};