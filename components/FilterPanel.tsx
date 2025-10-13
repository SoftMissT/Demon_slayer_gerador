import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchableSelect } from './ui/SearchableSelect';
import { SearchableMultiSelect } from './ui/SearchableMultiSelect';
import { TextInput } from './ui/TextInput';
import { TextArea } from './ui/TextArea';
import { Switch } from './ui/Switch';
import { SparklesIcon } from './icons/SparklesIcon';
import type { FilterState, Category, AIFlags } from '../types';
import { INITIAL_FILTERS, CATEGORIES, RARITIES, TEMATICAS, TONES, DEMON_BLOOD_ARTS, PERSONALITIES, METAL_COLORS, COUNTRIES, TERRAINS, DAMAGE_TYPES, THREAT_SCALES, ONI_POWER_LEVELS, HUNTER_RANKS, EVENT_LEVELS, EVENT_THREAT_LEVELS, EVENT_TYPES, AI_FOCUS_GEMINI, AI_FOCUS_GPT, AI_FOCUS_DEEPSEEK, ORIGINS } from '../constants';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { WEAPON_TYPES } from '../lib/weaponData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';

interface FilterPanelProps {
  onGenerate: (filters: FilterState, count: number, promptModifier: string, aiFlags: AIFlags) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

const BREATHING_STYLES = ['Aleatória', ...BREATHING_STYLES_DATA.map(bs => bs.nome)];
const WEAPON_OPTIONS = WEAPON_TYPES.map(w => w.name);
const ARCHETYPES = ['Aleatório', ...HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => s.nome))];

export const FilterPanel: React.FC<FilterPanelProps> = ({ onGenerate, isLoading, isAuthenticated, onLoginClick }) => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [promptModifier, setPromptModifier] = useState('');
    const [aiFlags, setAiFlags] = useState<AIFlags>({ useDeepSeek: true, useGemini: true, useGpt: true });
    
    const handleFilterChange = (field: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }
        if (!filters.category) {
            alert("Por favor, selecione uma categoria para gerar.");
            return;
        }
        onGenerate(filters, 1, promptModifier, aiFlags);
    };
    
    const selectedTematica = filters[`${filters.category.toLowerCase()}Tematica` as keyof FilterState] as string || 'Aleatória';
    const professionOptions = useMemo(() => {
        const key = Object.keys(PROFESSIONS_BY_TEMATICA).find(k => k === selectedTematica) || 'all';
        return PROFESSIONS_BY_TEMATICA[key] || [];
    }, [selectedTematica]);

    const renderFilters = () => {
        if (!filters.category) return null;
        
        const categoryKey = filters.category;

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={categoryKey}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    {/* Common fields can be added here if any */}
                    
                    {categoryKey === 'Caçador' && (
                        <>
                            <SearchableSelect label="Temática" value={filters.hunterTematica} onChange={e => handleFilterChange('hunterTematica', e.target.value)}>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                            <SearchableSelect label="País de Origem" value={filters.hunterCountry} onChange={e => handleFilterChange('hunterCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
                            <SearchableSelect label="Arquétipo" value={filters.hunterArchetype} onChange={e => handleFilterChange('hunterArchetype', e.target.value)} tooltip="Define a classe e habilidades base do caçador.">{ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}</SearchableSelect>
                            <SearchableMultiSelect label="Estilos de Respiração" selected={filters.hunterBreathingStyles} onChange={v => handleFilterChange('hunterBreathingStyles', v)} options={BREATHING_STYLES} maxSelection={2} tooltip="Selecione até 2 estilos de respiração para inspiração." />
                            <Select label="Rank" value={filters.hunterRank} onChange={e => handleFilterChange('hunterRank', e.target.value)}>{HUNTER_RANKS.map(r => <option key={r} value={r}>{r}</option>)}</Select>
                            <Select label="Personalidade" value={filters.hunterPersonality} onChange={e => handleFilterChange('hunterPersonality', e.target.value)}>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
                            <Select label="Arma Principal" value={filters.hunterWeapon} onChange={e => handleFilterChange('hunterWeapon', e.target.value)}>{WEAPON_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}</Select>
                        </>
                    )}
                    
                    {categoryKey === 'Inimigo/Oni' && (
                        <>
                           <Select label="Nível de Poder" value={filters.oniPowerLevel} onChange={e => handleFilterChange('oniPowerLevel', e.target.value)}>{ONI_POWER_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}</Select>
                           <SearchableMultiSelect label="Inspiração de Kekkijutsu" selected={filters.oniInspirationKekkijutsu} onChange={v => handleFilterChange('oniInspirationKekkijutsu', v)} options={DEMON_BLOOD_ARTS} maxSelection={2} />
                           <Select label="Personalidade" value={filters.oniPersonality} onChange={e => handleFilterChange('oniPersonality', e.target.value)}>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
                        </>
                    )}
                    
                    {categoryKey === 'NPC' && (
                        <>
                            <SearchableSelect label="Temática" value={filters.npcTematica} onChange={e => handleFilterChange('npcTematica', e.target.value)}>{TEMATICAS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                            <SearchableSelect label="País de Origem" value={filters.npcCountry} onChange={e => handleFilterChange('npcCountry', e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</SearchableSelect>
                            <SearchableSelect label="Origem/Background" value={filters.npcOrigin} onChange={e => handleFilterChange('npcOrigin', e.target.value)}>{ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}</SearchableSelect>
                            <Select label="Profissão" value={filters.npcProfession} onChange={e => handleFilterChange('npcProfession', e.target.value)}>{professionOptions.map(p => <option key={p} value={p}>{p}</option>)}</Select>
                            <Select label="Personalidade" value={filters.npcPersonality} onChange={e => handleFilterChange('npcPersonality', e.target.value)}>{PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}</Select>
                        </>
                    )}
                    
                    {categoryKey === 'Arma' && (
                        <>
                            <Select label="Raridade" value={filters.weaponRarity} onChange={e => handleFilterChange('weaponRarity', e.target.value)}>{RARITIES.map(r => <option key={r} value={r}>{r}</option>)}</Select>
                            <SearchableSelect label="Tipo de Arma" value={filters.weaponType} onChange={e => handleFilterChange('weaponType', e.target.value)}>{WEAPON_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}</SearchableSelect>
                            <Select label="Cor do Metal (Nichirin)" value={filters.weaponMetalColor} onChange={e => handleFilterChange('weaponMetalColor', e.target.value)}>{METAL_COLORS.map(c => <option key={c} value={c}>{c}</option>)}</Select>
                            <Select label="Tipo de Dano" value={filters.weaponDamageType} onChange={e => handleFilterChange('weaponDamageType', e.target.value)}>{DAMAGE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}</Select>
                        </>
                    )}

                    {categoryKey === 'Acessório' && (
                         <Select label="Raridade" value={filters.accessoryRarity} onChange={e => handleFilterChange('accessoryRarity', e.target.value)}>{RARITIES.map(r => <option key={r} value={r}>{r}</option>)}</Select>
                    )}
                    
                    {categoryKey === 'Missões' && (
                        <>
                            <Select label="Tom da Missão" value={filters.missionTone} onChange={e => handleFilterChange('missionTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                            <Select label="Escala da Ameaça" value={filters.missionThreatScale} onChange={e => handleFilterChange('missionThreatScale', e.target.value)}>{THREAT_SCALES.map(s => <option key={s} value={s}>{s}</option>)}</Select>
                            <Select label="Tipo de Evento Central" value={filters.missionEventType} onChange={e => handleFilterChange('missionEventType', e.target.value)}>{EVENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}</Select>
                        </>
                    )}
                    
                    {categoryKey === 'World Building' && (
                        <>
                            <SearchableSelect label="Local Principal" value={filters.wbLocation} onChange={e => handleFilterChange('wbLocation', e.target.value)}>{TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}</SearchableSelect>
                            <Select label="Escala da Ameaça" value={filters.wbThreatScale} onChange={e => handleFilterChange('wbThreatScale', e.target.value)}>{THREAT_SCALES.map(s => <option key={s} value={s}>{s}</option>)}</Select>
                            <Select label="Tom Geral" value={filters.wbTone} onChange={e => handleFilterChange('wbTone', e.target.value)}>{TONES.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                        </>
                    )}

                    {categoryKey === 'Evento' && (
                        <>
                            <Select label="Nível do Evento" value={filters.eventLevel} onChange={e => handleFilterChange('eventLevel', e.target.value)}>{EVENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</Select>
                            <Select label="Nível de Ameaça" value={filters.eventThreatLevel} onChange={e => handleFilterChange('eventThreatLevel', e.target.value)}>{EVENT_THREAT_LEVELS.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                            <Select label="Tipo de Evento" value={filters.eventType} onChange={e => handleFilterChange('eventType', e.target.value)}>{EVENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}</Select>
                        </>
                    )}

                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <div className="filter-panel h-full flex flex-col bg-gray-900/50 rounded-lg border border-gray-700/50">
            <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
                <h2 className="text-xl font-bold font-gangofthree text-white">Bigorna</h2>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto space-y-4 inner-scroll">
                <div>
                    <Select label="1. Categoria" value={filters.category} onChange={e => handleFilterChange('category', e.target.value as Category)}>
                        <option value="" disabled>Selecione o que forjar...</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                </div>
                
                {renderFilters()}

                <hr className="border-gray-700/50 my-4"/>

                <div className="space-y-4">
                    <TextInput 
                        label="2. Referências de Estilo" 
                        value={filters.styleReferences}
                        onChange={e => handleFilterChange('styleReferences', e.target.value)}
                        placeholder="Ex: Demon Slayer, Yoshitaka Amano"
                        tooltip="Inspirações visuais e temáticas para a IA (nomes de artistas, jogos, animes)."
                    />
                    <TextArea 
                        label="3. Modificador de Prompt" 
                        value={promptModifier}
                        onChange={e => setPromptModifier(e.target.value)}
                        placeholder="Ex: Foco em terror cósmico, evitar clichês"
                        rows={2}
                        tooltip="Uma instrução curta e de alta prioridade para guiar a geração."
                    />
                </div>
                
                <hr className="border-gray-700/50 my-4"/>
                
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-400">4. Diretrizes da Forja (Foco da IA)</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Select label="Foco do Gemini (Estrutura)" value={filters.aiFocusGemini} onChange={e => handleFilterChange('aiFocusGemini', e.target.value)}>{AI_FOCUS_GEMINI.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                        <Select label="Foco do GPT (Polimento)" value={filters.aiFocusGpt} onChange={e => handleFilterChange('aiFocusGpt', e.target.value)}>{AI_FOCUS_GPT.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                        <Select label="Foco do DeepSeek (Conceito)" value={filters.aiFocusDeepSeek} onChange={e => handleFilterChange('aiFocusDeepSeek', e.target.value)}>{AI_FOCUS_DEEPSEEK.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                    </div>
                </div>

                 <div className="space-y-2 pt-2">
                    <Switch label="Usar DeepSeek (Conceito)" checked={aiFlags.useDeepSeek} onChange={e => setAiFlags(f => ({...f, useDeepSeek: e.target.checked}))}/>
                    <Switch label="Usar Gemini (Estrutura)" checked={aiFlags.useGemini} onChange={e => setAiFlags(f => ({...f, useGemini: e.target.checked}))}/>
                    <Switch label="Usar GPT (Polimento)" checked={aiFlags.useGpt} onChange={e => setAiFlags(f => ({...f, useGpt: e.target.checked}))}/>
                 </div>
            </div>

            <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
                <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading || !filters.category} 
                    className="w-full forge-button"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    {isLoading ? 'Forjando...' : 'Forjar Item'}
                </Button>
            </div>
        </div>
    );
};
