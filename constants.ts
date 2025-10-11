
import type { Category, Rarity, Era, Tone } from './types';

export const CATEGORIES: Category[] = [
  'Aleatória',
  'Arma',
  'Acessório',
  'Caçador',
  'Inimigo/Oni',
  'Classe/Origem',
  'Forma de Respiração',
  'Kekkijutsu',
  'Local/Cenário',
  'Missão/Cenário'
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
