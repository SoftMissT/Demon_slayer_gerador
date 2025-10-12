// FIX: Populated with full type definitions to resolve module errors.
export type Category = 'Caçador' | 'Inimigo/Oni' | 'NPC' | 'Arma' | 'Acessório' | 'Forma de Respiração' | 'Kekkijutsu' | 'Local/Cenário' | 'Missão/Cenário' | 'World Building';
export type Rarity = 'Aleatória' | 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Amaldiçoado' | 'N/A';
export type Era = 'Aleatória' | 'Período Edo (Japão Feudal)' | 'Medieval Fantasia' | 'Steampunk' | 'Cyberpunk' | 'Pós-apocalíptico' | 'Tempos Atuais' | 'Futurista (Sci-Fi)' | 'Biopunk';
export type Tone = 'épico' | 'sombrio' | 'misterioso' | 'aventuresco' | 'cômico' | 'trágico' | 'esperançoso';

export interface FilterState {
  category: Category | '';
  // Hunter
  hunterEra: Era;
  hunterCountry: string;
  hunterOrigin: string;
  hunterArchetype: string;
  hunterPersonality: string;
  hunterWeapon: string;
  hunterBreathingStyles: string[];
  hunterAccessory: string;
  // Oni
  oniPowerLevel: string;
  oniCountry: string;
  oniWeapon: string;
  oniInspirationKekkijutsu: string;
  oniInspirationBreathing: string;
  oniPersonality: string;
  // NPC
  npcEra: Era;
  npcCountry: string;
  npcOrigin: string;
  npcProfession: string;
  npcPersonality: string;
  npcWeapon: string;
  // Weapon
  weaponRarity: Rarity;
  weaponEra: Era;
  weaponCountry: string;
  weaponType: string;
  weaponMetalColor: string;
  // Accessory
  accessoryRarity: Rarity;
  accessoryEra: Era;
  accessoryOrigin: string;
  accessoryBreathingInspiration: string;
  accessoryKekkijutsuInspiration: string;
  accessoryWeaponInspiration: string;
  // Breathing Form
  baseBreathingStyles: string[];
  breathingFormEra: Era;
  breathingFormCountry: string;
  breathingFormOrigin: string;
  breathingFormTone: Tone;
  breathingFormWeapon: string;
  breathingFormArchetype: string;
  // Kekkijutsu
  kekkijutsuEra: Era;
  kekkijutsuCountry: string;
  kekkijutsuKekkijutsuInspiration: string;
  kekkijutsuBreathingInspiration: string;
  kekkijutsuWeaponInspiration: string;
  // Location
  locationTone: Tone;
  locationEra: Era;
  locationCountry: string;
  locationTerrain: string;
  // Mission
  missionTone: Tone;
  intensity: number;
  missionScale: 'local' | 'regional' | 'nacional' | 'cósmico';
  protagonist: string;
  targets: string;
  moodModifiers: string;
  // World Building
  wbTone: Tone;
  wbEra: Era;
  wbCountry: string;
  wbThreatScale: string;
  wbLocation: string;
}

interface BaseGeneratedItem {
  id: string;
  createdAt: string;
  nome: string;
  categoria: Category;
  era: string;
  descricao_curta: string;
  descricao: string;
  raridade: Rarity;
  nivel_sugerido: number;
  ganchos_narrativos?: string | string[];
}

export interface WeaponItem extends BaseGeneratedItem {
  categoria: 'Arma' | 'Acessório';
  dano: string;
  dados: string;
  tipo_de_dano: string;
  status_aplicado?: string;
  efeitos_secundarios?: string;
}

export interface KekkijutsuItem extends BaseGeneratedItem {
    categoria: 'Kekkijutsu';
    dano: string;
    dados: string;
    tipo_de_dano: string;
    status_aplicado?: string;
    efeitos_secundarios?: string;
}

export interface HunterItem extends BaseGeneratedItem {
    categoria: 'Caçador';
    classe: string;
    personalidade: string;
    descricao_fisica: string;
    background: string;
    arsenal: {
        arma: string;
        empunhadura: { nome: string; descricao: string; };
    };
    habilidades_especiais: {
        respiracao: string;
        variacoes_tecnica: string[];
    };
    acessorio: {
        nome: string;
        descricao: string;
    };
    uso_em_cena: string[];
}

export interface OniItem extends BaseGeneratedItem {
    categoria: 'Inimigo/Oni';
    power_level: string;
    descricao_fisica_detalhada: string;
    kekkijutsu: {
        nome: string;
        descricao: string;
    };
    comportamento_combate: string[];
    comportamento_fora_combate: string[];
    fraquezas_unicas: string[];
    trofeus_loot: string[];
}

export interface NpcItem extends BaseGeneratedItem {
    categoria: 'NPC';
    origem: string;
    voice_and_mannerisms: string;
    inventory_focal: string;
    motivation: string;
    secret: string;
    dialogue_lines: string[];
    role?: string;
    profession?: string;
    relationship_to_pcs?: string;
}

export interface BreathingFormItem extends BaseGeneratedItem {
    categoria: 'Forma de Respiração';
    base_breathing_id: string;
    derivation_type?: string;
    name_native?: string;
    description_flavor: string;
    requirements: {
        min_rank: string;
        exhaustion_cost: string;
        cooldown: string;
    };
    mechanics: {
        activation: string;
        target: string;
        initial_test: { type: string; dc_formula: string; };
        on_success_target: string;
        on_fail_target: string;
        damage_formula_rank: Record<string, string>;
    };
    level_scaling: Record<string, Record<string, string>>;
    micro_variants?: (string | Record<string, unknown>)[];
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

export interface MissionItemDetails extends BaseGeneratedItem {
    categoria: 'Missão/Cenário';
    title: string;
    logline: string;
    summary: string;
    objectives: string[];
    complications: string[];
    failure_states: string[];
    rewards: string[];
    numberOfSessions: number;
    environment: string;
    protagonist_desc: {
        silhouette: string;
        face: string;
        attire: string;
        movement: string;
        defining_feature: string;
    };
    oni_desc: {
        scale: string;
        skin: string;
        appendages: string;
        eyes: string;
        sound_smell: string;
        mystic_sign: string;
    };
    demonBloodArtType: string;
    key_npcs: MissionNPC[];
    relevant_items: MissionItem[];
    scaling_hooks: string;
    tone_variations: Record<string, string>;
    sensitive_flags: string[];
    diff?: {
        summary: string;
        changes: string[];
    };
    micro_variants?: (string | Record<string, unknown>)[];
    tone: Tone;
}

export interface WorldBuildingItem extends BaseGeneratedItem {
    categoria: 'World Building';
    plot_threads: { title: string; description: string; }[];
    adventure_hooks: string[];
    key_npcs_wb: { name: string; role: string; description: string; }[];
    points_of_interest: { name: string; type: string; description: string; }[];
    mini_missions: { title: string; objective: string; reward: string; }[];
}

export interface LocationItem extends BaseGeneratedItem {
    categoria: 'Local/Cenário';
}

export type GeneratedItem = 
    | WeaponItem
    | KekkijutsuItem
    | HunterItem
    | OniItem
    | NpcItem
    | BreathingFormItem
    | MissionItemDetails
    | WorldBuildingItem
    | LocationItem;

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