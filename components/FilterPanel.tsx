import React, { useState, useCallback, useMemo } from 'react';
import type { FilterState, AIFlags, Category, Rarity, Tematica, Tone } from '../types';
import {
    CATEGORIES, RARITIES, TEMATICAS, TONES, DEMON_BLOOD_ARTS, PERSONALITIES, METAL_COLORS,
    COUNTRIES, TERRAINS, DAMAGE_TYPES, THREAT_SCALES, ONI_POWER_LEVELS, HUNTER_RANKS, EVENT_LEVELS,
    EVENT_THREAT_LEVELS, EVENT_TYPES, AI_FOCUS_GEMINI, AI_FOCUS_GPT, AI_FOCUS_DEEPSEEK, INITIAL_FILTERS, ORIGINS
} from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';

import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { TextInput } from './ui/TextInput';
import { TextArea } from './ui/TextArea';
import { Switch } from './ui/Switch';
import { Slider } from './ui/Slider';
import { NumberInput } from './ui/NumberInput';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { SparklesIcon } from './icons/SparklesIcon';
import { AnvilIcon } from './icons/AnvilIcon';

interface FilterPanelProps {
    onGenerate: (filters: FilterState, count: number, promptModifier: string, aiFlags: AIFlags) => void;
    isLoading: boolean;
    isAuthenticated: boolean;
    onLoginClick: () => void;
}

const breathingStyleOptions = BREATHING_STYLES_DATA.map(style => ({
    value: style.nome,
    label: style.nome
}));

const archetypesOptions = [
    { value: '', label: 'Aleatório' },
    ...HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => ({ value: s.nome, label: `${s.nome} (${a.arquétipo})` })))
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ onGenerate, isLoading }) => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [count, setCount] = useState(1);
    const [promptModifier, setPromptModifier] = useState('');
    const [aiFlags, setAiFlags] = useState<AIFlags>({ useDeepSeek: true, useGemini: true, useGpt: true });

    const handleFilterChange = useCallback((field: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(filters, count, promptModifier, aiFlags);
    };

    const isGenerateDisabled = isLoading || !filters.category || (!aiFlags.useDeepSeek && !aiFlags.useGemini && !aiFlags.useGpt);

    const tematicaKey = useMemo(() => {
        if (!filters.category) return null;
        const categoryToKeyMap: Partial<Record<Category, keyof FilterState>> = {
            'Caçador': 'hunterTematica', 'Inimigo/Oni': 'oniTematica', 'NPC': 'npcTematica',
            'Arma': 'weaponTematica', 'Acessório': 'accessoryTematica', 'Forma de Respiração': 'breathingFormTematica',
            'Kekkijutsu': 'kekkijutsuTematica', 'Local/Cenário': 'locationTematica', 'Missões': 'missionTematica',
            'World Building': 'wbTematica', 'Evento': 'eventTematica',
        };
        return categoryToKeyMap[filters.category] || null;
    }, [filters.category]);

    const renderCategorySpecificFilters = () => {
        switch (filters.category) {
            case 'Caçador':
                return (
                    <>
                        <p className="filter-subheader">Identidade</p>
                        <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.hunterCountry} onChange={v => handleFilterChange('hunterCountry', v)} />
                        <SearchableSelect label="Origem (Background)" options={ORIGINS} value={filters.hunterOrigin} onChange={v => handleFilterChange('hunterOrigin', v)} />
                        <Select label="Personalidade" options={PERSONALITIES} value={filters.hunterPersonality} onChange={v => handleFilterChange('hunterPersonality', v)} />
                        
                        <p className="filter-subheader">Estilo de Combate</p>
                        <Select label="Arquétipo" options={archetypesOptions} value={filters.hunterArchetype} onChange={v => handleFilterChange('hunterArchetype', v)} />
                        <SearchableMultiSelect label="Respirações (Base)" options={breathingStyleOptions} selected={filters.hunterBreathingStyles} onChange={v => handleFilterChange('hunterBreathingStyles', v)} />
                        <Select label="Rank" options={HUNTER_RANKS} value={filters.hunterRank} onChange={v => handleFilterChange('hunterRank', v)} />
                    </>
                );
             case 'Inimigo/Oni':
                return (
                    <>
                         <p className="filter-subheader">Poder</p>
                        <Select label="Nível de Poder" options={ONI_POWER_LEVELS} value={filters.oniPowerLevel} onChange={v => handleFilterChange('oniPowerLevel', v)} />
                        
                        <p className="filter-subheader">Origem e Inspiração</p>
                        <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.oniCountry} onChange={v => handleFilterChange('oniCountry', v)} />
                        <Select label="Inspiração (Respiração)" options={['Nenhuma', ...breathingStyleOptions.map(b => b.value)]} value={filters.oniInspirationBreathing} onChange={v => handleFilterChange('oniInspirationBreathing', v)} />
                    </>
                );
            case 'NPC':
                return (
                    <>
                        <p className="filter-subheader">Identidade</p>
                        <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.npcCountry} onChange={v => handleFilterChange('npcCountry', v)} />
                        <SearchableSelect label="Origem (Background)" options={ORIGINS} value={filters.npcOrigin} onChange={v => handleFilterChange('npcOrigin', v)} />
                    </>
                );
            case 'Arma':
                 return (
                    <>
                        <p className="filter-subheader">Atributos Principais</p>
                        {/* FIX: Spread the readonly RARITIES array to make it mutable for the options prop. */}
                        <Select label="Raridade" options={[...RARITIES]} value={filters.weaponRarity} onChange={v => handleFilterChange('weaponRarity', v)} />
                        <SearchableSelect label="Tipo de Arma" options={WEAPON_TYPES.map(w => w.name)} value={filters.weaponType} onChange={v => handleFilterChange('weaponType', v)} />
                        
                        <p className="filter-subheader">Origem e Manufatura</p>
                        <Select label="Cor do Metal (Nichirin)" options={METAL_COLORS} value={filters.weaponMetalColor} onChange={v => handleFilterChange('weaponMetalColor', v)} />
                    </>
                );
            case 'Acessório':
                return (
                     // FIX: Spread the readonly RARITIES array to make it mutable for the options prop.
                     <Select label="Raridade" options={[...RARITIES]} value={filters.accessoryRarity} onChange={v => handleFilterChange('accessoryRarity', v)} />
                );
            case 'Forma de Respiração':
                 return (
                    <>
                        <SearchableMultiSelect label="Respirações (Base)" options={breathingStyleOptions} selected={filters.baseBreathingStyles} onChange={v => handleFilterChange('baseBreathingStyles', v)} />
                        {/* FIX: Spread the readonly TONES array to make it mutable for the options prop. */}
                        <Select label="Tom" options={[...TONES]} value={filters.breathingFormTone} onChange={v => handleFilterChange('breathingFormTone', v as Tone)} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900/50 rounded-lg border border-gray-700/50">
            <header className="flex justify-between items-center p-3 border-b border-gray-700/50 flex-shrink-0">
                <h2 className="text-xl font-bold font-gangofthree text-white flex items-center gap-2"><AnvilIcon className="w-6 h-6"/> Bigorna</h2>
                 <Button variant="ghost" size="sm" onClick={() => setFilters(INITIAL_FILTERS)}>Limpar Filtros</Button>
            </header>

            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto inner-scroll p-3 space-y-4">
                <SearchableSelect
                    label="Categoria"
                    options={[...CATEGORIES]}
                    value={filters.category}
                    onChange={v => handleFilterChange('category', v as Category)}
                    placeholder="Selecione uma categoria..."
                />

                {filters.category && (
                    <>
                        <Select
                            label="Temática Principal"
                            options={[...TEMATICAS]}
                            value={tematicaKey ? filters[tematicaKey as keyof FilterState] as string : ''}
                            onChange={v => {
                                if (tematicaKey) {
                                    handleFilterChange(tematicaKey, v as Tematica);
                                }
                            }}
                            placeholder="Aleatória"
                            disabled={!tematicaKey}
                        />
                        {renderCategorySpecificFilters()}
                    </>
                )}

                 <CollapsibleSection title="Opções Avançadas de IA" wrapperClassName='border-t border-gray-700/50 pt-2 mt-4'>
                    <div className="space-y-4 p-2">
                        <TextArea label="Modificador de Prompt (Prioridade Máxima)" value={promptModifier} onChange={e => setPromptModifier(e.target.value)} rows={2} placeholder="Ex: 'Crie algo com um tom mais sombrio', 'Foco em um design biomecânico'"/>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                            <Select label="Foco Gemini" tooltip="Define a abordagem principal do Gemini na criação." options={AI_FOCUS_GEMINI} value={filters.aiFocusGemini} onChange={v => handleFilterChange('aiFocusGemini', v)} />
                            <Select label="Foco GPT" tooltip="Define a abordagem do GPT no polimento do texto." options={AI_FOCUS_GPT} value={filters.aiFocusGpt} onChange={v => handleFilterChange('aiFocusGpt', v)} />
                            <Select label="Foco DeepSeek" tooltip="Define a abordagem do Deepseek na ideação." options={AI_FOCUS_DEEPSEEK} value={filters.aiFocusDeepSeek} onChange={v => handleFilterChange('aiFocusDeepSeek', v)} />
                        </div>
                    </div>
                </CollapsibleSection>

                 <div className="pt-4 border-t border-gray-700/50">
                    <p className="text-sm font-semibold mb-2 text-gray-300">Modelos a Utilizar:</p>
                    <div className="flex items-center justify-around gap-2">
                        <Switch label="DeepSeek" checked={aiFlags.useDeepSeek} onChange={e => setAiFlags(f => ({ ...f, useDeepSeek: e.target.checked }))}/>
                        <Switch label="Gemini" checked={aiFlags.useGemini} onChange={e => setAiFlags(f => ({ ...f, useGemini: e.target.checked }))} />
                        <Switch label="GPT-4o" checked={aiFlags.useGpt} onChange={e => setAiFlags(f => ({ ...f, useGpt: e.target.checked }))} />
                    </div>
                </div>
            </form>
            
            <footer className="p-3 border-t border-gray-700/50 flex-shrink-0 space-y-3">
                 <NumberInput label="Quantidade" value={count} onChange={setCount} min={1} max={5} />
                <Button type="submit" onClick={handleSubmit} disabled={isGenerateDisabled} className="w-full forge-button" size="lg">
                    <SparklesIcon className="w-5 h-5"/>
                    {isLoading ? 'Forjando...' : 'Forjar'}
                </Button>
            </footer>
        </div>
    );
};
