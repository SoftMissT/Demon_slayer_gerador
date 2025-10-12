
import { Type } from '@google/genai';
import type { FilterState, Category } from '../types';

const buildBaseSchemaProperties = (category: Category) => ({
    nome: { type: Type.STRING, description: 'O nome criativo e único do item/personagem/técnica.' },
    categoria: { type: Type.STRING, description: `A categoria do item gerado. DEVE SER EXATAMENTE "${category}".` },
    tematica: { type: Type.STRING, description: 'A temática principal que inspirou o item, como "Cyberpunk" ou "Medieval Fantasia".' },
    descricao_curta: { type: Type.STRING, description: 'Uma descrição de uma ou duas frases que captura a essência.' },
    descricao: { type: Type.STRING, description: 'Uma descrição detalhada (pelo menos 3 parágrafos) incluindo aparência, história, lore e como ele se encaixa no mundo. Este campo será o "gameText" principal.' },
    imagePromptDescription: { type: Type.STRING, description: 'Um protótipo de prompt para IA de imagem (ex: Midjourney). Descreva a aparência visual de forma concisa e evocativa, focada em adjetivos e composição.' },
    raridade: { type: Type.STRING, enum: ['Aleatória', 'Comum', 'Incomum', 'Raro', 'Épico', 'Lendário', 'Amaldiçoado', 'N/A'], description: 'A raridade.' },
    nivel_sugerido: { type: Type.INTEGER, description: 'O nível de personagem sugerido para usar ou encontrar este item.' },
    ganchos_narrativos: {
        type: Type.ARRAY,
        description: 'Pelo menos 3 ideias ou ganchos de aventura distintos e criativos para um mestre de RPG usar.',
        items: { type: Type.STRING }
    },
});

const SCHEMAS: Record<Category, any> = {
    'Arma': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Arma'),
            dano: { type: Type.STRING, description: 'O dano base da arma, ex: "2d8".' },
            dados: { type: Type.STRING, description: 'O dado rolado para o ataque, ex: "d20".' },
            tipo_de_dano: { type: Type.STRING, description: 'O tipo de dano, ex: "Cortante", "Perfurante", "Mágico".' },
            status_aplicado: { type: Type.STRING, description: 'Qualquer status negativo aplicado, ex: "Sangramento", "Veneno".', nullable: true },
            efeitos_secundarios: { type: Type.STRING, description: 'Efeitos adicionais ou passivos da arma.', nullable: true },
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'dano', 'dados', 'tipo_de_dano']
    },
    'Acessório': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Acessório'),
            dano: { type: Type.STRING, nullable: true },
            dados: { type: Type.STRING, nullable: true },
            tipo_de_dano: { type: Type.STRING, nullable: true },
            status_aplicado: { type: Type.STRING, description: 'Qualquer status aplicado, ex: "Invisibilidade", "Resistência a Fogo".', nullable: true },
            efeitos_secundarios: { type: Type.STRING, description: 'Efeitos adicionais, passivos ou de ativação do acessório.' },
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'efeitos_secundarios']
    },
    'Caçador': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Caçador'),
            classe: { type: Type.STRING, description: 'O arquétipo ou classe do caçador, ex: "Kenshi", "Bujin".' },
            personalidade: { type: Type.STRING, description: 'Traços de personalidade marcantes.' },
            descricao_fisica: { type: Type.STRING, description: 'Descrição detalhada da aparência física.' },
            background: { type: Type.STRING, description: 'A história de origem e motivações do caçador.' },
            arsenal: {
                type: Type.OBJECT, properties: {
                    arma: { type: Type.STRING, description: 'A arma principal do caçador.' },
                    empunhadura: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, descricao: { type: Type.STRING } } }
                }
            },
            habilidades_especiais: {
                type: Type.OBJECT, properties: {
                    respiracao: { type: Type.STRING, description: 'A principal forma de respiração.' },
                    variacoes_tecnica: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Técnicas únicas ou variações da respiração.' }
                }
            },
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'classe', 'personalidade', 'descricao_fisica', 'background']
    },
    'Inimigo/Oni': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Inimigo/Oni'),
            power_level: { type: Type.STRING, description: 'O nível de poder do Oni, ex: "Lua Inferior".' },
            descricao_fisica_detalhada: { type: Type.STRING, description: 'Descrição detalhada da aparência, incluindo traços monstruosos.' },
            kekkijutsu: {
                type: Type.OBJECT, properties: {
                    nome: { type: Type.STRING, description: 'O nome da Arte Demoníaca de Sangue.' },
                    descricao: { type: Type.STRING, description: 'O que a arte faz em detalhes.' }
                }
            },
            comportamento_combate: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Táticas e comportamentos em combate.' },
            comportamento_fora_combate: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Comportamento social ou quando não está em alerta.' },
            fraquezas_unicas: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Fraquezas específicas além da luz solar ou lâminas de Nichirin.' },
            trofeus_loot: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Itens que podem ser obtidos ao derrotá-lo.' }
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'power_level', 'kekkijutsu', 'comportamento_combate']
    },
    'NPC': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('NPC'),
            origem: { type: Type.STRING, description: 'A origem cultural ou geográfica do NPC.' },
            profession: { type: Type.STRING, description: 'A profissão ou papel principal do NPC na sociedade.' },
            motivation: { type: Type.STRING, description: 'O que move e motiva as ações deste NPC.' },
            secret: { type: Type.STRING, description: 'Um segredo importante que o NPC guarda.' },
            dialogue_lines: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exemplos de falas que revelam sua personalidade.' },
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'origem', 'profession', 'motivation', 'secret']
    },
    'Forma de Respiração': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Forma de Respiração'),
            name_native: { type: Type.STRING, description: 'O nome da técnica no idioma original (ex: japonês), com tradução.', nullable: true },
            description_flavor: { type: Type.STRING, description: 'Descrição poética e visual da técnica em ação.' },
            mechanics: {
                type: Type.OBJECT, properties: {
                    activation: { type: Type.STRING, description: 'Como a técnica é ativada (ex: Ação, Reação).' },
                    target: { type: Type.STRING, description: 'O alvo ou área de efeito.' },
                    on_success_target: { type: Type.STRING, description: 'O que acontece ao alvo em caso de sucesso.' },
                    damage_formula_rank: { type: Type.OBJECT, properties: {}, additionalProperties: { type: Type.STRING }, description: 'Fórmula de dano baseada no rank do caçador, ex: {"Mizunoto": "2d6", "Hashira": "4d10+FOR"}.' }
                }
            }
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'description_flavor', 'mechanics']
    },
    'Kekkijutsu': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Kekkijutsu'),
            dano: { type: Type.STRING, description: 'O dano base da técnica, ex: "3d10".', nullable: true },
            dados: { type: Type.STRING, description: 'O dado para teste de resistência, ex: "CD 15 Destreza".', nullable: true },
            tipo_de_dano: { type: Type.STRING, description: 'O tipo de dano, ex: "Necrótico", "Psíquico".', nullable: true },
            status_aplicado: { type: Type.STRING, description: 'Qualquer status negativo aplicado, ex: "Paralisia", "Medo".', nullable: true },
            efeitos_secundarios: { type: Type.STRING, description: 'Efeitos adicionais da técnica.' },
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos']
    },
    'Local/Cenário': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Local/Cenário'),
            points_of_interest: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } }, description: 'Locais chave dentro deste cenário.' },
            key_npcs_wb: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, description: { type: Type.STRING } } }, description: 'NPCs importantes que podem ser encontrados aqui.' },
            ameacas_externas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, tipo: { type: Type.STRING }, descricao: { type: Type.STRING } } }, description: 'Perigos e ameaças comuns neste local.' },
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'points_of_interest']
    },
    'Missões': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Missões'),
            title: { type: Type.STRING, description: 'O título da missão.' },
            logline: { type: Type.STRING, description: 'Resumo da missão em uma frase.' },
            summary: { type: Type.STRING, description: 'Sumário detalhado da missão.' },
            objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            complications: { type: Type.ARRAY, items: { type: Type.STRING } },
            rewards: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'title', 'logline', 'summary', 'objectives']
    },
    'World Building': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('World Building'),
            plot_threads: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } }, description: 'Fios de enredo para desenvolver.' },
            faccoes_internas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, objetivo: { type: Type.STRING }, descricao: { type: Type.STRING } } }, description: 'Facções e seus objetivos.' },
            misterios_segredos: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Mistérios para os jogadores investigarem.' }
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'plot_threads', 'faccoes_internas', 'misterios_segredos']
    },
    'Evento': {
        type: Type.OBJECT,
        properties: {
            ...buildBaseSchemaProperties('Evento'),
            eventType: { type: Type.STRING, description: 'O tipo do evento, ex: "Festival Cultural", "Desastre Natural".' },
            consequencias: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'As possíveis consequências e desfechos do evento.' },
            participantes_chave: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, papel: { type: Type.STRING } } }, description: 'Personagens ou grupos chave envolvidos.' },
        },
        required: ['nome', 'categoria', 'tematica', 'descricao_curta', 'descricao', 'imagePromptDescription', 'raridade', 'nivel_sugerido', 'ganchos_narrativos', 'eventType', 'consequencias']
    }
};

export const buildResponseSchema = (filters: FilterState, count: number) => {
    if (!filters.category) {
        throw new Error("Category is required to build a response schema.");
    }
    const schema = SCHEMAS[filters.category];
    if (!schema) {
        throw new Error(`No schema defined for category: ${filters.category}`);
    }
    if (count > 1) {
        return {
            type: Type.OBJECT,
            properties: {
                items: {
                    type: Type.ARRAY,
                    items: schema
                }
            }
        };
    }
    return schema;
};

export const buildGenerationPrompt = (filters: FilterState, count: number, promptModifier?: string, baseConcept?: any): string => {
    let prompt = `Você é um mestre de RPG e escritor de fantasia especialista no universo de Demon Slayer. Sua tarefa é criar ${count > 1 ? count + ' itens únicos' : 'um item único'} para um jogo de RPG de mesa, seguindo estritamente as especificações abaixo. A resposta DEVE ser um objeto JSON (ou um objeto com uma chave "items" contendo um array se count > 1) que valide com o schema fornecido.

**Categoria:** ${filters.category}
`;

    if (baseConcept && Object.keys(baseConcept).length > 0) {
        prompt += `\n**Conceito Base (Inspiração Inicial):**\n${JSON.stringify(baseConcept, null, 2)}\nUse este conceito como ponto de partida, mas sinta-se à vontade para expandir e adicionar detalhes criativos.`;
    }

    prompt += "\n**Filtros e Diretrizes:**\n";

    const addFilter = (label: string, value: any) => {
        if (value && (!Array.isArray(value) || value.length > 0)) {
            prompt += `- **${label}:** ${Array.isArray(value) ? value.join(', ') : value}\n`;
        }
    };

    switch (filters.category) {
        case 'Caçador':
            addFilter('Temática', filters.hunterTematica);
            addFilter('País de Origem', filters.hunterCountry);
            addFilter('Arquétipo', filters.hunterArchetype);
            addFilter('Personalidade', filters.hunterPersonality);
            addFilter('Respirações Base', filters.hunterBreathingStyles);
            addFilter('Rank', filters.hunterRank);
            break;
        case 'Inimigo/Oni':
            addFilter('Temática', filters.oniTematica);
            addFilter('País de Origem', filters.oniCountry);
            addFilter('Nível de Poder', filters.oniPowerLevel);
            addFilter('Personalidade', filters.oniPersonality);
            addFilter('Inspiração de Kekkijutsu', filters.oniInspirationKekkijutsu);
            break;
        // Add cases for other categories...
    }

    if (promptModifier) {
        prompt += `\n**Instrução Adicional:** ${promptModifier}\n`;
    }

    prompt += `
**Requisitos Obrigatórios:**
1.  **Criatividade:** Crie algo verdadeiramente único e memorável. Evite clichês.
2.  **Descrição Rica:** A 'descricao' deve ser longa, detalhada e imersiva, com pelo menos três parágrafos, explorando a história, aparência e lore.
3.  **Ganchos de RPG:** Os 'ganchos_narrativos' devem ser criativos e fornecer ideias concretas para aventuras.
4.  **Prompt de Imagem:** O 'imagePromptDescription' deve ser uma descrição visual concisa, focada em adjetivos, iluminação e composição, pronta para ser usada em uma IA de imagem.
5.  **Validação de Schema:** O JSON de saída DEVE ser estritamente validado pelo schema fornecido.
`;

    return prompt;
};
