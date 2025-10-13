import React from 'react';
import type { FilterState, AIFlags, Category, Rarity, Tematica } from '../types';
import { Button } from './ui/Button';
import { NumberInput } from './ui/NumberInput';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { TextArea } from './ui/TextArea';
import { Switch } from './ui/Switch';
import { HammerIcon } from './icons/HammerIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { CATEGORY_OPTIONS, RARITY_OPTIONS, THEME_OPTIONS, ORIGIN_OPTIONS, BREATHING_STYLE_OPTIONS, PROFESSION_OPTIONS } from '../constants';
import { AccordionSection } from './AccordionSection';

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
    onAIFlagChange
}) => {
    return (
        <div className="h-full flex flex-col bg-gray-800/30 rounded-lg">
            <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <h2 className="text-lg font-bold text-white font-gangofthree">Painel de Forja</h2>
                <p className="text-sm text-gray-400">Ajuste os filtros para sua criação.</p>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 inner-scroll">
                 <SearchableSelect
                    label="Categoria Principal"
                    options={CATEGORY_OPTIONS}
                    value={filters.category}
                    onChange={(value) => onFilterChange('category', value as Category)}
                />
                
                <AccordionSection title="Detalhes do Personagem/Item">
                    <div className="space-y-4 pt-4">
                        <SearchableSelect
                            label="Temática / Era"
                            options={THEME_OPTIONS}
                            value={filters.tematica}
                            onChange={(value) => onFilterChange('tematica', value as Tematica)}
                        />
                        <SearchableMultiSelect
                            label="Origens"
                            options={ORIGIN_OPTIONS}
                            selected={filters.origins}
                            onChange={(value) => onFilterChange('origins', value)}
                        />
                        <SearchableMultiSelect
                            label="Estilos de Respiração"
                            options={BREATHING_STYLE_OPTIONS}
                            selected={filters.breathingStyles}
                            onChange={(value) => onFilterChange('breathingStyles', value)}
                        />
                        <SearchableMultiSelect
                            label="Profissões"
                            options={PROFESSION_OPTIONS}
                            selected={filters.professions}
                            onChange={(value) => onFilterChange('professions', value)}
                        />
                        <SearchableSelect
                            label="Raridade Desejada"
                            options={RARITY_OPTIONS}
                            value={filters.rarity}
                            onChange={(value) => onFilterChange('rarity', value as Rarity)}
                        />
                    </div>
                </AccordionSection>
                
                <AccordionSection title="Instruções para IA">
                     <div className="space-y-4 pt-4">
                        <TextArea
                            label="Modificador de Prompt"
                            placeholder="Ex: 'Com foco em furtividade' ou 'com um toque cômico'"
                            value={filters.promptModifier}
                            onChange={(e) => onFilterChange('promptModifier', e.target.value)}
                        />
                         <TextArea
                            label="Referências de Estilo Visual"
                            placeholder="Ex: 'estilo de arte de Genshin Impact, iluminação cinematográfica, paleta de cores sombria'"
                            value={filters.styleReferences}
                            onChange={(e) => onFilterChange('styleReferences', e.target.value)}
                            rows={3}
                        />
                    </div>
                </AccordionSection>

                <AccordionSection title="Configuração de Geração">
                    <div className="space-y-4 pt-4">
                        <NumberInput
                            label="Quantidade a Gerar"
                            value={filters.quantity}
                            onChange={(value) => onFilterChange('quantity', value)}
                            min={1}
                            max={5}
                        />
                         <div className="space-y-2 pt-2">
                             <p className="text-sm font-medium text-gray-400">Modelos de IA a Utilizar:</p>
                            <Switch label="DeepSeek (Conceito)" checked={aiFlags.useDeepSeek} onChange={(e) => onAIFlagChange('useDeepSeek', e.target.checked)} />
                            <Switch label="Gemini (Estrutura)" checked={aiFlags.useGemini} onChange={(e) => onAIFlagChange('useGemini', e.target.checked)} />
                            <Switch label="GPT-4o (Polimento)" checked={aiFlags.useGpt} onChange={(e) => onAIFlagChange('useGpt', e.target.checked)} />
                        </div>
                    </div>
                </AccordionSection>
            </div>

            <div className="p-4 border-t border-gray-700 flex-shrink-0 space-y-2">
                <Button 
                    onClick={onGenerate} 
                    disabled={isLoading}
                    className="w-full forge-button"
                    size="lg"
                >
                    <HammerIcon className="w-5 h-5" />
                    {isLoading ? 'Forjando...' : 'Forjar Item'}
                </Button>
                <Button 
                    onClick={onReset} 
                    disabled={isLoading} 
                    variant="secondary" 
                    className="w-full"
                >
                     <RefreshIcon className="w-5 h-5" />
                    Resetar Filtros
                </Button>
            </div>
        </div>
    );
};
