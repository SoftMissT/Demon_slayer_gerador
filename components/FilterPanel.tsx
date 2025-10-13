import React, { useState } from 'react';
// FIX: Imported Tematica and Rarity types to resolve type errors.
import type { FilterState, Category, Tematica, Rarity } from '../types';
import {
    CATEGORIES, TONES, COUNTRIES, TEMATICAS, RARITIES, HUNTER_RANKS, ONI_POWER_LEVELS,
    PERSONALITIES, DEMON_BLOOD_ARTS, METAL_COLORS, DAMAGE_TYPES, ORIGINS, TERRAINS,
    EVENT_LEVELS, EVENT_THREAT_LEVELS, EVENT_TYPES, THREAT_SCALES,
    AI_FOCUS_DEEPSEEK, AI_FOCUS_GEMINI, AI_FOCUS_GPT
} from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { TextArea } from './ui/TextArea';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { HammerIcon } from './icons/HammerIcon';
import { ExpandIcon } from './icons/ExpandIcon';
import { CollapseIcon } from './icons/CollapseIcon';
import { Checkbox } from './ui/Checkbox';
import { TextInput } from './ui/TextInput';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onGenerate: () => void;
  isGenerating: boolean;
  aiFlags: { useDeepSeek: boolean; useGemini: boolean; useGpt: boolean; };
  setAiFlags: React.Dispatch<React.SetStateAction<{ useDeepSeek: boolean; useGemini: boolean; useGpt: boolean; }>>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, onGenerate, isGenerating, aiFlags, setAiFlags }) => {
  const [allSectionsOpen, setAllSectionsOpen] = useState(false);

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const renderCategorySpecificFilters = () => {
    switch (filters.category) {
      case 'Caçador':
        return (
          <>
            {/* FIX: Casted the value to the correct Tematica type to resolve a type mismatch. */}
            <SearchableSelect label="Temática" options={TEMATICAS} value={filters.hunterTematica} onChange={v => handleFilterChange('hunterTematica', v as Tematica | '')} />
            <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.hunterCountry} onChange={v => handleFilterChange('hunterCountry', v)} />
            <SearchableSelect label="Origem (Background)" options={ORIGINS} value={filters.hunterOrigin} onChange={v => handleFilterChange('hunterOrigin', v)} />
            <Select label="Arquétipo" options={['Aleatório', ...HUNTER_ARCHETYPES_DATA.map(a => a.arquétipo)]} value={filters.hunterArchetype} onChange={v => handleFilterChange('hunterArchetype', v)} />
            <Select label="Personalidade" options={PERSONALITIES} value={filters.hunterPersonality} onChange={v => handleFilterChange('hunterPersonality', v)} />
            <Select label="Arma Principal" options={WEAPON_TYPES.map(w => w.name)} value={filters.hunterWeapon} onChange={v => handleFilterChange('hunterWeapon', v)} />
            <SearchableMultiSelect label="Estilos de Respiração (Inspiração)" options={BREATHING_STYLES_DATA.map(b => b.nome)} selected={filters.hunterBreathingStyles} onChange={v => handleFilterChange('hunterBreathingStyles', v)} />
            <Select label="Rank" options={HUNTER_RANKS} value={filters.hunterRank} onChange={v => handleFilterChange('hunterRank', v)} />
          </>
        );
      case 'Inimigo/Oni':
        return (
          <>
            {/* FIX: Casted the value to the correct Tematica type to resolve a type mismatch. */}
            <SearchableSelect label="Temática" options={TEMATICAS} value={filters.oniTematica} onChange={v => handleFilterChange('oniTematica', v as Tematica | '')} />
            <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.oniCountry} onChange={v => handleFilterChange('oniCountry', v)} />
            <Select label="Nível de Poder" options={ONI_POWER_LEVELS} value={filters.oniPowerLevel} onChange={v => handleFilterChange('oniPowerLevel', v)} />
            <SearchableMultiSelect label="Inspiração (Kekkijutsu)" options={DEMON_BLOOD_ARTS} selected={filters.oniInspirationKekkijutsu} onChange={v => handleFilterChange('oniInspirationKekkijutsu', v)} />
            <Select label="Personalidade" options={PERSONALITIES} value={filters.oniPersonality} onChange={v => handleFilterChange('oniPersonality', v)} />
          </>
        );
      case 'NPC':
        return (
          <>
            {/* FIX: Casted the value to the correct Tematica type to resolve a type mismatch. */}
            <SearchableSelect label="Temática" options={TEMATICAS} value={filters.npcTematica} onChange={v => handleFilterChange('npcTematica', v as Tematica | '')} />
            <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.npcCountry} onChange={v => handleFilterChange('npcCountry', v)} />
            <SearchableSelect label="Origem" options={ORIGINS} value={filters.npcOrigin} onChange={v => handleFilterChange('npcOrigin', v)} />
            <Select label="Profissão" options={PROFESSIONS_BY_TEMATICA.all} value={filters.npcProfession} onChange={v => handleFilterChange('npcProfession', v)} />
            <Select label="Personalidade" options={PERSONALITIES} value={filters.npcPersonality} onChange={v => handleFilterChange('npcPersonality', v)} />
          </>
        );
      case 'Arma':
        return (
            <>
                {/* FIX: Casted the value to the correct Rarity type to resolve a type mismatch. */}
                <Select label="Raridade" options={RARITIES} value={filters.weaponRarity} onChange={v => handleFilterChange('weaponRarity', v as Rarity | '')} />
                {/* FIX: Casted the value to the correct Tematica type to resolve a type mismatch. */}
                <SearchableSelect label="Temática" options={TEMATICAS} value={filters.weaponTematica} onChange={v => handleFilterChange('weaponTematica', v as Tematica | '')} />
                <SearchableSelect label="País de Origem" options={COUNTRIES} value={filters.weaponCountry} onChange={v => handleFilterChange('weaponCountry', v)} />
                <Select label="Tipo de Arma" options={WEAPON_TYPES.map(w => w.name)} value={filters.weaponType} onChange={v => handleFilterChange('weaponType', v)} />
                <Select label="Cor do Metal" options={METAL_COLORS} value={filters.weaponMetalColor} onChange={v => handleFilterChange('weaponMetalColor', v)} />
                <Select label="Tipo de Dano" options={DAMAGE_TYPES} value={filters.weaponDamageType} onChange={v => handleFilterChange('weaponDamageType', v)} />
            </>
        );
      default:
        return <p className="text-gray-500 text-sm">Selecione uma categoria para ver os filtros específicos.</p>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/50 rounded-lg border border-gray-700/50">
      <header className="flex justify-between items-center p-3 border-b border-gray-700/50 flex-shrink-0">
        <h2 className="text-xl font-bold font-gangofthree text-white">Filtros da Forja</h2>
        <Button variant="ghost" size="sm" onClick={() => setAllSectionsOpen(!allSectionsOpen)}>
            {allSectionsOpen ? <CollapseIcon className="w-4 h-4" /> : <ExpandIcon className="w-4 h-4" />}
            {allSectionsOpen ? 'Fechar Tudo' : 'Abrir Tudo'}
        </Button>
      </header>

      <div className="flex-grow overflow-y-auto p-3 space-y-4 inner-scroll">
        <CollapsibleSection title="Geral" defaultOpen>
            <div className="space-y-4 p-2">
                <Select label="Categoria" options={['', ...CATEGORIES]} value={filters.category} onChange={v => handleFilterChange('category', v as Category | '')} />
                <TextArea label="Referências de Estilo" value={filters.styleReferences} onChange={e => handleFilterChange('styleReferences', e.target.value)} rows={3} placeholder="Ex: Ghibli, H.R. Giger, dark fantasy, anime anos 90..." />
            </div>
        </CollapsibleSection>

        {filters.category && (
            <CollapsibleSection title="Filtros Específicos" defaultOpen>
                 <div className="space-y-4 p-2">{renderCategorySpecificFilters()}</div>
            </CollapsibleSection>
        )}
        
        <CollapsibleSection title="Colaboração IA" defaultOpen={allSectionsOpen}>
            <div className="space-y-4 p-2">
                 <p className="text-xs text-gray-400">Controle quais IAs participam do processo de criação.</p>
                <div className="space-y-2">
                    <Checkbox label="Usar DeepSeek (Conceito)" checked={aiFlags.useDeepSeek} onChange={e => setAiFlags(f => ({ ...f, useDeepSeek: e.target.checked }))} />
                    <Checkbox label="Usar Gemini (Estrutura e Lore)" checked={aiFlags.useGemini} onChange={e => setAiFlags(f => ({ ...f, useGemini: e.target.checked }))} />
                    <Checkbox label="Usar GPT-4o (Polimento Final)" checked={aiFlags.useGpt} onChange={e => setAiFlags(f => ({ ...f, useGpt: e.target.checked }))} />
                </div>
                 <Select label="Foco do Gemini" options={AI_FOCUS_GEMINI} value={filters.aiFocusGemini} onChange={v => handleFilterChange('aiFocusGemini', v)} />
                 <Select label="Foco do GPT" options={AI_FOCUS_GPT} value={filters.aiFocusGpt} onChange={v => handleFilterChange('aiFocusGpt', v)} />
                 <Select label="Foco do DeepSeek" options={AI_FOCUS_DEEPSEEK} value={filters.aiFocusDeepSeek} onChange={v => handleFilterChange('aiFocusDeepSeek', v)} />
            </div>
        </CollapsibleSection>
      </div>

      <footer className="p-3 border-t border-gray-700/50 flex-shrink-0">
        <Button onClick={onGenerate} disabled={isGenerating || !filters.category} className="w-full forge-button" size="lg">
          <HammerIcon className="w-5 h-5" />
          {isGenerating ? 'Forjando...' : 'Forjar'}
        </Button>
      </footer>
    </div>
  );
};