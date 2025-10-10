export type GenerationType = 'Forma de Respiração' | 'Arma' | 'Acessório' | 'Missão' | 'Inimigo/Oni' | 'Kekkijutsu' | 'Classe/Origem' | 'Caçador' | 'Híbrido Humano-Oni' | 'NPC';
export type Rarity = 'Low' | 'Mid' | 'High' | 'Peça-lendária';
export type GripType = 'Ittō-ryū' | 'Nitō-ryū' | 'Ryōtō' | 'Battōjutsu' | 'Kyūdō' | 'Taijutsu';
export type AccessoryType = 'Kimono' | 'Brinco' | 'Pulseira' | 'Bainha' | 'Haori';

export interface FilterState {
  generationType: GenerationType | '';
  breathingBase: string;
  weaponType: string[];
  grip: GripType | '';
  level: number;
  theme: string | '';
  rarity: Rarity;
  accessoryType: AccessoryType | '';
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

export interface DanoPorNivel {
  nivel: string;
  dano: string;
  pdr?: string;
  cd_vit?: string;
}


export interface GeneratedItem {
  id: string;
  nome: string;
  categoria: GenerationType;
  descricao_curta: string;
  descricao: string;
  ganchos_narrativos: string;
  imageUrl?: string;
  nivel_sugerido: number;
  respiracao_base: string;

  // Campos para tipos de geração mais simples
  dano?: string;
  dados?: string;
  tipo_de_dano?: string;
  status_aplicado?: string;
  efeitos_secundarios?: string;
  
  // Campos detalhados para Respirações/Kekkijutsus
  nivel_requerido?: string;
  teste_necessario?: Teste;
  efeito_no_inimigo?: EfeitoInimigo;
  exaustao?: string;
  cura_condicional?: string;
  dano_por_nivel?: DanoPorNivel[];

  // Estatísticas de Combate Detalhadas
  dano_base?: string;
  multiplicador_de_ataque?: string;
  defesa?: string;
  resistencia_magica?: string;
  velocidade_movimento?: string;
}