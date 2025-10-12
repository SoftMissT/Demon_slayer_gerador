// FIX: Populated with full constant definitions to resolve module errors.
import type { Category, Rarity, Era, Tone, FilterState } from './types';

export const CATEGORIES: Category[] = [
    'Caçador', 'Inimigo/Oni', 'NPC', 'Arma', 'Acessório', 'Forma de Respiração', 'Kekkijutsu', 'Local/Cenário', 'Missão/Cenário', 'World Building'
];

export const RARITIES: Rarity[] = ['Aleatória', 'Comum', 'Incomum', 'Raro', 'Épico', 'Lendário', 'Amaldiçoado'];

export const ERAS: Era[] = [
    'Aleatória',
    'Período Edo (Japão Feudal)',
    'Medieval Fantasia',
    'Steampunk',
    'Cyberpunk',
    'Pós-apocalíptico',
    'Tempos Atuais',
    'Futurista (Sci-Fi)',
    'Biopunk'
];

export const TONES: Tone[] = ['épico', 'sombrio', 'misterioso', 'aventuresco', 'cômico', 'trágico', 'esperançoso'];

export const DEMON_BLOOD_ARTS: string[] = [
    'Aleatória', 'Manipulação de Sangue', 'Fios de Seda', 'Tambores de Impacto', 'Flechas Vetoriais', 'Teias de Aranha', 'Ilusões Mortais', 'Sonhos Manipulados', 'Absorção de Poder', 'Crioquinese', 'Pirocinese', 'Regeneração Acelerada', 'Clones de Carne', 'Manipulação de Esporos', 'Venenos e Toxinas'
];

export const PERSONALITIES: string[] = [
    'Aleatória', 'Honrado', 'Sombrio', 'Caótico', 'Leal', 'Enganador', 'Corajoso', 'Covarde', 'Sábio', 'Tolo', 'Arrogante', 'Humilde', 'Vingativo', 'Piedoso'
];

export const METAL_COLORS: string[] = [
    'Aleatória', 'Preto (Absorção Solar)', 'Vermelho (Chamas)', 'Amarelo (Trovão)', 'Azul (Água)', 'Verde (Vento)', 'Rosa (Amor)', 'Cinza (Besta)', 'Branco (Névoa)', 'Lavanda (Serpente)', 'Índigo (Som)'
];

export const COUNTRIES: string[] = [
    'Aleatório', 'Japão', 'China', 'Coreia', 'Índia', 'Egito', 'Grécia', 'Roma', 'Nórdico (Viking)', 'Celta', 'Arábia', 'Pérsia', 'Asteca', 'Maia'
];

export const TERRAINS: string[] = [
    'Aleatória', 'Floresta Densa', 'Montanhas Rochosas', 'Pântano Nebuloso', 'Cidade Assombrada', 'Templo Antigo', 'Caverna de Cristal', 'Vulcão Ativo', 'Planície Nevada', 'Deserto de Areia Negra'
];

export const THREAT_SCALES: string[] = [
    'Aleatória', 'Conflito Local', 'Guerra Regional', 'Ameaça Nacional', 'Crise Continental', 'Perigo Global', 'Evento de Extinção'
];

export const ORIGINS: string[] = [
    'Aleatória', 'Clã de Ferreiros', 'Família de Caçadores', 'Templo de Monges', 'Nobreza Caída', 'Sobrevivente de Massacre', 'Criação de Oni', 'Experimento Alquímico', 'Pacto Sobrenatural', 'Viajante Dimensional'
];

export const ONI_POWER_LEVELS: string[] = [
    'Aleatório', 'Oni Comum', 'Oni de Elite', 'Lua Inferior', 'Lua Superior', 'Classe Muzan'
];

export const INITIAL_FILTERS: FilterState = {
    category: '',
    // Hunter
    hunterEra: 'Aleatória',
    hunterCountry: 'Aleatório',
    hunterOrigin: 'Aleatória',
    hunterArchetype: 'Aleatória',
    hunterPersonality: 'Aleatória',
    hunterWeapon: 'Aleatório',
    hunterBreathingStyles: [],
    hunterAccessory: 'Aleatório',
    // Oni
    oniPowerLevel: 'Aleatório',
    oniCountry: 'Aleatório',
    oniWeapon: 'Aleatório',
    oniInspirationKekkijutsu: 'Aleatória',
    oniInspirationBreathing: 'Nenhuma',
    oniPersonality: 'Aleatória',
    // NPC
    npcEra: 'Aleatória',
    npcCountry: 'Aleatório',
    npcOrigin: 'Aleatória',
    npcProfession: 'Aleatória',
    npcPersonality: 'Aleatória',
    npcWeapon: 'Aleatório',
    // Weapon
    weaponRarity: 'Aleatória',
    weaponEra: 'Aleatória',
    weaponCountry: 'Aleatório',
    weaponType: 'Aleatório',
    weaponMetalColor: 'Aleatório',
    // Accessory
    accessoryRarity: 'Aleatória',
    accessoryEra: 'Aleatória',
    accessoryOrigin: 'Aleatória',
    accessoryBreathingInspiration: 'Nenhuma',
    accessoryKekkijutsuInspiration: 'Nenhuma',
    accessoryWeaponInspiration: 'Nenhuma',
    // Breathing Form
    baseBreathingStyles: [],
    breathingFormEra: 'Aleatória',
    breathingFormCountry: 'Aleatório',
    breathingFormOrigin: 'Aleatória',
    breathingFormTone: 'épico',
    breathingFormWeapon: 'Aleatório',
    breathingFormArchetype: 'Aleatório',
    // Kekkijutsu
    kekkijutsuEra: 'Aleatória',
    kekkijutsuCountry: 'Aleatório',
    kekkijutsuKekkijutsuInspiration: 'Aleatória',
    kekkijutsuBreathingInspiration: 'Nenhuma',
    kekkijutsuWeaponInspiration: 'Nenhuma',
    // Location
    locationTone: 'misterioso',
    locationEra: 'Aleatória',
    locationCountry: 'Aleatório',
    locationTerrain: 'Aleatório',
    // Mission
    missionTone: 'sombrio',
    intensity: 3,
    missionScale: 'local',
    protagonist: '',
    targets: '',
    moodModifiers: '',
    // World Building
    wbTone: 'épico',
    wbEra: 'Aleatória',
    wbCountry: 'Aleatório',
    wbThreatScale: 'Aleatória',
    wbLocation: '',
};
