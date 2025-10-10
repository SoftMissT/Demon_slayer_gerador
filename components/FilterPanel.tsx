import React from 'react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { SparklesIcon } from './icons/SparklesIcon';
import type { FilterState } from '../types';
import { CATEGORIES, RARITIES, ERAS, BREATHING_STYLES, DEMON_BLOOD_ARTS } from '../constants';

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
          label="Raridade"
          value={filters.rarity}
          onChange={(e) => handleFilterChange('rarity', e.target.value)}
        >
          {RARITIES.map(rar => <option key={rar} value={rar}>{rar}</option>)}
        </Select>

        <Select
          label="Era / Estilo"
          value={filters.era}
          onChange={(e) => handleFilterChange('era', e.target.value)}
        >
          {ERAS.map(era => <option key={era} value={era}>{era}</option>)}
        </Select>

        {filters.category === 'Forma de Respiração' && (
          <SearchableMultiSelect
            label="Inspiração (Respirações)"
            options={BREATHING_STYLES}
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
        <div className="grid grid-cols-3 gap-2 mb-4">
            <Button variant="secondary" onClick={() => onGenerate(1)} disabled={isLoading}>Gerar 1</Button>
            <Button variant="secondary" onClick={() => onGenerate(3)} disabled={isLoading}>Gerar 3</Button>
            <Button variant="secondary" onClick={() => onGenerate(5)} disabled={isLoading}>Gerar 5</Button>
        </div>
        <Button onClick={() => onGenerate(1)} disabled={isLoading} className="w-full">
          <SparklesIcon className="w-5 h-5" />
          {isLoading ? 'Forjando...' : 'Gerar Item'}
        </Button>
      </div>
    </div>
  );
};
