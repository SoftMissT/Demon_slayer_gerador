// FIX: Populated types.ts with comprehensive type definitions to resolve module and type errors across the application.

// From constants.ts
export type Category = 
    'Caçador' | 'Inimigo/Oni' | 'NPC' | 'Arma' | 'Acessório' | 
    'Forma de Respiração' | 'Kekkijutsu' | 'Local/Cenário' | 
    'Missões' | 'World Building' | 'Evento';

export type Rarity = 'Aleatória' | 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Amaldiçoado' | 'N/A';

export type Tematica = 
    'Aleatória' | 'Período Edo (Japão Feudal)' | 'Medieval Fantasia' | 'Steampunk' | 
    'Cyberpunk' | 'Pós-apocalípico' | 'Tempos Atuais' | 'Futurista (Sci-Fi)' | 
    'Biopunk' | '🧭 JOSEON (Coreia Histórica Expandida)' | '🤠 VELHO OESTE SOLAR' | 
    'DOS CAÇADORES DE SOMBRAS' | '🏴‍☠️ DOS IMPÉRIOS FLUTUANTES' | '🕵️‍♂️ DO JAZZ & OCULTISMO' |
    '🧪 DO COLONIALISMO DE ALQUIMIA' | '🌌 DOS CINZÁRIOS (PÓS-APOCALÍPTICO MÍSTICO)' |
    '🤖 DA SINGULARIDADE (PÓS-HUMANA)' | '🧬 DO JARDIM PROIBIDO (BIOPUNK ORGÂNICO)' |
    '🛸 DO CREPÚSCULO CÓSMICO' | '💠 DA INFOCRACIA' | '🎭 DOS CINCO REINOS (WUXIA/XIANXIA)' |
    '🌃 DO SUBMUNDO NOTURNO' | '🧙 DA ALVORADA ANCESTRAL' | '🏜️ DO SAARA ETERNO' |
    '🧟 DA QUEDA DOS REINOS' | '🚪 DOS PORTAIS ESQUECIDOS' | '🪐 DA FRONTEIRA ESTELAR' |
    '🌌 DO ETERNO CREPÚSCULO' | '⚗️ DA REVOLUÇÃO INDUSTRIAL OCULTA' | '🎭 DOS CARNAVAIS SANGUE' |
    '🌃 DO RENASCIMENTO SOMBRIO' | '⚔️ DOS DEUSES CAÍDOS' | '🛸 DA COLONIZAÇÃO INTERGALÁTICA' |
    'Neon-Noir Megacidade' | 'Mythpunk Amazônico' | 'Shogunato Cibernético' | 
    'Coralpunk Oceânico' | 'Retro-Futuro 1950s' | 'Ártico Steampunk' | 
    'Paisagem dos Sonhos (Surreal)' | 'Tecno-Xamanismo';

export type Tone = 'épico' | 'sombrio' | 'misterioso' | 'aventuresco' | 'cômico' | 'trágico' | 'esperançoso';

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

export interface FilterPreset {
    name: string;
    filters: FilterState;
}

// From DetailPanel.tsx, etc.
interface BaseItem {
    id: string;
    nome: string;
    categoria: Category;
    tematica: string;
    descricao_curta: string;
    descricao: string;
    imagePromptDescription?: string;
    raridade: Rarity;
    nivel_sugerido: number;
    createdAt: string;
    ganchos_narrativos?: string[] | string;
    provenance?: any[];
}

export interface WeaponItem extends BaseItem {
    categoria: 'Arma' | 'Acessório';
    dano: string;
    dados: string;
    tipo_de_dano: string;
    status_aplicado: string;
    efeitos_secundarios: string;
}

export interface KekkijutsuItem extends BaseItem {
    categoria: 'Kekkijutsu';
    dano: string;
    dados: string;
    tipo_de_dano: string;
    status_aplicado: string;
    efeitos_secundarios: string;
}

export interface HunterItem extends BaseItem {
    categoria: 'Caçador';
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
    uso_em_cena: string[];
}

export interface OniItem extends BaseItem {
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

export interface NpcItem extends BaseItem {
    categoria: 'NPC';
    origem: string;
    voice_and_mannerisms: string;
    inventory_focal: string;
    motivation: string;
    secret: string;
    dialogue_lines: string[];
    profession?: string;
    role?: string;
    relationship_to_pcs?: string;
}

export interface BreathingFormItem extends BaseItem {
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
        initial_test: {
            type: string;
            dc_formula: string;
        };
        on_success_target: string;
        on_fail_target: string;
        damage_formula_rank: Record<string, string>;
    };
    level_scaling?: Record<string, any>;
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

export interface MissionItemDetails extends BaseItem {
    categoria: 'Missões';
    title: string;
    tone?: string;
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
}

export interface WorldBuildingItem extends BaseItem {
    categoria: 'World Building';
    plot_threads: { title: string; description: string }[];
    adventure_hooks: string[];
    key_npcs_wb: { name: string; role: string; description: string }[];
    points_of_interest: { name: string; type: string; description: string }[];
    mini_missions: { title: string; objective: string; reward: string }[];
    faccoes_internas: { nome: string; objetivo: string; descricao: string }[];
    ameacas_externas: { nome: string; tipo: string; descricao: string }[];
    tradicoes_culturais: string[];
    eventos_historicos_chave: { evento: string; impacto: string }[];
    misterios_segredos: string[];
}

export interface LocationItem extends BaseItem {
    categoria: 'Local/Cenário';
}

export interface EventItem extends BaseItem {
    categoria: 'Evento';
    level: string;
    threatLevel: string;
    eventType: string;
    consequencias: string[];
    participantes_chave: { nome: string; papel: string }[];
}

export type GeneratedItem =
// FIX: Removed BaseItem from the union to make it a strict discriminated union.
// This allows TypeScript to correctly narrow types based on the 'categoria' property,
// resolving type errors in the DetailPanel component.
    | WeaponItem
    | KekkijutsuItem
    | HunterItem
    | OniItem
    | NpcItem
    | BreathingFormItem
    | MissionItemDetails
    | WorldBuildingItem
    | LocationItem
    | EventItem;


// For PromptEngineeringPanel / Alquimia
export interface MidjourneyParameter<T> {
    value: T;
    active: boolean;
}

export interface MidjourneyParameters {
    aspectRatio: MidjourneyParameter<string>;
    version: MidjourneyParameter<string>;
    style: MidjourneyParameter<string>;
    stylize: MidjourneyParameter<number>;
    chaos: MidjourneyParameter<number>;
    quality: MidjourneyParameter<number>;
    weird: MidjourneyParameter<number>;
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