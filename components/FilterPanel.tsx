import React, { useState } from 'react';
import type { FilterState, Category, AIFlags, Tematica, Rarity, Tone, OniPowerLevel, HunterRank } from '../types';
import {
    CATEGORIES, TEMATICAS, RARITIES, TONES, HUNTER_RANKS, ONI_POWER_LEVELS, COUNTRIES, ORIGINS, PERSONALITIES,
    METAL_COLORS, DAMAGE_TYPES, TERRAINS, THREAT_SCALES, EVENT_LEVELS, EVENT_THREAT_LEVELS, EVENT_TYPES,
    AI_FOCUS_GEMINI, AI_FOCUS_GPT, AI_FOCUS_DEEPSEEK
} from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { DEMON_BLOOD_ARTS } from '../constants';
import { WEAPON_TYPES } from '../lib/weaponData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { Select } from './ui/Select';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { TextArea } from './ui/TextArea';
import { NumberInput } from './ui/NumberInput';
import { Button } from './ui/Button';
import { TextInput } from './ui/TextInput';
import { Checkbox } from './ui/Checkbox';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { HammerIcon } from './icons/HammerIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ExpandIcon } from './icons/ExpandIcon';
import { CollapseIcon } from './icons/CollapseIcon';


interface FilterPanelProps {
    filters: FilterState;
    onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    onGenerate: () => void;
    onReset: () => void;
    isLoading: boolean;
    aiFlags: AIFlags;
    onAiFlagChange: (key: keyof AIFlags, value: boolean) => void;
    setError: (message: string | null) => void;
}

const weaponTypeOptions = WEAPON_TYPES.map(w => w.name);
const breathingStyleOptions = BREATHING_STYLES_DATA.map(bs => bs.nome);
const hunterArchetypeOptions = HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => s.nome));

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onGenerate, onReset, isLoading, aiFlags, onAiFlagChange, setError }) => {
    
    const [areAllSectionsOpen, setAreAllSectionsOpen] = useState(false);
    
    const handleGenerateClick = () => {
        if (!filters.category) {
            setError("ERRO NA CONFIGURAÇÃO DA GERAÇÃO|A combinação de filtros atual pode ter causado um problema. Tente simplificar a sua seleção ou alterar o tipo de geração.|A categoria é obrigatória nos filtros.");
            return;
        }
        onGenerate();
    };

    const professionOptions = PROFESSIONS_BY_TEMATICA[filters.npcTematica as keyof typeof PROFESSIONS_BY_TEMATICA] || PROFESSIONS_BY_TEMATICA.all || [];

    const renderCategorySpecificFilters = (category: Category | '') => {
        if (!category) {
            return <p className="text-gray-500 text-sm px-1">Selecione uma categoria principal para ver mais filtros.</p>;
        }
        
        return (
            <div className="space-y-4">
                 {category === 'Caçador' && (
                     <>
                        <h4 className="filter-subheader">Identidade & Origem</h4>
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.hunterTematica} onChange={v => onFilterChange('hunterTematica', v as Tematica | '')} />
                        <SearchableSelect label="País" options={[...COUNTRIES]} value={filters.hunterCountry} onChange={v => onFilterChange('hunterCountry', v)} />
                        <SearchableSelect label="Origem (Background)" options={[...ORIGINS]} value={filters.hunterOrigin} onChange={v => onFilterChange('hunterOrigin', v)} />
                        
                        <h4 className="filter-subheader">Estilo de Combate</h4>
                        <SearchableSelect label="Arquétipo" options={hunterArchetypeOptions} value={filters.hunterArchetype} onChange={v => onFilterChange('hunterArchetype', v)} />
                        <SearchableMultiSelect label="Estilos de Respiração" options={breathingStyleOptions} selected={filters.hunterBreathingStyles} onChange={v => onFilterChange('hunterBreathingStyles', v)} />
                        <SearchableSelect label="Arma Principal" options={weaponTypeOptions} value={filters.hunterWeapon} onChange={v => onFilterChange('hunterWeapon', v)} />
                        <Select label="Rank" options={[...HUNTER_RANKS]} value={filters.hunterRank} onChange={v => onFilterChange('hunterRank', v as HunterRank | '')} />
                        
                        <h4 className="filter-subheader">Personalidade</h4>
                        <SearchableSelect label="Traços" options={[...PERSONALITIES]} value={filters.hunterPersonality} onChange={v => onFilterChange('hunterPersonality', v)} />
                     </>
                )}
                {category === 'Inimigo/Oni' && (
                    <>
                        <h4 className="filter-subheader">Nível de Ameaça</h4>
                        <Select label="Nível de Poder" options={[...ONI_POWER_LEVELS]} value={filters.oniPowerLevel} onChange={v => onFilterChange('oniPowerLevel', v as OniPowerLevel | '')} />
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.oniTematica} onChange={v => onFilterChange('oniTematica', v as Tematica | '')} />

                        <h4 className="filter-subheader">Habilidades</h4>
                        <SearchableMultiSelect label="Kekkijutsu (Inspiração)" options={DEMON_BLOOD_ARTS} selected={filters.oniInspirationKekkijutsu} onChange={v => onFilterChange('oniInspirationKekkijutsu', v)} />

                        <h4 className="filter-subheader">Identidade</h4>
                        <SearchableSelect label="País de Origem" options={[...COUNTRIES]} value={filters.oniCountry} onChange={v => onFilterChange('oniCountry', v)} />
                        <SearchableSelect label="Personalidade" options={[...PERSONALITIES]} value={filters.oniPersonality} onChange={v => onFilterChange('oniPersonality', v)} />
                    </>
                )}
                 {category === 'NPC' && (
                    <>
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.npcTematica} onChange={v => onFilterChange('npcTematica', v as Tematica | '')} />
                        <SearchableSelect label="Profissão" options={professionOptions} value={filters.npcProfession} onChange={v => onFilterChange('npcProfession', v)} tooltip="As profissões mudam com base na temática."/>
                        <SearchableSelect label="País de Origem" options={[...COUNTRIES]} value={filters.npcCountry} onChange={v => onFilterChange('npcCountry', v)} />
                        <SearchableSelect label="Origem (Background)" options={[...ORIGINS]} value={filters.npcOrigin} onChange={v => onFilterChange('npcOrigin', v)} />
                        <SearchableSelect label="Personalidade" options={[...PERSONALITIES]} value={filters.npcPersonality} onChange={v => onFilterChange('npcPersonality', v)} />
                    </>
                )}
                {category === 'Arma' && (
                    <>
                        <h4 className="filter-subheader">Atributos Principais</h4>
                        <Select label="Raridade" options={[...RARITIES]} value={filters.weaponRarity} onChange={v => onFilterChange('weaponRarity', v as Rarity | '')} />
                        <SearchableSelect label="Tipo de Arma" options={weaponTypeOptions} value={filters.weaponType} onChange={v => onFilterChange('weaponType', v)} />
                        <Select label="Tipo de Dano" options={DAMAGE_TYPES} value={filters.weaponDamageType} onChange={v => onFilterChange('weaponDamageType', v)} />

                        <h4 className="filter-subheader">Origem e Manufatura</h4>
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.weaponTematica} onChange={v => onFilterChange('weaponTematica', v as Tematica | '')} />
                        <SearchableSelect label="País de Origem" options={[...COUNTRIES]} value={filters.weaponCountry} onChange={v => onFilterChange('weaponCountry', v)} />
                        <Select label="Cor do Metal (Nichirin)" options={METAL_COLORS} value={filters.weaponMetalColor} onChange={v => onFilterChange('weaponMetalColor', v)} />
                    </>
                )}
                 {category === 'Acessório' && (
                    <>
                        <h4 className="filter-subheader">Atributos</h4>
                        <Select label="Raridade" options={[...RARITIES]} value={filters.accessoryRarity} onChange={v => onFilterChange('accessoryRarity', v as Rarity | '')} />
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.accessoryTematica} onChange={v => onFilterChange('accessoryTematica', v as Tematica | '')} />

                        <h4 className="filter-subheader">Inspiração</h4>
                         <SearchableSelect label="País de Origem" options={[...COUNTRIES]} value={filters.accessoryCountry} onChange={v => onFilterChange('accessoryCountry', v)} />
                        <SearchableSelect label="Origem do Acessório" options={[...ORIGINS]} value={filters.accessoryOrigin} onChange={v => onFilterChange('accessoryOrigin', v)} />
                    </>
                )}
                {category === 'Forma de Respiração' && (
                     <>
                        <SearchableMultiSelect label="Respirações Base" options={breathingStyleOptions} selected={filters.baseBreathingStyles} onChange={v => onFilterChange('baseBreathingStyles', v)} />
                        <Select label="Tom" options={[...TONES]} value={filters.breathingFormTone} onChange={v => onFilterChange('breathingFormTone', v as Tone)} />
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.breathingFormTematica} onChange={v => onFilterChange('breathingFormTematica', v as Tematica | '')} />
                    </>
                )}
                {category === 'Kekkijutsu' && (
                    <>
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.kekkijutsuTematica} onChange={v => onFilterChange('kekkijutsuTematica', v as Tematica | '')} />
                        <SearchableSelect label="Inspiração Principal" options={DEMON_BLOOD_ARTS} value={filters.kekkijutsuKekkijutsuInspiration} onChange={v => onFilterChange('kekkijutsuKekkijutsuInspiration', v)} />
                    </>
                )}
                 {category === 'Local/Cenário' && (
                    <>
                        <Select label="Tom" options={[...TONES]} value={filters.locationTone} onChange={v => onFilterChange('locationTone', v as Tone)} />
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.locationTematica} onChange={v => onFilterChange('locationTematica', v as Tematica | '')} />
                        <SearchableSelect label="País" options={[...COUNTRIES]} value={filters.locationCountry} onChange={v => onFilterChange('locationCountry', v)} />
                        <SearchableSelect label="Tipo de Terreno" options={[...TERRAINS, 'Outro']} value={filters.locationTerrain} onChange={v => onFilterChange('locationTerrain', v)} />
                        {filters.locationTerrain === 'Outro' && <TextInput label="Terreno Customizado" value={filters.locationTerrainCustom} onChange={e => onFilterChange('locationTerrainCustom', e.target.value)} />}
                    </>
                )}
                {category === 'Missões' && (
                    <>
                        <Select label="Tom" options={[...TONES]} value={filters.missionTone} onChange={v => onFilterChange('missionTone', v as Tone)} />
                        <NumberInput label="Intensidade" value={filters.intensity} onChange={v => onFilterChange('intensity', v)} min={1} max={5} />
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.missionTematica} onChange={v => onFilterChange('missionTematica', v as Tematica | '')} />
                        <Select label="Escala da Ameaça" options={THREAT_SCALES} value={filters.missionThreatScale} onChange={v => onFilterChange('missionThreatScale', v)} />
                    </>
                )}
                {category === 'World Building' && (
                    <>
                        <Select label="Tom" options={[...TONES]} value={filters.wbTone} onChange={v => onFilterChange('wbTone', v as Tone)} />
                        <SearchableSelect label="Temática" options={[...TEMATICAS]} value={filters.wbTematica} onChange={v => onFilterChange('wbTematica', v as Tematica | '')} />
                        <Select label="Escala da Ameaça" options={THREAT_SCALES} value={filters.wbThreatScale} onChange={v => onFilterChange('wbThreatScale', v)} />
                    </>
                )}
                {category === 'Evento' && (
                    <>
                        <Select label="Nível" options={EVENT_LEVELS} value={filters.eventLevel} onChange={v => onFilterChange('eventLevel', v)} />
                        <Select label="Nível de Ameaça" options={EVENT_THREAT_LEVELS} value={filters.eventThreatLevel} onChange={v => onFilterChange('eventThreatLevel', v)} />
                        <Select label="Tipo de Evento" options={EVENT_TYPES} value={filters.eventType} onChange={v => onFilterChange('eventType', v)} />
                    </>
                )}

            </div>
        );
    };
    
    return (
        <div className="h-full flex flex-col bg-gray-800/30 rounded-lg">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                <h2 className="text-lg font-bold text-white font-gangofthree">FILTROS DA FORJA</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onReset} disabled={isLoading}>
                        <TrashIcon className="w-4 h-4" /> Limpar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setAreAllSectionsOpen(p => !p)}>
                        {areAllSectionsOpen ? <CollapseIcon className="w-4 h-4" /> : <ExpandIcon className="w-4 h-4" />}
                        {areAllSectionsOpen ? 'Fechar' : 'Abrir'} Tudo
                    </Button>
                </div>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4 inner-scroll">
                
                <CollapsibleSection title="Geral" forceOpen={areAllSectionsOpen}>
                    <div className="space-y-4 p-1">
                        <SearchableSelect
                            label="Categoria Principal"
                            options={[...CATEGORIES]}
                            value={filters.category}
                            onChange={(v) => onFilterChange('category', v as Category)}
                            placeholder="Selecione..."
                        />
                        {renderCategorySpecificFilters(filters.category)}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Diretrizes Avançadas de IA" forceOpen={areAllSectionsOpen}>
                    <div className="space-y-4 p-1">
                        <TextArea
                            label="Referências de Estilo Visual"
                            value={filters.styleReferences}
                            onChange={e => onFilterChange('styleReferences', e.target.value)}
                            placeholder="Ex: Ghibli, H.R. Giger, dark fantasy, anime anos 90..."
                            rows={3}
                            tooltip="Descreva o estilo visual para o prompt de imagem. Isso influencia a arte conceitual."
                        />
                        <Select label="Foco Criativo (Gemini)" options={AI_FOCUS_GEMINI} value={filters.aiFocusGemini} onChange={v => onFilterChange('aiFocusGemini', v)} />
                        <Select label="Foco Narrativo (GPT)" options={AI_FOCUS_GPT} value={filters.aiFocusGpt} onChange={v => onFilterChange('aiFocusGpt', v)} />
                        <Select label="Foco Conceitual (DeepSeek)" options={AI_FOCUS_DEEPSEEK} value={filters.aiFocusDeepSeek} onChange={v => onFilterChange('aiFocusDeepSeek', v)} />
                    </div>
                </CollapsibleSection>
                
                 <CollapsibleSection title="Orquestração de IA" forceOpen={areAllSectionsOpen}>
                     <div className="space-y-2 p-1">
                        <Checkbox label="Usar DeepSeek (Conceito)" checked={aiFlags.useDeepSeek} onChange={e => onAiFlagChange('useDeepSeek', e.target.checked)} />
                        <Checkbox label="Usar Gemini (Estrutura)" checked={aiFlags.useGemini} onChange={e => onAiFlagChange('useGemini', e.target.checked)} />
                        <Checkbox label="Usar GPT-4o (Polimento)" checked={aiFlags.useGpt} onChange={e => onAiFlagChange('useGpt', e.target.checked)} />
                    </div>
                </CollapsibleSection>

                <NumberInput label="Quantidade" value={3} onChange={() => {}} min={1} max={10}/>

            </div>

            <div className="p-4 border-t border-gray-700 flex-shrink-0 space-y-2">
                <Button onClick={handleGenerateClick} disabled={isLoading || !filters.category} className="w-full forge-button">
                    <HammerIcon className="w-5 h-5" />
                    {isLoading ? 'Forjando...' : 'Forjar'}
                </Button>
            </div>
        </div>
    );
};