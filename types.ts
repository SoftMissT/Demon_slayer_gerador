
import { CATEGORIES, RARITIES, TEMATICAS, TONES } from './constants';

// Base types from constants
export type Category = typeof CATEGORIES[number];
export type Rarity = typeof RARITIES[number];
export type Tematica = typeof TEMATICAS[number];
export type Tone = typeof TONES[number];

// Filter State
export interface FilterState {
    category: Category | '';
    styleReferences: string;
    // Hunter
    hunterTematica: Tematica | '';
    hunterCountry: string;
    hunterOrigin: string;
    hunterArchetype: string;
    hunterPersonality: string;
    hunterWeapon: string;
    hunterBreathingStyles: string[];
    hunterAccessory: string;
    hunterRank: string;
    // Oni
    oniPowerLevel: string;
    oniCountry: string;
    oniWeapon: string;
    oniInspirationKekkijutsu: string[];
    oniInspirationBreathing: string;
    oniPersonality: string;
    oniTematica: Tematica | '';
    // NPC
    npcTematica: Tematica | '';
    npcCountry: string;
    npcOrigin: string;
    npcProfession: string;
    npcPersonality: string;
    npcWeapon: string;
    npcAccessory: string;
    // Weapon
    weaponRarity: Rarity | '';
    weaponTematica: Tematica | '';
    weaponCountry: string;
    weaponType: string;
    weaponMetalColor: string;
    weaponDamageType: string;
    weaponDetailedDescription: string;
    // Accessory
    accessoryRarity: Rarity | '';
    accessoryTematica: Tematica | '';
    accessoryOrigin: string;
    accessoryCountry: string;
    accessoryBreathingInspiration: string;
    accessoryKekkijutsuInspiration: string;
    accessoryWeaponInspiration: string;
    // Breathing Form
    baseBreathingStyles: string[];
    breathingFormTematica: Tematica | '';
    breathingFormCountry: string;
    breathingFormOrigin: string;
    breathingFormTone: Tone;
    breathingFormWeapon: string;
    breathingFormArchetype: string;
    // Kekkijutsu
    kekkijutsuTematica: Tematica | '';
    kekkijutsuCountry: string;
    kekkijutsuKekkijutsuInspiration: string;
    kekkijutsuBreathingInspiration: string;
    kekkijutsuWeaponInspiration: string;
    kekkijutsuAccessoryInspiration: string;
    // Location
    locationTone: Tone;
    locationTematica: Tematica | '';
    locationCountry: string;
    locationTerrain: string;
    locationTerrainCustom: string;
    // Mission
    missionTone: Tone;
    intensity: number;
    missionScale: string;
    protagonist: string;
    targets: string;
    moodModifiers: string;
    missionTematica: Tematica | '';
    missionCountry: string;
    missionThreatScale: string;
    missionEventType: string;
    // World Building
    wbTone: Tone;
    wbTematica: Tematica | '';
    wbCountry: string;
    wbThreatScale: string;
    wbLocation: string;
    // Event
    eventTone: Tone;
    eventTematica: Tematica | '';
    eventCountry: string;
    eventLevel: string;
    eventThreatLevel: string;
    eventType: string;
    // AI Collaboration Focus
    aiFocusGemini: string;
    aiFocusGpt: string;
    aiFocusDeepSeek: string;
}


// Provenance for generated items
export interface Provenance {
    step: string;
    model: string;
    status: 'success' | 'failed' | 'skipped';
    error?: string;
    reason?: string;
}

// Base for generated items
export interface GeneratedItem {
    id: string;
    nome: string;
    categoria: Category;
    tematica: Tematica | string;
    descricao_curta: string;
    descricao: string;
    imagePromptDescription: string;
    raridade: Rarity | string;
    nivel_sugerido: number;
    ganchos_narrativos: string[] | string;
    provenance: Provenance[];
    createdAt: string;
    [key: string]: any;
}

export interface HunterItem extends GeneratedItem {
    classe: string;
    personalidade: string;
    background: string;
}

export interface OniItem extends GeneratedItem {
    power_level: string;
    comportamento_combate: string;
    fraquezas_unicas: string[];
}

export interface NpcItem extends GeneratedItem {
    origem: string;
    motivation: string;
    secret: string;
}

export interface WeaponItem extends GeneratedItem {
    dano: string;
    tipo_de_dano: string;
    status_aplicado: string;
    efeitos_secundarios: string;
}

export interface KekkijutsuItem extends WeaponItem {}

export interface AccessoryItem extends GeneratedItem {
    efeitos_passivos: string;
    efeitos_ativos: string;
    condicao_ativacao: string;
}

export interface BreathingFormItem extends GeneratedItem {}

export interface MissionItemDetails {
    title: string;
    logline: string;
    summary: string;
    objectives: string[];
    complications: string[];
    failure_states: string[];
    rewards: string[];
    numberOfSessions: number;
}

export interface MissionItem extends GeneratedItem {
    details: MissionItemDetails;
}

export interface WorldBuildingItem extends GeneratedItem {}

export interface EventItem extends GeneratedItem {}


// Auth & API
export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface AIFlags {
  useDeepSeek: boolean;
  useGemini: boolean;
  useGpt: boolean;
}

export interface ApiKeys {
    gemini: string;
    openai: string;
    deepseek: string;
}

// Prompt Alchemy types
export interface MidjourneyParam {
    value: string | number;
    active: boolean;
}

export interface MidjourneyParameters {
    [key: string]: MidjourneyParam;
}

export interface GptParameters {
    tone: string;
    style: string;
    composition: string;
}

export interface GeminiParameters {
    artStyle: string;
    lighting: string;
    colorPalette: string;
    composition: string;
    detailLevel: string;
}

export interface PromptGenerationResult {
    midjourneyPrompt?: string;
    gptPrompt?: string;
    geminiPrompt?: string;
}

export interface AlchemyHistoryItem {
    id: string;
    createdAt: string;
    inputs: {
        basePrompt: string;
        negativePrompt?: string;
        mjParams?: MidjourneyParameters;
        gptParams: GptParameters;
        geminiParams: GeminiParameters;
    };
    outputs: PromptGenerationResult;
}

export type HistoryItem = GeneratedItem | AlchemyHistoryItem;
export type FavoriteItem = GeneratedItem | AlchemyHistoryItem;
