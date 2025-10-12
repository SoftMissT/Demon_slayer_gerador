

import React from 'react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { SparklesIcon } from './icons/SparklesIcon';
import { Slider } from './ui/Slider';
// FIX: Corrected import paths for types and constants from parent directories.
import type { FilterState, Tone, Category, Rarity, Era } from '../types';
import { 
    CATEGORIES, RARITIES, ERAS, DEMON_BLOOD_ARTS, TONES, PERSONALITIES, 
    METAL_COLORS, COUNTRIES, TERRAINS, THREAT_SCALES, ONI_POWER_LEVELS 
} from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { PROFESSIONS_BY_ERA } from '../lib/professionsData';
import { ORIGINS_DATA } from '../lib/originsData';

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
  
  const breathingStyleOptions = BREATHING_STYLES_DATA.map(style => style.nome);
  const weaponTypeOptions = WEAPON_TYPES.map(w => w.name);
  // FIX: Corrected property access from 'a.nome' to 'a.arquétipo' to match the 'Archetype' interface.
  const hunterArchetypeOptions = ['Aleatória', ...HUNTER_ARCHETYPES_DATA.map(a => a.arquétipo)];
  const professionOptions = PROFESSIONS_BY_ERA[filters.npcEra] || PROFESSIONS_BY_ERA['all'];
  const originOptions = ['Aleatória', ...ORIGINS_DATA.map(o => o.nome)];


  const renderFiltersForCategory = () => {
    switch (filters.category) {
      case 'Caçador':
        return (
          <>
            <Select label="Era / Estilo" value={filters.hunterEra} onChange={(e) => handleFilterChange('hunterEra', e.target.value as Era)}>{ERAS.map(e => <option key={e} value={e}>{e}</option>)}</Select>
            <Select label="País/Cultura" value={filters.hunterCountry} onChange={(e) => handleFilterChange('hunterCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            <Select label="Origem" value={filters.hunterOrigin} onChange={(e) => handleFilterChange('hunterOrigin', e.target.value)}>{originOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            <Select label="Arquétipo" value={filters.hunterArchetype} onChange={(e) => handleFilterChange('hunterArchetype', e.target.value)}>{hunterArchetypeOptions.map(a => <option key={a} value={a}>{a}</option>)}</Select>
            <Select label="Personalidade" value={filters.hunterPersonality} onChange={(e) => handleFilterChange('hunterPersonality', e.target.value)}>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
            <Select label="Arma Principal" value={filters.hunterWeapon} onChange={(e) => handleFilterChange('hunterWeapon', e.target.value)}>{weaponTypeOptions.map(w => <option key={w} value={w}>{w}</option>)}</Select>
            <SearchableMultiSelect label="Estilos de Respiração" selected={filters.hunterBreathingStyles} onChange={(v) => handleFilterChange('hunterBreathingStyles', v)} options={breathingStyleOptions} maxSelection={2} placeholder="Selecione até 2" />
          </>
        );
      case 'Inimigo/Oni':
        return (
          <>
            <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={(e) => handleFilterChange('oniPowerLevel', e.target.value)}>{ONI_POWER_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}</Select>
             <Select label="País/Cultura" value={filters.oniCountry} onChange={(e) => handleFilterChange('oniCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            <Select label="Arma (se houver)" value={filters.oniWeapon} onChange={(e) => handleFilterChange('oniWeapon', e.target.value)}>{weaponTypeOptions.map(w => <option key={w} value={w}>{w}</option>)}</Select>
            <Select label="Inspiração (Kekkijutsu)" value={filters.oniInspirationKekkijutsu} onChange={(e) => handleFilterChange('oniInspirationKekkijutsu', e.target.value)}>{DEMON_BLOOD_ARTS.map(k => <option key={k} value={k}>{k}</option>)}</Select>
            <Select label="Inspiração (Respiração)" value={filters.oniInspirationBreathing} onChange={(e) => handleFilterChange('oniInspirationBreathing', e.target.value)}><option value="Nenhuma">Nenhuma</option>{breathingStyleOptions.map(b => <option key={b} value={b}>{b}</option>)}</Select>
            <Select label="Personalidade" value={filters.oniPersonality} onChange={(e) => handleFilterChange('oniPersonality', e.target.value)}>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
          </>
        );
      case 'NPC':
        return (
          <>
            <Select label="Era / Estilo" value={filters.npcEra} onChange={(e) => handleFilterChange('npcEra', e.target.value as Era)}>{ERAS.map(e => <option key={e} value={e}>{e}</option>)}</Select>
            <Select label="País/Cultura" value={filters.npcCountry} onChange={(e) => handleFilterChange('npcCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            <Select label="Origem" value={filters.npcOrigin} onChange={(e) => handleFilterChange('npcOrigin', e.target.value)}>{originOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            <Select label="Profissão" value={filters.npcProfession} onChange={(e) => handleFilterChange('npcProfession', e.target.value)}>{professionOptions.map(p => <option key={p} value={p}>{p}</option>)}</Select>
            <Select label="Personalidade" value={filters.npcPersonality} onChange={(e) => handleFilterChange('npcPersonality', e.target.value)}>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
            <Select label="Arma (Opcional)" value={filters.npcWeapon} onChange={(e) => handleFilterChange('npcWeapon', e.target.value)}>{weaponTypeOptions.map(w => <option key={w} value={w}>{w}</option>)}</Select>
          </>
        );
      case 'Arma':
        return (
          <>
            <Select label="Raridade" value={filters.weaponRarity} onChange={(e) => handleFilterChange('weaponRarity', e.target.value as Rarity)}>{RARITIES.map(r => <option key={r} value={r}>{r}</option>)}</Select>
            <Select label="Era / Estilo" value={filters.weaponEra} onChange={(e) => handleFilterChange('weaponEra', e.target.value as Era)}>{ERAS.map(e => <option key={e} value={e}>{e}</option>)}</Select>
            <Select label="País/Cultura" value={filters.weaponCountry} onChange={(e) => handleFilterChange('weaponCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            <Select label="Tipo de Arma" value={filters.weaponType} onChange={(e) => handleFilterChange('weaponType', e.target.value)}>{weaponTypeOptions.map(w => <option key={w} value={w}>{w}</option>)}</Select>
            <Select label="Cor do Metal (Nichirin)" value={filters.weaponMetalColor} onChange={(e) => handleFilterChange('weaponMetalColor', e.target.value)}>{METAL_COLORS.map(c => <option key={c} value={c}>{c}</option>)}</Select>
          </>
        );
      case 'Acessório':
        return (
          <>
            <Select label="Raridade" value={filters.accessoryRarity} onChange={(e) => handleFilterChange('accessoryRarity', e.target.value as Rarity)}>{RARITIES.map(r => <option key={r} value={r}>{r}</option>)}</Select>
            <Select label="Era / Estilo" value={filters.accessoryEra} onChange={(e) => handleFilterChange('accessoryEra', e.target.value as Era)}>{ERAS.map(e => <option key={e} value={e}>{e}</option>)}</Select>
            <Select label="País/Cultura" value={filters.accessoryCountry} onChange={(e) => handleFilterChange('accessoryCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            <Select label="Inspiração (Origem)" value={filters.accessoryOrigin} onChange={(e) => handleFilterChange('accessoryOrigin', e.target.value)}>{originOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            <Select label="Inspiração (Respiração)" value={filters.accessoryBreathingInspiration} onChange={(e) => handleFilterChange('accessoryBreathingInspiration', e.target.value)}><option value="Nenhuma">Nenhuma</option>{breathingStyleOptions.map(b => <option key={b} value={b}>{b}</option>)}</Select>
          </>
        );
      case 'Forma de Respiração':
        return (
          <>
             <SearchableMultiSelect label="Respirações Base (Derivação)" selected={filters.baseBreathingStyles} onChange={(v) => handleFilterChange('baseBreathingStyles', v)} options={breathingStyleOptions} maxSelection={2} placeholder="Selecione até 2" />
             <Select label="Era / Estilo" value={filters.breathingFormEra} onChange={(e) => handleFilterChange('breathingFormEra', e.target.value as Era)}>{ERAS.map(e => <option key={e} value={e}>{e}</option>)}</Select>
             <Select label="País/Cultura" value={filters.breathingFormCountry} onChange={(e) => handleFilterChange('breathingFormCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
             <Select label="Origem do Usuário" value={filters.breathingFormOrigin} onChange={(e) => handleFilterChange('breathingFormOrigin', e.target.value)}>{originOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select>
             <Select label="Tom" value={filters.breathingFormTone} onChange={(e) => handleFilterChange('breathingFormTone', e.target.value as Tone)}>{TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}</Select>
             <Select label="Arma Associada" value={filters.breathingFormWeapon} onChange={(e) => handleFilterChange('breathingFormWeapon', e.target.value)}>{weaponTypeOptions.map(w => <option key={w} value={w}>{w}</option>)}</Select>
          </>
        );
      case 'Kekkijutsu':
        return (
          <>
            <Select label="Era / Estilo" value={filters.kekkijutsuEra} onChange={(e) => handleFilterChange('kekkijutsuEra', e.target.value as Era)}>{ERAS.map(e => <option key={e} value={e}>{e}</option>)}</Select>
            <Select label="País/Cultura" value={filters.kekkijutsuCountry} onChange={(e) => handleFilterChange('kekkijutsuCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            <Select label="Inspiração (Outro Kekkijutsu)" value={filters.kekkijutsuKekkijutsuInspiration} onChange={(e) => handleFilterChange('kekkijutsuKekkijutsuInspiration', e.target.value)}>{DEMON_BLOOD_ARTS.map(k => <option key={k} value={k}>{k}</option>)}</Select>
            <Select label="Inspiração (Respiração)" value={filters.kekkijutsuBreathingInspiration} onChange={(e) => handleFilterChange('kekkijutsuBreathingInspiration', e.target.value)}><option value="Nenhuma">Nenhuma</option>{breathingStyleOptions.map(b => <option key={b} value={b}>{b}</option>)}</Select>
            <Select label="Inspiração (Arma)" value={filters.kekkijutsuWeaponInspiration} onChange={(e) => handleFilterChange('kekkijutsuWeaponInspiration', e.target.value)}><option value="Nenhuma">Nenhuma</option>{weaponTypeOptions.map(w => <option key={w} value={w}>{w}</option>)}</Select>
          </>
        );
      case 'Local/Cenário':
        return (
          <>
            <Select label="Tom" value={filters.locationTone} onChange={(e) => handleFilterChange('locationTone', e.target.value as Tone)}>{TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}</Select>
            <Select label="Era / Estilo" value={filters.locationEra} onChange={(e) => handleFilterChange('locationEra', e.target.value as Era)}>{ERAS.map(e => <option key={e} value={e}>{e}</option>)}</Select>
            <Select label="País/Cultura" value={filters.locationCountry} onChange={(e) => handleFilterChange('locationCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            <Select label="Terreno" value={filters.locationTerrain} onChange={(e) => handleFilterChange('locationTerrain', e.target.value)}>{TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
          </>
        );
      case 'Missão/Cenário':
        return (
          <>
            <Select label="Tom da Missão" value={filters.missionTone} onChange={(e) => handleFilterChange('missionTone', e.target.value as Tone)}>{TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}</Select>
            <Slider label={`Intensidade: ${filters.intensity}`} min={1} max={5} step={1} value={filters.intensity || 3} onChange={(e) => handleFilterChange('intensity', parseInt(e.target.value))} />
            <Select label="Escala da Ameaça" value={filters.missionScale} onChange={(e) => handleFilterChange('missionScale', e.target.value as 'local' | 'regional' | 'nacional' | 'cósmico')}>
                <option value="local">Local</option><option value="regional">Regional</option><option value="nacional">Nacional</option><option value="cósmico">Cósmico</option>
            </Select>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Protagonista</label><input type="text" value={filters.protagonist} onChange={e => handleFilterChange('protagonist', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white" /></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Alvo Principal</label><input type="text" value={filters.targets} onChange={e => handleFilterChange('targets', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white" /></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Modificadores</label><input type="text" value={filters.moodModifiers} onChange={e => handleFilterChange('moodModifiers', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white" placeholder="Ex: úmido, nevoento, reverente" /></div>
          </>
        );
      case 'World Building':
        return (
          <>
            <Select label="Tom" value={filters.wbTone} onChange={(e) => handleFilterChange('wbTone', e.target.value as Tone)}>{TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}</Select>
            <Select label="Era / Estilo" value={filters.wbEra} onChange={(e) => handleFilterChange('wbEra', e.target.value as Era)}>{ERAS.map(e => <option key={e} value={e}>{e}</option>)}</Select>
            <Select label="Escala da Ameaça" value={filters.wbThreatScale} onChange={(e) => handleFilterChange('wbThreatScale', e.target.value)}>{THREAT_SCALES.map(s => <option key={s} value={s}>{s}</option>)}</Select>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Local Principal</label><input type="text" value={filters.wbLocation} onChange={e => handleFilterChange('wbLocation', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white" placeholder="Ex: uma cidade, uma região" /></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-4 font-gangofthree flex-shrink-0">Filtros</h2>
      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        <Select
          label="Categoria"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value as Category)}
        >
          <option value="" disabled>Selecione...</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </Select>
        
        <div className="space-y-4 border-t border-indigo-900/50 pt-4">
            {renderFiltersForCategory()}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700 flex-shrink-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
             <Button onClick={() => onGenerate(1)} disabled={isLoading || !filters.category} className="w-full">
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? 'Forjando...' : 'Gerar'}
            </Button>
            <Button onClick={() => onGenerate(3)} disabled={isLoading || !filters.category} className="w-full" variant="secondary">
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? '...' : 'Gerar x3'}
            </Button>
        </div>
        <Button onClick={onResetFilters} disabled={isLoading} variant="ghost" className="w-full text-xs">
            Resetar Filtros
        </Button>
      </div>
    </div>
  );
};