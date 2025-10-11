
import React from 'react';
import { Button } from './components/ui/Button';
import { Select } from './components/ui/Select';
import { SearchableMultiSelect } from './components/ui/SearchableMultiSelect';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { Slider } from './components/ui/Slider';
import type { FilterState, Tone } from './types';
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
      onFiltersChange({ ...filters, [key]: numValue });
    }
  };

  // FIX: Create an array of style names from the imported data object.
  const breathingStyleOptions = BREATHING_STYLES_DATA.map(style => style.nome);

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

        {filters.category !== 'Missão/Cenário' && (
           <Select
            label="Raridade"
            value={filters.rarity}
            onChange={(e) => handleFilterChange('rarity', e.target.value)}
          >
            {RARITIES.map(rar => <option key={rar} value={rar}>{rar}</option>)}
          </Select>
        )}

        <Select
          label="Era / Estilo"
          value={filters.era}
          onChange={(e) => handleFilterChange('era', e.target.value)}
        >
          {ERAS.map(era => <option key={era} value={era}>{era}</option>)}
        </Select>
        
        {/* Mission-specific filters */}
        {filters.category === 'Missão/Cenário' && (
            <div className="space-y-4 border-t border-indigo-900/50 pt-4">
                <Select
                  label="Tom da Missão"
                  value={filters.tone}
                  onChange={(e) => handleFilterChange('tone', e.target.value as Tone)}
                >
                  {TONES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </Select>
                <Slider
                    label={`Intensidade: ${filters.intensity}`}
                    min={1} max={5} step={1}
                    value={filters.intensity || 3}
                    onChange={(e) => handleNumericFilterChange('intensity', e.target.value)}
                />
                 <Select
                  label="Escala da Ameaça"
                  value={filters.scale}
                  onChange={(e) => handleFilterChange('scale', e.target.value as 'local' | 'regional' | 'nacional' | 'cósmico')}
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

        {filters.category === 'Forma de Respiração' && (
          <SearchableMultiSelect
            label="Inspiração (Respirações)"
            options={breathingStyleOptions}
            selected={filters.breathingStyles}
            onChange={(selected) => handleFilterChange('breathingStyles', selected)}
            placeholder="Selecione estilos..."
          />
        )}
        
        {filters.category === 'Kekkijutsu' && (
          <SearchableMultiSelect
            label="Inspiração (Kekkijutsu)"
            options={DEMON_BLOOD_ARTS}
            selected={filters.demonArts}
            onChange={(selected) => handleFilterChange('demonArts', selected)}
            placeholder="Selecione artes..."
          />
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
