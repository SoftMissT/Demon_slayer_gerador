

import React from 'react';
import type { GeneratedItem, FilterState } from '../types';
import { ResultCardSkeleton } from './ResultCardSkeleton';
import { ForgeIcon } from './icons/ForgeIcon';
import { Button } from './ui/Button';
import { ForgeLoadingIndicator } from './ForgeLoadingIndicator';
import { LazyResultCard } from './LazyResultCard';
import { TagIcon } from './icons/TagIcon';
import { AnimatePresence, motion } from 'framer-motion';

interface ResultsPanelProps {
  items: GeneratedItem[];
  isLoading: boolean;
  selectedItem: GeneratedItem | null;
  onSelectItem: (item: GeneratedItem) => void;
  favorites: GeneratedItem[];
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  onClearResults: () => void;
  title?: string;
  aiFocus: Record<string, string> | null;
  activeFilters: FilterState | null;
}

const formatFilterKey = (key: string): string => {
    const labels: { [key: string]: string } = {
        category: 'Categoria',
        hunterTematica: 'Temática do Caçador',
        hunterCountry: 'País do Caçador',
        hunterOrigin: 'Origem do Caçador',
        hunterArchetype: 'Arquétipo',
        hunterPersonality: 'Personalidade',
        hunterWeapon: 'Arma Principal',
        hunterBreathingStyles: 'Respirações (Insp.)',
        hunterRank: 'Rank',
        oniPowerLevel: 'Nível de Poder',
        oniCountry: 'País do Oni',
        oniWeapon: 'Arma do Oni',
        oniInspirationKekkijutsu: 'Kekkijutsu (Insp.)',
        oniInspirationBreathing: 'Respiração (Insp.)',
        oniPersonality: 'Personalidade do Oni',
        oniTematica: 'Temática do Oni',
        npcTematica: 'Temática do NPC',
        npcCountry: 'País do NPC',
        npcOrigin: 'Origem do NPC',
        npcProfession: 'Profissão',
        npcWeapon: 'Arma do NPC',
        npcAccessory: 'Acessório do NPC',
        weaponRarity: 'Raridade',
        weaponTematica: 'Temática da Arma',
        weaponCountry: 'País da Arma',
        weaponType: 'Tipo de Arma',
        weaponMetalColor: 'Cor do Metal',
        weaponDamageType: 'Tipo de Dano',
        accessoryRarity: 'Raridade',
        accessoryTematica: 'Temática do Acessório',
        accessoryOrigin: 'Origem do Acessório',
        accessoryCountry: 'País do Acessório',
        accessoryBreathingInspiration: 'Respiração (Insp.)',
        accessoryKekkijutsuInspiration: 'Kekkijutsu (Insp.)',
        accessoryWeaponInspiration: 'Arma (Insp.)',
        baseBreathingStyles: 'Respirações Base',
        breathingFormTematica: 'Temática',
        breathingFormCountry: 'País',
        breathingFormOrigin: 'Origem',
        breathingFormTone: 'Tom',
        breathingFormWeapon: 'Arma',
        breathingFormArchetype: 'Arquétipo',
        kekkijutsuTematica: 'Temática',
        kekkijutsuCountry: 'País',
        kekkijutsuKekkijutsuInspiration: 'Kekkijutsu (Insp.)',
        kekkijutsuBreathingInspiration: 'Respiração (Insp.)',
        kekkijutsuWeaponInspiration: 'Arma (Insp.)',
        kekkijutsuAccessoryInspiration: 'Acessório (Insp.)',
        locationTone: 'Tom',
        locationTematica: 'Temática',
        locationCountry: 'País',
        locationTerrain: 'Terreno',
        missionTone: 'Tom',
        intensity: 'Intensidade',
        missionScale: 'Escala',
        protagonist: 'Protagonista',
        targets: 'Alvo',
        moodModifiers: 'Modificadores',
        missionTematica: 'Temática',
        missionCountry: 'País',
        missionThreatScale: 'Escala da Ameaça',
        missionEventType: 'Tipo de Evento',
        wbTone: 'Tom',
        wbTematica: 'Temática',
        wbCountry: 'País',
        wbThreatScale: 'Escala da Ameaça',
        wbLocation: 'Local',
        eventTone: 'Tom',
        eventTematica: 'Temática',
        eventCountry: 'País',
        eventLevel: 'Nível do Evento',
        eventThreatLevel: 'Nível da Ameaça',
        eventType: 'Tipo de Evento',
    };
    return labels[key] || key;
};

const getActiveFilters = (filters: FilterState | null): { key: string; label: string; value: string }[] => {
    if (!filters) return [];
    
    const processed: { key: string; label: string; value: string }[] = [];
    
    Object.entries(filters).forEach(([key, value]) => {
        const isMeaningful = value &&
            (!Array.isArray(value) || value.length > 0) &&
            (typeof value !== 'string' || !['Aleatória', 'Aleatório', 'Nenhuma', 'N/A', ''].includes(value)) &&
            !key.startsWith('aiFocus') && key !== 'styleReferences' && key !== 'locationTerrainCustom';

        if (isMeaningful) {
             processed.push({
                key,
                label: formatFilterKey(key),
                value: Array.isArray(value) ? value.join(', ') : String(value),
            });
        }
    });
    return processed;
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  items,
  isLoading,
  selectedItem,
  onSelectItem,
  favorites,
  onToggleFavorite,
  onGenerateVariant,
  onClearResults,
  title = "VITRINE DE EXPOSIÇÃO",
  aiFocus,
  activeFilters,
}) => {
  const displayedFilters = getActiveFilters(activeFilters);

  return (
    <div className="results-panel forge-panel rounded-lg p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-white font-gangofthree">{title}</h2>
        {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearResults}>
                Limpar Resultados
            </Button>
        )}
      </div>
      {displayedFilters.length > 0 && items.length > 0 && (
          <div className="mb-4 border-b border-gray-700/50 pb-3">
              <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <TagIcon className="w-4 h-4" />
                  Filtros Ativos para esta Geração
              </h4>
              <div className="flex flex-wrap gap-2">
                  {displayedFilters.map(filter => (
                      <div key={filter.key} className="bg-gray-700/80 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                          <span className="font-bold text-gray-300 mr-1.5">{filter.label}:</span>
                          {filter.value}
                      </div>
                  ))}
              </div>
          </div>
      )}
      <div className="flex-grow min-h-[200px]">
        {isLoading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <ForgeLoadingIndicator aiFocus={aiFocus} />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <ForgeIcon className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400">A forja está pronta.</h3>
            <p>Use os filtros para gerar seus itens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
            <AnimatePresence>
                {items.map(item => (
                   <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <LazyResultCard
                            item={item}
                            isSelected={selectedItem?.id === item.id}
                            onSelect={onSelectItem}
                            isFavorite={favorites.some(fav => fav.id === item.id)}
                            onToggleFavorite={onToggleFavorite}
                            onGenerateVariant={onGenerateVariant}
                        />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};