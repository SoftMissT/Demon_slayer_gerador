
import React, { useState, useEffect } from 'react';
import type { FilterState } from '../types';
import { INITIAL_FILTERS, CATEGORIES, TEMATICAS, RARITIES, TONES, DEMON_BLOOD_ARTS, PERSONALITIES, METAL_COLORS, COUNTRIES, ORIGINS, TERRAINS, DAMAGE_TYPES, THREAT_SCALES, ONI_POWER_LEVELS, HUNTER_RANKS, EVENT_LEVELS, EVENT_THREAT_LEVELS, EVENT_TYPES, AI_FOCUS_GEMINI, AI_FOCUS_GPT, AI_FOCUS_DEEPSEEK } from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { TextInput } from './ui/TextInput';
import { TextArea } from './ui/TextArea';
import { SparklesIcon } from './icons/SparklesIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { AnvilIcon } from './icons/AnvilIcon';

const BreathingStyles = BREATHING_STYLES_DATA.map(bs => bs.nome);
const WeaponTypesList = WEAPON_TYPES.map(wt => wt.name);
const HunterArchetypes = ['Aleatório', ...HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => s.nome))];


interface FilterPanelProps {
  onGenerate: (filters: FilterState, count: number, promptModifier?: string) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 p-4 mb-4 border border-gray-700/50 rounded-lg bg-gray-800/30">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">{title}</h3>
        {children}
    </div>
);

export const FilterPanel: React.FC<FilterPanelProps> = ({ onGenerate, isLoading }) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [promptModifier, setPromptModifier] = useState('');
  const [professions, setProfessions] = useState<string[]>(PROFESSIONS_BY_TEMATICA.all);

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as FilterState['category'];
    setFilters(prev => ({
      ...INITIAL_FILTERS,
      category: newCategory,
      aiFocusGemini: prev.aiFocusGemini,
      aiFocusGpt: prev.aiFocusGpt,
      aiFocusDeepSeek: prev.aiFocusDeepSeek,
      styleReferences: prev.styleReferences
    }));
  };
  
  useEffect(() => {
    const tematicaKey = filters.npcTematica || 'all';
    const availableProfessions = PROFESSIONS_BY_TEMATICA[tematicaKey] || PROFESSIONS_BY_TEMATICA.all;
    setProfessions(availableProfessions);
    if (!availableProfessions.includes(filters.npcProfession)) {
      handleFilterChange('npcProfession', 'Aleatória');
    }
  }, [filters.npcTematica]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.category) {
      onGenerate(filters, 1, promptModifier);
    }
  };
  
  const renderCategoryFilters = () => {
    switch (filters.category) {
      case 'Caçador':
        return (
          <div className="space-y-4">
            <SearchableSelect label="Temática" value={filters.hunterTematica} onChange={e => handleFilterChange('hunterTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
            <SearchableSelect label="País de Origem" value={filters.hunterCountry} onChange={e => handleFilterChange('hunterCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
            <SearchableSelect label="Clã / Origem" value={filters.hunterOrigin} onChange={e => handleFilterChange('hunterOrigin', e.target.value)}><option value="">Aleatória</option>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            <SearchableSelect label="Arquétipo" value={filters.hunterArchetype} onChange={e => handleFilterChange('hunterArchetype', e.target.value)}>{HunterArchetypes.map(a => <option key={a} value={a}>{a}</option>)}</SearchableSelect>
            <Select label="Personalidade" value={filters.hunterPersonality} onChange={e => handleFilterChange('hunterPersonality', e.target.value)}><option value="">Aleatória</option>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
            <SearchableMultiSelect label="Respirações (max 2)" selected={filters.hunterBreathingStyles} onChange={v => handleFilterChange('hunterBreathingStyles', v)} options={BreathingStyles} maxSelection={2} />
            <SearchableSelect label="Arma Principal" value={filters.hunterWeapon} onChange={e => handleFilterChange('hunterWeapon', e.target.value)}><option value="">Aleatória</option>{WeaponTypesList.map(w => <option key={w} value={w}>{w}</option>)}</SearchableSelect>
            <Select label="Rank" value={filters.hunterRank} onChange={e => handleFilterChange('hunterRank', e.target.value)}><option value="">Aleatório</option>{HUNTER_RANKS.map(r => <option key={r} value={r}>{r}</option>)}</Select>
          </div>
        );
       case 'Inimigo/Oni':
        return (
          <div className="space-y-4">
            <SearchableSelect label="Temática" value={filters.oniTematica} onChange={e => handleFilterChange('oniTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
            <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={e => handleFilterChange('oniPowerLevel', e.target.value)}><option value="">Aleatório</option>{ONI_POWER_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</Select>
            <Select label="Personalidade" value={filters.oniPersonality} onChange={e => handleFilterChange('oniPersonality', e.target.value)}><option value="">Aleatória</option>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
            <SearchableSelect label="País de Origem" value={filters.oniCountry} onChange={e => handleFilterChange('oniCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
            <SearchableMultiSelect label="Inspiração de Kekkijutsu" selected={filters.oniInspirationKekkijutsu} onChange={v => handleFilterChange('oniInspirationKekkijutsu', v)} options={DEMON_BLOOD_ARTS} maxSelection={2} />
          </div>
        );
      case 'NPC':
        return (
          <div className="space-y-4">
            <SearchableSelect label="Temática" value={filters.npcTematica} onChange={e => handleFilterChange('npcTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
            <SearchableSelect label="País de Origem" value={filters.npcCountry} onChange={e => handleFilterChange('npcCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
            <SearchableSelect label="Clã / Origem" value={filters.npcOrigin} onChange={e => handleFilterChange('npcOrigin', e.target.value)}><option value="">Aleatória</option>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            <SearchableSelect label="Profissão" value={filters.npcProfession} onChange={e => handleFilterChange('npcProfession', e.target.value)}>{professions.map(p => <option key={p} value={p}>{p}</option>)}</SearchableSelect>
            <Select label="Personalidade" value={filters.npcPersonality} onChange={e => handleFilterChange('npcPersonality', e.target.value)}><option value="">Aleatória</option>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
          </div>
        );
      case 'Arma':
         return (
            <div className="space-y-4">
                <Select label="Raridade" value={filters.weaponRarity} onChange={e => handleFilterChange('weaponRarity', e.target.value)}><option value="">Aleatória</option>{RARITIES.map(r => <option key={r} value={r}>{r}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.weaponTematica} onChange={e => handleFilterChange('weaponTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                <SearchableSelect label="Tipo de Arma" value={filters.weaponType} onChange={e => handleFilterChange('weaponType', e.target.value)}><option value="">Aleatória</option>{WeaponTypesList.map(w => <option key={w} value={w}>{w}</option>)}</SearchableSelect>
                <Select label="Cor do Metal" value={filters.weaponMetalColor} onChange={e => handleFilterChange('weaponMetalColor', e.target.value)}><option value="">Aleatória</option>{METAL_COLORS.map(c => <option key={c} value={c}>{c}</option>)}</Select>
                <Select label="Tipo de Dano" value={filters.weaponDamageType} onChange={e => handleFilterChange('weaponDamageType', e.target.value)}><option value="">Aleatória</option>{DAMAGE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}</Select>
            </div>
        );
        case 'Acessório':
         return (
            <div className="space-y-4">
                <Select label="Raridade" value={filters.accessoryRarity} onChange={e => handleFilterChange('accessoryRarity', e.target.value)}><option value="">Aleatória</option>{RARITIES.map(r => <option key={r} value={r}>{r}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.accessoryTematica} onChange={e => handleFilterChange('accessoryTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                <SearchableSelect label="Origem" value={filters.accessoryOrigin} onChange={e => handleFilterChange('accessoryOrigin', e.target.value)}><option value="">Aleatória</option>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
            </div>
        );
      case 'Forma de Respiração':
        return (
             <div className="space-y-4">
                <SearchableMultiSelect label="Respirações Base (max 2)" selected={filters.baseBreathingStyles} onChange={v => handleFilterChange('baseBreathingStyles', v)} options={BreathingStyles} maxSelection={2} />
                <SearchableSelect label="Temática" value={filters.breathingFormTematica} onChange={e => handleFilterChange('breathingFormTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                <Select label="Tom" value={filters.breathingFormTone} onChange={e => handleFilterChange('breathingFormTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
             </div>
        );
      case 'Kekkijutsu':
        return (
             <div className="space-y-4">
                <SearchableSelect label="Temática" value={filters.kekkijutsuTematica} onChange={e => handleFilterChange('kekkijutsuTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                <Select label="Inspiração de Kekkijutsu" value={filters.kekkijutsuKekkijutsuInspiration} onChange={e => handleFilterChange('kekkijutsuKekkijutsuInspiration', e.target.value)}><option value="">Aleatória</option>{DEMON_BLOOD_ARTS.map(k => <option key={k} value={k}>{k}</option>)}</Select>
             </div>
        );
      case 'Local/Cenário':
        return (
             <div className="space-y-4">
                <Select label="Tom" value={filters.locationTone} onChange={e => handleFilterChange('locationTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.locationTematica} onChange={e => handleFilterChange('locationTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                <SearchableSelect label="País" value={filters.locationCountry} onChange={e => handleFilterChange('locationCountry', e.target.value)}><option value="">Aleatória</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
                <Select label="Terreno" value={filters.locationTerrain} onChange={e => handleFilterChange('locationTerrain', e.target.value)}><option value="">Aleatória</option>{TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
             </div>
        );
        case 'Missões':
        return (
             <div className="space-y-4">
                <Select label="Tom" value={filters.missionTone} onChange={e => handleFilterChange('missionTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.missionTematica} onChange={e => handleFilterChange('missionTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                <Select label="Escala de Ameaça" value={filters.missionThreatScale} onChange={e => handleFilterChange('missionThreatScale', e.target.value)}><option value="">Aleatória</option>{THREAT_SCALES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
             </div>
        );
       case 'World Building':
        return (
             <div className="space-y-4">
                <Select label="Tom" value={filters.wbTone} onChange={e => handleFilterChange('wbTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.wbTematica} onChange={e => handleFilterChange('wbTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                <Select label="Escala de Ameaça" value={filters.wbThreatScale} onChange={e => handleFilterChange('wbThreatScale', e.target.value)}><option value="">Aleatória</option>{THREAT_SCALES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
             </div>
        );
       case 'Evento':
        return (
             <div className="space-y-4">
                <Select label="Tom" value={filters.eventTone} onChange={e => handleFilterChange('eventTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                <SearchableSelect label="Temática" value={filters.eventTematica} onChange={e => handleFilterChange('eventTematica', e.target.value)}><option value="">Aleatória</option>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                <Select label="Nível do Evento" value={filters.eventLevel} onChange={e => handleFilterChange('eventLevel', e.target.value)}><option value="">Aleatório</option>{EVENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</Select>
                <Select label="Nível de Ameaça" value={filters.eventThreatLevel} onChange={e => handleFilterChange('eventThreatLevel', e.target.value)}><option value="">Aleatória</option>{EVENT_THREAT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</Select>
                <Select label="Tipo de Evento" value={filters.eventType} onChange={e => handleFilterChange('eventType', e.target.value)}><option value="">Aleatório</option>{EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
             </div>
        );
      default:
        return <p className="text-gray-500 text-sm p-4 text-center">Selecione uma categoria para ver os filtros específicos.</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="filter-panel h-full flex flex-col bg-gray-900 rounded-lg border border-gray-700/50">
        <div className="p-4 flex items-center justify-between border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center gap-3">
                <AnvilIcon className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-bold font-gangofthree text-white">Bigorna</h2>
            </div>
            <Button type="button" variant="ghost" onClick={() => setFilters(INITIAL_FILTERS)} className="text-xs">
                <RefreshIcon className="w-4 h-4" /> Limpar
            </Button>
        </div>
      
        <div className="flex-grow overflow-y-auto p-4 inner-scroll">
            <FilterSection title="Configuração Principal">
                <Select label="Categoria" value={filters.category} onChange={handleCategoryChange}>
                    <option value="" disabled>Selecione uma categoria...</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </Select>
                {filters.category && renderCategoryFilters()}
            </FilterSection>

             <FilterSection title="Diretrizes da Forja">
                <Select label="Foco Criativo (Gemini)" value={filters.aiFocusGemini} onChange={e => handleFilterChange('aiFocusGemini', e.target.value)} tooltip="Define a prioridade do Gemini: criar a estrutura base, expandir a lore, focar em originalidade ou simplificar o conceito.">
                    {AI_FOCUS_GEMINI.map(f => <option key={f} value={f}>{f}</option>)}
                </Select>
                <Select label="Foco Narrativo (GPT)" value={filters.aiFocusGpt} onChange={e => handleFilterChange('aiFocusGpt', e.target.value)} tooltip="Define a prioridade do GPT no polimento final: melhorar a narrativa, criar diálogos vívidos, descrições cinematográficas ou um tom mais sombrio.">
                    {AI_FOCUS_GPT.map(f => <option key={f} value={f}>{f}</option>)}
                </Select>
                <Select label="Foco de Mecânicas (DeepSeek)" value={filters.aiFocusDeepSeek} onChange={e => handleFilterChange('aiFocusDeepSeek', e.target.value)} tooltip="Define a prioridade do DeepSeek: refinar mecânicas, balancear para combate, criar regras exóticas ou simplificar para fácil acesso.">
                    {AI_FOCUS_DEEPSEEK.map(f => <option key={f} value={f}>{f}</option>)}
                </Select>
            </FilterSection>
            
            <FilterSection title="Refinamento Avançado">
                <TextInput label="Referências de Estilo" value={filters.styleReferences} onChange={e => handleFilterChange('styleReferences', e.target.value)} placeholder="Ex: Ghibli, Yoshitaka Amano, Dark Souls" tooltip="Nomes de artistas, jogos ou mídias para guiar o estilo visual e temático do item." />
                <TextArea label="Modificador de Prompt (Opcional)" value={promptModifier} onChange={e => setPromptModifier(e.target.value)} placeholder="Instrução de alta prioridade. Ex: 'evitar clichês', 'foco em horror cósmico'." rows={3} tooltip="Uma instrução direta para a IA que sobrepõe outros filtros. Use para refinar o resultado com comandos específicos." />
            </FilterSection>
        </div>

        <div className="p-4 border-t border-gray-700/50 mt-auto flex-shrink-0 bg-gray-900/80">
            <Button type="submit" disabled={isLoading || !filters.category} className="w-full forge-button">
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? 'Forjando...' : 'Forjar Item'}
            </Button>
        </div>
    </form>
  );
};
