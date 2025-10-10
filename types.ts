// Defines the core data structures and types used throughout the application.

export type Category = 'Arma' | 'Acessório' | 'Inimigo/Oni' | 'Caçador' | 'Classe/Origem' | 'Forma de Respiração' | 'Kekkijutsu' | 'Local/Cenário' | 'Missão/Cenário';
export type Rarity = 'Aleatória' | 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Amaldiçoado';
export type Era = 'Período Edo (Japão Feudal)' | 'Moderno' | 'Cyberpunk' | 'Steampunk' | 'Medieval Fantasia' | 'Biopunk' | 'Tempos Atuais' | 'Futurista (Sci-Fi)' | 'Pós-apocalíptico';
export type Tone = "misterioso" | "dark" | "macabro" | "sombrio" | "melancólico" | "claustrofóbico" | "onírico" | "visceral" | "ritualístico" | "gótico" | "noir" | "opressor" | "silencioso" | "febril" | "septentrional" | "crepuscular";


export interface FilterState {
  category: string;
  rarity: string;
  era: string;
  breathingStyles: string[];
  demonArts: string[];
  // Mission Specific Filters
  tone?: Tone;
  intensity?: number;
  scale?: 'local' | 'regional' | 'nacional' | 'cósmico';
  protagonist?: string;
  targets?: string;
  moodModifiers?: string;
}

// Sub-interfaces for Mission/Scenario
export interface MissionNPC {
  id: string;
  name: string;
  role: string;
  goal: string;
  secret: string;
  twist: string;
  physical_trait: string;
  dialogue_example: string;
}

export interface MissionLocation {
  id: string;
  name: string;
  descr_short: string;
  mechanic_hook: string;
}

export interface MissionEncounter {
  id: string;
  type: 'combat' | 'social' | 'puzzle' | 'exploration';
  descr: string;
  difficulty: number;
  modular_template: string;
}

export interface MissionClue {
  text: string;
  difficulty: number;
  location_id: string;
}

export interface MissionItem {
    appearance: string;
    origin: string;
    wear: string;
    quirk: string;
    use: string;
}

export interface MissionProtagonist {
    silhouette: string;
    face: string;
    attire: string;
    movement: string;
    defining_feature: string;
}

export interface MissionOni {
    scale: string;
    skin: string;
    appendages: string;
    eyes: string;
    sound_smell: string;
    mystic_sign: string;
}

export interface MissionDiff {
    changes: string[];
    summary: string;
}

export interface GeneratedItem {
  id: string;
  nome: string;
  categoria: Category;
  raridade: Rarity;
  nivel_sugerido: number;
  descricao_curta: string;
  descricao: string;
  dano?: string;
  dados?: string;
  tipo_de_dano?: string;
  status_aplicado?: string;
  efeitos_secundarios?: string;
  ganchos_narrativos?: string;
  clima?: string; 
  bioma?: string; 

  // Mission/Scenario fields
  title?: string;
  logline?: string;
  summary?: string;
  objectives?: string[];
  failure_states?: string[];
  key_npcs?: MissionNPC[];
  locations?: MissionLocation[];
  encounters?: MissionEncounter[];
  clues?: MissionClue[];
  major_twist?: string;
  rewards?: string[];
  design_notes?: string;
  diff?: MissionDiff;
  micro_variants?: any[];
  sensitive_flags?: string[];
  protagonist_desc?: MissionProtagonist;
  oni_desc?: MissionOni;
  relevant_items?: MissionItem[];
  complications?: string[];
  environment?: string;
  tone_variations?: any;
  scaling_hooks?: string;
}

// Types for Prompt Engineering Panel
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

export interface WebSearchQueryResult {
    uri: string;
    title: string;
}

export interface PromptGenerationResult {
    midjourneyPrompt: string;
    gptPrompt: string;
    webSearchQueries?: WebSearchQueryResult[];
}