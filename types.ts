

// FIX: Define and export all types. This file should only contain type definitions.

export type Category = 'Aleatória' | 'Arma' | 'Acessório' | 'Caçador' | 'Inimigo/Oni' | 'Forma de Respiração' | 'Kekkijutsu' | 'Local/Cenário' | 'Missão/Cenário' | 'NPC' | 'World Building';

export type Rarity = 'Aleatória' | 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Amaldiçoado' | 'N/A';

export type Era = 'Aleatória' | 'Período Edo (Japão Feudal)' | 'Medieval Fantasia' | 'Steampunk' | 'Cyberpunk' | 'Pós-apocalíptico' | 'Moderno' | 'Tempos Atuais' | 'Futurista (Sci-Fi)' | 'Biopunk';

export type Tone = 'investigação' | 'terror' | 'ação' | 'drama' | 'mistério' | 'aventura' | 'político';

export type FilterState = {
    category: Category;
    rarity: Rarity;
    era: Era;
    // Mission filters
    missionTone: Tone;
    intensity: number;
    missionScale: 'local' | 'regional' | 'nacional' | 'cósmico';
    protagonist: string;
    targets: string;
    moodModifiers: string;
    // NPC Filters
    profession: string;
    relation_with_pcs: string;
    level_detail: string;
    // Hunter/NPC Origin
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
    wbScale: 'local' | 'regional' | 'nacional' | 'cósmico';
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

    // Legacy property from another version of FilterPanel.tsx to prevent new errors
    baseBreathingStyle?: string;
};

export type Diff = {
    summary: string;
    changes: string[];
};

export type MissionNPC = {
    id: string;
    name: string;
    role: string;
    dialogue_example: string;
    physical_trait: string;
    goal: string;
    secret: string;
    twist: string;
};

export type MissionItem = {
    appearance: string;
    origin: string;
    wear: string;
    quirk: string;
    use: string;
};

// A base type for all generated items
type BaseGeneratedItem = {
    id: string; // Added client-side
    nome: string;
    categoria: Category;
    raridade: Rarity;
    nivel_sugerido: number;
    descricao_curta: string;
    diff?: Diff; // Added for variants
    createdAt?: string; // Added for history feature
};

// For Arma, Acessório, Kekkijutsu, etc.
export type GenericItem = BaseGeneratedItem & {
    descricao: string;
    dano?: string;
    dados?: string;
    tipo_de_dano?: string;
    status_aplicado?: string;
    efeitos_secundarios?: string;
    ganchos_narrativos?: string | string[];
};

// For Caçador
export type HunterItem = BaseGeneratedItem & {
    origem: string;
    classe: string;
    personalidade: string;
    descricao_fisica: string;
    background: string;
    arsenal: {
        arma: string;
        empunhadura: {
            nome: string;
            descricao: string;
        };
    };
    habilidades_especiais: {
        respiracao: string;
        variacoes_tecnica: string[];
    };
    acessorio: {
        nome: string;
        descricao: string;
    };
    ganchos_narrativos: string[];
    uso_em_cena: string[];
};

// For Inimigo/Oni
export type OniItem = BaseGeneratedItem & {
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
    ganchos_narrativos: string[];
};

// For Forma de Respiração
export type BreathingFormItem = BaseGeneratedItem & {
    base_breathing_id: string;
    derivation_type: string;
    name_native?: string;
    name_pt?: string;
    description_flavor: string;
    mechanics: {
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
    };
    requirements: {
        min_rank: number;
        cooldown: string;
        exhaustion_cost: number;
    };
    level_scaling: Record<string, Record<string, string>>;
    balance_variants?: {
        leve: object;
        padrao: object;
        brutal: object;
    };
    micro_variants: Record<string, string>[];
    sensitive_flags?: string[];
    clipboard_plain?: string;
    clipboard_markdown?: string;
    notes_for_gm?: string;
};

// For Local/Cenário
export type LocationItem = BaseGeneratedItem & {
    descricao: string;
    clima?: string;
    bioma?: string;
    pais?: string;
    terreno?: string;
    tom_local?: string;
    ganchos_narrativos?: string;
};

// For Missão/Cenário
export type MissionItemType = BaseGeneratedItem & {
    title: string;
    logline: string;
    summary: string;
    objectives: string[];
    complications: string[];
    failure_states: string[];
    rewards: string[];
    numberOfSessions: number;
    environment: string;
    protagonist_desc?: {
        silhouette: string; face: string; attire: string; movement: string; defining_feature: string;
    };
    oni_desc?: {
        scale: string; skin: string; appendages: string; eyes: string; sound_smell: string; mystic_sign: string;
    };
    demonBloodArtType?: string;
    key_npcs: MissionNPC[];
    relevant_items: MissionItem[];
    scaling_hooks: string;
    tone_variations?: Record<string, string>;
    sensitive_flags: string[];
    micro_variants: string[];
    tone?: Tone;
};

// For NPC
export type NpcItem = BaseGeneratedItem & {
    descricao: string;
    role: string;
    profession: string;
    origem: string;
    voice_and_mannerisms: string;
    inventory_focal: string;
    motivation: string;
    secret: string;
    relationship_to_pcs: string;
    ganchos_narrativos: string[];
    dialogue_lines: string[];
};

// For World Building
export type WorldBuildingItem = BaseGeneratedItem & {
    plot_threads: { title: string; description: string; }[];
    adventure_hooks: string[];
    key_npcs_wb: { name: string; role: string; description: string; }[];
    points_of_interest: { name: string; type: string; description: string; }[];
    mini_missions: { title: string; objective: string; reward: string; }[];
};

// The main union type for any generated item
export type GeneratedItem =
    & BaseGeneratedItem
    & Partial<GenericItem>
    & Partial<HunterItem>
    & Partial<OniItem>
    & Partial<BreathingFormItem>
    & Partial<LocationItem>
    & Partial<MissionItemType>
    & Partial<NpcItem>
    & Partial<WorldBuildingItem>;

// --- Prompt Engineering Panel Types ---
export type MidjourneyParameter<T> = {
    active: boolean;
    value: T;
};

export type MidjourneyParameters = {
    aspectRatio: MidjourneyParameter<string>;
    chaos: MidjourneyParameter<number>;
    quality: MidjourneyParameter<number>;
    style: MidjourneyParameter<string>;
    stylize: MidjourneyParameter<number>;
    weird: MidjourneyParameter<number>;
    version: MidjourneyParameter<string>;
};

export type GptParameters = {
    tone: string;
    style: string;
    composition: string;
};

export type PromptGenerationResult = {
    midjourneyPrompt: string;
    gptPrompt: string;
};