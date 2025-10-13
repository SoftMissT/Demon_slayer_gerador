import React, { useState, useCallback, useMemo, Fragment } from 'react';

import type { FilterState, AIFlags, Category, Tematica } from '../types';
import {
    CATEGORIES, RARITIES, TEMATICAS, TONES, PERSONALITIES, METAL_COLORS, COUNTRIES, TERRAINS,
    DAMAGE_TYPES, THREAT_SCALES, ONI_POWER_LEVELS, HUNTER_RANKS, EVENT_LEVELS, EVENT_THREAT_LEVELS,
    EVENT_TYPES, AI_FOCUS_GEMINI, AI_FOCUS_GPT, AI_FOCUS_DEEPSEEK, ORIGINS, INITIAL_FILTERS, DEMON_BLOOD_ARTS
} from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';

import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { TextInput } from './ui/TextInput';
import { TextArea } from './ui/TextArea';
import { Slider } from './ui/Slider';
import { Checkbox } from './ui/Checkbox';
import { HammerIcon } from './icons/HammerIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { ExpandIcon } from './icons/ExpandIcon';
import { CollapseIcon } from './icons/CollapseIcon';

interface FilterPanelProps {
  onGenerate: (filters: FilterState, count: number, promptModifier: string, aiFlags: AIFlags) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onGenerate, isLoading, isAuthenticated, onLoginClick }) => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [generationCount, setGenerationCount] = useState(1);
    const [promptModifier, setPromptModifier] = useState('');
    const [aiFlags, setAiFlags] = useState<AIFlags>({ useDeepSeek: true, useGemini: true, useGpt: true });
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Mapped constants for selects
    const breathingStyles = useMemo(() => ['Aleatória', 'Nenhuma', ...BREATHING_STYLES_DATA.map(b => b.nome)], []);
    const weaponTypes = useMemo(() => WEAPON_TYPES.map(w => w.name), []);
    const hunterArchetypes = useMemo(() => ['Aleatória', ...HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => s.nome))], []);
    const demonBloodArts = useMemo(() => DEMON_BLOOD_ARTS, []);
    
    const npcProfessions = useMemo(() => {
        const tematicaKey = filters.npcTematica as keyof typeof PROFESSIONS_BY_TEMATICA;
        if (tematicaKey && PROFESSIONS_BY_TEMATICA[tematicaKey]) {
            return PROFESSIONS_BY_TEMATICA[tematicaKey];
        }
        return (PROFESSIONS_BY_TEMATICA as any).all || [];
    }, [filters.npcTematica]);

    // Handlers
    const handleFilterChange = useCallback((field: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as Category | '';
        setFilters(prev => ({
            ...INITIAL_FILTERS,
            category: newCategory,
            styleReferences: prev.styleReferences,
            aiFocusGemini: prev.aiFocusGemini,
            aiFocusGpt: prev.aiFocusGpt,
            aiFocusDeepSeek: prev.aiFocusDeepSeek,
        }));
    }, []);

    const handleReset = useCallback(() => {
        setFilters(prev => ({
            ...INITIAL_FILTERS,
            category: prev.category,
            styleReferences: prev.styleReferences,
            aiFocusGemini: prev.aiFocusGemini,
            aiFocusGpt: prev.aiFocusGpt,
            aiFocusDeepSeek: prev.aiFocusDeepSeek,
        }));
    }, []);

    const handleGenerateClick = useCallback(() => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }
        if (!filters.category) {
            alert("Por favor, selecione uma categoria para forjar.");
            return;
        }
        onGenerate(filters, generationCount, promptModifier, aiFlags);
    }, [isAuthenticated, onLoginClick, onGenerate, filters, generationCount, promptModifier, aiFlags]);

    // Render logic
    const renderCategoryFilters = () => {
        const commonFields = (
             <TextArea
                label="Referências de Estilo Visual"
                value={filters.styleReferences}
                onChange={e => handleFilterChange('styleReferences', e.target.value)}
                placeholder="Ex: Ukiyo-e, Art Nouveau, Steampunk, Ghibli..."
                rows={2}
                tooltip="Influências visuais para a IA considerar ao gerar a descrição para imagem."
            />
        );

        switch (filters.category) {
            case 'Caçador':
                return (
                    <Fragment>
                        {commonFields}
                        <Select label="Temática" value={filters.hunterTematica} onChange={e => handleFilterChange('hunterTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País de Origem" value={filters.hunterCountry} onChange={e => handleFilterChange('hunterCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                        <SearchableSelect label="Origem/Background" value={filters.hunterOrigin} onChange={e => handleFilterChange('hunterOrigin', e.target.value)}>
                            {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                        </SearchableSelect>
                        <Select label="Arquétipo" value={filters.hunterArchetype} onChange={e => handleFilterChange('hunterArchetype', e.target.value)}>
                            {hunterArchetypes.map(a => <option key={a} value={a}>{a}</option>)}
                        </Select>
                        <Select label="Personalidade" value={filters.hunterPersonality} onChange={e => handleFilterChange('hunterPersonality', e.target.value)}>
                            {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                        <SearchableSelect label="Arma Principal" value={filters.hunterWeapon} onChange={e => handleFilterChange('hunterWeapon', e.target.value)}>
                            {weaponTypes.map(w => <option key={w} value={w}>{w}</option>)}
                        </SearchableSelect>
                        <SearchableMultiSelect label="Estilos de Respiração" selected={filters.hunterBreathingStyles} onChange={val => handleFilterChange('hunterBreathingStyles', val)} options={breathingStyles.filter(b => b !== 'Nenhuma')} maxSelection={2} />
                        <Select label="Rank" value={filters.hunterRank} onChange={e => handleFilterChange('hunterRank', e.target.value)}>
                            {HUNTER_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                        </Select>
                    </Fragment>
                );
            case 'Inimigo/Oni':
                 return (
                    <Fragment>
                        {commonFields}
                         <Select label="Temática" value={filters.oniTematica} onChange={e => handleFilterChange('oniTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País de Origem" value={filters.oniCountry} onChange={e => handleFilterChange('oniCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                        <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={e => handleFilterChange('oniPowerLevel', e.target.value)}>
                            {ONI_POWER_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                        <Select label="Personalidade" value={filters.oniPersonality} onChange={e => handleFilterChange('oniPersonality', e.target.value)}>
                            {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                        <SearchableSelect label="Arma (Opcional)" value={filters.oniWeapon} onChange={e => handleFilterChange('oniWeapon', e.target.value)}>
                            {weaponTypes.map(w => <option key={w} value={w}>{w}</option>)}
                        </SearchableSelect>
                        <SearchableMultiSelect label="Inspiração de Kekkijutsu" selected={filters.oniInspirationKekkijutsu} onChange={val => handleFilterChange('oniInspirationKekkijutsu', val)} options={demonBloodArts} maxSelection={3} />
                    </Fragment>
                );
            case 'NPC':
                 return (
                    <Fragment>
                        {commonFields}
                        <Select label="Temática" value={filters.npcTematica} onChange={e => handleFilterChange('npcTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País de Origem" value={filters.npcCountry} onChange={e => handleFilterChange('npcCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                         <SearchableSelect label="Origem/Background" value={filters.npcOrigin} onChange={e => handleFilterChange('npcOrigin', e.target.value)}>
                            {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                        </SearchableSelect>
                         <SearchableSelect label="Profissão" value={filters.npcProfession} onChange={e => handleFilterChange('npcProfession', e.target.value)}>
                            {npcProfessions.map(p => <option key={p} value={p}>{p}</option>)}
                        </SearchableSelect>
                        <Select label="Personalidade" value={filters.npcPersonality} onChange={e => handleFilterChange('npcPersonality', e.target.value)}>
                            {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                        <SearchableSelect label="Arma (Opcional)" value={filters.npcWeapon} onChange={e => handleFilterChange('npcWeapon', e.target.value)}>
                            {weaponTypes.map(w => <option key={w} value={w}>{w}</option>)}
                        </SearchableSelect>
                    </Fragment>
                );
            case 'Arma':
                 return (
                    <Fragment>
                        {commonFields}
                        <Select label="Raridade" value={filters.weaponRarity} onChange={e => handleFilterChange('weaponRarity', e.target.value)}>
                            {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                        </Select>
                        <Select label="Temática" value={filters.weaponTematica} onChange={e => handleFilterChange('weaponTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País de Origem" value={filters.weaponCountry} onChange={e => handleFilterChange('weaponCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                        <SearchableSelect label="Tipo de Arma" value={filters.weaponType} onChange={e => handleFilterChange('weaponType', e.target.value)}>
                            {weaponTypes.map(w => <option key={w} value={w}>{w}</option>)}
                        </SearchableSelect>
                         <Select label="Cor do Metal (Nichirin)" value={filters.weaponMetalColor} onChange={e => handleFilterChange('weaponMetalColor', e.target.value)}>
                            {METAL_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                         <Select label="Tipo de Dano" value={filters.weaponDamageType} onChange={e => handleFilterChange('weaponDamageType', e.target.value)}>
                            {DAMAGE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                        </Select>
                    </Fragment>
                );
            case 'Acessório':
                return (
                    <Fragment>
                        {commonFields}
                        <Select label="Raridade" value={filters.accessoryRarity} onChange={e => handleFilterChange('accessoryRarity', e.target.value)}>
                            {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                        </Select>
                        <Select label="Temática" value={filters.accessoryTematica} onChange={e => handleFilterChange('accessoryTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                         <SearchableSelect label="Origem Cultural" value={filters.accessoryOrigin} onChange={e => handleFilterChange('accessoryOrigin', e.target.value)}>
                            {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                        </SearchableSelect>
                        <SearchableSelect label="País de Origem" value={filters.accessoryCountry} onChange={e => handleFilterChange('accessoryCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                    </Fragment>
                );
             case 'Forma de Respiração':
                return (
                    <Fragment>
                        {commonFields}
                         <SearchableMultiSelect label="Respirações Base" selected={filters.baseBreathingStyles} onChange={val => handleFilterChange('baseBreathingStyles', val)} options={breathingStyles.filter(b => !['Nenhuma', 'Aleatória'].includes(b))} maxSelection={2} />
                        <Select label="Temática" value={filters.breathingFormTematica} onChange={e => handleFilterChange('breathingFormTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País de Origem" value={filters.breathingFormCountry} onChange={e => handleFilterChange('breathingFormCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                        <Select label="Tom" value={filters.breathingFormTone} onChange={e => handleFilterChange('breathingFormTone', e.target.value)}>
                            {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                        </Select>
                    </Fragment>
                );
            case 'Kekkijutsu':
                return (
                    <Fragment>
                        {commonFields}
                        <Select label="Temática" value={filters.kekkijutsuTematica} onChange={e => handleFilterChange('kekkijutsuTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País de Origem" value={filters.kekkijutsuCountry} onChange={e => handleFilterChange('kekkijutsuCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                        <Select label="Inspiração Principal" value={filters.kekkijutsuKekkijutsuInspiration} onChange={e => handleFilterChange('kekkijutsuKekkijutsuInspiration', e.target.value)}>
                            {demonBloodArts.map(k => <option key={k} value={k}>{k}</option>)}
                        </Select>
                    </Fragment>
                );
            case 'Local/Cenário':
                 return (
                    <Fragment>
                        {commonFields}
                        <Select label="Tom" value={filters.locationTone} onChange={e => handleFilterChange('locationTone', e.target.value)}>
                            {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                        </Select>
                         <Select label="Temática" value={filters.locationTematica} onChange={e => handleFilterChange('locationTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País" value={filters.locationCountry} onChange={e => handleFilterChange('locationCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                         <SearchableSelect label="Terreno" value={filters.locationTerrain} onChange={e => handleFilterChange('locationTerrain', e.target.value)}>
                            {TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}
                        </SearchableSelect>
                    </Fragment>
                );
             case 'Missões':
                return (
                    <Fragment>
                        {commonFields}
                        <Select label="Tom da Missão" value={filters.missionTone} onChange={e => handleFilterChange('missionTone', e.target.value)}>
                            {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                        </Select>
                        <Select label="Temática" value={filters.missionTematica} onChange={e => handleFilterChange('missionTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País" value={filters.missionCountry} onChange={e => handleFilterChange('missionCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                        <Select label="Escala da Ameaça" value={filters.missionThreatScale} onChange={e => handleFilterChange('missionThreatScale', e.target.value)}>
                            {THREAT_SCALES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                         <Slider label="Intensidade" min={1} max={5} step={1} value={filters.intensity} onChange={e => handleFilterChange('intensity', parseInt(e.target.value, 10))} />
                    </Fragment>
                );
            case 'World Building':
                 return (
                    <Fragment>
                        {commonFields}
                        <Select label="Tom" value={filters.wbTone} onChange={e => handleFilterChange('wbTone', e.target.value)}>
                            {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                        </Select>
                         <Select label="Temática" value={filters.wbTematica} onChange={e => handleFilterChange('wbTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País Foco" value={filters.wbCountry} onChange={e => handleFilterChange('wbCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                         <SearchableSelect label="Local Principal" value={filters.wbLocation} onChange={e => handleFilterChange('wbLocation', e.target.value)}>
                            {TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}
                        </SearchableSelect>
                        <Select label="Escala da Ameaça" value={filters.wbThreatScale} onChange={e => handleFilterChange('wbThreatScale', e.target.value)}>
                            {THREAT_SCALES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                    </Fragment>
                );
            case 'Evento':
                 return (
                    <Fragment>
                        {commonFields}
                        <Select label="Tom" value={filters.eventTone} onChange={e => handleFilterChange('eventTone', e.target.value)}>
                            {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                        </Select>
                         <Select label="Temática" value={filters.eventTematica} onChange={e => handleFilterChange('eventTematica', e.target.value)}>
                            {TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <SearchableSelect label="País" value={filters.eventCountry} onChange={e => handleFilterChange('eventCountry', e.target.value)}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </SearchableSelect>
                        <Select label="Escala do Evento" value={filters.eventLevel} onChange={e => handleFilterChange('eventLevel', e.target.value)}>
                            {EVENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </Select>
                        <Select label="Nível de Ameaça" value={filters.eventThreatLevel} onChange={e => handleFilterChange('eventThreatLevel', e.target.value)}>
                            {EVENT_THREAT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </Select>
                         <Select label="Tipo de Evento" value={filters.eventType} onChange={e => handleFilterChange('eventType', e.target.value)}>
                            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                    </Fragment>
                );
            default:
                return <p className="text-gray-500 text-center p-4">Selecione uma categoria para ver as opções de forja.</p>;
        }
    }

    return (
        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50 h-full flex flex-col">
            <header className="flex justify-between items-center pb-2 mb-2 border-b border-gray-700/50 flex-shrink-0">
                <h2 className="text-xl font-bold font-gangofthree text-white">Bigorna</h2>
                <Button variant="ghost" size="sm" onClick={handleReset} disabled={!filters.category}>
                    <RefreshIcon className="w-4 h-4" /> Resetar Filtros
                </Button>
            </header>
            
            <div className="flex-grow overflow-y-auto inner-scroll pr-2 -mr-2">
                <div className="space-y-4">
                    <Select label="Categoria" value={filters.category} onChange={handleCategoryChange}>
                        <option value="" disabled>Selecione uma categoria...</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                    
                    {renderCategoryFilters()}
                </div>
            </div>

            <div className="flex-shrink-0 pt-3 mt-3 border-t border-gray-700/50">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold font-gangofthree text-white">Opções de Geração</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                        {showAdvanced ? <CollapseIcon className="w-4 h-4"/> : <ExpandIcon className="w-4 h-4" />}
                        Avançado
                    </Button>
                </div>

                {showAdvanced && (
                    <div className="space-y-4 mb-4 p-3 bg-gray-800/50 rounded-lg">
                        <TextArea 
                            label="Modificador de Prompt (Prioridade Máxima)" 
                            value={promptModifier}
                            onChange={e => setPromptModifier(e.target.value)}
                            placeholder="Ex: 'Crie algo com um tom mais sombrio', 'Foco em um design biomecânico'"
                            rows={2}
                            tooltip="Uma instrução direta para a IA que sobrepõe outros filtros."
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Select label="Foco Gemini" value={filters.aiFocusGemini} onChange={e => handleFilterChange('aiFocusGemini', e.target.value)} tooltip="Define a principal tarefa do Gemini na criação.">
                                {AI_FOCUS_GEMINI.map(f => <option key={f} value={f}>{f}</option>)}
                            </Select>
                            <Select label="Foco GPT" value={filters.aiFocusGpt} onChange={e => handleFilterChange('aiFocusGpt', e.target.value)} tooltip="Define como o GPT-4o irá refinar o texto.">
                                {AI_FOCUS_GPT.map(f => <option key={f} value={f}>{f}</option>)}
                            </Select>
                            <Select label="Foco DeepSeek" value={filters.aiFocusDeepSeek} onChange={e => handleFilterChange('aiFocusDeepSeek', e.target.value)} tooltip="Define a tarefa do DeepSeek na criação de mecânicas.">
                                {AI_FOCUS_DEEPSEEK.map(f => <option key={f} value={f}>{f}</option>)}
                            </Select>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Modelos a Utilizar</p>
                            <div className="flex items-center gap-4">
                                <Checkbox label="DeepSeek" checked={aiFlags.useDeepSeek} onChange={e => setAiFlags(f => ({ ...f, useDeepSeek: e.target.checked }))} />
                                <Checkbox label="Gemini" checked={aiFlags.useGemini} onChange={e => setAiFlags(f => ({ ...f, useGemini: e.target.checked }))} />
                                <Checkbox label="GPT-4o" checked={aiFlags.useGpt} onChange={e => setAiFlags(f => ({ ...f, useGpt: e.target.checked }))} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-end gap-3">
                    <div className="w-24">
                        <TextInput 
                            label="Quantidade" 
                            type="number" 
                            min="1" max="5" 
                            value={generationCount}
                            onChange={e => setGenerationCount(Math.max(1, Math.min(5, parseInt(e.target.value, 10) || 1)))}
                        />
                    </div>
                    <div className="flex-grow">
                         <Button 
                            onClick={handleGenerateClick} 
                            disabled={isLoading || !filters.category} 
                            className="w-full forge-button"
                        >
                            <HammerIcon className="w-5 h-5"/>
                            {isLoading ? 'Forjando...' : (generationCount > 1 ? `Forjar ${generationCount} Itens` : 'Forjar Item')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
