import React, { useState, useCallback, useEffect } from 'react';
import { FilterPanel } from './FilterPanel';
import { ResultsPanel } from './ResultsPanel';
import { DetailModal } from './DetailModal';
import { generateContent } from '../services/geminiService';
import type { FilterState, GeneratedItem } from '../types';

interface ForgeInterfaceProps {
    favorites: GeneratedItem[];
    onToggleFavorite: (item: GeneratedItem) => void;
    onAddToHistory: (items: GeneratedItem[]) => void;
    onError: (message: string | null) => void;
    onUpdateItem: (item: GeneratedItem) => void;
}

export const ForgeInterface: React.FC<ForgeInterfaceProps> = ({
    favorites,
    onToggleFavorite,
    onAddToHistory,
    onError,
    onUpdateItem,
}) => {
    const [items, setItems] = useState<GeneratedItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [aiFocus, setAiFocus] = useState<Record<string, string> | null>(null);
    
    useEffect(() => {
        if (items.length === 0) {
            setSelectedItem(null);
        }
    }, [items]);
    
    const handleSelectItem = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setDetailModalOpen(false);
        // Deselect item after modal close animation
        setTimeout(() => {
            setSelectedItem(null);
        }, 300);
    }, []);
    
    const handleUpdateItem = (updatedItem: GeneratedItem) => {
        onUpdateItem(updatedItem);
        setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    };

    const handleGenerate = useCallback(async (filters: FilterState, count: number, promptModifier?: string) => {
        setIsLoading(true);
        onError(null);
        setItems([]);
        setSelectedItem(null);
        setAiFocus({
            gemini: filters.aiFocusGemini,
            gpt: filters.aiFocusGpt,
            deepseek: filters.aiFocusDeepSeek
        });
        
        try {
            const newItems = await generateContent(filters, count, promptModifier);
            setItems(newItems);
            onAddToHistory(newItems);
        } catch (error: any) {
            onError(error.message || 'Ocorreu um erro desconhecido.');
            setItems([]);
        } finally {
            setIsLoading(false);
            setAiFocus(null);
        }
    }, [onAddToHistory, onError]);
    
    const handleGenerateVariant = useCallback(async (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        // This is a complex feature, for now we will just re-generate with a modifier
        const filters: FilterState = {
            category: item.categoria,
            // We can't know the original filters, so we'll just use the item's properties
            styleReferences: '',
            hunterTematica: item.tematica as any,
            hunterCountry: '',
            hunterOrigin: '',
            hunterArchetype: '',
            hunterPersonality: '',
            hunterWeapon: '',
            hunterBreathingStyles: [],
            hunterAccessory: '',
            hunterRank: '',
            oniPowerLevel: '',
            oniCountry: '',
            oniWeapon: '',
            oniInspirationKekkijutsu: [],
            oniInspirationBreathing: '',
            oniPersonality: '',
            oniTematica: item.tematica as any,
            npcTematica: item.tematica as any,
            npcCountry: '',
            npcOrigin: '',
            npcProfession: '',
            npcPersonality: '',
            npcWeapon: '',
            npcAccessory: '',
            weaponRarity: item.raridade as any,
            weaponTematica: item.tematica as any,
            weaponCountry: '',
            weaponType: '',
            weaponMetalColor: '',
            accessoryRarity: item.raridade as any,
            accessoryTematica: item.tematica as any,
            accessoryOrigin: '',
            accessoryCountry: '',
            accessoryBreathingInspiration: '',
            accessoryKekkijutsuInspiration: '',
            accessoryWeaponInspiration: '',
            baseBreathingStyles: [],
            breathingFormTematica: item.tematica as any,
            breathingFormCountry: '',
            breathingFormOrigin: '',
            breathingFormTone: 'épico',
            breathingFormWeapon: '',
            breathingFormArchetype: '',
            kekkijutsuTematica: item.tematica as any,
            kekkijutsuCountry: '',
            kekkijutsuKekkijutsuInspiration: '',
            kekkijutsuBreathingInspiration: '',
            kekkijutsuWeaponInspiration: '',
            kekkijutsuAccessoryInspiration: '',
            locationTone: 'misterioso',
            locationTematica: item.tematica as any,
            locationCountry: '',
            locationTerrain: '',
            locationTerrainCustom: '',
            missionTone: 'sombrio',
            intensity: 3,
            missionScale: 'local',
            protagonist: '',
            targets: '',
            moodModifiers: '',
            missionTematica: item.tematica as any,
            missionCountry: '',
            wbTone: 'épico',
            wbTematica: item.tematica as any,
            wbCountry: '',
            wbThreatScale: '',
            wbLocation: '',
            eventTone: 'misterioso',
            eventTematica: item.tematica as any,
            eventCountry: '',
            eventLevel: '',
            eventThreatLevel: '',
            eventType: '',
            aiFocusGemini: 'Estrutura Base (Padrão)',
            aiFocusGpt: 'Polimento Narrativo (Padrão)',
            aiFocusDeepSeek: 'Refinamento de Mecânicas (Padrão)',
        };
        const promptModifier = `Crie uma variação do item "${item.nome}" com um foco mais ${variantType}.`;
        await handleGenerate(filters, 1, promptModifier);

    }, [handleGenerate]);

    const handleClearResults = useCallback(() => {
        setItems([]);
        setSelectedItem(null);
    }, []);

    const isFavorite = selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false;

    return (
        <div className="forge-layout">
            <div className="forge-column-filters filters-panel-wrapper">
                <FilterPanel onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
            <div className="forge-column-results results-panel-wrapper">
                <ResultsPanel
                    items={items}
                    isLoading={isLoading}
                    selectedItem={selectedItem}
                    onSelectItem={handleSelectItem}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                    onGenerateVariant={handleGenerateVariant}
                    onClearResults={handleClearResults}
                    aiFocus={aiFocus}
                />
            </div>
            
            <DetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                item={selectedItem}
                onGenerateVariant={handleGenerateVariant}
                isFavorite={isFavorite}
                onToggleFavorite={selectedItem ? onToggleFavorite : () => {}}
                onUpdate={handleUpdateItem}
            />
        </div>
    );
};