import type { GeneratedItem } from '../types';

type ImageCategory = 'Inimigo/Oni' | 'Caçador' | 'Arma' | 'Acessório' | 'Classe/Origem' | 'Forma de Respiração' | 'Kekkijutsu' | 'Local/Cenário';

/**
 * Retorna a string de fundo apropriada para a categoria de imagem.
 */
const getBackgroundPrompt = (category: ImageCategory): string => {
  switch (category) {
    case 'Inimigo/Oni':
      return 'fundo dramático e sombrio';
    case 'Caçador':
      return 'fundo de dojo diurno ou floresta de bambu';
    case 'Classe/Origem':
      return 'fundo de paisagem épica com um templo antigo';
    case 'Forma de Respiração':
    case 'Kekkijutsu':
        return 'fundo de campo de batalha noturno e místico';
    case 'Local/Cenário':
        return 'atmosfera cinematográfica';
    case 'Arma':
    case 'Acessório':
      return 'fundo neutro para focar no design';
    default:
      return 'fundo neutro';
  }
};

/**
 * Retorna uma string descritiva do estilo artístico com base na Era.
 */
const getEraStylePrompt = (era?: string): string => {
  switch (era) {
    case 'Cyberpunk':
      return 'com estética cyberpunk, com luzes de neon, detalhes de circuitos e materiais de alta tecnologia';
    case 'Steampunk':
      return 'com estética steampunk, com engrenagens de latão, tubos de cobre e mecanismos a vapor';
    case 'Medieval Fantasia':
      return 'com estética de fantasia medieval, ornamentado, com runas mágicas ou artesanato élfico/anão';
    case 'Biopunk':
      return 'com estética biopunk, parecendo orgânico, com quitina, simbiótico ou biomecânico';
    case 'Moderno':
    case 'Tempos Atuais':
      return 'com um design tático moderno, usando polímeros e metais leves';
    case 'Futurista (Sci-Fi)':
      return 'com um design de ficção científica elegante, com luzes de energia e materiais exóticos';
    case 'Pós-apocalíptico':
      return 'com uma aparência pós-apocalíptica, feito de sucata, improvisado, desgastado e enferrujado';
    case 'Período Edo (Japão Feudal)':
    default:
      return 'no estilo tradicional japonês de fantasia';
  }
};


/**
 * Constrói o prompt de imagem para um personagem (Oni ou Caçador).
 */
const buildCharacterImagePrompt = (
  itemName: string,
  shortDesc: string,
  background: string,
  expression: string
): string => {
  return `Corpo inteiro de ${itemName}, descrito como: ${shortDesc}. Estilizado como um personagem de anime de fantasia, altamente detalhado, atmosfera mística, ${background}, ${expression}, anime, HD, estilo manhwa, design de arte de tatuagem, Pose olhando para frente, HD, arte de anime, profundidade de campo, arte de quadrinhos semi-realista, estilo de quadrinhos, cinemático de anime, Esboço de Personagem, ilustração de anime, texturas faciais detalhadas, iluminação suave, estilo de arte Demon Slayer, foto crua.`;
};

/**
 * Constrói o prompt de imagem para um item (Arma ou Acessório).
 */
const buildItemImagePrompt = (
    itemName: string,
    shortDesc: string,
    background: string,
    itemType: 'Arma' | 'Acessório',
    era?: string
): string => {
    const eraStyle = getEraStylePrompt(era);
    const itemTypeString = itemType === 'Arma' ? 'uma arma' : 'um acessório';

    return `Arte conceitual detalhada de ${itemTypeString} ${eraStyle}, estilo anime sombrio. O item se chama "${itemName}" e é descrito como: "${shortDesc}". ${background}, isolado, foco no item.`;
}

/**
 * Constrói um prompt de imagem otimizado com base na categoria do item.
 */
export const buildImagePrompt = (
  item: GeneratedItem,
  era?: string
): string => {
  const { categoria, nome, descricao_curta, descricao } = item;

  switch (categoria) {
    case 'Inimigo/Oni': {
      const background = getBackgroundPrompt('Inimigo/Oni');
      return buildCharacterImagePrompt(nome, descricao_curta, background, 'expressão rancorosa');
    }
    case 'Caçador': {
      const background = getBackgroundPrompt('Caçador');
      return buildCharacterImagePrompt(nome, descricao_curta, background, 'expressão determinada');
    }
    case 'Classe/Origem': {
      const background = getBackgroundPrompt('Classe/Origem');
      return buildCharacterImagePrompt(`um arquétipo de ${nome}`, descricao_curta, background, 'expressão confiante e enigmática');
    }
    case 'Arma': {
      const background = getBackgroundPrompt('Arma');
      return buildItemImagePrompt(nome, descricao_curta, background, 'Arma', era);
    }
    case 'Acessório': {
      const background = getBackgroundPrompt('Acessório');
      return buildItemImagePrompt(nome, descricao_curta, background, 'Acessório', era);
    }
    case 'Forma de Respiração':
    case 'Kekkijutsu': {
        const background = getBackgroundPrompt(categoria);
        return `Uma ilustração cinematográfica de um guerreiro da era Taisho executando a técnica "${nome}", descrita como: ${descricao}. O efeito visual da técnica é o foco principal. ${background}, iluminação dramática, arte conceitual estilo anime de alta resolução, movimento dinâmico, arte de fantasia sombria.`
    }
    case 'Local/Cenário': {
        const background = getBackgroundPrompt(categoria);
        return `Uma paisagem cinematográfica de ${nome}, um lugar descrito como: ${descricao_curta}. O clima é ${item.clima} e o bioma é ${item.bioma}. Estilo de arte do período Taisho do Japão, ${background}, enevoado, altamente detalhado, 4k, arte conceitual.`
    }
    default:
      return `Uma ilustração de fantasia sombria no estilo anime de: ${nome}, ${descricao_curta}.`;
  }
};