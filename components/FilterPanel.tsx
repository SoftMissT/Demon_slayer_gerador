
import React from 'react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { SparklesIcon } from './icons/SparklesIcon';
import { Slider } from './ui/Slider';
import type { FilterState, Tone } from '../types';
import { CATEGORIES, RARITIES, ERAS, DEMON_BLOOD_ARTS, TONES, RELATIONS, DETAIL_LEVELS, ORIGINS, ONI_POWER_LEVELS, PERSONALITIES, METAL_COLORS, COUNTRIES, TERRAINS } from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { PROFESSIONS_BY_ERA } from '../lib/professionsData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onGenerate: (count: number) => void;
  isLoading: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onGenerate, isLoading }) => {
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
  const weaponOptions = WEAPON_TYPES.map(weapon => weapon.name);
  const hunterArchetypeOptions = HUNTER_ARCHETYPES_DATA.map(arch => arch.nome);
  
  const professionOptions = React.useMemo(() => {
    const eraKey = filters.era;
    if (eraKey === 'Aleatória') {
        return PROFESSIONS_BY_ERA.all;
    }
    return PROFESSIONS_BY_ERA[eraKey] || [];
  }, [filters.era]);
  
  React.useEffect(() => {
    if (!professionOptions.includes(filters.profession)) {
        handleFilterChange('profession', 'Aleatória');
    }
  }, [professionOptions, filters.profession]);

  const renderFiltersByCategory = () => {
    switch(filters.category) {
      case 'Caçador':
        return (
          <>
            <Select label="Arma Principal" value={filters.hunterWeapon} onChange={(e) => handleFilterChange('hunterWeapon', e.target.value)}>
              {weaponOptions.map(w => <option key={w} value={w}>{w}</option>)}
            </Select>
            <SearchableMultiSelect
                label="Respiração (até 2)"
                options={breathingStyleOptions}
                selected={filters.hunterBreathingStyles}
                onChange={(selected) => {
                    if (selected.length <= 2) {
                        handleFilterChange('hunterBreathingStyles', selected);
                    }
                }}
                placeholder="Selecione estilos..."
            />
            <Select label="Origem" value={filters.origem} onChange={(e) => handleFilterChange('origem', e.target.value)}>
              {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Arquétipo (Classe)" value={filters.hunterArchetype} onChange={(e) => handleFilterChange('hunterArchetype', e.target.value)}>
              <option value="Aleatório">Aleatório</option>
              {hunterArchetypeOptions.map(arch => <option key={arch} value={arch}>{arch}</option>)}
            </Select>
            <Select label="Personalidade" value={filters.hunterPersonality} onChange={(e) => handleFilterChange('hunterPersonality', e.target.value)}>
              {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
             <Select label="Tom do Personagem" value={filters.hunterTone} onChange={(e) => handleFilterChange('hunterTone', e.target.value as Tone)}>
              {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </Select>
          </>
        );
      case 'Acessório':
        return (
          <>
            <Select label="Raridade" value={filters.rarity} onChange={(e) => handleFilterChange('rarity', e.target.value)}>
              {RARITIES.map(rar => <option key={rar} value={rar}>{rar}</option>)}
            </Select>
            <Select label="Inspiração (Respiração)" value={filters.accessoryInspirationBreathing} onChange={(e) => handleFilterChange('accessoryInspirationBreathing', e.target.value)}>
              <option value="Nenhuma">Nenhuma</option>
              {breathingStyleOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Select label="Inspiração (Kekkijutsu)" value={filters.accessoryInspirationKekkijutsu} onChange={(e) => handleFilterChange('accessoryInspirationKekkijutsu', e.target.value)}>
              <option value="Nenhuma">Nenhuma</option>
              {DEMON_BLOOD_ARTS.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Select label="Inspiração (Arma)" value={filters.accessoryWeaponInspiration} onChange={(e) => handleFilterChange('accessoryWeaponInspiration', e.target.value)}>
               <option value="Nenhuma">Nenhuma</option>
              {weaponOptions.map(w => <option key={w} value={w}>{w}</option>)}
            </Select>
            <Select label="Inspiração (Origem)" value={filters.accessoryOriginInspiration} onChange={(e) => handleFilterChange('accessoryOriginInspiration', e.target.value)}>
              {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </>
        );
      case 'Arma':
        return (
          <>
            <Select label="Raridade" value={filters.rarity} onChange={(e) => handleFilterChange('rarity', e.target.value)}>
              {RARITIES.map(rar => <option key={rar} value={rar}>{rar}</option>)}
            </Select>
             <Select label="Cor do Metal (Nichirin)" value={filters.weaponMetalColor} onChange={(e) => handleFilterChange('weaponMetalColor', e.target.value)}>
              {METAL_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </>
        );
      case 'Local/Cenário':
        return (
          <>
            <Select label="Tom" value={filters.locationTone} onChange={(e) => handleFilterChange('locationTone', e.target.value as Tone)}>
              {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </Select>
            <Select label="País/Cultura" value={filters.locationCountry} onChange={(e) => handleFilterChange('locationCountry', e.target.value)}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Tipo de Terreno" value={filters.locationTerrain} onChange={(e) => handleFilterChange('locationTerrain', e.target.value)}>
              {TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </>
        );
       case 'World Building':
        return (
          <>
            <Select label="Tom" value={filters.wbTone} onChange={(e) => handleFilterChange('wbTone', e.target.value as Tone)}>
              {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </Select>
            <Select label="País/Cultura" value={filters.wbCountry} onChange={(e) => handleFilterChange('wbCountry', e.target.value)}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Escala da Ameaça" value={filters.wbScale} onChange={(e) => handleFilterChange('wbScale', e.target.value as 'local' | 'regional' | 'nacional' | 'cósmico')}>
              <option value="local">Local</option>
              <option value="regional">Regional</option>
              <option value="nacional">Nacional</option>
              <option value="cósmico">Cósmico</option>
            </Select>
          </>
        );
      case 'Forma de Respiração':
        return (
          <>
            {/* FIX: Replaced SearchableMultiSelect with Select to match FilterState type for 'baseBreathingStyle'. */}
            <Select label="Respiração Base (Derivação)" value={filters.baseBreathingStyle} onChange={(e) => handleFilterChange('baseBreathingStyle', e.target.value)}>
              <option value="Aleatória">Aleatória</option>
              {breathingStyleOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Select label="Arma" value={filters.breathingFormWeapon} onChange={(e) => handleFilterChange('breathingFormWeapon', e.target.value)}>
              {weaponOptions.map(w => <option key={w} value={w}>{w}</option>)}
            </Select>
            <Select label="Tom" value={filters.breathingFormTone} onChange={(e) => handleFilterChange('breathingFormTone', e.target.value as Tone)}>
              {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </Select>
            <Select label="Origem" value={filters.breathingFormOrigin} onChange={(e) => handleFilterChange('breathingFormOrigin', e.target.value)}>
              {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Arquétipo (Classe)" value={filters.breathingFormArchetype} onChange={(e) => handleFilterChange('breathingFormArchetype', e.target.value)}>
              <option value="Aleatório">Aleatório</option>
              {hunterArchetypeOptions.map(arch => <option key={arch} value={arch}>{arch}</option>)}
            </Select>
          </>
        );
       case 'Kekkijutsu':
        return (
          <>
            {/* FIX: Replaced SearchableMultiSelect with Select for 'kekkijutsuInspiration' to match the FilterState type. */}
            <Select label="Inspiração (Kekkijutsu)" value={filters.kekkijutsuInspiration} onChange={(e) => handleFilterChange('kekkijutsuInspiration', e.target.value)}>
              <option value="Nenhuma">Nenhuma</option>
              {DEMON_BLOOD_ARTS.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Select label="Inspiração (Respiração)" value={filters.kekkijutsuInspirationBreathing} onChange={(e) => handleFilterChange('kekkijutsuInspirationBreathing', e.target.value)}>
              <option value="Nenhuma">Nenhuma</option>
              {breathingStyleOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Select label="Inspiração (Arma)" value={filters.kekkijutsuWeapon} onChange={(e) => handleFilterChange('kekkijutsuWeapon', e.target.value)}>
              <option value="Nenhuma">Nenhuma</option>
              {weaponOptions.map(w => <option key={w} value={w}>{w}</option>)}
            </Select>
          </>
        );
      case 'Inimigo/Oni':
         return (
            <>
                 <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={(e) => handleFilterChange('oniPowerLevel', e.target.value)}>
                  {ONI_POWER_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
                <Select label="Arma do Oni" value={filters.oniWeapon} onChange={(e) => handleFilterChange('oniWeapon', e.target.value)}>
                  {weaponOptions.map(w => <option key={w} value={w}>{w}</option>)}
                </Select>
                 <Select label="Inspiração (Respiração)" value={filters.oniInspirationBreathing} onChange={(e) => handleFilterChange('oniInspirationBreathing', e.target.value)}>
                  <option value="Nenhuma">Nenhuma</option>
                  {breathingStyleOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
                <Select label="Inspiração (Kekkijutsu)" value={filters.oniInspirationKekkijutsu} onChange={(e) => handleFilterChange('oniInspirationKekkijutsu', e.target.value)}>
                  <option value="Nenhuma">Nenhuma</option>
                  {DEMON_BLOOD_ARTS.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
            </>
        );
      case 'NPC':
        return (
            <>
                <Select label="Origem" value={filters.origem} onChange={(e) => handleFilterChange('origem', e.target.value)}>
                    {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                </Select>
                <Select label="Tom do NPC" value={filters.missionTone} onChange={(e) => handleFilterChange('missionTone', e.target.value as Tone)}>
                  {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </Select>
                 <Select label="Profissão" value={filters.profession} onChange={(e) => handleFilterChange('profession', e.target.value)}>
                  {professionOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
                <Select label="Relação com PJs" value={filters.relation_with_pcs} onChange={(e) => handleFilterChange('relation_with_pcs', e.target.value)}>
                  {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
                <Select label="Nível de Detalhe" value={filters.level_detail} onChange={(e) => handleFilterChange('level_detail', e.target.value)}>
                  {DETAIL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </Select>
            </>
        );
      case 'Missão/Cenário':
        return (
            <>
                {/* FIX: Corrected property 'tone' to 'missionTone' to match FilterState type. */}
                <Select label="Tom da Missão" value={filters.missionTone} onChange={(e) => handleFilterChange('missionTone', e.target.value as Tone)}>
                  {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </Select>
                <Slider label={`Intensidade: ${filters.intensity}`} min={1} max={5} step={1} value={filters.intensity || 3} onChange={(e) => handleNumericFilterChange('intensity', e.target.value)} />
                 {/* FIX: Corrected property 'scale' to 'missionScale' to match FilterState type. */}
                 <Select label="Escala da Ameaça" value={filters.missionScale} onChange={(e) => handleFilterChange('missionScale', e.target.value as 'local' | 'regional' | 'nacional' | 'cósmico')}>
                  <option value="local">Local</option>
                  <option value="regional">Regional</option>
                  <option value="nacional">Nacional</option>
                  <option value="cósmico">Cósmico</option>
                </Select>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Protagonista</label>
                  <input type="text" value={filters.protagonist} onChange={e => handleFilterChange('protagonist', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Alvo Principal</label>
                  <input type="text" value={filters.targets} onChange={e => handleFilterChange('targets', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Modificadores de Ambiente</label>
                  <input type="text" value={filters.moodModifiers} onChange={e => handleFilterChange('moodModifiers', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white" placeholder="Ex: úmido, nevoento, reverente" />
                </div>
            </>
        );
      default:
        // Default filters for Arma, or Aleatória
        return (
            <Select label="Raridade" value={filters.rarity} onChange={(e) => handleFilterChange('rarity', e.target.value)}>
                {RARITIES.map(rar => <option key={rar} value={rar}>{rar}</option>)}
            </Select>
        )
    }
  }


  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-4 font-gangofthree">Forja de Lendas</h2>
      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        <Select
          label="Categoria"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </Select>
        
        <Select
          label="Era / Estilo"
          value={filters.era}
          onChange={(e) => handleFilterChange('era', e.target.value)}
        >
          {ERAS.map(era => <option key={era} value={era}>{era}</option>)}
        </Select>

        <div className="space-y-4 border-t border-indigo-900/50 pt-4">
            {renderFiltersByCategory()}
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => onGenerate(1)} disabled={isLoading}>
                {isLoading ? '...' : 'Gerar 1'}
            </Button>
            <Button onClick={() => onGenerate(3)} disabled={isLoading}>
                {isLoading ? '...' : 'Gerar 3'}
            </Button>
            <Button onClick={() => onGenerate(6)} disabled={isLoading}>
                {isLoading ? '...' : 'Gerar 6'}
            </Button>
        </div>
      </div>
    </div>
  );
};
