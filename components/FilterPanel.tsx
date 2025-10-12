import React, { useState, useCallback, useMemo } from 'react';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { AnvilIcon } from './icons/AnvilIcon';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { SearchableSelect } from './ui/SearchableSelect';
import { Slider } from './ui/Slider';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';
import useLocalStorage from '../hooks/useLocalStorage';
import {
    CATEGORIES, RARITIES, TEMATICAS, TONES, DEMON_BLOOD_ARTS, PERSONALITIES,
    METAL_COLORS, COUNTRIES, TERRAINS, THREAT_SCALES, ONI_POWER_LEVELS, ORIGINS, 
    INITIAL_FILTERS, HUNTER_RANKS, EVENT_LEVELS, EVENT_THREAT_LEVELS, EVENT_TYPES,
    AI_FOCUS_GEMINI, AI_FOCUS_GPT, AI_FOCUS_DEEPSEEK
} from '../constants';
import type { FilterState, Category, Tematica, Rarity, Tone, FilterPreset } from '../types';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { RefreshIcon } from './icons/RefreshIcon';

interface FilterPanelProps {
    onGenerate: (filters: FilterState, count: number, promptModifier?: string) => void;
    isLoading: boolean;
}

const breathingStylesOptions = BREATHING_STYLES_DATA.map(style => style.nome);
const hunterArchetypeOptions = ['Aleatória', ...HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => s.nome))];
const weaponTypeOptions = WEAPON_TYPES.map(w => w.name);
const accessoryInspirationOptions = ['Nenhuma', 'Máscara', 'Brinco', 'Colar', 'Anel', 'Cinto', 'Luva', 'Haori (Kimono)', 'Amuleto'];

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input 
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            {...props}
        />
    </div>
);


export const FilterPanel: React.FC<FilterPanelProps> = ({ onGenerate, isLoading }) => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [count, setCount] = useState(1);
    const [promptModifier, setPromptModifier] = useState('');
    const [presets, setPresets] = useLocalStorage<FilterPreset[]>('kimetsu-forge-presets', []);
    const [selectedPreset, setSelectedPreset] = useState<string>('');

    const handleFilterChange = useCallback(<K extends keyof FilterState>(field: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
        setSelectedPreset('');
        setPromptModifier('');
        setCount(1);
    }, []);
    
    const handleSavePreset = useCallback(() => {
        const name = prompt("Digite um nome para o preset:");
        if (name && name.trim()) {
            if (presets.some(p => p.name === name.trim())) {
                alert('Já existe um preset com este nome.');
                return;
            }
            const newPreset: FilterPreset = { name: name.trim(), filters };
            setPresets(prev => [...prev, newPreset].sort((a, b) => a.name.localeCompare(b.name)));
            setSelectedPreset(name.trim());
        }
    }, [filters, presets, setPresets]);

    const handlePresetChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        setSelectedPreset(name);
        if (name) {
            const preset = presets.find(p => p.name === name);
            if (preset) {
                setFilters(preset.filters);
            }
        } else {
            setFilters(INITIAL_FILTERS);
        }
    }, [presets]);

    const handleDeletePreset = useCallback(() => {
        if (selectedPreset && window.confirm(`Tem certeza que deseja deletar o preset "${selectedPreset}"?`)) {
            setPresets(prev => prev.filter(p => p.name !== selectedPreset));
            setSelectedPreset('');
            setFilters(INITIAL_FILTERS); 
        }
    }, [selectedPreset, setPresets]);


    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as Category | '';
        setFilters(prev => ({
            ...INITIAL_FILTERS,
            category: newCategory,
        }));
    };
    
    const professionOptions = useMemo(() => {
        const eraKey = filters.npcTematica;
        if (eraKey && PROFESSIONS_BY_TEMATICA[eraKey]) {
            return PROFESSIONS_BY_TEMATICA[eraKey];
        }
        return PROFESSIONS_BY_TEMATICA.all;
    }, [filters.npcTematica]);

    const renderCategorySpecificFilters = () => {
        switch (filters.category) {
            case 'Caçador': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SearchableSelect label="Temática" value={filters.hunterTematica || ''} onChange={e => handleFilterChange('hunterTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Rank" value={filters.hunterRank} onChange={e => handleFilterChange('hunterRank', e.target.value)}>{HUNTER_RANKS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País de Origem (Cultural)" value={filters.hunterCountry} onChange={e => handleFilterChange('hunterCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Origem (Background)" value={filters.hunterOrigin} onChange={e => handleFilterChange('hunterOrigin', e.target.value)}>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Arquétipo" value={filters.hunterArchetype} onChange={e => handleFilterChange('hunterArchetype', e.target.value)}>{hunterArchetypeOptions.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Personalidade" value={filters.hunterPersonality} onChange={e => handleFilterChange('hunterPersonality', e.target.value)}>{PERSONALITIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Arma Principal" value={filters.hunterWeapon} onChange={e => handleFilterChange('hunterWeapon', e.target.value)}>{weaponTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableMultiSelect label="Inspiração (Respirações)" options={breathingStylesOptions} selected={filters.hunterBreathingStyles} onChange={s => handleFilterChange('hunterBreathingStyles', s)} placeholder="Selecione até 2" maxSelection={2}/>
            </div>);
            case 'Inimigo/Oni': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={e => handleFilterChange('oniPowerLevel', e.target.value)}>{ONI_POWER_LEVELS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.oniTematica || ''} onChange={e => handleFilterChange('oniTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País de Origem (Cultural)" value={filters.oniCountry} onChange={e => handleFilterChange('oniCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Personalidade Dominante" value={filters.oniPersonality} onChange={e => handleFilterChange('oniPersonality', e.target.value)}>{PERSONALITIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Arma" value={filters.oniWeapon} onChange={e => handleFilterChange('oniWeapon', e.target.value)}>{['Nenhuma', ...weaponTypeOptions].map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Inspiração de Respiração" value={filters.oniInspirationBreathing} onChange={e => handleFilterChange('oniInspirationBreathing', e.target.value)}>{['Nenhuma', ...breathingStylesOptions].map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <div className="lg:col-span-2">
                    <SearchableMultiSelect 
                        label="Inspiração de Kekkijutsu" 
                        options={DEMON_BLOOD_ARTS.filter(o => o !== 'Aleatória')} 
                        selected={filters.oniInspirationKekkijutsu} 
                        onChange={s => handleFilterChange('oniInspirationKekkijutsu', s)} 
                        placeholder="Selecione uma ou mais artes..."
                    />
                </div>
            </div>);
            case 'NPC': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SearchableSelect label="Temática" value={filters.npcTematica || ''} onChange={e => handleFilterChange('npcTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.npcCountry} onChange={e => handleFilterChange('npcCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Origem (Background)" value={filters.npcOrigin} onChange={e => handleFilterChange('npcOrigin', e.target.value)}>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Profissão" value={filters.npcProfession} onChange={e => handleFilterChange('npcProfession', e.target.value)}>{professionOptions.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Personalidade" value={filters.npcPersonality} onChange={e => handleFilterChange('npcPersonality', e.target.value)}>{PERSONALITIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Arma" value={filters.npcWeapon} onChange={e => handleFilterChange('npcWeapon', e.target.value)}>{['Nenhuma', ...weaponTypeOptions].map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Acessório" value={filters.npcAccessory} onChange={e => handleFilterChange('npcAccessory', e.target.value)}>{accessoryInspirationOptions.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            </div>);
            case 'Arma': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Select label="Raridade" value={filters.weaponRarity || ''} onChange={e => handleFilterChange('weaponRarity', e.target.value as Rarity)}>{RARITIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.weaponTematica || ''} onChange={e => handleFilterChange('weaponTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.weaponCountry} onChange={e => handleFilterChange('weaponCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Tipo de Arma" value={filters.weaponType} onChange={e => handleFilterChange('weaponType', e.target.value)}>{weaponTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Cor do Metal (Nichirin)" value={filters.weaponMetalColor} onChange={e => handleFilterChange('weaponMetalColor', e.target.value)}>{METAL_COLORS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            </div>);
            case 'Acessório': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 <Select label="Raridade" value={filters.accessoryRarity || ''} onChange={e => handleFilterChange('accessoryRarity', e.target.value as Rarity)}>{RARITIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.accessoryTematica || ''} onChange={e => handleFilterChange('accessoryTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.accessoryCountry} onChange={e => handleFilterChange('accessoryCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Inspiração (Respiração)" value={filters.accessoryBreathingInspiration} onChange={e => handleFilterChange('accessoryBreathingInspiration', e.target.value)}>{['Nenhuma', ...breathingStylesOptions].map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Inspiração (Kekkijutsu)" value={filters.accessoryKekkijutsuInspiration} onChange={e => handleFilterChange('accessoryKekkijutsuInspiration', e.target.value)}>{['Nenhuma', ...DEMON_BLOOD_ARTS].map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            </div>);
            case 'Forma de Respiração': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                    <SearchableMultiSelect label="Respiração Base" options={breathingStylesOptions} selected={filters.baseBreathingStyles} onChange={s => handleFilterChange('baseBreathingStyles', s)} placeholder="Selecione 1 ou 2" maxSelection={2} />
                </div>
                <SearchableSelect label="Temática" value={filters.breathingFormTematica || ''} onChange={e => handleFilterChange('breathingFormTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.breathingFormCountry} onChange={e => handleFilterChange('breathingFormCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Arma Principal" value={filters.breathingFormWeapon} onChange={e => handleFilterChange('breathingFormWeapon', e.target.value)}>{weaponTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <Select label="Tom" value={filters.breathingFormTone} onChange={e => handleFilterChange('breathingFormTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            </div>);
            case 'Kekkijutsu': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SearchableSelect label="Temática" value={filters.kekkijutsuTematica || ''} onChange={e => handleFilterChange('kekkijutsuTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.kekkijutsuCountry} onChange={e => handleFilterChange('kekkijutsuCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Inspiração (Kekkijutsu)" value={filters.kekkijutsuKekkijutsuInspiration} onChange={e => handleFilterChange('kekkijutsuKekkijutsuInspiration', e.target.value)}>{DEMON_BLOOD_ARTS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Inspiração (Respiração)" value={filters.kekkijutsuBreathingInspiration} onChange={e => handleFilterChange('kekkijutsuBreathingInspiration', e.target.value)}>{['Nenhuma', ...breathingStylesOptions].map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Inspiração (Arma)" value={filters.kekkijutsuWeaponInspiration} onChange={e => handleFilterChange('kekkijutsuWeaponInspiration', e.target.value)}>{['Nenhuma', ...weaponTypeOptions].map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Inspiração (Acessório)" value={filters.kekkijutsuAccessoryInspiration} onChange={e => handleFilterChange('kekkijutsuAccessoryInspiration', e.target.value)}>{accessoryInspirationOptions.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            </div>);
            case 'Local/Cenário': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Select label="Tom" value={filters.locationTone} onChange={e => handleFilterChange('locationTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.locationTematica || ''} onChange={e => handleFilterChange('locationTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.locationCountry} onChange={e => handleFilterChange('locationCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="Terreno Principal" value={filters.locationTerrain} onChange={e => handleFilterChange('locationTerrain', e.target.value)}>{TERRAINS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <div className="lg:col-span-2">
                    <TextInput label="Ou Especifique um Terreno" value={filters.locationTerrainCustom} onChange={e => handleFilterChange('locationTerrainCustom', e.target.value)} placeholder="Ex: Cidade no esqueleto de um Titã"/>
                </div>
            </div>);
            case 'Missões': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Select label="Tom" value={filters.missionTone} onChange={e => handleFilterChange('missionTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.missionTematica || ''} onChange={e => handleFilterChange('missionTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.missionCountry} onChange={e => handleFilterChange('missionCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <div className="lg:col-span-2">
                    <Slider label={`Intensidade: ${filters.intensity}`} min={1} max={5} step={1} value={filters.intensity} onChange={e => handleFilterChange('intensity', parseInt(e.target.value))} />
                </div>
                <div className="lg:col-span-2">
                    <TextInput label="Protagonista (Descrição)" value={filters.protagonist} onChange={e => handleFilterChange('protagonist', e.target.value)} placeholder="Ex: um caçador cego, um ferreiro amaldiçoado..."/>
                </div>
                <div className="lg:col-span-2">
                    <TextInput label="Alvo Principal" value={filters.targets} onChange={e => handleFilterChange('targets', e.target.value)} placeholder="Ex: um oni que devora memórias, uma seita..."/>
                </div>
            </div>);
            case 'World Building': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Select label="Tom" value={filters.wbTone} onChange={e => handleFilterChange('wbTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.wbTematica || ''} onChange={e => handleFilterChange('wbTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.wbCountry} onChange={e => handleFilterChange('wbCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <Select label="Escala da Ameaça" value={filters.wbThreatScale} onChange={e => handleFilterChange('wbThreatScale', e.target.value)}>{THREAT_SCALES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <div className="lg:col-span-2">
                    <TextInput label="Local Principal" value={filters.wbLocation} onChange={e => handleFilterChange('wbLocation', e.target.value)} placeholder="Ex: uma cidade sob uma cachoeira, uma ilha-prisão..."/>
                </div>
            </div>);
            case 'Evento': return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Select label="Nível" value={filters.eventLevel} onChange={e => handleFilterChange('eventLevel', e.target.value)}>{EVENT_LEVELS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Nível de Ameaça" value={filters.eventThreatLevel} onChange={e => handleFilterChange('eventThreatLevel', e.target.value)}>{EVENT_THREAT_LEVELS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableSelect label="Tipo de Evento" value={filters.eventType} onChange={e => handleFilterChange('eventType', e.target.value)}>{EVENT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <Select label="Tom" value={filters.eventTone} onChange={e => handleFilterChange('eventTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.eventTematica || ''} onChange={e => handleFilterChange('eventTematica', e.target.value as Tematica)}>{TEMATICAS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                <SearchableSelect label="País (Cultural)" value={filters.eventCountry} onChange={e => handleFilterChange('eventCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            </div>);
            default: return <p className="text-sm text-gray-500 text-center py-4">Selecione uma categoria para ver os filtros.</p>;
        }
    };

    return (
        <Card className="forge-panel flex flex-col h-full p-4">
            <div className="flex justify-between items-center flex-shrink-0 mb-4">
                <h2 className="text-xl font-bold text-white font-gangofthree">Filtros da Forja</h2>
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                     <RefreshIcon className="w-4 h-4" /> Limpar Filtros
                </Button>
            </div>
            <div className="inner-scroll flex-grow pr-2 -mr-2 space-y-4">
                <Select label="Categoria" value={filters.category} onChange={handleCategoryChange}>
                    <option value="">Selecione a Categoria</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </Select>
                
                {filters.category && (
                    <div className="space-y-4">
                        <div className="border-t border-gray-700/50 pt-4">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">Diretrizes da Forja</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select label="Gemini (Arquiteto)" value={filters.aiFocusGemini} onChange={e => handleFilterChange('aiFocusGemini', e.target.value)}>
                                    {AI_FOCUS_GEMINI.map(o => <option key={o} value={o}>{o}</option>)}
                                </Select>
                                <Select label="GPT (Escritor)" value={filters.aiFocusGpt} onChange={e => handleFilterChange('aiFocusGpt', e.target.value)}>
                                    {AI_FOCUS_GPT.map(o => <option key={o} value={o}>{o}</option>)}
                                </Select>
                                <Select label="DeepSeek (Game Master)" value={filters.aiFocusDeepSeek} onChange={e => handleFilterChange('aiFocusDeepSeek', e.target.value)}>
                                    {AI_FOCUS_DEEPSEEK.map(o => <option key={o} value={o}>{o}</option>)}
                                </Select>
                            </div>
                        </div>
                        <div className="border-t border-gray-700/50 pt-4">
                            {renderCategorySpecificFilters()}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-auto pt-4 flex-shrink-0 space-y-4">
                 <div className="border-t border-gray-700 pt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-300">Presets de Filtros</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex-grow">
                        <Select label="" value={selectedPreset} onChange={handlePresetChange}>
                            <option value="">Carregar preset...</option>
                            {presets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </Select>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleSavePreset} className="!p-2" title="Salvar filtros atuais como um preset">
                            <SaveIcon className="w-5 h-5" />
                        </Button>
                        {selectedPreset && (
                        <Button variant="danger" size="sm" onClick={handleDeletePreset} className="!p-2" title="Deletar preset selecionado">
                            <TrashIcon className="w-5 h-5" />
                        </Button>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Modificador de Prompt (Opcional)</label>
                    <textarea
                        value={promptModifier}
                        onChange={(e) => setPromptModifier(e.target.value)}
                        placeholder="Ex: Crie algo com um toque de terror cósmico."
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm resize-none"
                        rows={2}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <Slider
                            label={`Quantidade`}
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            min={1} max={4} step={1}
                            disabled={isLoading}
                        />
                    </div>
                    <Button onClick={() => onGenerate(filters, count, promptModifier)} disabled={isLoading || !filters.category} className="w-40 forge-anvil-button">
                        {isLoading ? <Spinner size="sm" /> : <AnvilIcon className="w-5 h-5" />}
                        {isLoading ? 'Forjando...' : `Forjar`}
                    </Button>
                </div>
            </div>
        </Card>
    );
};