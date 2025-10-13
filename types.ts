// FIX: Populated with full type definitions to resolve module and type errors across the application.
import { CATEGORIES, RARITIES, TEMATICAS, TONES, HUNTER_RANKS, ONI_POWER_LEVELS } from './constants';

// General types
export type AppView = 'forge' | 'alchemist';

export interface User {
  id: string;
  username: string;
  avatar: string;
}

// AI Generation related types
export interface AIFlags {
    useDeepSeek: boolean;
    useGemini: boolean;
    useGpt: boolean;
}

export interface ProvenanceEntry {
    step: string;
    model: string;
    status: 'success' | 'failed' | 'skipped';
    error?: string;
    reason?: string;
}

// Type Aliases from constants for better type safety
export type Category = typeof CATEGORIES[number];
export type Rarity = typeof RARITIES[number];
export type Tematica = typeof TEMATICAS[number];
export type Tone = typeof TONES[number];
export type HunterRank = typeof HUNTER_RANKS[number];
export type OniPowerLevel = typeof ONI_POWER_LEVELS[number];

// Base for all generated items
interface BaseGeneratedItem {
    id: string;
    createdAt: string;
    nome: string;
    title?: string; // Some items use title instead of nome
    categoria: Category;
    tematica?: Tematica | string;
    raridade?: Rarity | string;
    descricao_curta: string;
    descricao?: string;
    nivel_sugerido?: number;
    imagePromptDescription?: string;
    ganchos_narrativos?: string[] | string;
    provenance?: ProvenanceEntry[];
}

// Category-specific generated items
export interface GeneratedHunter extends BaseGeneratedItem {
    categoria: 'Caçador';
    classe?: string;
    personalidade?: string;
    background?: string;
}

export interface Kekkijutsu {
    nome: string;
    descricao: string;
}
export interface GeneratedOni extends BaseGeneratedItem {
    categoria: 'Inimigo/Oni';
    power_level?: OniPowerLevel | string;
    kekkijutsu?: Kekkijutsu;
    comportamento_combate?: string[];
}
export interface GeneratedNpc extends BaseGeneratedItem {
    categoria: 'NPC';
    personalidade?: string;
    profissao?: string;
}

export interface GeneratedWeapon extends BaseGeneratedItem {
    categoria: 'Arma';
    dano?: string;
    dados?: string;
    tipo_de_dano?: string;
    status_aplicado?: string;
    efeitos_secundarios?: string;
}

export interface GeneratedAccessory extends BaseGeneratedItem {
    categoria: 'Acessório';
    dano?: string;
    dados?: string;
    tipo_de_dano?: string;
    status_aplicado?: string;
    efeitos_secundarios?: string;
}

export interface GeneratedBreathingForm extends BaseGeneratedItem {
    categoria: 'Forma de Respiração';
    // Add specific fields if any
}

export interface GeneratedKekkijutsu extends BaseGeneratedItem {
    categoria: 'Kekkijutsu';
    dano?: string;
    dados?: string;
    tipo_de_dano?: string;
    status_aplicado?: string;
    efeitos_secundarios?: string;
}

export interface GeneratedLocation extends BaseGeneratedItem {
    categoria: 'Local/Cenário';
    // Add specific fields if any
}

export interface GeneratedMission extends BaseGeneratedItem {
    categoria: 'Missões';
    // Add specific fields if any
}

export interface GeneratedWorldBuilding extends BaseGeneratedItem {
    categoria: 'World Building';
     // Add specific fields if any
}
export interface GeneratedEvent extends BaseGeneratedItem {
    categoria: 'Evento';
     // Add specific fields if any
}

// Union type for any generated item
export type GeneratedItem =
    | GeneratedHunter
    | GeneratedOni
    | GeneratedNpc
    | GeneratedWeapon
    | GeneratedAccessory
    | GeneratedBreathingForm
    | GeneratedKekkijutsu
    | GeneratedLocation
    | GeneratedMission
    | GeneratedWorldBuilding
    | GeneratedEvent;


// Forge Filter State
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
    // FIX: Changed array types to readonly to allow `as const` on INITIAL_FILTERS for precise type inference.
    hunterBreathingStyles: readonly string[];
    hunterAccessory: string;
    hunterRank: HunterRank | '';
    // Oni
    oniPowerLevel: OniPowerLevel | '';
    oniCountry: string;
    oniWeapon: string;
    // FIX: Changed array types to readonly to allow `as const` on INITIAL_FILTERS for precise type inference.
    oniInspirationKekkijutsu: readonly string[];
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
    // FIX: Changed array types to readonly to allow `as const` on INITIAL_FILTERS for precise type inference.
    baseBreathingStyles: readonly string[];
    breathingFormTematica: Tematica | '';
    breathingFormCountry: string;
    breathingFormOrigin: string;
    breathingFormTone: Tone | 'épico';
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
    locationTone: Tone | 'misterioso';
    locationTematica: Tematica | '';
    locationCountry: string;
    locationTerrain: string;
    locationTerrainCustom: string;
    // Mission
    missionTone: Tone | 'sombrio';
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
    wbTone: Tone | 'épico';
    wbTematica: Tematica | '';
    wbCountry: string;
    wbThreatScale: string;
    wbLocation: string;
    // Event
    eventTone: 'misterioso';
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

// Prompt Engineering / Alchemist types
export interface MidjourneyParam {
    active: boolean;
    value: string | number;
}
export interface MidjourneyParameters {
    aspectRatio: MidjourneyParam;
    chaos: MidjourneyParam;
    quality: MidjourneyParam;
    style: MidjourneyParam;
    stylize: MidjourneyParam;
    version: MidjourneyParam;
    weird: MidjourneyParam;
    artStyle?: MidjourneyParam;
    lighting?: MidjourneyParam;
    colorPalette?: MidjourneyParam;
    composition?: MidjourneyParam;
    detailLevel?: MidjourneyParam;
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
        negativePrompt: string;
        mjParams: MidjourneyParameters;
        gptParams: GptParameters;
        geminiParams: GeminiParameters;
        // FIX: Added 'generateFor' to the type to align with the application's state, resolving a type error when loading history items.
        generateFor?: {
            midjourney: boolean;
            gpt: boolean;
            gemini: boolean;
        };
    };
    outputs: PromptGenerationResult;
}


// History & Favorites
export type HistoryItem = GeneratedItem | AlchemyHistoryItem;
export type FavoriteItem = GeneratedItem | AlchemyHistoryItem;