
import React, { useState, useCallback, useMemo } from 'react';
import type { FilterState, Category } from '../types';
import {
  CATEGORIES,
  RARITIES,
  TEMATICAS,
  TONES,
  DEMON_BLOOD_ARTS,
  PERSONALITIES,
  METAL_COLORS,
  COUNTRIES,
  TERRAINS,
  THREAT_SCALES,
  ONI_POWER_LEVELS,
  HUNTER_RANKS,
  EVENT_LEVELS,
  EVENT_THREAT_LEVELS,
  EVENT_TYPES,
  AI_FOCUS_GEMINI,
  AI_FOCUS_GPT,
  AI_FOCUS_DEEPSEEK,
  INITIAL_FILTERS,
  ORIGINS
} from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { Slider } from './ui/Slider';
import { Card } from './ui/Card';
import { SparklesIcon } from './icons/SparklesIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface FilterPanelProps {
  onGenerate: (filters: FilterState, count: number, promptModifier?: string) => void;
  isLoading: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onGenerate, isLoading }) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [count, setCount] = useState(1);
  const [promptModifier, setPromptModifier] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = useCallback((field: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleMultiSelectChange = useCallback((field: keyof FilterState, value: string[]) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(filters, count, promptModifier);
  };
  
  const breathingStylesOptions = useMemo(() => BREATHING_STYLES_DATA.map(bs => bs.nome), []);
  const weaponTypesOptions = useMemo(() => WEAPON_TYPES.map(wt => wt.name), []);
  const hunterArchetypesOptions = useMemo(() => HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => s.nome)), []);

  const professions = useMemo(() => {
    const tematica: keyof typeof PROFESSIONS_BY_TEMATICA = filters.npcTematica || 'all';
    return PROFESSIONS_BY_TEMATICA[tematica] || PROFESSIONS_BY_TEMATICA.all;
  }, [filters.npcTematica]);

  const renderFilters = () => {
    switch (filters.category) {
      case 'Caçador':
        return (
          <>
            <SearchableSelect label="Arquétipo" value={filters.hunterArchetype} onChange={e => handleFilterChange('hunterArchetype', e.target.value)}><option value="">Aleatório</option>{hunterArchetypesOptions.map(a => <option key={a} value={a}>{a}</option>)}</SearchableSelect>
            <SearchableMultiSelect label="Respirações Base" options={breathingStylesOptions} selected={filters.hunterBreathingStyles} onChange={v => handleMultiSelectChange('hunterBreathingStyles', v)} maxSelection={2} />
            <SearchableSelect label="País de Origem" value={filters.hunterCountry} onChange={e => handleFilterChange('hunterCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
            <Select label="Temática" value={filters.hunterTematica} onChange={e => handleFilterChange('hunterTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
            <Select label="Personalidade" value={filters.hunterPersonality} onChange={e => handleFilterChange('hunterPersonality', e.target.value)}><option value="">Aleatória</option>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
            <Select label="Rank" value={filters.hunterRank} onChange={e => handleFilterChange('hunterRank', e.target.value)}><option value="">Aleatório</option>{HUNTER_RANKS.map(r => <option key={r} value={r}>{r}</option>)}</Select>
          </>
        );
      case 'Inimigo/Oni':
        return (
          <>
            <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={e => handleFilterChange('oniPowerLevel', e.target.value)}><option value="">Aleatório</option>{ONI_POWER_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}</Select>
            <SearchableMultiSelect label="Inspiração (Kekkijutsu)" options={DEMON_BLOOD_ARTS} selected={filters.oniInspirationKekkijutsu} onChange={v => handleMultiSelectChange('oniInspirationKekkijutsu', v)} maxSelection={2} />
            <SearchableSelect label="País de Origem" value={filters.oniCountry} onChange={e => handleFilterChange('oniCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
            <Select label="Temática" value={filters.oniTematica} onChange={e => handleFilterChange('oniTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
            <Select label="Personalidade" value={filters.oniPersonality} onChange={e => handleFilterChange('oniPersonality', e.target.value)}><option value="">Aleatória</option>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
          </>
        );
      case 'NPC':
        return (
          <>
            <Select label="Temática" value={filters.npcTematica} onChange={e => handleFilterChange('npcTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
            <SearchableSelect label="País de Origem" value={filters.npcCountry} onChange={e => handleFilterChange('npcCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
            <SearchableSelect label="Origem (Background)" value={filters.npcOrigin} onChange={e => handleFilterChange('npcOrigin', e.target.value)}><option value="">Aleatória</option>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            <Select label="Profissão" value={filters.npcProfession} onChange={e => handleFilterChange('npcProfession', e.target.value)}><option value="">Aleatória</option>{professions.map(p => <option key={p} value={p}>{p}</option>)}</Select>
            <Select label="Personalidade" value={filters.npcPersonality} onChange={e => handleFilterChange('npcPersonality', e.target.value)}><option value="">Aleatória</option>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
          </>
        );
      case 'Arma':
      case 'Acessório':
        return (
          <>
            <Select label="Raridade" value={filters.weaponRarity} onChange={e => handleFilterChange('weaponRarity', e.target.value)}><option value="">Aleatória</option>{RARITIES.map(r => <option key={r} value={r}>{r}</option>)}</Select>
            <Select label="Temática" value={filters.weaponTematica} onChange={e => handleFilterChange('weaponTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
            <SearchableSelect label="Tipo de Arma Base" value={filters.weaponType} onChange={e => handleFilterChange('weaponType', e.target.value)}><option value="">Aleatório</option>{weaponTypesOptions.map(w => <option key={w} value={w}>{w}</option>)}</SearchableSelect>
            <Select label="Cor do Metal (Nichirin)" value={filters.weaponMetalColor} onChange={e => handleFilterChange('weaponMetalColor', e.target.value)}><option value="">Aleatória</option>{METAL_COLORS.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            <SearchableSelect label="País de Origem" value={filters.weaponCountry} onChange={e => handleFilterChange('weaponCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
          </>
        );
      case 'Forma de Respiração':
        return (
            <>
              <SearchableMultiSelect label="Respirações Base" options={breathingStylesOptions} selected={filters.baseBreathingStyles} onChange={v => handleMultiSelectChange('baseBreathingStyles', v)} maxSelection={2} />
              <Select label="Tom" value={filters.breathingFormTone} onChange={e => handleFilterChange('breathingFormTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
              <Select label="Temática" value={filters.breathingFormTematica} onChange={e => handleFilterChange('breathingFormTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
              <SearchableSelect label="País de Origem" value={filters.breathingFormCountry} onChange={e => handleFilterChange('breathingFormCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
            </>
        );
      case 'Kekkijutsu':
          return (
              <>
                  <Select label="Temática" value={filters.kekkijutsuTematica} onChange={e => handleFilterChange('kekkijutsuTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                  <SearchableSelect label="País de Origem" value={filters.kekkijutsuCountry} onChange={e => handleFilterChange('kekkijutsuCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
                  <SearchableSelect label="Inspiração (Kekkijutsu)" value={filters.kekkijutsuKekkijutsuInspiration} onChange={e => handleFilterChange('kekkijutsuKekkijutsuInspiration', e.target.value)}><option value="">Aleatória</option>{DEMON_BLOOD_ARTS.map(k => <option key={k} value={k}>{k}</option>)}</SearchableSelect>
              </>
          );
      case 'Local/Cenário':
        return (
          <>
            <Select label="Tom" value={filters.locationTone} onChange={e => handleFilterChange('locationTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
            <Select label="Temática" value={filters.locationTematica} onChange={e => handleFilterChange('locationTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
            <SearchableSelect label="País" value={filters.locationCountry} onChange={e => handleFilterChange('locationCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
            <Select label="Terreno" value={filters.locationTerrain} onChange={e => handleFilterChange('locationTerrain', e.target.value)}><option value="">Aleatória</option>{TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
          </>
        );
      case 'Missões':
        return (
          <>
            <Select label="Tom" value={filters.missionTone} onChange={e => handleFilterChange('missionTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
            <Select label="Escala" value={filters.missionScale} onChange={e => handleFilterChange('missionScale', e.target.value)}><option value="local">Local</option><option value="regional">Regional</option><option value="nacional">Nacional</option><option value="cósmico">Cósmico</option></Select>
            <Slider label="Intensidade" value={filters.intensity} onChange={e => handleFilterChange('intensity', parseInt(e.target.value, 10))} min={1} max={5} step={1} />
            <SearchableSelect label="País" value={filters.missionCountry} onChange={e => handleFilterChange('missionCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
          </>
        );
      default:
        return <p className="text-gray-500 text-center col-span-full">Selecione uma categoria para ver os filtros.</p>;
    }
  };

  return (
    <Card className="filter-panel forge-panel rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-4 font-gangofthree">Filtros da Forja</h2>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-4">
        <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
          <Select label="Categoria Principal" value={filters.category} onChange={e => handleFilterChange('category', e.target.value as Category)}>
            <option value="" disabled>Selecione uma categoria...</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </Select>
          
          {filters.category && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
              {renderFilters()}
            </div>
          )}
          
          <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-400 mb-1">Referências de Estilo (para imagem)</label>
              <input type="text" value={filters.styleReferences} onChange={e => handleFilterChange('styleReferences', e.target.value)} placeholder="Ex: anime, ukiyo-e, dark fantasy, cinematic" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
          </div>

          <div className="col-span-full">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="!justify-start !p-0">
              <SettingsIcon className="w-4 h-4 mr-1"/> Opções Avançadas de Geração
            </Button>
            {showAdvanced && (
                <Card className="mt-2 p-4 space-y-4 animate-fade-in-up">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Modificador de Prompt</label>
                        <input type="text" value={promptModifier} onChange={e => setPromptModifier(e.target.value)} placeholder="Ex: 'Faça o item ser amaldiçoado'" className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select label="Foco Gemini" value={filters.aiFocusGemini} onChange={e => handleFilterChange('aiFocusGemini', e.target.value)}>{AI_FOCUS_GEMINI.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                        <Select label="Foco GPT" value={filters.aiFocusGpt} onChange={e => handleFilterChange('aiFocusGpt', e.target.value)}>{AI_FOCUS_GPT.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                        <Select label="Foco DeepSeek" value={filters.aiFocusDeepSeek} onChange={e => handleFilterChange('aiFocusDeepSeek', e.target.value)}>{AI_FOCUS_DEEPSEEK.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                    </div>
                </Card>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <Button type="submit" disabled={isLoading || !filters.category} className="w-full main-generate-button">
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? 'Forjando...' : `Forjar ${count > 1 ? count + ' Itens' : 'Item'}`}
              </Button>
            </div>
            <div className="w-24">
              <Select label="" value={count} onChange={(e) => setCount(Number(e.target.value))}>
                <option value={1}>x1</option>
                <option value={2}>x2</option>
                <option value={3}>x3</option>
                <option value={4}>x4</option>
              </Select>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};
