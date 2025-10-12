// FIX: Corrected type imports from the now separate types.ts file.
import type { Category, Rarity, Era, Tone, FilterState } from './types';

export const CATEGORIES: Category[] = [
  'Caçador',
  'Inimigo/Oni',
  'NPC',
  'Arma',
  'Acessório',
  'Forma de Respiração',
  'Kekkijutsu',
  'Local/Cenário',
  'Missão/Cenário',
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
  'Era Joseon',
  'Velho Oeste',
  'Medieval Fantasia',
  'Steampunk',
  'Cyberpunk',
  'Pós-apocalíptico',
  'Moderno',
  'Tempos Atuais',
  'Futurista (Sci-Fi)',
  'Biopunk',
  'ERA DOS CINCO REINOS',
  'ERA DA INFOCRACIA',
  'ERA DO CREPÚSCULO CÓSMICO',
  'ERA DO JARDIM PROIBIDO (BIOPUNK ORGÂNICO)',
  'ERA DA SINGULARIDADE (PÓS-HUMANA)',
  'ERA DOS CINZÁRIOS (PÓS-APOCALÍPTICO MÍSTICO)',
  'ERA DO COLONIALISMO DE ALQUIMIA',
  'ERA DO JAZZ & OCULTISMO',
  'ERA DOS CAÇADORES DE SOMBRAS',
  'VELHO OESTE SOLAR',
  'ERA DO SUBMUNDO NOTURNO',
  'ERA DA ALVORADA ANCESTRAL',
  'ERA DO SAARA ETERNO',
  'ERA DA QUEDA DOS REINOS',
  'ERA DOS PORTAIS ESQUECIDOS',
  'ERA DA FRONTEIRA ESTELAR',
  'ERA DO ETERNO CREPÚSCULO',
  'ERA DA REVOLUÇÃO INDUSTRIAL OCULTA',
  'ERA DOS CARNAVAIS SANGUE',
  'ERA DO RENASCIMENTO SOMBRIO',
  'ERA DOS DEUSES CAÍDOS',
  // FIX: Corrected the string literal to match the 'Era' type definition, resolving a type error likely caused by an invisible character.
  'ERA DA COLONIZAÇÃO INTERGALÁTICA'
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
export const COUNTRIES: string[] = [
    'Aleatório', 
    'Japão (Padrão)', 
    'China Imperial', 
    'Coreia (Era Joseon)',
    'Europa Medieval', 
    'Velho Oeste Americano',
    'Império Russo', 
    'Egito Antigo', 
    'Pérsia Mística', 
    'Escandinávia Viking',
    'Império Romano',
    'Grécia Antiga',
    'Brasil Colonial',
    'Índia Mística',
    'Terras Árabes (Mil e Uma Noites)',
    'Reino Africano (Wakanda-like)',
    'Ilhas Polinésias'
];
export const TERRAINS: string[] = ['Aleatório', 'Floresta Densa', 'Montanhas Rochosas', 'Planícies Abertas', 'Pântano Nebuloso', 'Cidade Murada', 'Vila Costeira', 'Cavernas Subterrâneas', 'Deserto de Areia Negra'];
export const ACCESSORY_TYPES: string[] = ['Aleatória', 'Máscara', 'Brinco', 'Colar', 'Capa', 'Haori Especial', 'Amuleto'];
export const THREAT_SCALES: string[] = ['Aleatória', 'Conflito Local', 'Guerra Regional', 'Ameaça Global', 'Crise Existencial'];

export const RELATIONS: string[] = ['Aleatória', 'Amigo', 'Inimigo', 'Neutro', 'Mentor', 'Contato'];
export const DETAIL_LEVELS: string[] = ['Médio', 'Baixo', 'Alto'];

export const ORIGINS: string[] = [
    'Aleatória',
    'Tsuguko (Discípulo de Hashira)',
    'Samurai',
    'Ninja',
    'Isolado',
    'Civilizado',
  'Slayer Corrompido',
    'Descendente Perdido',
    'Estrangeiro',
    'Monge',
    'Criado por Ex-Hashira'
];

export const ONI_POWER_LEVELS: string[] = ['Aleatório', 'Minion', 'Médio', 'Lua Inferior', 'Lua Minguante', 'Lua Superior'];

// Sample data for Demon Blood Arts as it's not provided elsewhere.
export const DEMON_BLOOD_ARTS: string[] = [
    "Nenhuma",
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

export const INITIAL_FILTERS: FilterState = {
  category: '',
  hunterWeapon: 'Aleatória',
  hunterBreathingStyles: [],
  hunterAccessory: 'Aleatória',
  hunterEra: 'Aleatória',
  hunterPersonality: 'Aleatória',
  hunterOrigin: 'Aleatória',
  hunterArchetype: 'Aleatória',
  hunterCountry: 'Aleatório',
  accessoryRarity: 'Aleatória',
  accessoryEra: 'Aleatória',
  accessoryKekkijutsuInspiration: 'Nenhuma',
  accessoryBreathingInspiration: 'Nenhuma',
  accessoryWeaponInspiration: 'Nenhuma',
  accessoryOrigin: 'Aleatória',
  weaponRarity: 'Aleatória',
  weaponMetalColor: 'Aleatória',
  weaponEra: 'Aleatória',
  weaponType: 'Aleatória',
  weaponCountry: 'Aleatório',
  locationTone: 'aventura',
  locationCountry: 'Aleatório',
  locationEra: 'Aleatória',
  locationTerrain: 'Aleatório',
  wbTone: 'aventura',
  wbCountry: 'Aleatório',
  wbEra: 'Aleatória',
  wbThreatScale: 'Aleatória',
  wbLocation: 'Aleatória',
  breathingFormEra: 'Aleatória',
  breathingFormWeapon: 'Aleatória',
  baseBreathingStyles: [],
  breathingFormTone: 'ação',
  breathingFormOrigin: 'Aleatória',
  breathingFormArchetype: 'Aleatória',
  breathingFormCountry: 'Aleatório',
  kekkijutsuEra: 'Aleatória',
  kekkijutsuKekkijutsuInspiration: 'Nenhuma',
  kekkijutsuBreathingInspiration: 'Nenhuma',
  kekkijutsuWeaponInspiration: 'Nenhuma',
  kekkijutsuCountry: 'Aleatório',
  npcOrigin: 'Aleatória',
  npcProfession: 'Aleatória',
  npcEra: 'Aleatória',
  npcPersonality: 'Aleatória',
  npcWeapon: 'Aleatória',
  npcCountry: 'Aleatório',
  oniPowerLevel: 'Aleatório',
  oniInspirationKekkijutsu: 'Nenhuma',
  oniInspirationBreathing: 'Nenhuma',
  oniWeapon: 'Aleatória',
  oniCountry: 'Aleatório',
  oniPersonality: 'Aleatória',
  missionTone: 'mistério',
  intensity: 3,
  missionScale: 'local',
  protagonist: 'Um caçador recém-formado com um passado misterioso.',
  targets: 'Um oni que se esconde em uma vila isolada.',
  moodModifiers: 'chuvoso, sombrio, silencioso',
};