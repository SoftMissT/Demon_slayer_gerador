import type { StringifyOptions } from "crypto";

export type Category =
  | 'Aleatória'
  | 'Arma'
  | 'Acessório'
  | 'Caçador'
  | 'Inimigo/Oni'
  | 'Forma de Respiração'
  | 'Kekkijutsu'
  | 'Local/Cenário'
  | 'Missão/Cenário'
  | 'NPC'
  | 'World Building';

export type Rarity =
  | 'Aleatória'
  | 'Comum'
  | 'Incomum'
  | 'Raro'
  | 'Épico'
  | 'Lendário'
  | 'Amaldiçoado'
  | 'N/A';

export type Era =
  | 'Aleatória'
  | 'Período Edo (Japão Feudal)'
  | 'Medieval Fantasia'
  | 'Steampunk'
  | 'Cyberpunk'
  | 'Pós-apocalíptico'
  | 'Moderno'
  | 'Tempos Atuais'
  | 'Futurista (Sci-Fi)'
  | 'Biopunk';

export type Tone =
  | 'investigação'
  | 'terror'
  | 'ação'
  | 'drama'
  | 'mistério'
  | 'aventura'
  | 'político';

export interface FilterState {
  category: Category;

  // Hunter Filters
  hunterWeapon: string;
  hunterBreathingStyles: string[];
  hunterAccessory: string;
  hunterEra: Era;
  hunterPersonality: string;
  hunterOrigin: string;
  hunterArchetype: string;

  // Accessory Filters
  accessoryRarity: Rarity;
  accessoryEra: Era;
  accessoryKekkijutsuInspiration: string;
  accessoryBreathingInspiration: string;
  accessoryWeaponInspiration: string;
  accessoryOrigin: string;

  // Weapon Filters
  weaponRarity: Rarity;
  weaponMetalColor: string;
  weaponEra: Era;
  weaponType: string;

  // Location Filters
  locationTone: Tone;
  locationCountry: string;
  locationEra: Era;
  locationTerrain: string;

  // World Building Filters
  wbTone: Tone;
  wbCountry: string;
  wbEra: Era;
  wbThreatScale: string;
  wbLocation: string;

  // Breathing Form Filters
  breathingFormEra: Era;
  breathingFormWeapon: string;
  baseBreathingStyles: string[];
  breathingFormTone: Tone;
  breathingFormOrigin: string;
  breathingFormArchetype: string;

  // Kekkijutsu Filters
  kekkijutsuEra: Era;
  kekkijutsuKekkijutsuInspiration: string;
  kekkijutsuBreathingInspiration: string;
  kekkijutsuWeaponInspiration: string;
  
  // NPC filters
  npcOrigin: string;
  npcProfession: string;
  npcEra: Era;
  
  // Oni Filters
  oniPowerLevel: string;
  oniInspirationKekkijutsu: string;
  oniInspirationBreathing: string;
  oniWeapon: string;

  // Mission Filters
  missionTone: Tone;
  intensity: number;
  missionScale: 'local' | 'regional' | 'nacional' | 'cósmico';
  protagonist: string;
  targets: string;
  moodModifiers: string;
}

export interface MissionNPC {
  id: string;
  name: string;
  role: string;
  dialogue_example: string;
  physical_trait: string;
  goal: string;
  secret: string;
  twist: string;
}

export interface MissionItem {
  appearance: string;
  origin: string;
  wear: string;
  quirk: string;
  use: string;
}

// FIX: Added interface for Protagonist description object.
export interface ProtagonistDesc {
    silhouette: string;
    face: string;
    attire: string;
    movement: string;
    defining_feature: string;
}

// FIX: Added interface for Oni description object.
export interface OniDesc {
    scale: string;
    skin: string;
    appendages: string;
    eyes: string;
    sound_smell: string;
    mystic_sign: string;
}

export interface BaseGeneratedItem {
  id: string;
  createdAt: string;
  nome: string;
  categoria: Category;
  raridade: Rarity;
  // FIX: Added era to base item type.
  era: Era;
  nivel_sugerido: number;
  descricao_curta: string;
  descricao: string;
  ganchos_narrativos?: string | string[];
}

// Discriminated Union for specific item types
export type GeneratedItem = BaseGeneratedItem & (
    | { categoria: 'Arma' | 'Acessório', dano: string, dados: string, tipo_de_dano: string, status_aplicado?: string, efeitos_secundarios?: string }
    | { categoria: 'Caçador', classe: string, personalidade: string, descricao_fisica: string, background: string, arsenal: any, habilidades_especiais: any, acessorio: any, uso_em_cena: string[] }
    | { categoria: 'Inimigo/Oni', power_level: string, descricao_fisica_detalhada: string, kekkijutsu?: { nome: string, descricao: string, tecnicas?: string[] }, comportamento_combate: string[], comportamento_fora_combate: string[], fraquezas_unicas: string[], trofeus_loot: string[] }
    | { categoria: 'Forma de Respiração', base_breathing_id: string, derivation_type: string, name_native: string, name_pt: string, description_flavor: string, requirements: any, mechanics: any, level_scaling: any, micro_variants: any[] }
    | { categoria: 'Kekkijutsu', tecnicas_sugeridas?: { nome: string; descricao: string }[] }
    | { categoria: 'Local/Cenário', clima: string, atmosfera: string, populacao: string, perigos: string[], segredos: string[] }
    // FIX: Added several missing properties to the Mission/Scenario type to match what the API returns and what DetailPanel expects.
    | { categoria: 'Missão/Cenário', tone?: Tone, title?: string, logline: string, summary: string, objectives: string[], complications: string[], failure_states: string[], rewards: string[], numberOfSessions: number, environment: string, key_npcs: MissionNPC[], relevant_items: MissionItem[], protagonist_desc?: ProtagonistDesc, oni_desc?: OniDesc, demonBloodArtType?: string, scaling_hooks?: string, tone_variations?: Record<string, string>, sensitive_flags?: string[], diff?: { summary: string, changes?: string[] }, micro_variants?: any[] }
    | { categoria: 'NPC', origem: string, profession: string, role?: string, relationship_to_pcs?: string, voice_and_mannerisms: string, inventory_focal: string, motivation: string, secret: string, dialogue_lines: string[] }
    | { categoria: 'World Building', title?: string, plot_threads: any[], adventure_hooks: string[], key_npcs_wb: any[], points_of_interest: any[], mini_missions: any[] }
    | { categoria: 'Aleatória' }
);


export interface MidjourneyParameter<T> {
  active: boolean;
  value: T;
}

export interface MidjourneyParameters {
  aspectRatio: MidjourneyParameter<string>;
  chaos: MidjourneyParameter<number>;
  quality: MidjourneyParameter<number>;
  style: MidjourneyParameter<string>;
  stylize: MidjourneyParameter<number>;
  weird: MidjourneyParameter<number>;
  version: MidjourneyParameter<string>;
}

export interface GptParameters {
  tone: string;
  style: string;
  composition: string;
}

export interface PromptGenerationResult {
  midjourneyPrompt: string;
  gptPrompt: string;
}