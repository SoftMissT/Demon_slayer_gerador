// types.ts

export type AppView = 'forge' | 'alchemist';

export interface User {
  id: string;
  username: string;
  avatar: string;
}

export const CATEGORIES = [
    'Aleatório', 'Arma', 'Acessório', 'Caçador', 'Inimigo/Oni', 'Kekkijutsu', 'Respiração', 'Missões', 'NPC', 'Evento', 'Local/Cenário'
] as const;
export type Category = typeof CATEGORIES[number];

export const RARITIES = ['Aleatória', 'Comum', 'Incomum', 'Rara', 'Épica', 'Lendária'] as const;
export type Rarity = typeof RARITIES[number];

export type Tematica = 
    | 'Aleatória'
    | 'Período Edo (Japão Feudal)'
    | 'Medieval Fantasia'
    | 'Steampunk'
    | 'Cyberpunk'
    | 'Pós-apocalíptico'
    | 'Moderno'
    | 'Tempos Atuais'
    | 'Futurista (Sci-Fi)'
    | 'Biopunk'
    | 'Shogunato Cibernético'
    | 'DOS CAÇADORES DE SOMBRAS'
    | '⚔️ DOS DEUSES CAÍDOS'
    | '🕵️‍♂️ DO JAZZ & OCULTISMO'
    | '⚗️ DA REVOLUÇÃO INDUSTRIAL OCULTA'
    | '🤠 VELHO OESTE SOLAR'
    | '🏴‍☠️ DOS IMPÉRIOS FLUTUANTES'
    | '🏜️ DO SAARA ETERNO'
    | '🎭 DOS CINCO REINOS (WUXIA/XIANXIA)'
    | '🧙 DA ALVORADA ANCESTRAL'
    | '🧬 DO JARDIM PROIBIDO (BIOPUNK ORGÂNICO)'
    | 'Neon-Noir Megacidade'
    | '💠 DA INFOCRACIA'
    | '🌃 DO RENASCIMENTO SOMBRIO'
    | '🌃 DO SUBMUNDO NOTURNO'
    | 'Mythpunk Amazônico'
    | 'Ártico Steampunk'
    | '🌌 DOS CINZÁRIOS (PÓS-APOCALÍPTICO MÍSTICO)'
    | '🧟 DA QUEDA DOS REINOS'
    | '🤖 DA SINGULARIDADE (PÓS-HUMANA)';

export interface FilterState {
  category: Category;
  subCategory: string;
  hunterWeapon: string;
  quantity: number;
  tematica: string;
  origins: string[];
  breathingStyles: string[];
  professions: string[];
  rarity: Rarity;
  level: number;
  suggestedPrice: number;
  promptModifier: string;
  styleReferences: string;
  aiFocusGemini: string;
  aiFocusGpt: string;
  aiFocusDeepSeek: string;
}

export interface AIFlags {
    useGemini: boolean;
    useGpt: boolean;
    useDeepSeek: boolean;
}

export interface ProvenanceEntry {
  step: string;
  model: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  reason?: string;
}

export interface Kekkijutsu {
    nome: string;
    descricao: string;
}

interface BaseGeneratedItem {
  id: string;
  createdAt: string;
  categoria: Category;
  nome: string;
  title?: string;
  descricao_curta: string;
  descricao: string;
  raridade: string;
  nivel_sugerido: number;
  preco_sugerido?: number;
  ganchos_narrativos: string[] | string;
  imagePromptDescription?: string;
  provenance: ProvenanceEntry[];
}

export interface GeneratedWeapon extends BaseGeneratedItem {
    categoria: 'Arma' | 'Acessório';
    dano?: string;
    dados?: string;
    tipo_de_dano?: string;
    status_aplicado?: string;
    efeitos_secundarios?: string;
}

export interface GeneratedHunter extends BaseGeneratedItem {
    categoria: 'Caçador' | 'NPC';
    classe?: string;
    personalidade?: string;
    background?: string;
}

export interface GeneratedOni extends BaseGeneratedItem {
    categoria: 'Inimigo/Oni';
    power_level?: string;
    kekkijutsu?: Kekkijutsu;
    comportamento_combate?: string[];
}

export type GeneratedItem = BaseGeneratedItem | GeneratedWeapon | GeneratedHunter | GeneratedOni;

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
        negativePrompt?: string;
        mjParams: MidjourneyParameters;
        gptParams: GptParameters;
        geminiParams: GeminiParameters;
        generateFor: {
            midjourney: boolean;
            gpt: boolean;
            gemini: boolean;
        };
    };
    outputs: PromptGenerationResult;
}

export type HistoryItem = GeneratedItem | AlchemyHistoryItem;
export type FavoriteItem = GeneratedItem | AlchemyHistoryItem;