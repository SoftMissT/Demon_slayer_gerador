import type { GenerationType, GripType, Rarity, AccessoryType, ArmaduraType, ItemDeAuxilioType, ConsumableType, ArchetypeType, SkillType } from './types';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';

export const GENERATION_TYPES: GenerationType[] = [
  'Forma de Respiração',
  'Kekkijutsu',
  'Arquétipo/Habilidade',
  'Arma',
  'Armadura',
  'Acessório',
  'Item de Auxílio',
  'Item Consumível',
  'Missão',
  'Inimigo/Oni',
  'Classe/Origem',
  'Caçador',
  'Híbrido Humano-Oni',
  'NPC',
  'Local/Cenário',
];

export const ARCHETYPE_TYPES: ArchetypeType[] = [
    'GUERREIRO',
    'ALQUIMISTA',
    'ESCUDEIRO'
];

export const SKILL_TYPES: { [key in ArchetypeType]: SkillType[] } = {
    GUERREIRO: ['Kenshi', 'Bujin', 'Kyūshi'],
    ALQUIMISTA: ['Kajiya', 'Curandeiro', 'Dokugakusha', 'Ritualista'],
    ESCUDEIRO: ['Tate', 'Ishibumi', 'Shugo', 'Paladino'],
};

export const ARMADURA_TYPES: ArmaduraType[] = [
    'Armadura Leve',
    'Armadura Pesada',
    'Uniforme dos Caçadores de Onis'
];

export const ITEM_DE_AUXILIO_TYPES: ItemDeAuxilioType[] = [
    'Luva Yugake',
    'Kit Marcial'
];

export const CONSUMABLE_TYPES: ConsumableType[] = [
    'Venenos',
    'Medicamentos',
    'Bandagens',
    'Cantil',
    'Kit Cirúrgico',
    'Saco de Dormir',
    'Bomba Explosiva',
    'Injeção de Adrenalina',
    'Munição de Armas',
    'Metal Ancestral',
    'Vidro de Sol',
    'Tinta Especial Hamaki'
];

export const BREATHING_STYLES: string[] = BREATHING_STYLES_DATA.map(style => style.nome);

export const WEAPON_TYPES: string[] = [
  'Alabarda',
  'Arco Composto',
  'Arco Longo',
  'Arco Longo (Yumi)',
  'Arma do Espírito',
  'Bacalhau (Mace)',
  'Báculo',
  'Baioneta',
  'Balas de Ultravioleta',
  'Balestra',
  'Balestra de Repetição',
  'Bastão Retrátil',
  'Bō',
  'Bō Segmentado',
  'Chakram',
  'Chicote',
  'Cimitarra',
  'Cutelos Gêmeos',
  'Dao (Sabre Chinês)',
  'Double Blade',
  'Escopeta Cano Duplo',
  'Escudo de Batalha',
  'Espada de Lumen',
  'Espada de Sion',
  'Espada Longa',
  'Espada Ondular',
  'Faca Bowie',
  'Foice',
  'Fuuma Shuriken',
  'Guandao (Alabarda Chinesa)',
  'Hook Shuang',
  'Hwando (Sabre Coreano)',
  'Hwandudaedo (Espada Coreana)',
  'Ioiô de Lâmina',
  'Jambiya',
  'Jian (Espada Chinesa Reta)',
  'Kama',
  'Kanabō',
  'Katana',
  'Katana chicote',
  'Katana Ferrão',
  'Katana Serrilhada',
  'Kunai',
  'Kusarigama',
  'Lança (Rumh)',
  'Machado de Batalha',
  'Macuahuitl',
  'Manoplas / Soqueiras',
  'Montante',
  'Nagamaki',
  'Naginata',
  'Ngalo',
  'Nichirin Blades (Variadas)',
  'Nodachi/Ōdachi',
  'Nunchaku',
  'Ono & Mangual',
  'Ōtsuchi',
  'Pistolas Automáticas Híbridas',
  'Punho de Aço',
  'Qiang (Lança Chinesa)',
  'Rapieira',
  'Revólver',
  'Rifle',
  'Rifle Murata',
  'runkah',
  'Shamshir',
  'Shotel',
  'Shuriken',
  'Sicrimos',
  'Tantō',
  'Tepoztopilli',
  'Tessen',
  'Tetsubo',
  'Tomahawk',
  'Wakizashi',
  'Woldo (Alabarda Coreana)',
  'Yari',
  'Zweihänder',
];

export const GRIP_TYPES: GripType[] = [
  'Ittō-ryū',
  'Nitō-ryū',
  'Ryōtō',
  'Battōjutsu',
  'Kyūdō',
  'Taijutsu',
];

export const THEMATIC_TONES: string[] = [
  'Sombrio', 'Épico', 'Cômico', 'Misterioso', 'Heroico', 'Trágico'
];

export const ERAS: string[] = [
  'Período Edo (Japão Feudal)',
  'Cyberpunk',
  'Medieval Fantasia',
  'Steampunk',
  'Biopunk',
  'Moderno',
  'Futurista (Sci-Fi)',
  'Tempos Atuais',
  'Pós-apocalíptico',
];

export const RARITIES: Rarity[] = ['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário', 'Amaldiçoado'];

export const ACCESSORY_TYPES: AccessoryType[] = [
    'Kimono', 
    'Brinco', 
    'Pulseira', 
    'Bainha', 
    'Haori', 
    'Máscara', 
    'Chapéu',
    'Talisman', 
    'Sandálias de Palha (Waraji)', 
    'Faixa Espiritual (Obi)', 
    'Guarda de Espada (Tsuba)', 
    'Colar de Foco (Magatama)', 
    'Luvas de Oni', 
    'Patuá de Caçador', 
    'Capa de Neblina'
];

export const KEKKIJUTSU_TYPES: string[] = [
  'Manipulação de Sangue',
  'Criação de Gelo',
  'Teias de Aranha',
  'Fios Cortantes',
  'Ilusões Mortais',
  'Explosões de Sangue',
  'Manipulação de Ossos',
  'Controle de Plantas Venenosas',
  'Absorção de Vida',
  'Sombras Vivas',
  'Metamorfose Corporal',
  'Cristalização',
  'Gravitocinese',
  'Pirocinese Negra',
];