import React, { useState, useCallback, useMemo } from 'react';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { Slider } from './ui/Slider';
import {
    CATEGORIES, RARITIES, ERAS, TONES, DEMON_BLOOD_ARTS, PERSONALITIES,
    METAL_COLORS, COUNTRIES, TERRAINS, THREAT_SCALES, ONI_POWER_LEVELS, ORIGINS, INITIAL_FILTERS
} from '../constants';
import type { FilterState, Category, Era, Rarity, Tone } from '../types';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { PROFESSIONS_BY_ERA } from '../lib/professionsData';

interface FilterPanelProps {
    onGenerate: (filters: FilterState, count: number, promptModifier?: string) => void;
    isLoading: boolean;
}

const breathingStylesOptions = BREATHING_STYLES_DATA.map(style => style.nome);
const hunterArchetypeOptions = ['Aleatória', ...HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => s.nome))];
const weaponTypeOptions = WEAPON_TYPES.map(w => w.name);

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

    const handleFilterChange = useCallback(<K extends keyof FilterState>(field: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as Category;
        setFilters(prev => ({
            ...INITIAL_FILTERS,
            category: newCategory,
        }));
    };
    
    const professionOptions = useMemo(() => {
        const eraKey = filters.npcEra;
        if (PROFESSIONS_BY_ERA[eraKey]) {
            return PROFESSIONS_BY_ERA[eraKey];
        }
        return PROFESSIONS_BY_ERA.all;
    }, [filters.npcEra]);

    const renderCategorySpecificFilters = () => {
        switch (filters.category) {
            case 'Caçador': return (<>
                <Select label="Era" value={filters.hunterEra} onChange={e => handleFilterChange('hunterEra', e.target.value as Era)}>{ERAS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="País de Origem (Cultural)" value={filters.hunterCountry} onChange={e => handleFilterChange('hunterCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Origem (Background)" value={filters.hunterOrigin} onChange={e => handleFilterChange('hunterOrigin', e.target.value)}>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Arquétipo" value={filters.hunterArchetype} onChange={e => handleFilterChange('hunterArchetype', e.target.value)}>{hunterArchetypeOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Personalidade" value={filters.hunterPersonality} onChange={e => handleFilterChange('hunterPersonality', e.target.value)}>{PERSONALITIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Arma Principal" value={filters.hunterWeapon} onChange={e => handleFilterChange('hunterWeapon', e.target.value)}>{weaponTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <SearchableMultiSelect label="Inspiração (Respirações)" options={breathingStylesOptions} selected={filters.hunterBreathingStyles} onChange={s => handleFilterChange('hunterBreathingStyles', s)} placeholder="Selecione até 2" maxSelection={2}/>
            </>);
            case 'Inimigo/Oni': return (<>
                <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={e => handleFilterChange('oniPowerLevel', e.target.value)}>{ONI_POWER_LEVELS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="País de Origem (Cultural)" value={filters.oniCountry} onChange={e => handleFilterChange('oniCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Personalidade Dominante" value={filters.oniPersonality} onChange={e => handleFilterChange('oniPersonality', e.target.value)}>{PERSONALITIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Inspiração de Kekkijutsu" value={filters.oniInspirationKekkijutsu} onChange={e => handleFilterChange('oniInspirationKekkijutsu', e.target.value)}>{DEMON_BLOOD_ARTS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            </>);
            case 'NPC': return (<>
                <Select label="Era" value={filters.npcEra} onChange={e => handleFilterChange('npcEra', e.target.value as Era)}>{ERAS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="País (Cultural)" value={filters.npcCountry} onChange={e => handleFilterChange('npcCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Origem (Background)" value={filters.npcOrigin} onChange={e => handleFilterChange('npcOrigin', e.target.value)}>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Profissão" value={filters.npcProfession} onChange={e => handleFilterChange('npcProfession', e.target.value)}>{professionOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Personalidade" value={filters.npcPersonality} onChange={e => handleFilterChange('npcPersonality', e.target.value)}>{PERSONALITIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            </>);
            case 'Arma': return (<>
                <Select label="Raridade" value={filters.weaponRarity} onChange={e => handleFilterChange('weaponRarity', e.target.value as Rarity)}>{RARITIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Era" value={filters.weaponEra} onChange={e => handleFilterChange('weaponEra', e.target.value as Era)}>{ERAS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="País (Cultural)" value={filters.weaponCountry} onChange={e => handleFilterChange('weaponCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Tipo de Arma" value={filters.weaponType} onChange={e => handleFilterChange('weaponType', e.target.value)}>{weaponTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Cor do Metal (Nichirin)" value={filters.weaponMetalColor} onChange={e => handleFilterChange('weaponMetalColor', e.target.value)}>{METAL_COLORS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            </>);
            case 'Acessório': return (<>
                 <Select label="Raridade" value={filters.accessoryRarity} onChange={e => handleFilterChange('accessoryRarity', e.target.value as Rarity)}>{RARITIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Era" value={filters.accessoryEra} onChange={e => handleFilterChange('accessoryEra', e.target.value as Era)}>{ERAS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="País (Cultural)" value={filters.accessoryCountry} onChange={e => handleFilterChange('accessoryCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Inspiração (Respiração)" value={filters.accessoryBreathingInspiration} onChange={e => handleFilterChange('accessoryBreathingInspiration', e.target.value)}>{['Nenhuma', ...breathingStylesOptions].map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Inspiração (Kekkijutsu)" value={filters.accessoryKekkijutsuInspiration} onChange={e => handleFilterChange('accessoryKekkijutsuInspiration', e.target.value)}>{['Nenhuma', ...DEMON_BLOOD_ARTS].map(o => <option key={o} value={o}>{o}</option>)}</Select>
            </>);
            case 'Forma de Respiração': return (<>
                <SearchableMultiSelect label="Respiração Base" options={breathingStylesOptions} selected={filters.baseBreathingStyles} onChange={s => handleFilterChange('baseBreathingStyles', s)} placeholder="Selecione 1 ou 2" maxSelection={2} />
                <Select label="Era" value={filters.breathingFormEra} onChange={e => handleFilterChange('breathingFormEra', e.target.value as Era)}>{ERAS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Tom" value={filters.breathingFormTone} onChange={e => handleFilterChange('breathingFormTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            </>);
            case 'Kekkijutsu': return (<>
                <Select label="Era" value={filters.kekkijutsuEra} onChange={e => handleFilterChange('kekkijutsuEra', e.target.value as Era)}>{ERAS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Inspiração (Kekkijutsu)" value={filters.kekkijutsuKekkijutsuInspiration} onChange={e => handleFilterChange('kekkijutsuKekkijutsuInspiration', e.target.value)}>{DEMON_BLOOD_ARTS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Inspiração (Respiração)" value={filters.kekkijutsuBreathingInspiration} onChange={e => handleFilterChange('kekkijutsuBreathingInspiration', e.target.value)}>{['Nenhuma', ...breathingStylesOptions].map(o => <option key={o} value={o}>{o}</option>)}</Select>
            </>);
            case 'Local/Cenário': return (<>
                <Select label="Tom" value={filters.locationTone} onChange={e => handleFilterChange('locationTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Era" value={filters.locationEra} onChange={e => handleFilterChange('locationEra', e.target.value as Era)}>{ERAS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="País (Cultural)" value={filters.locationCountry} onChange={e => handleFilterChange('locationCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Terreno Principal" value={filters.locationTerrain} onChange={e => handleFilterChange('locationTerrain', e.target.value)}>{TERRAINS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            </>);
            case 'Missão/Cenário': return (<>
                <Select label="Tom" value={filters.missionTone} onChange={e => handleFilterChange('missionTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Slider label={`Intensidade: ${filters.intensity}`} min={1} max={5} step={1} value={filters.intensity} onChange={e => handleFilterChange('intensity', parseInt(e.target.value))} />
                <TextInput label="Protagonista (Descrição)" value={filters.protagonist} onChange={e => handleFilterChange('protagonist', e.target.value)} placeholder="Ex: um caçador cego, um ferreiro amaldiçoado..."/>
                <TextInput label="Alvo Principal" value={filters.targets} onChange={e => handleFilterChange('targets', e.target.value)} placeholder="Ex: um oni que devora memórias, uma seita..."/>
            </>);
            case 'World Building': return (<>
                <Select label="Tom" value={filters.wbTone} onChange={e => handleFilterChange('wbTone', e.target.value as Tone)}>{TONES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Era" value={filters.wbEra} onChange={e => handleFilterChange('wbEra', e.target.value as Era)}>{ERAS.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="País (Cultural)" value={filters.wbCountry} onChange={e => handleFilterChange('wbCountry', e.target.value)}>{COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <Select label="Escala da Ameaça" value={filters.wbThreatScale} onChange={e => handleFilterChange('wbThreatScale', e.target.value)}>{THREAT_SCALES.map(o => <option key={o} value={o}>{o}</option>)}</Select>
                <TextInput label="Local Principal" value={filters.wbLocation} onChange={e => handleFilterChange('wbLocation', e.target.value)} placeholder="Ex: uma cidade sob uma cachoeira, uma ilha-prisão..."/>
            </>);
            default: return <p className="text-sm text-gray-500 text-center py-4">Selecione uma categoria para ver os filtros.</p>;
        }
    };

    return (
        <Card className="forge-panel flex flex-col h-full p-4">
            <h2 className="text-xl font-bold text-white font-gangofthree mb-4 flex-shrink-0">Filtros da Forja</h2>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
                <Select label="Categoria" value={filters.category} onChange={handleCategoryChange}>
                    <option value="">Selecione a Categoria</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </Select>
                {filters.category && renderCategorySpecificFilters()}
            </div>
            <div className="mt-4 border-t border-gray-700 pt-4 flex-shrink-0 space-y-4">
                <div>
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
                    <Button onClick={() => onGenerate(filters, count, promptModifier)} disabled={isLoading || !filters.category} className="w-40">
                        {isLoading ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5" />}
                        {isLoading ? 'Forjando...' : `Forjar`}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
