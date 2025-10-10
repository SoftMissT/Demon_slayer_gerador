import React from 'react';
import type { FilterState, Rarity } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { SparklesIcon } from './icons/SparklesIcon';
import { GENERATION_TYPES, BREATHING_STYLES, WEAPON_TYPES, GRIP_TYPES, THEMATIC_TONES, RARITIES, ACCESSORY_TYPES, ERAS, KEKKIJUTSU_TYPES, ARMADURA_TYPES, ITEM_DE_AUXILIO_TYPES, CONSUMABLE_TYPES, ARCHETYPE_TYPES, SKILL_TYPES } from '../constants';
import { Spinner } from './ui/Spinner';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onGenerate: (count: number) => void;
  onReset: () => void;
  isLoading: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, onGenerate, onReset, isLoading }) => {
  const handleInputChange = <K extends keyof FilterState,>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleArchetypeChange = (value: FilterState['archetypeType']) => {
    setFilters(prev => ({ ...prev, archetypeType: value, skillType: '' }));
  };

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-indigo-400 font-gangofthree">Filtros Detalhados</h2>
      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        <Select label="Tipo de Geração" value={filters.generationType} onChange={(e) => handleInputChange('generationType', e.target.value as FilterState['generationType'])}>
          <option value="" disabled>Selecione um tipo...</option>
          {GENERATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </Select>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden space-y-4 ${filters.generationType === 'Arquétipo/Habilidade' ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
            <Select
                label="Arquétipo"
                value={filters.archetypeType}
                onChange={(e) => handleArchetypeChange(e.target.value as FilterState['archetypeType'])}
            >
                <option value="">Qualquer um...</option>
                {ARCHETYPE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
            <Select
                label="Habilidade Específica"
                value={filters.skillType}
                onChange={(e) => handleInputChange('skillType', e.target.value as FilterState['skillType'])}
                disabled={!filters.archetypeType}
            >
                <option value="">Qualquer uma...</option>
                {filters.archetypeType && SKILL_TYPES[filters.archetypeType].map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
        </div>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${(filters.generationType === 'Inimigo/Oni' || filters.generationType === 'Híbrido Humano-Oni') ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <Select
                label="Kekkijutsu Específico"
                value={filters.kekkijutsu}
                onChange={(e) => handleInputChange('kekkijutsu', e.target.value as FilterState['kekkijutsu'])}
            >
                <option value="">Qualquer um...</option>
                {KEKKIJUTSU_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
        </div>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${filters.generationType === 'Acessório' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <Select 
            label="Tipo de Acessório" 
            value={filters.accessoryType} 
            onChange={(e) => handleInputChange('accessoryType', e.target.value as FilterState['accessoryType'])}
          >
            <option value="" disabled>Selecione um item...</option>
            {ACCESSORY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </Select>
        </div>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${filters.generationType === 'Armadura' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <Select 
            label="Tipo de Armadura" 
            value={filters.armaduraType} 
            onChange={(e) => handleInputChange('armaduraType', e.target.value as FilterState['armaduraType'])}
          >
            <option value="" disabled>Selecione um tipo...</option>
            {ARMADURA_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </Select>
        </div>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${filters.generationType === 'Item de Auxílio' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <Select 
            label="Tipo de Item de Auxílio" 
            value={filters.itemDeAuxilioType} 
            onChange={(e) => handleInputChange('itemDeAuxilioType', e.target.value as FilterState['itemDeAuxilioType'])}
          >
            <option value="" disabled>Selecione um item...</option>
            {ITEM_DE_AUXILIO_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </Select>
        </div>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${filters.generationType === 'Item Consumível' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <Select 
            label="Tipo de Item Consumível" 
            value={filters.consumableType} 
            onChange={(e) => handleInputChange('consumableType', e.target.value as FilterState['consumableType'])}
          >
            <option value="" disabled>Selecione um item...</option>
            {CONSUMABLE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </Select>
        </div>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden space-y-4 ${filters.generationType !== 'Classe/Origem' && filters.generationType !== 'Local/Cenário' && filters.generationType !== 'Arquétipo/Habilidade' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <Select
              label="Respiração Base"
              value={filters.breathingBase}
              onChange={(e) => handleInputChange('breathingBase', e.target.value)}
            >
              <option value="">Selecione uma respiração...</option>
              {BREATHING_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
            </Select>

            <Select
                label="Tipo de Arma"
                value={filters.weaponType}
                onChange={(e) => handleInputChange('weaponType', e.target.value)}
            >
              <option value="">Selecione uma arma...</option>
              {WEAPON_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </Select>

            <Select label="Empunhadura" value={filters.grip} onChange={(e) => handleInputChange('grip', e.target.value as FilterState['grip'])}>
              <option value="" disabled>Selecione uma empunhadura...</option>
              {GRIP_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
        </div>

        <div>
          <label htmlFor="level-slider" className="block text-sm font-medium text-gray-400 mb-1">Nível / Patente ({filters.level})</label>
          <input
            id="level-slider"
            type="range"
            min="1"
            max="20"
            value={filters.level}
            onChange={(e) => handleInputChange('level', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <Select label="Tom Temático" value={filters.theme} onChange={(e) => handleInputChange('theme', e.target.value)}>
            <option value="" disabled>Selecione um tom...</option>
            {THEMATIC_TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
        </Select>

        <Select label="Era / Ambientação" value={filters.era} onChange={(e) => handleInputChange('era', e.target.value)}>
            <option value="" disabled>Selecione uma era...</option>
            {ERAS.map(era => <option key={era} value={era}>{era}</option>)}
        </Select>
        
        <Select label="Raridade/Impacto" value={filters.rarity} onChange={(e) => handleInputChange('rarity', e.target.value as Rarity)}>
            {RARITIES.map(rarity => <option key={rarity} value={rarity}>{rarity}</option>)}
        </Select>

        <div>
            <label htmlFor="seed-input" className="block text-sm font-medium text-gray-400 mb-1">Seed (Opcional)</label>
            <input
                id="seed-input"
                type="text"
                value={filters.seed}
                onChange={(e) => handleInputChange('seed', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Para resultados reproduzíveis"
            />
        </div>

      </div>
      <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-2 gap-2">
        <Button onClick={() => onGenerate(1)} disabled={isLoading || !filters.generationType} className="col-span-2">
          {isLoading ? <><Spinner size="sm" /> Gerando...</> : <><SparklesIcon className="w-5 h-5" /> Gerar</>}
        </Button>
        <Button onClick={() => onGenerate(5)} disabled={isLoading || !filters.generationType} className="col-span-2">
           {isLoading ? <><Spinner size="sm" /> Gerando...</> : <><SparklesIcon className="w-5 h-5" /> Gerar x5</>}
        </Button>
        <Button variant="secondary" onClick={onReset} disabled={isLoading} className="col-span-2">Resetar Filtros</Button>
      </div>
    </Card>
  );
};