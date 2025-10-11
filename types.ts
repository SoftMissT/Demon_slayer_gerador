
export type Rarity = 'Aleatória' | 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Amaldiçoado';

export type Category = 
  | 'Aleatória'
  | 'Arma'
  | 'Acessório'
  | 'Caçador'
  | 'Inimigo/Oni'
  | 'Classe/Origem'
  | 'Forma de Respiração'
  | 'Kekkijutsu'
  | 'Local/Cenário'
  | 'Missão/Cenário'
  | 'NPC';

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

export type Tone = 'investigação' | 'terror' | 'ação' | 'drama' | 'mistério' | 'aventura' | 'político';
export type Relation = 'Aleatória' | 'Amigo' | 'Inimigo' | 'Neutro' | 'Mentor' | 'Contato';
export type DetailLevel = 'Baixo' | 'Médio' | 'Alto';

export interface FilterState {
  category: string;
  rarity: string;
  era: string;
  breathingStyles: string[];
  demonArts: string[];
  // Mission filters
  tone: Tone;
  intensity: number;
  scale: 'local' | 'regional' | 'nacional' | 'cósmico';
  protagonist: string;
  targets: string;
  moodModifiers: string;
  // NPC filters
  profession: string;
  relation_with_pcs: string;
  level_detail: string;
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

export interface GeneratedItem {
  id: string;
  nome: string;
  categoria: string;
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
  // For locations
  clima?: string;
  bioma?: string;
  // For missions
  title?: string;
  logline?: string;
  summary?: string;
  objectives?: string[];
  complications?: string[];
  failure_states?: string[];
  rewards?: string[];
  numberOfSessions?: number;
  environment?: string;
  protagonist_desc?: {
      silhouette: string;
      face: string;
      attire: string;
      movement: string;
      defining_feature: string;
  };
  oni_desc?: {
      scale: string;
      skin: string;
      appendages: string;
      eyes: string;
      sound_smell: string;
      mystic_sign: string;
  };
  demonBloodArtType?: string;
  key_npcs?: MissionNPC[];
  relevant_items?: MissionItem[];
  scaling_hooks?: string;
  tone_variations?: Record<string, string>;
  sensitive_flags?: string[];
  diff?: {
      summary: string;
      changes: string[];
  };
  micro_variants?: string[];
  tone?: string;
  // For NPCs
  role?: string;
  profession?: string;
  voice_and_mannerisms?: string;
  inventory_focal?: string;
  motivation?: string;
  secret?: string;
  relationship_to_pcs?: string;
  hooks?: string[];
  dialogue_lines?: string[];
}

// Prompt Engineering Panel Types
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

export interface WebSearchQuery {
    uri: string;
    title: string;
}

export interface PromptGenerationResult {
    midjourneyPrompt: string;
    gptPrompt: string;
    webSearchQueries?: WebSearchQuery[];
}
