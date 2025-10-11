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
  rarity: Rarity;
  era: Era;
  missionTone: Tone;
  intensity: number;
  missionScale: 'local' | 'regional' | 'nacional' | 'cósmico';
  protagonist: string;
  targets: string;
  moodModifiers: string;
  baseBreathingStyle: string;
  kekkijutsuInspiration: string;
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
  createdAt: string;
  nome: string;
  categoria: Category;
  raridade: Rarity;
  nivel_sugerido: number;
  descricao_curta: string;
  descricao: string;
  ganchos_narrativos?: string | string[];
  // This allows for the wide variety of fields from the API
  [key: string]: any;
}

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
