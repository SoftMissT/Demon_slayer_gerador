
export type GenerationType =
  | 'Forma de Respiração'
  | 'Kekkijutsu'
  | 'Arquétipo/Habilidade'
  | 'Arma'
  | 'Armadura'
  | 'Acessório'
  | 'Item de Auxílio'
  | 'Item Consumível'
  | 'Missão'
  | 'Inimigo/Oni'
  | 'Classe/Origem'
  | 'Caçador'
  | 'Híbrido Humano-Oni'
  | 'NPC'
  | 'Local/Cenário';

export type GripType = 'Ittō-ryū' | 'Nitō-ryū' | 'Ryōtō' | 'Battōjutsu' | 'Kyūdō' | 'Taijutsu' | '';

export type Rarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Amaldiçoado';

export type AccessoryType = 
    'Kimono' | 
    'Brinco' | 
    'Pulseira' | 
    'Bainha' | 
    'Haori' | 
    'Máscara' | 
    'Chapéu' |
    'Talisman' | 
    'Sandálias de Palha (Waraji)' | 
    'Faixa Espiritual (Obi)' | 
    'Guarda de Espada (Tsuba)' | 
    'Colar de Foco (Magatama)' | 
    'Luvas de Oni' | 
    'Patuá de Caçador' | 
    'Capa de Neblina' |
    '';

export type ArmaduraType =
    'Armadura Leve' |
    'Armadura Pesada' |
    'Uniforme dos Caçadores de Onis' |
    '';

export type ItemDeAuxilioType =
    'Luva Yugake' |
    'Kit Marcial' |
    '';

export type ConsumableType =
    'Venenos' |
    'Medicamentos' |
    'Bandagens' |
    'Cantil' |
    'Kit Cirúrgico' |
    'Saco de Dormir' |
    'Bomba Explosiva' |
    'Injeção de Adrenalina' |
    'Munição de Armas' |
    'Metal Ancestral' |
    'Vidro de Sol' |
    'Tinta Especial Hamaki' |
    '';
    
export type ArchetypeType = 'GUERREIRO' | 'ALQUIMISTA' | 'ESCUDEIRO' | '';

export type SkillType = 
    'Kenshi' | 'Bujin' | 'Kyūshi' |
    'Kajiya' | 'Curandeiro' | 'Dokugakusha' | 'Ritualista' |
    'Tate' | 'Ishibumi' | 'Shugo' | 'Paladino' | '';

export type AiModel = 'Gemini' | 'OpenAI';

export interface FilterState {
  generationType: GenerationType | '';
  aiModel: AiModel;
  archetypeType: ArchetypeType;
  skillType: SkillType;
  kekkijutsu: string;
  accessoryType: AccessoryType;
  armaduraType: ArmaduraType;
  itemDeAuxilioType: ItemDeAuxilioType;
  consumableType: ConsumableType;
  breathingBase: string;
  weaponType: string;
  grip: GripType;
  level: number;
  theme: string;
  era: string;
  rarity: Rarity;
  seed: string;
}

export interface GeneratedItem {
  id: string;
  nome: string;
  tipo: string;
  subcategoria: string;
  categoria: GenerationType | string;
  descricao_curta: string;
  descricao: string;
  nivel_sugerido: number;
  raridade: Rarity;
  dano: string;
  dados: string;
  tipo_de_dano: string;
  status_aplicado: string;
  efeitos_secundarios: string;
  ganchos_narrativos: string;
  dano_base?: string;
  multiplicador_de_ataque?: string;
  defesa?: string;
  resistencia_magica?: string;
  velocidade_movimento?: string;
  clima?: string;
  bioma?: string;
}

export interface PromptResponse {
  query: string;
  prompts: {
    midjourney: string;
    gemini: string;
    copilot: string;
    gpt: string;
  };
  references: {
    title: string;
    url: string;
    source: string;
  }[];
}
