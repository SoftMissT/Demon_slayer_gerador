import React from 'react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SparklesIcon } from './icons/SparklesIcon';
import { Slider } from './ui/Slider';
import type { FilterState, Tone, Category, Rarity, Era } from '../types';
import { CATEGORIES, RARITIES, ERAS, DEMON_BLOOD_ARTS, TONES } from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';

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

        {filters.category !== 'Missão/Cenário' && (
           <Select
            label="Raridade"
            value={filters.rarity}
            onChange={(e) => handleFilterChange('rarity', e.target.value as Rarity)}
          >
            {RARITIES.map(rar => <option key={rar} value={rar}>{rar}</option>)}
          </Select>
        )}

        <Select
          label="Era / Estilo"
          value={filters.era}
          onChange={(e) => handleFilterChange('era', e.target.value as Era)}
        >
          {ERAS.map(era => <option key={era} value={era}>{era}</option>)}
        </Select>
        
        {filters.category === 'Missão/Cenário' && (
            <div className="space-y-4 border-t border-indigo-900/50 pt-4">
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

        {filters.category === 'Forma de Respiração' && (
          <Select
            label="Respiração Base (Derivação)"
            value={filters.baseBreathingStyle || 'Aleatória'}
            onChange={(e) => handleFilterChange('baseBreathingStyle', e.target.value)}
          >
            <option value="Aleatória">Aleatória</option>
            {breathingStyleOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
        )}
        
        {filters.category === 'Kekkijutsu' && (
          <Select
            label="Inspiração (Kekkijutsu)"
            value={filters.kekkijutsuInspiration}
            onChange={(e) => handleFilterChange('kekkijutsuInspiration', e.target.value)}
          >
            <option value="Nenhuma">Nenhuma</option>
            {DEMON_BLOOD_ARTS.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
        )}
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