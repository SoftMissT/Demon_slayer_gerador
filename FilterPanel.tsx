


import React from 'react';
import { Button } from './components/ui/Button';
import { Select } from './components/ui/Select';
import { SearchableMultiSelect } from './components/ui/SearchableMultiSelect';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { Slider } from './components/ui/Slider';
// FIX: Corrected type imports from the now separate types.ts file.
import type { FilterState, Tone, Category, Rarity, Era } from './types';
// FIX: Removed BREATHING_STYLES from constants import as it's not exported there.
import { CATEGORIES, RARITIES, ERAS, DEMON_BLOOD_ARTS, TONES } from './constants';
// FIX: Import BREATHING_STYLES_DATA from its source file.
import { BREATHING_STYLES_DATA } from './lib/breathingStylesData';

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
      // FIX: Added 'as any' to fix TypeScript error for assigning number to a potentially string property.
      onFiltersChange({ ...filters, [key]: numValue as any });
    }
  };

  // FIX: Create an array of style names from the imported data object.
  const breathingStyleOptions = BREATHING_STYLES_DATA.map(style => style.nome);

  // FIX: Helper to render rarity select only for applicable categories.
  const renderRaritySelect = () => {
    if (filters.category === 'Arma') {
        return (
            <Select
                label="Raridade"
                value={filters.weaponRarity}
                onChange={(e) => handleFilterChange('weaponRarity', e.target.value as Rarity)}
            >
                {RARITIES.map(rar => <option key={rar} value={rar}>{rar}</option>)}
            </Select>
        );
    }
    if (filters.category === 'Acessório') {
        return (
            <Select
                label="Raridade"
                value={filters.accessoryRarity}
                onChange={(e) => handleFilterChange('accessoryRarity', e.target.value as Rarity)}
            >
                {RARITIES.map(rar => <option key={rar} value={rar}>{rar}</option>)}
            </Select>
        );
    }
    return null;
  }

  // FIX: Helper to render era select only for applicable categories.
  const renderEraSelect = () => {
    let era: Era | undefined;
    let eraKey: keyof FilterState | undefined;

    switch (filters.category) {
        case 'Caçador':
            era = filters.hunterEra;
            eraKey = 'hunterEra';
            break;
        case 'Acessório':
            era = filters.accessoryEra;
            eraKey = 'accessoryEra';
            break;
        case 'Arma':
            era = filters.weaponEra;
            eraKey = 'weaponEra';
            break;
        case 'Local/Cenário':
            era = filters.locationEra;
            eraKey = 'locationEra';
            break;
        case 'World Building':
            era = filters.wbEra;
            eraKey = 'wbEra';
            break;
        case 'Forma de Respiração':
            era = filters.breathingFormEra;
            eraKey = 'breathingFormEra';
            break;
        case 'Kekkijutsu':
            era = filters.kekkijutsuEra;
            eraKey = 'kekkijutsuEra';
            break;
        case 'NPC':
            era = filters.npcEra;
            eraKey = 'npcEra';
            break;
    }

    if (era !== undefined && eraKey) {
        const key = eraKey; // for closure
        return (
            <Select
                label="Era / Estilo"
                value={era}
                onChange={(e) => handleFilterChange(key, e.target.value as Era)}
            >
                {ERAS.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
        );
    }
    return null;
}

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-4 font-gangofthree">Forja de Lendas</h2>
      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        <Select
          label="Categoria"
          value={filters.category}
          // FIX: Cast e.target.value to Category to match the FilterState type.
          onChange={(e) => handleFilterChange('category', e.target.value as Category)}
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </Select>

        {/* FIX: Replaced generic rarity select with a conditional one */}
        {renderRaritySelect()}

        {/* FIX: Replaced generic era select with a conditional one */}
        {renderEraSelect()}
        
        {/* Mission-specific filters */}
        {filters.category === 'Missão/Cenário' && (
            <div className="space-y-4 border-t border-indigo-900/50 pt-4">
                {/* FIX: Corrected property 'tone' to 'missionTone' to match FilterState type. */}
                <Select
                  label="Tom da Missão"
                  value={filters.missionTone}
                  onChange={(e) => handleFilterChange('missionTone', e.target.value as Tone)}
                >
                  {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </Select>
                <Slider
                    label={`Intensidade: ${filters.intensity}`}
                    min={1} max={5} step={1}
                    value={filters.intensity || 3}
                    onChange={(e) => handleNumericFilterChange('intensity', e.target.value)}
                />
                 {/* FIX: Corrected property 'scale' to 'missionScale' to match FilterState type. */}
                 <Select
                  label="Escala da Ameaça"
                  value={filters.missionScale}
                  onChange={(e) => handleFilterChange('missionScale', e.target.value as 'local' | 'regional' | 'nacional' | 'cósmico')}
                >
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
            </div>
        )}

        {/* FIX: Used SearchableMultiSelect and corrected property to 'baseBreathingStyles' */}
        {filters.category === 'Forma de Respiração' && (
          <SearchableMultiSelect
            label="Respiração Base (Derivação)"
            selected={filters.baseBreathingStyles}
            onChange={(val) => handleFilterChange('baseBreathingStyles', val)}
            options={breathingStyleOptions}
          />
        )}
        
        {/* FIX: Corrected property to 'kekkijutsuKekkijutsuInspiration'. */}
        {filters.category === 'Kekkijutsu' && (
          <Select
            label="Inspiração (Kekkijutsu)"
            value={filters.kekkijutsuKekkijutsuInspiration}
            onChange={(e) => handleFilterChange('kekkijutsuKekkijutsuInspiration', e.target.value)}
          >
            <option value="Nenhuma">Nenhuma</option>
            {DEMON_BLOOD_ARTS.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <Button onClick={() => onGenerate(1)} disabled={isLoading} className="w-full">
          <SparklesIcon className="w-5 h-5" />
          {isLoading ? 'Forjando...' : 'Gerar'}
        </Button>
      </div>
    </div>
  );
};