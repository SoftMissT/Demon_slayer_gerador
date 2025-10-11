import type { GeneratedItem, FilterState } from '../types';
import { Type } from '@google/genai';

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
        const clima = 'clima' in item ? item.clima : 'neutro';
        const bioma = 'bioma' in item ? item.bioma : 'desconhecido';
        return `Uma paisagem cinematográfica de ${nome}, um lugar descrito como: ${descricao_curta}. O clima é ${clima} e o bioma é ${bioma}. Estilo de arte do período Taisho do Japão, ${background}, enevoado, altamente detalhado, 4k, arte conceitual.`
    }
    default:
      return `Uma ilustração de fantasia sombria no estilo anime de: ${nome}, ${descricao_curta}.`;
  }
};

/**
 * Builds the main prompt for generating structured content based on filters.
 */
export const buildGenerationPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    let prompt = `Você é um mestre de RPG e escritor criativo especializado no universo de Demon Slayer (Kimetsu no Yaiba), mas com a capacidade de adaptar elementos para diferentes eras e estilos.
Sua tarefa é gerar ${count} item(s) único(s) e detalhado(s) para uma campanha de RPG com base nos seguintes filtros.
A resposta DEVE ser um objeto JSON${count > 1 ? ` contendo uma chave "items" que é um array de objetos` : ''}, seguindo o schema JSON fornecido.

**Filtros:**
- Categoria: ${filters.category}
- Era/Estilo: ${filters.era}
`;

    Object.entries(filters).forEach(([key, value]) => {
        if (value && (typeof value !== 'object' || (Array.isArray(value) && value.length > 0)) && value !== 'Aleatória' && value !== 'Nenhuma' ) {
            if (key !== 'category' && key !== 'era') {
                prompt += `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
            }
        }
    });

    if (promptModifier) {
        prompt += `\n**Modificador Adicional:**\n${promptModifier}\n`;
    }

    prompt += `\nForneça uma resposta rica e criativa que possa ser usada diretamente em um jogo. Foque em originalidade e detalhes que inspirem a narrativa.`;
    
    return prompt;
};

/**
 * Builds the JSON schema for the AI response based on the category.
 */
export const buildResponseSchema = (filters: FilterState, count: number) => {
    // This is a simplified dynamic schema builder
    const baseItemProperties = {
        nome: { type: Type.STRING, description: 'O nome do item/personagem/lugar.' },
        categoria: { type: Type.STRING, description: 'A categoria, deve ser igual à solicitada.', enum: [filters.category] },
        raridade: { type: Type.STRING, description: 'A raridade (Comum, Incomum, Raro, etc.).', enum: ['N/A', 'Comum', 'Incomum', 'Raro', 'Épico', 'Lendário', 'Amaldiçoado'] },
        nivel_sugerido: { type: Type.NUMBER, description: 'O nível de poder ou dificuldade sugerido (1-20).' },
        descricao_curta: { type: Type.STRING, description: 'Uma descrição concisa e evocativa de 1-2 frases.' },
        descricao: { type: Type.STRING, description: 'Uma descrição detalhada com background, aparência e lore.' },
    };

    const requiredFields = ['nome', 'categoria', 'raridade', 'nivel_sugerido', 'descricao_curta', 'descricao'];

    // Add category-specific properties
    switch (filters.category) {
        case 'Arma':
        case 'Acessório':
            Object.assign(baseItemProperties, {
                dano: { type: Type.STRING },
                dados: { type: Type.STRING },
                tipo_de_dano: { type: Type.STRING },
                status_aplicado: { type: Type.STRING },
                efeitos_secundarios: { type: Type.STRING },
                ganchos_narrativos: { type: Type.STRING },
            });
            requiredFields.push('dano', 'dados', 'tipo_de_dano');
            break;
        case 'Caçador':
             Object.assign(baseItemProperties, {
                classe: { type: Type.STRING },
                personalidade: { type: Type.STRING },
                descricao_fisica: { type: Type.STRING },
                background: { type: Type.STRING },
             });
            break;
        // Other cases would be needed for a complete implementation
    }

    const itemSchema = {
        type: Type.OBJECT,
        properties: baseItemProperties,
        required: requiredFields,
    };
    
    if (count > 1) {
        return {
            type: Type.OBJECT,
            properties: {
                items: {
                    type: Type.ARRAY,
                    items: itemSchema,
                },
            },
            required: ['items'],
        };
    }

    return itemSchema;
};
