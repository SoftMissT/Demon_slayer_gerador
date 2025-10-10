import type { GenerationType as OldGenerationType } from './types';

export type GenerationType = 'Forma de Respiração' | 'Kekkijutsu' | 'Arquétipo/Habilidade' | 'Arma' | 'Acessório' | 'Missão' | 'Inimigo/Oni' | 'Classe/Origem' | 'Caçador' | 'Híbrido Humano-Oni' | 'NPC' | 'Local/Cenário' | 'Armadura' | 'Item de Auxílio' | 'Item Consumível';
export type Rarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Amaldiçoado';
export type GripType = 'Ittō-ryū' | 'Nitō-ryū' | 'Ryōtō' | 'Battōjutsu' | 'Kyūdō' | 'Taijutsu';
export type AccessoryType = 'Kimono' | 'Brinco' | 'Pulseira' | 'Bainha' | 'Haori' | 'Máscara' | 'Talisman' | 'Sandálias de Palha (Waraji)' | 'Faixa Espiritual (Obi)' | 'Guarda de Espada (Tsuba)' | 'Colar de Foco (Magatama)' | 'Luvas de Oni' | 'Patuá de Caçador' | 'Capa de Neblina' | 'Chapéu';
export type ArmaduraType = 'Armadura Leve' | 'Armadura Pesada' | 'Uniforme dos Caçadores de Onis';
export type ItemDeAuxilioType = 'Luva Yugake' | 'Kit Marcial';
export type ConsumableType = 'Venenos' | 'Medicamentos' | 'Bandagens' | 'Cantil' | 'Kit Cirúrgico' | 'Saco de Dormir' | 'Bomba Explosiva' | 'Injeção de Adrenalina' | 'Munição de Armas' | 'Metal Ancestral' | 'Vidro de Sol' | 'Tinta Especial Hamaki';
export type MainItemType = 'Item' | 'Equipamento' | 'Habilidade';
export type ArchetypeType = 'GUERREIRO' | 'ALQUIMISTA' | 'ESCUDEIRO';
export type SkillType = 'Kenshi' | 'Bujin' | 'Kyūshi' | 'Kajiya' | 'Curandeiro' | 'Dokugakusha' | 'Ritualista' | 'Tate' | 'Ishibumi' | 'Shugo' | 'Paladino';
export type SkillActivationType = 'Ativa' | 'Passiva' | 'Toggled' | 'Ultimate';

export interface FilterState {
  generationType: GenerationType | '';
  breathingBase: string;
  weaponType: string;
  grip: GripType | '';
  level: number;
  theme: string | '';
  rarity: Rarity;
  accessoryType: AccessoryType | '';
  armaduraType: ArmaduraType | '';
  itemDeAuxilioType: ItemDeAuxilioType | '';
  consumableType: ConsumableType | '';
  archetypeType: ArchetypeType | '';
  skillType: SkillType | '';
  seed: string;
  era: string;
  kekkijutsu: string;
}

export interface Teste {
  tipo: string;
  cd: string;
  efeito_falha: string;
}

export interface EfeitoInimigo {
  teste: string;
  cd: string;
  falha: string;
}

export interface DanoPorNivelDetalhado {
  nivel: string;
  arma: string;
  forma: string;
  modificador: string;
  dano_total_exemplo: string;
  cd_vit?: string;
}

export interface CustoHabilidade {
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

export interface MomentumRule {
    ganho_por_acerto: number;
    ganho_por_crit: number;
    gasta: { [key: string]: string }[];
}


export interface GeneratedItem {
  id: string;
  nome: string;
  tipo: MainItemType;
  categoria: GenerationType;
  subcategoria: string;
  descricao_curta: string;
  descricao: string;
  ganchos_narrativos: string;
  nivel_sugerido: number;
  respiracao_base: string;

  // Campos de raridade e bônus
  raridade: Rarity;
  dano_extra: string;
  durabilidade: string;
  efeito: string;
  historia: string;
  prompts_de_geracao: {
    Gemini: string;
    ChatGPT: string;
    Midjourney: string;
    Copilot: string;
  };
  
  // Campos de RPG
  preco_em_moedas: string;
  espaco_que_ocupa: string;

  // Campos de combate simples
  dano?: string;
  dados?: string;
  tipo_de_dano?: string;
  status_aplicado?: string;
  efeitos_secundarios?: string;
  
  // Campos detalhados para Respirações/Kekkijutsus/Habilidades
  arquétipo?: ArchetypeType;
  tipo_habilidade?: SkillActivationType;
  custo?: CustoHabilidade;
  cd?: string; // Cooldown
  efeitos?: EfeitoHabilidade[];
  interacao_respirações?: string;
  roleplay_hook?: string;

  nivel_requerido?: string;
  teste_necessario?: Teste;
  efeito_no_inimigo?: EfeitoInimigo;
  exaustao?: string;
  cura_condicional?: string;
  
  dano_total_formula?: string;
  dano_por_nivel?: DanoPorNivelDetalhado[];
  momentum?: MomentumRule;

  // Estatísticas de Combate Detalhadas
  dano_base?: string;
  multiplicador_de_ataque?: string;
  defesa?: string;
  resistencia_magica?: string;
  velocidade_movimento?: string;

  // Campos para Locais/Cenários
  clima?: string;
  bioma?: string;
}