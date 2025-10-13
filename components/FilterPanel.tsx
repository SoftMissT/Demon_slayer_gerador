import React, { useState } from 'react';
import type { FilterState, Category } from '../types';
import { Select } from './ui/Select';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { TextArea } from './ui/TextArea';
import { AccordionSection } from './AccordionSection';
import { ExpandIcon } from './icons/ExpandIcon';
import { CollapseIcon } from './icons/CollapseIcon';
import { Slider } from './ui/Slider';
import {
    CATEGORIES,
    TEMATICAS,
    HUNTER_RANKS,
    ONI_POWER_LEVELS,
    RARITIES,
    TONES,
    COUNTRIES,
    ORIGINS,
    PERSONALITIES,
    METAL_COLORS,
    DAMAGE_TYPES,
    TERRAINS,
    THREAT_SCALES,
    EVENT_LEVELS,
    EVENT_THREAT_LEVELS,
    EVENT_TYPES,
    AI_FOCUS_GEMINI,
    AI_FOCUS_GPT,
    AI_FOCUS_DEEPSEEK,
    INITIAL_FILTERS
} from '../constants';
import { WEAPON_TYPES } from '../lib/weaponData';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { DEMON_BLOOD_ARTS } from '../constants';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';

interface FilterPanelProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const breathingStylesOptions = BREATHING_STYLES_DATA.map(bs => bs.nome);
const weaponTypesOptions = WEAPON_TYPES.map(wt => wt.name);
const hunterArchetypesOptions = ['Aleatório', ...HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => s.nome))];

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
    const [allOpen, setAllOpen] = useState(false);

    const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    
    const handleClearFilters = () => {
        const category = filters.category;
        setFilters({
            ...(INITIAL_FILTERS as FilterState),
            category: category, // Keep the current category
        });
    }

    const renderHunterFilters = () => (
        <>
            <h4 className="filter-subheader">Identidade & Origem</h4>
            <div className="space-y-4">
                <Select label="Temática" options={TEMATICAS} value={filters.hunterTematica} onChange={v => handleFilterChange('hunterTematica', v as any)} />
                <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.hunterCountry} onChange={v => handleFilterChange('hunterCountry', v)} />
                <SearchableSelect label="Origem (Background)" options={ORIGINS} value={filters.hunterOrigin} onChange={v => handleFilterChange('hunterOrigin', v)} />
                <Select label="Personalidade" options={PERSONALITIES} value={filters.hunterPersonality} onChange={v => handleFilterChange('hunterPersonality', v)} />
                <Select label="Rank" options={HUNTER_RANKS} value={filters.hunterRank} onChange={v => handleFilterChange('hunterRank', v as any)} />
            </div>

            <h4 className="filter-subheader">Estilo de Combate</h4>
             <div className="space-y-4">
                <SearchableSelect label="Arquétipo" options={hunterArchetypesOptions} value={filters.hunterArchetype} onChange={v => handleFilterChange('hunterArchetype', v)} />
                <SearchableSelect label="Arma Principal" options={weaponTypesOptions} value={filters.hunterWeapon} onChange={v => handleFilterChange('hunterWeapon', v)} />
                <SearchableMultiSelect label="Estilos de Respiração (Inspiração)" options={breathingStylesOptions} selected={filters.hunterBreathingStyles} onChange={v => handleFilterChange('hunterBreathingStyles', v as any)} />
             </div>
        </>
    );

    const renderOniFilters = () => (
        <>
            <h4 className="filter-subheader">Identidade & Poder</h4>
            <div className="space-y-4">
                <Select label="Nível de Poder" options={ONI_POWER_LEVELS} value={filters.oniPowerLevel} onChange={v => handleFilterChange('oniPowerLevel', v as any)} />
                <Select label="Temática" options={TEMATICAS} value={filters.oniTematica} onChange={v => handleFilterChange('oniTematica', v as any)} />
                <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.oniCountry} onChange={v => handleFilterChange('oniCountry', v)} />
                <Select label="Personalidade" options={PERSONALITIES} value={filters.oniPersonality} onChange={v => handleFilterChange('oniPersonality', v)} />
            </div>

            <h4 className="filter-subheader">Habilidades de Combate</h4>
            <div className="space-y-4">
                <SearchableSelect label="Arma (Opcional)" options={weaponTypesOptions} value={filters.oniWeapon} onChange={v => handleFilterChange('oniWeapon', v)} />
                <SearchableMultiSelect label="Inspiração de Kekkijutsu" options={DEMON_BLOOD_ARTS} selected={filters.oniInspirationKekkijutsu} onChange={v => handleFilterChange('oniInspirationKekkijutsu', v as any)} />
            </div>
        </>
    );

    const renderNpcFilters = () => {
       const professions = PROFESSIONS_BY_TEMATICA[filters.npcTematica as keyof typeof PROFESSIONS_BY_TEMATICA] || PROFESSIONS_BY_TEMATICA.all;
        return (
            <>
                <h4 className="filter-subheader">Identidade & Origem</h4>
                 <div className="space-y-4">
                    <Select label="Temática" options={TEMATICAS} value={filters.npcTematica} onChange={v => handleFilterChange('npcTematica', v as any)} />
                    <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.npcCountry} onChange={v => handleFilterChange('npcCountry', v)} />
                    <SearchableSelect label="Origem (Background)" options={ORIGINS} value={filters.npcOrigin} onChange={v => handleFilterChange('npcOrigin', v)} />
                    <SearchableSelect label="Profissão" options={professions} value={filters.npcProfession} onChange={v => handleFilterChange('npcProfession', v)} />
                    <Select label="Personalidade" options={PERSONALITIES} value={filters.npcPersonality} onChange={v => handleFilterChange('npcPersonality', v)} />
                 </div>
                
                <h4 className="filter-subheader">Equipamento</h4>
                 <div className="space-y-4">
                    <SearchableSelect label="Arma (Opcional)" options={weaponTypesOptions} value={filters.npcWeapon} onChange={v => handleFilterChange('npcWeapon', v)} />
                 </div>
            </>
        );
    }
    
    return (
        <div className="flex flex-col h-full bg-gray-800/50 border-r border-gray-700">
            <div className="p-4 border-b border-gray-700 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white font-gangofthree">Filtros da Forja</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="!p-1.5">
                            <TrashIcon className="w-4 h-4 mr-1" /> Limpar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setAllOpen(!allOpen)} className="!p-1.5">
                            {allOpen ? <CollapseIcon className="w-4 h-4" /> : <ExpandIcon className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
                <SearchableSelect label="Categoria Principal" options={CATEGORIES as any} value={filters.category} onChange={v => handleFilterChange('category', v as Category)} />
            </div>
            <div className="flex-grow p-4 overflow-y-auto inner-scroll">
                 
                {filters.category === 'Caçador' && <AccordionSection title="Atributos do Caçador" defaultOpen forceOpen={allOpen}>{renderHunterFilters()}</AccordionSection>}
                {filters.category === 'Inimigo/Oni' && <AccordionSection title="Atributos do Oni" defaultOpen forceOpen={allOpen}>{renderOniFilters()}</AccordionSection>}
                {filters.category === 'NPC' && <AccordionSection title="Atributos do NPC" defaultOpen forceOpen={allOpen}>{renderNpcFilters()}</AccordionSection>}
                
                {filters.category === 'Arma' && (
                    <AccordionSection title="Atributos da Arma" defaultOpen forceOpen={allOpen}>
                        <div className="space-y-4">
                            <Select label="Raridade" options={RARITIES} value={filters.weaponRarity} onChange={v => handleFilterChange('weaponRarity', v as any)} />
                            <Select label="Temática" options={TEMATICAS} value={filters.weaponTematica} onChange={v => handleFilterChange('weaponTematica', v as any)} />
                            <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.weaponCountry} onChange={v => handleFilterChange('weaponCountry', v)} />
                            <SearchableSelect label="Tipo de Arma" options={weaponTypesOptions} value={filters.weaponType} onChange={v => handleFilterChange('weaponType', v)} />
                            <Select label="Cor do Metal (Nichirin)" options={METAL_COLORS} value={filters.weaponMetalColor} onChange={v => handleFilterChange('weaponMetalColor', v)} />
                            <Select label="Tipo de Dano" options={DAMAGE_TYPES} value={filters.weaponDamageType} onChange={v => handleFilterChange('weaponDamageType', v)} />
                        </div>
                    </AccordionSection>
                )}
                 {filters.category === 'Acessório' && (
                    <AccordionSection title="Atributos do Acessório" defaultOpen forceOpen={allOpen}>
                        <div className="space-y-4">
                            <Select label="Raridade" options={RARITIES} value={filters.accessoryRarity} onChange={v => handleFilterChange('accessoryRarity', v as any)} />
                            <Select label="Temática" options={TEMATICAS} value={filters.accessoryTematica} onChange={v => handleFilterChange('accessoryTematica', v as any)} />
                            <SearchableSelect label="Origem" options={ORIGINS} value={filters.accessoryOrigin} onChange={v => handleFilterChange('accessoryOrigin', v)} />
                             <SearchableMultiSelect label="Inspiração em Respiração" options={breathingStylesOptions} selected={[filters.accessoryBreathingInspiration]} onChange={v => handleFilterChange('accessoryBreathingInspiration', v[0] || 'Nenhuma')} />
                             <SearchableMultiSelect label="Inspiração em Kekkijutsu" options={DEMON_BLOOD_ARTS} selected={[filters.accessoryKekkijutsuInspiration]} onChange={v => handleFilterChange('accessoryKekkijutsuInspiration', v[0] || 'Nenhuma')} />
                        </div>
                    </AccordionSection>
                )}
                 {filters.category === 'Missões' && (
                    <AccordionSection title="Estrutura da Missão" defaultOpen forceOpen={allOpen}>
                        <div className="space-y-4">
                             <Select label="Tom" options={TONES} value={filters.missionTone} onChange={v => handleFilterChange('missionTone', v as any)} />
                             <Select label="Temática" options={TEMATICAS} value={filters.missionTematica} onChange={v => handleFilterChange('missionTematica', v as any)} />
                             <SearchableSelect label="País" options={COUNTRIES} value={filters.missionCountry} onChange={v => handleFilterChange('missionCountry', v)} />
                             <Select label="Escala da Ameaça" options={THREAT_SCALES} value={filters.missionThreatScale} onChange={v => handleFilterChange('missionThreatScale', v)} />
                             <Slider label="Intensidade" value={filters.intensity} onChange={e => handleFilterChange('intensity', parseInt(e.target.value))} min={1} max={5} step={1} />
                        </div>
                    </AccordionSection>
                )}
                
                <AccordionSection title="Diretrizes Avançadas de IA" forceOpen={allOpen}>
                    <div className="space-y-4">
                        <TextArea label="Referências de Estilo Visual" value={filters.styleReferences} onChange={e => handleFilterChange('styleReferences', e.target.value)} rows={2} placeholder="Ex: Ghibli, dark fantasy, ukiyo-e..." />
                        <Select label="Foco do Gemini (Estrutura)" options={AI_FOCUS_GEMINI} value={filters.aiFocusGemini} onChange={v => handleFilterChange('aiFocusGemini', v)} />
                        <Select label="Foco do GPT (Narrativa)" options={AI_FOCUS_GPT} value={filters.aiFocusGpt} onChange={v => handleFilterChange('aiFocusGpt', v)} />
                        <Select label="Foco do DeepSeek (Mecânicas)" options={AI_FOCUS_DEEPSEEK} value={filters.aiFocusDeepSeek} onChange={v => handleFilterChange('aiFocusDeepSeek', v)} />
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
};