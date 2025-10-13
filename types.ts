// types.ts

import { CATEGORIES, RARITIES, TEMATICAS, TONES } from './constants';

// Basic Types from Constants
export type Category = typeof CATEGORIES[number];
export type Rarity = typeof RARITIES[number];
export type Tematica = typeof TEMATICAS[number];
export type Tone = typeof TONES[number];

// User & Auth
export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface ApiKeys {
  gemini: string;
  openai: string;
  deepseek: string;
}

// AI Generation Flags
export interface AIFlags {
    useDeepSeek: boolean;
    useGemini: boolean;
    useGpt: boolean;
}

// Forge Item Generation
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

// Base type for generated items
interface BaseGeneratedItem {
    id: string;
    createdAt: string;
    nome: string;
    categoria: Category;
    tematica: string;
    descricao_curta: string;
    descricao: string;
    imagePromptDescription?: string;
    raridade: string;
    nivel_sugerido: number;
    ganchos_narrativos?: string | string[];
    provenance?: Array<{
        step: string;
        model: string;
        status: 'success' | 'failed' | 'skipped';
        error?: string;
        reason?: string;
    }>;
}

// Specific item types extending the base
export interface WeaponItem extends BaseGeneratedItem {
    categoria: 'Arma';
    dano: string;
    dados: string;
    tipo_de_dano: string;
    status_aplicado: string;
    efeitos_secundarios: string;
}

export interface AccessoryItem extends BaseGeneratedItem {
    categoria: 'Acessório';
    efeitos_passivos: string;
    efeitos_ativos: string;
    condicao_ativacao: string;
}

export interface HunterItem extends BaseGeneratedItem {
    categoria: 'Caçador';
    classe: string;
    personalidade: string;
    background: string;
}

export interface OniItem extends BaseGeneratedItem {
    categoria: 'Inimigo/Oni';
    power_level: string;
    comportamento_combate: string[];
    fraquezas_unicas: string[];
    kekkijutsu?: { nome: string; descricao: string };
}

export interface NpcItem extends BaseGeneratedItem {
    categoria: 'NPC';
    origem: string;
    motivation: string;
    secret: string;
}

export interface BreathingFormItem extends BaseGeneratedItem {
    categoria: 'Forma de Respiração';
    // Add specific fields if any
}

export interface KekkijutsuItem extends BaseGeneratedItem {
    categoria: 'Kekkijutsu';
    dano: string;
    dados: string;
    tipo_de_dano: string;
    status_aplicado: string;
    efeitos_secundarios: string;
}

export interface LocationItem extends BaseGeneratedItem {
    categoria: 'Local/Cenário';
}

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

export interface MissionItem extends BaseGeneratedItem, MissionItemDetails {
    categoria: 'Missões';
}

export interface WorldBuildingItem extends BaseGeneratedItem {
    categoria: 'World Building';
    // Add specific fields if any
}

export interface EventItem extends BaseGeneratedItem {
    categoria: 'Evento';
    // Add specific fields if any
}


// A union of all possible generated item types
export type GeneratedItem = 
    | WeaponItem
    | AccessoryItem
    | HunterItem
    | OniItem
    | NpcItem
    | BreathingFormItem
    | KekkijutsuItem
    | LocationItem
    | MissionItem
    | WorldBuildingItem
    | EventItem;

// Prompt Engineering Types
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
    // Descriptive params
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

// History & Favorites
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

export type AppView = 'forge' | 'alchemist';
