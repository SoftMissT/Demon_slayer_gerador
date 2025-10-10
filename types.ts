
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
  | 'Local/Cenário'
  | '';

export type ArchetypeType = 'GUERREIRO' | 'ALQUIMISTA' | 'ESCUDEIRO' | '';
export type SkillType = 'Kenshi' | 'Bujin' | 'Kyūshi' | 'Kajiya' | 'Curandeiro' | 'Dokugakusha' | 'Ritualista' | 'Tate' | 'Ishibumi' | 'Shugo' | 'Paladino' | '';

export type ArmaduraType = 'Armadura Leve' | 'Armadura Pesada' | 'Uniforme dos Caçadores de Onis' | '';
export type ItemDeAuxilioType = 'Luva Yugake' | 'Kit Marcial' | '';
export type ConsumableType = 'Venenos' | 'Medicamentos' | 'Bandagens' | 'Cantil' | 'Kit Cirúrgico' | 'Saco de Dormir' | 'Bomba Explosiva' | 'Injeção de Adrenalina' | 'Munição de Armas' | 'Metal Ancestral' | 'Vidro de Sol' | 'Tinta Especial Hamaki' | '';
export type GripType = 'Ittō-ryū' | 'Nitō-ryū' | 'Ryōtō' | 'Battōjutsu' | 'Kyūdō' | 'Taijutsu' | '';
export type Rarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Amaldiçoado';
export type AccessoryType = 'Kimono' | 'Brinco' | 'Pulseira' | 'Bainha' | 'Haori' | 'Máscara' | 'Chapéu' | 'Talisman' | 'Sandálias de Palha (Waraji)' | 'Faixa Espiritual (Obi)' | 'Guarda de Espada (Tsuba)' | 'Colar de Foco (Magatama)' | 'Luvas de Oni' | 'Patuá de Caçador' | 'Capa de Neblina' | '';

export type AiModel = 'Gemini' | 'OpenAI';

export interface FilterState {
  generationType: GenerationType;
  aiModel: AiModel;
  breathingBase: string;
  weaponType: string;
  grip: GripType;
  level: number;
  theme: string;
  rarity: Rarity;
  accessoryType: AccessoryType;
  armaduraType: ArmaduraType;
  itemDeAuxilioType: ItemDeAuxilioType;
  consumableType: ConsumableType;
  archetypeType: ArchetypeType;
  skillType: SkillType;
  seed: string;
  era: string;
  kekkijutsu: string;
}

export interface DanoPorNivelDetalhado {
    nivel: string;
    arma: string;
    forma: string;
    modificador: string;
    dano_total_exemplo: string;
    cd_vit?: string;
}

export interface Momentum {
    ganho_por_acerto: number;
    ganho_por_crit: number;
    gasta: Record<string, string>[];
}

export interface TesteNecessario {
    tipo: string;
    cd: string;
    efeito_falha: string;
}

export interface Prompts {
    Gemini: string;
    ChatGPT: string;
    Midjourney: string;
    Copilot: string;
}

export interface Custo {
    stamina?: number;
    ki?: number;
    reagentes?: string;
}

export interface EfeitoHabilidade {
    tipo: string;
    valor: string;
    alvo: string;
    obs?: string;
}

export interface GeneratedItem {
  id: string;
  nome: string;
  tipo: string;
  categoria: GenerationType;
  subcategoria: string;
  descricao_curta: string;
  descricao: string;
  ganchos_narrativos?: string;
  roleplay_hook?: string; // Alias for ganchos_narrativos
  nivel_sugerido: number;
  respiracao_base?: string;
  raridade: Rarity;
  efeito?: string;
  historia?: string;
  prompts_de_geracao?: Prompts;
  preco_em_moedas?: string;
  espaco_que_ocupa?: string;
  dano?: string;
  dados?: string;
  tipo_de_dano?: string;
  status_aplicado?: string;
  efeitos_secundarios?: string;
  dano_base?: string;
  multiplicador_de_ataque?: string;
  defesa?: string;
  resistencia_magica?: string;
  velocidade_movimento?: string;
  clima?: string;
  bioma?: string;
  dano_extra?: string;
  durabilidade?: string;
  
  // For techniques
  dano_total_formula?: string;
  dano_por_nivel?: DanoPorNivelDetalhado[];
  momentum?: Momentum;
  teste_necessario?: TesteNecessario;

  // For skills/archetypes
  arquétipo?: ArchetypeType;
  tipo_habilidade?: string;
  custo?: Custo;
  cd?: string; // cooldown
  efeitos?: EfeitoHabilidade[];
  interacao_respirações?: string;
}

// Types for the new Prompt Engineering feature
export interface PromptSet {
  midjourney: string;
  gemini: string;
  copilot: string;
  gpt: string;
}

export interface Reference {
  title: string;
  url: string;
  source: string;
  snippet?: string;
  reliability?: number;
}

export interface PromptResponse {
  query: string;
  prompts: PromptSet;
  references: Reference[];
}