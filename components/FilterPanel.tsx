import React from 'react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { Slider } from './ui/Slider';
import type { FilterState, Tone, Category, Rarity, Era } from '../types';
import { 
    CATEGORIES, RARITIES, ERAS, DEMON_BLOOD_ARTS, TONES, PERSONALITIES, METAL_COLORS, 
    COUNTRIES, TERRAINS, ORIGINS, ONI_POWER_LEVELS, ACCESSORY_TYPES, THREAT_SCALES 
} from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { PROFESSIONS_BY_ERA } from '../lib/professionsData';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onGenerate: (count: number) => void;
  isLoading: boolean;
  onResetFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onGenerate, isLoading, onResetFilters }) => {
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleNumericFilterChange = (key: keyof FilterState, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onFiltersChange({ ...filters, [key]: numValue as any });
    }
  };

  const breathingStyleOptions = BREATHING_STYLES_DATA.map(style => style.nome);
  const weaponOptions = WEAPON_TYPES.map(w => w.name);
  const archetypeOptions = ['Aleatório', ...HUNTER_ARCHETYPES_DATA.map(a => a.nome)];
  const professionOptions = PROFESSIONS_BY_ERA[filters.npcEra] || PROFESSIONS_BY_ERA.all;

  const renderFiltersByCategory = () => {
    switch (filters.category) {
        case 'Caçador':
            return <>
                <Select label="Arma" value={filters.hunterWeapon} onChange={(e) => handleFilterChange('hunterWeapon', e.target.value)}>
                    {weaponOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <SearchableMultiSelect label="Respiração (até 2)" options={breathingStyleOptions} selected={filters.hunterBreathingStyles} onChange={(val) => handleFilterChange('hunterBreathingStyles', val)} maxSelection={2} />
                <Select label="Acessório" value={filters.hunterAccessory} onChange={(e) => handleFilterChange('hunterAccessory', e.target.value)}>
                    {ACCESSORY_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Era / Estilo" value={filters.hunterEra} onChange={(e) => handleFilterChange('hunterEra', e.target.value as Era)}>
                    {ERAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Personalidade" value={filters.hunterPersonality} onChange={(e) => handleFilterChange('hunterPersonality', e.target.value)}>
                    {PERSONALITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Origem" value={filters.hunterOrigin} onChange={(e) => handleFilterChange('hunterOrigin', e.target.value)}>
                    {ORIGINS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Classe (Arquétipo)" value={filters.hunterArchetype} onChange={(e) => handleFilterChange('hunterArchetype', e.target.value)}>
                    {archetypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
            </>;
        case 'Acessório':
            return <>
                <Select label="Raridade" value={filters.accessoryRarity} onChange={(e) => handleFilterChange('accessoryRarity', e.target.value as Rarity)}>
                    {RARITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Era / Estilo" value={filters.accessoryEra} onChange={(e) => handleFilterChange('accessoryEra', e.target.value as Era)}>
                    {ERAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Inspiração (Kekkijutsu)" value={filters.accessoryKekkijutsuInspiration} onChange={(e) => handleFilterChange('accessoryKekkijutsuInspiration', e.target.value)}>
                    {DEMON_BLOOD_ARTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Inspiração (Respiração)" value={filters.accessoryBreathingInspiration} onChange={(e) => handleFilterChange('accessoryBreathingInspiration', e.target.value)}>
                     <option value="Nenhuma">Nenhuma</option>
                    {breathingStyleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Inspiração (Arma)" value={filters.accessoryWeaponInspiration} onChange={(e) => handleFilterChange('accessoryWeaponInspiration', e.target.value)}>
                    {weaponOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Inspiração (Origem)" value={filters.accessoryOrigin} onChange={(e) => handleFilterChange('accessoryOrigin', e.target.value)}>
                    {ORIGINS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
            </>;
        case 'Arma':
            return <>
                <Select label="Tipo de Arma" value={filters.weaponType} onChange={(e) => handleFilterChange('weaponType', e.target.value)}>
                    {weaponOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Raridade" value={filters.weaponRarity} onChange={(e) => handleFilterChange('weaponRarity', e.target.value as Rarity)}>
                    {RARITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Cor do Metal" value={filters.weaponMetalColor} onChange={(e) => handleFilterChange('weaponMetalColor', e.target.value)}>
                    {METAL_COLORS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Era / Estilo" value={filters.weaponEra} onChange={(e) => handleFilterChange('weaponEra', e.target.value as Era)}>
                    {ERAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
            </>;
        case 'Local/Cenário':
             return <>
                <Select label="Tom" value={filters.locationTone} onChange={(e) => handleFilterChange('locationTone', e.target.value as Tone)}>
                    {TONES.map(opt => <option key={opt} value={opt} className="capitalize">{opt}</option>)}
                </Select>
                <Select label="País" value={filters.locationCountry} onChange={(e) => handleFilterChange('locationCountry', e.target.value)}>
                    {COUNTRIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Era / Estilo" value={filters.locationEra} onChange={(e) => handleFilterChange('locationEra', e.target.value as Era)}>
                    {ERAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Tipo de Terreno" value={filters.locationTerrain} onChange={(e) => handleFilterChange('locationTerrain', e.target.value)}>
                    {TERRAINS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
             </>;
        case 'World Building':
            return <>
                <Select label="Tom" value={filters.wbTone} onChange={(e) => handleFilterChange('wbTone', e.target.value as Tone)}>
                    {TONES.map(opt => <option key={opt} value={opt} className="capitalize">{opt}</option>)}
                </Select>
                <Select label="País" value={filters.wbCountry} onChange={(e) => handleFilterChange('wbCountry', e.target.value)}>
                    {COUNTRIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Era / Estilo" value={filters.wbEra} onChange={(e) => handleFilterChange('wbEra', e.target.value as Era)}>
                    {ERAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Escala de Ameaça" value={filters.wbThreatScale} onChange={(e) => handleFilterChange('wbThreatScale', e.target.value)}>
                    {THREAT_SCALES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                 <Select label="Local Principal" value={filters.wbLocation} onChange={(e) => handleFilterChange('wbLocation', e.target.value)}>
                    {TERRAINS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
            </>;
        case 'Forma de Respiração':
            return <>
                <SearchableMultiSelect label="Respiração Base (Inspiração)" options={breathingStyleOptions} selected={filters.baseBreathingStyles} onChange={(val) => handleFilterChange('baseBreathingStyles', val)} />
                <Select label="Arma Associada" value={filters.breathingFormWeapon} onChange={(e) => handleFilterChange('breathingFormWeapon', e.target.value)}>
                    {weaponOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                 <Select label="Era / Estilo" value={filters.breathingFormEra} onChange={(e) => handleFilterChange('breathingFormEra', e.target.value as Era)}>
                    {ERAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Tom" value={filters.breathingFormTone} onChange={(e) => handleFilterChange('breathingFormTone', e.target.value as Tone)}>
                    {TONES.map(opt => <option key={opt} value={opt} className="capitalize">{opt}</option>)}
                </Select>
                <Select label="Origem Cultural" value={filters.breathingFormOrigin} onChange={(e) => handleFilterChange('breathingFormOrigin', e.target.value)}>
                    {ORIGINS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Arquétipo de Usuário" value={filters.breathingFormArchetype} onChange={(e) => handleFilterChange('breathingFormArchetype', e.target.value)}>
                    {archetypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
            </>;
        case 'Kekkijutsu':
            return <>
                 <Select label="Era / Estilo" value={filters.kekkijutsuEra} onChange={(e) => handleFilterChange('kekkijutsuEra', e.target.value as Era)}>
                    {ERAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Inspiração (Outro Kekkijutsu)" value={filters.kekkijutsuKekkijutsuInspiration} onChange={(e) => handleFilterChange('kekkijutsuKekkijutsuInspiration', e.target.value)}>
                    {DEMON_BLOOD_ARTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Inspiração (Respiração)" value={filters.kekkijutsuBreathingInspiration} onChange={(e) => handleFilterChange('kekkijutsuBreathingInspiration', e.target.value)}>
                    <option value="Nenhuma">Nenhuma</option>
                    {breathingStyleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Inspiração (Arma)" value={filters.kekkijutsuWeaponInspiration} onChange={(e) => handleFilterChange('kekkijutsuWeaponInspiration', e.target.value)}>
                    {weaponOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
            </>;
        case 'Inimigo/Oni':
            return <>
                <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={e => handleFilterChange('oniPowerLevel', e.target.value)}>
                    {ONI_POWER_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                 <Select label="Inspiração (Kekkijutsu)" value={filters.oniInspirationKekkijutsu} onChange={(e) => handleFilterChange('oniInspirationKekkijutsu', e.target.value)}>
                    {DEMON_BLOOD_ARTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Inspiração (Respiração)" value={filters.oniInspirationBreathing} onChange={(e) => handleFilterChange('oniInspirationBreathing', e.target.value)}>
                     <option value="Nenhuma">Nenhuma</option>
                    {breathingStyleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Arma" value={filters.oniWeapon} onChange={e => handleFilterChange('oniWeapon', e.target.value)}>
                    {weaponOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
            </>;
        case 'NPC':
            return <>
                <Select label="Origem" value={filters.npcOrigin} onChange={e => handleFilterChange('npcOrigin', e.target.value)}>
                    {ORIGINS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                 <Select label="Era (influencia profissão)" value={filters.npcEra} onChange={e => handleFilterChange('npcEra', e.target.value as Era)}>
                    {ERAS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Select label="Profissão (Classe)" value={filters.npcProfession} onChange={e => handleFilterChange('npcProfession', e.target.value)}>
                    {professionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
            </>
        case 'Missão/Cenário':
             return <div className="space-y-4 border-t border-indigo-900/50 pt-4">
                <Select label="Tom da Missão" value={filters.missionTone} onChange={(e) => handleFilterChange('missionTone', e.target.value as Tone)}>
                  {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </Select>
                <Slider label={`Intensidade: ${filters.intensity}`} min={1} max={5} step={1} value={filters.intensity || 3} onChange={(e) => handleNumericFilterChange('intensity', e.target.value)} />
                 <Select label="Escala da Ameaça" value={filters.missionScale} onChange={(e) => handleFilterChange('missionScale', e.target.value as 'local' | 'regional' | 'nacional' | 'cósmico')}>
                  <option value="local">Local</option>
                  <option value="regional">Regional</option>
                  <option value="nacional">Nacional</option>
                  <option value="cósmico">Cósmico</option>
                </Select>
            </div>;
        default:
            return null;
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-lg md:text-xl font-bold text-white mb-4 font-gangofthree">Forja de Lendas</h2>
      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        <Select
          label="Categoria"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value as Category)}
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </Select>
        {renderFiltersByCategory()}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700 space-y-3">
        <div className="grid grid-cols-4 gap-2">
            <Button onClick={() => onGenerate(1)} disabled={isLoading} className="w-full text-xs !px-2">
                {isLoading ? '...' : 'Gerar 1'}
            </Button>
            <Button onClick={() => onGenerate(3)} disabled={isLoading} className="w-full text-xs !px-2">
                {isLoading ? '...' : 'Gerar 3'}
            </Button>
            <Button onClick={() => onGenerate(6)} disabled={isLoading} className="w-full text-xs !px-2">
                {isLoading ? '...' : 'Gerar 6'}
            </Button>
            <Button onClick={() => onGenerate(10)} disabled={isLoading} className="w-full text-xs !px-2">
                {isLoading ? '...' : 'Gerar 10'}
            </Button>
        </div>
        <Button variant="secondary" onClick={onResetFilters} disabled={isLoading} className="w-full">
            Resetar Filtros
        </Button>
      </div>
    </div>
  );
};