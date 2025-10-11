


import type { Category, Rarity, Era, Tone } from './types';

export const CATEGORIES: Category[] = [
  'Aleatória',
  'Arma',
  'Acessório',
  'Caçador',
  'Inimigo/Oni',
  'Forma de Respiração',
  'Kekkijutsu',
  'Local/Cenário',
  'Missão/Cenário',
  'NPC',
  'World Building'
];

export const RARITIES: Rarity[] = [
  'Aleatória',
  'Comum',
  'Incomum',
  'Raro',
  'Épico',
  'Lendário',
  'Amaldiçoado'
];

export const ERAS: Era[] = [
  'Aleatória',
  'Período Edo (Japão Feudal)',
  'Medieval Fantasia',
  'Steampunk',
  'Cyberpunk',
  'Pós-apocalíptico',
  'Moderno',
  'Tempos Atuais',
  'Futurista (Sci-Fi)',
  'Biopunk'
];

export const TONES: Tone[] = [
    'investigação',
    'terror',
    'ação',
    'drama',
    'mistério',
    'aventura',
    'político'
];

export const PERSONALITIES: string[] = ['Aleatória', 'Sombrio e Silencioso', 'Otimista e Barulhento', 'Calmo e Analítico', 'Impulsivo e Feroz', 'Disciplinado e Austero', 'Gentil e Protetor'];
export const METAL_COLORS: string[] = ['Aleatória', 'Aço Nichirin Padrão', 'Vermelho Carmesim Brilhante', 'Azul Cobalto Profundo', 'Preto Obsidiana Fosco', 'Branco Lunar Perolado', 'Verde Jade Translúcido', 'Amarelo Dourado Elétrico', 'Roxo Ametista Sombrio'];
export const COUNTRIES: string[] = ['Aleatório', 'Japão (Padrão)', 'China Imperial', 'Europa Medieval', 'Império Russo', 'Egito Antigo', 'Pérsia', 'Escandinávia Viking'];
export const TERRAINS: string[] = ['Aleatório', 'Floresta Densa', 'Montanhas Rochosas', 'Planícies Abertas', 'Pântano Nebuloso', 'Cidade Murada', 'Vila Costeira', 'Cavernas Subterrâneas', 'Deserto de Areia Negra'];

export const RELATIONS: string[] = ['Aleatória', 'Amigo', 'Inimigo', 'Neutro', 'Mentor', 'Contato'];
export const DETAIL_LEVELS: string[] = ['Médio', 'Baixo', 'Alto'];

export const ORIGINS: string[] = [
    'Aleatória',
    'Tsuguko (Discípulo de Hashira)',
    'Samurai',
    'Ninja',
    'Isolado',
    'Civilizado',
    'Descendente Perdido',
    'Estrangeiro',
    'Monge',
    'Criado por Ex-Hashira'
];

export const ONI_POWER_LEVELS: string[] = ['Aleatório', 'Minion', 'Médio', 'Lua Inferior', 'Lua Minguante', 'Lua Superior'];

// Sample data for Demon Blood Arts as it's not provided elsewhere.
export const DEMON_BLOOD_ARTS: string[] = [
    "Manipulação de Sangue",
    "Fios Cortantes",
    "Ilusões Espaciais",
    "Controle de Sombras",
    "Gelo Eterno",
    "Chamas Negras",
    "Metamorfose Corporal",
    "Espinhos Ósseos",
    "Névoa Venenosa",
    "Criação de Marionetes",
    "Absorção de Vida",
    "Gravitocinese",
    "Desintegração Molecular",
    "Cúpula Dimensional"
];