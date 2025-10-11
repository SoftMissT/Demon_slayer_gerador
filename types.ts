// FIX: Replaced circular import with the actual type definition for Rarity.
export type Rarity =
  | 'Aleatória'
  | 'Comum'
  | 'Incomum'
  | 'Raro'
  | 'Épico'
  | 'Lendário'
  | 'Amaldiçoado'
  | 'N/A';

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
  
  // Mission filters
  missionTone: Tone;
  intensity: number;
  missionScale: 'local' | 'regional' | 'nacional' | 'cósmico';
  protagonist: string;
  targets: string;
  moodModifiers: string;

  // NPC filters
  profession: string;
  relation_with_pcs: string;
  level_detail: string;
  
  // Shared Hunter/NPC Origin
  origem: string;

  // Hunter Filters
  hunterWeapon: string;
  hunterBreathingStyles: string[];
  hunterTone: Tone;
  hunterPersonality: string;
  hunterArchetype: string;

  // Oni Filters
  oniWeapon: string;
  oniInspirationBreathing: string;
  oniPowerLevel: string;
  oniInspirationKekkijutsu: string;

  // Accessory Filters
  accessoryInspirationKekkijutsu: string;
  accessoryInspirationBreathing: string;
  accessoryWeaponInspiration: string;
  accessoryOriginInspiration: string;

  // Weapon Filters
  weaponMetalColor: string;

  // Location Filters
  locationTone: Tone;
  locationCountry: string;
  locationTerrain: string;

  // World Building Filters
  wbTone: Tone;
  wbCountry: string;
  wbScale: string;
  
  // Breathing Form Filters
  baseBreathingStyles: string[];
  breathingFormWeapon: string;
  breathingFormTone: Tone;
  breathingFormOrigin: string;
  breathingFormArchetype: string;

  // Kekkijutsu Filters
  kekkijutsuInspiration: string;
  kekkijutsuInspirationBreathing: string;
  kekkijutsuWeapon: string;
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

// World Building Types
export interface WBPlotThread {
    title: string;
    description: string;
}

export interface WBKeyNpc {
    name: string;
    role: string;
    description: string;
}

export interface WBPointOfInterest {
    name: string;
    type: string;
    description: string;
}

export interface WBMiniMission {
    title: string;
    objective: string;
    reward: string;
}

// Breathing Form Types
export interface BreathingFormMechanics {
    activation: string;
    target: string;
    initial_test: {
        type: string;
        dc_formula: string;
    };
    on_success_target: string;
    on_fail_target: string;
    damage_formula_rank: Record<string, string>;
    weapon_heat?: {
        weapon: number;
        target: number;
        duration: string;
    };
    critical_rule?: string;
    exhaustion_cost: number;
    exhaustion_transfer?: {
        vit_test_dc: string;
        transfer_on_fail: number;
    };
    cooldown: string;
    scaling_notes?: string;
}

export interface BreathingFormRequirements {
    min_rank: number;
    cooldown: string;
    exhaustion_cost: number;
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
  ganchos_narrativos?: string | string[];
  // For locations
  clima?: string;
  bioma?: string;
  pais?: string;
  terreno?: string;
  tom_local?: string;
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
  micro_variants?: any[];
  tone?: string;
  // For NPCs
  role?: string;
  profession?: string;
  voice_and_mannerisms?: string;
  inventory_focal?: string;
  motivation?: string;
  secret?: string;
  relationship_to_pcs?: string;
  dialogue_lines?: string[];
  // For Hunters and NPCs
  origem?: string;
  // For Hunters
  classe?: string;
  personalidade?: string;
  descricao_fisica?: string;
  background?: string;
  arsenal?: {
    arma: string;
    empunhadura: {
      nome: string;
      descricao: string;
    };
  };
  habilidades_especiais?: {
    respiracao: string;
    variacoes_tecnica: string[];
  };
  acessorio?: {
    nome: string;
    descricao: string;
  };
  uso_em_cena?: string[];
  // For Onis
  power_level?: string;
  descricao_fisica_detalhada?: string;
  kekkijutsu?: {
    nome: string;
    descricao: string;
  };
  comportamento_combate?: string[];
  comportamento_fora_combate?: string[];
  fraquezas_unicas?: string[];
  trofeus_loot?: string[];
  // For World Building
  plot_threads?: WBPlotThread[];
  adventure_hooks?: string[];
  key_npcs_wb?: WBKeyNpc[];
  points_of_interest?: WBPointOfInterest[];
  mini_missions?: WBMiniMission[];
  // For Breathing Forms
  base_breathing_id?: string;
  base_form_id?: string;
  derivation_type?: string;
  name_native?: string;
  name_pt?: string;
  description_flavor?: string;
  mechanics?: BreathingFormMechanics;
  requirements?: BreathingFormRequirements;
  level_scaling?: Record<string, Record<string, string>>;
  balance_variants?: {
      leve: any;
      padrao: any;
      brutal: any;
  };
  clipboard_plain?: string;
  clipboard_markdown?: string;
  notes_for_gm?: string;
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