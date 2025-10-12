import { Type } from '@google/genai';
import type { FilterState, Category } from '../types';

// #region Schemas
const ganchosNarrativosSchema = {
    type: Type.ARRAY,
    description: "Uma lista de 2 a 4 ganchos de aventura ou plot hooks para integrar o item na narrativa.",
    items: { type: Type.STRING }
};

const baseItemSchemaProperties = {
    nome: { type: Type.STRING, description: "Nome criativo e único para o item." },
    categoria: { type: Type.STRING, description: "A categoria do item gerado." },
    tematica: { type: Type.STRING, description: "A temática ou estilo em que o item se encaixa." },
    descricao_curta: { type: Type.STRING, description: "Uma descrição de uma a duas frases que captura a essência do item." },
    descricao: { type: Type.STRING, description: "Uma descrição detalhada (2-3 parágrafos) com lore, aparência e contexto." },
    raridade: { type: Type.STRING, description: "A raridade do item (Ex: Comum, Raro, Lendário).", enum: ['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário', 'Amaldiçoado', 'N/A'] },
    nivel_sugerido: { type: Type.NUMBER, description: "Nível de poder ou desafio sugerido para o item (1 a 20)." },
};

const weaponSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, description: "A categoria do item.", enum: ['Arma', 'Acessório'] },
        dano: { type: Type.STRING, description: "Fórmula de dano para sistemas de RPG (ex: '2d6', '1d10+FOR')." },
        dados: { type: Type.STRING, description: "Detalhes sobre os dados de dano." },
        tipo_de_dano: { type: Type.STRING, description: "Tipo de dano (ex: Cortante, Perfurante, Fogo, Gelo)." },
        status_aplicado: { type: Type.STRING, description: "Efeito de status que a arma pode aplicar (ex: 'Sangramento', 'Atordoamento', 'Nenhum')." },
        efeitos_secundarios: { type: Type.STRING, description: "Habilidade passiva ou ativa única da arma." },
        ganchos_narrativos: ganchosNarrativosSchema,
    }
};

const kekkijutsuSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, description: "A categoria.", enum: ['Kekkijutsu'] },
        dano: { type: Type.STRING, description: "Fórmula de dano para a técnica (ex: '4d8', '3d12+INT')." },
        dados: { type: Type.STRING, description: "Detalhes sobre os dados." },
        tipo_de_dano: { type: Type.STRING, description: "Tipo de dano elemental ou físico." },
        status_aplicado: { type: Type.STRING, description: "Efeito de status principal (ex: 'Paralisia', 'Medo', 'Corrupção')." },
        efeitos_secundarios: { type: Type.STRING, description: "Efeitos adicionais ou condições de uso." },
        ganchos_narrativos: ganchosNarrativosSchema,
    }
};

const hunterSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, enum: ['Caçador'] },
        classe: { type: Type.STRING, description: "O arquétipo ou classe do caçador." },
        personalidade: { type: Type.STRING, description: "Traços de personalidade marcantes." },
        descricao_fisica: { type: Type.STRING, description: "Descrição detalhada da aparência física." },
        background: { type: Type.STRING, description: "História de origem e motivações do personagem." },
        arsenal: {
            type: Type.OBJECT,
            properties: {
                arma: { type: Type.STRING },
                empunhadura: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, descricao: { type: Type.STRING } } },
            }
        },
        habilidades_especiais: {
            type: Type.OBJECT,
            properties: {
                respiracao: { type: Type.STRING, description: "Estilo de respiração principal." },
                variacoes_tecnica: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de técnicas notáveis." },
            }
        },
        acessorio: {
            type: Type.OBJECT,
            properties: { nome: { type: Type.STRING }, descricao: { type: Type.STRING } }
        },
        uso_em_cena: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Como um mestre pode usar este personagem em cena." },
        ganchos_narrativos: ganchosNarrativosSchema,
    }
};

const oniSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, enum: ['Inimigo/Oni'] },
        power_level: { type: Type.STRING, description: "Nível de poder do Oni (ex: 'Lua Inferior 3', 'Classe Muzan')." },
        descricao_fisica_detalhada: { type: Type.STRING, description: "Descrição vívida e detalhada da aparência do Oni." },
        kekkijutsu: {
            type: Type.OBJECT,
            properties: {
                nome: { type: Type.STRING, description: "Nome do Kekkijutsu." },
                descricao: { type: Type.STRING, description: "Descrição detalhada do Kekkijutsu." },
            }
        },
        comportamento_combate: { type: Type.ARRAY, items: { type: Type.STRING } },
        comportamento_fora_combate: { type: Type.ARRAY, items: { type: Type.STRING } },
        fraquezas_unicas: { type: Type.ARRAY, items: { type: Type.STRING } },
        trofeus_loot: { type: Type.ARRAY, items: { type: Type.STRING } },
        ganchos_narrativos: ganchosNarrativosSchema,
    }
};

const npcSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, enum: ['NPC'] },
        origem: { type: Type.STRING },
        voice_and_mannerisms: { type: Type.STRING, description: "Voz, tiques e maneirismos do NPC." },
        inventory_focal: { type: Type.STRING, description: "Um item importante que o NPC carrega." },
        motivation: { type: Type.STRING, description: "A principal motivação do NPC." },
        secret: { type: Type.STRING, description: "Um segredo que o NPC guarda." },
        dialogue_lines: { type: Type.ARRAY, items: { type: Type.STRING } },
        ganchos_narrativos: ganchosNarrativosSchema,
    }
};

const breathingFormSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, enum: ['Forma de Respiração'] },
        base_breathing_id: { type: Type.STRING, description: "Nome da respiração da qual esta forma deriva." },
        description_flavor: { type: Type.STRING, description: "Descrição poética e visual da forma." },
        requirements: {
            type: Type.OBJECT,
            properties: {
                min_rank: { type: Type.STRING },
                exhaustion_cost: { type: Type.STRING },
                cooldown: { type: Type.STRING },
            }
        },
        mechanics: {
            type: Type.OBJECT,
            properties: {
                activation: { type: Type.STRING },
                target: { type: Type.STRING },
                initial_test: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, dc_formula: { type: Type.STRING } } },
                on_success_target: { type: Type.STRING },
                on_fail_target: { type: Type.STRING },
                damage_formula_rank: { type: Type.OBJECT, properties: { Mizunoto: { type: Type.STRING }, Hashira: { type: Type.STRING } } },
            }
        }
    }
};

const missionSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, enum: ['Missões'] },
        title: { type: Type.STRING },
        logline: { type: Type.STRING },
        summary: { type: Type.STRING },
        objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
        complications: { type: Type.ARRAY, items: { type: Type.STRING } },
        failure_states: { type: Type.ARRAY, items: { type: Type.STRING } },
        rewards: { type: Type.ARRAY, items: { type: Type.STRING } },
        numberOfSessions: { type: Type.NUMBER },
        environment: { type: Type.STRING },
        protagonist_desc: { type: Type.OBJECT, properties: { silhouette: { type: Type.STRING }, face: { type: Type.STRING }, attire: { type: Type.STRING }, movement: { type: Type.STRING }, defining_feature: { type: Type.STRING } } },
        oni_desc: { type: Type.OBJECT, properties: { scale: { type: Type.STRING }, skin: { type: Type.STRING }, appendages: { type: Type.STRING }, eyes: { type: Type.STRING }, sound_smell: { type: Type.STRING }, mystic_sign: { type: Type.STRING } } },
        demonBloodArtType: { type: Type.STRING },
        key_npcs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, role: { type: Type.STRING }, dialogue_example: { type: Type.STRING }, physical_trait: { type: Type.STRING }, goal: { type: Type.STRING }, secret: { type: Type.STRING }, twist: { type: Type.STRING } } } },
        relevant_items: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { appearance: { type: Type.STRING }, origin: { type: Type.STRING }, wear: { type: Type.STRING }, quirk: { type: Type.STRING }, use: { type: Type.STRING } } } },
        scaling_hooks: { type: Type.STRING },
        tone_variations: { type: Type.OBJECT, properties: { hope: { type: Type.STRING }, horror: { type: Type.STRING }, mystery: { type: Type.STRING } } },
        sensitive_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};

const worldBuildingSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, enum: ['World Building'] },
        plot_threads: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } } },
        adventure_hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
        key_npcs_wb: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, description: { type: Type.STRING } } } },
        points_of_interest: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING } } } },
        mini_missions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, objective: { type: Type.STRING }, reward: { type: Type.STRING } } } },
        faccoes_internas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, objetivo: { type: Type.STRING }, descricao: { type: Type.STRING } } } },
        ameacas_externas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, tipo: { type: Type.STRING }, descricao: { type: Type.STRING } } } },
        tradicoes_culturais: { type: Type.ARRAY, items: { type: Type.STRING } },
        eventos_historicos_chave: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { evento: { type: Type.STRING }, impacto: { type: Type.STRING } } } },
        misterios_segredos: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};

const locationSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, enum: ['Local/Cenário'] },
        ganchos_narrativos: ganchosNarrativosSchema,
    }
};

const eventSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseItemSchemaProperties,
        categoria: { type: Type.STRING, enum: ['Evento'] },
        level: { type: Type.STRING, description: "A escala do evento (ex: Regional, Global)." },
        threatLevel: { type: Type.STRING, description: "O nível de ameaça que o evento representa." },
        eventType: { type: Type.STRING, description: "O tipo de evento (ex: Festival, Desastre Natural)." },
        consequencias: { type: Type.ARRAY, items: { type: Type.STRING }, description: "As possíveis consequências ou resultados do evento." },
        participantes_chave: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { 
                    nome: { type: Type.STRING }, 
                    papel: { type: Type.STRING } 
                } 
            },
            description: "Personagens ou grupos importantes envolvidos no evento."
        },
        ganchos_narrativos: ganchosNarrativosSchema,
    }
};

const categoryToSchemaMap: Record<Category, any> = {
    'Caçador': hunterSchema,
    'Inimigo/Oni': oniSchema,
    'NPC': npcSchema,
    'Arma': weaponSchema,
    'Acessório': weaponSchema,
    'Forma de Respiração': breathingFormSchema,
    'Kekkijutsu': kekkijutsuSchema,
    'Local/Cenário': locationSchema,
    'Missões': missionSchema,
    'World Building': worldBuildingSchema,
    'Evento': eventSchema,
};

// #endregion

function cleanFilters(filters: FilterState) {
    const cleaned: Record<string, any> = {};
    for (const key in filters) {
        const value = filters[key as keyof FilterState];
        if (value && value !== 'Aleatória' && value !== 'Aleatório' && value !== 'Nenhuma' && (!Array.isArray(value) || value.length > 0)) {
            cleaned[key] = value;
        }
    }
    return cleaned;
}

export const buildGenerationPrompt = (filters: FilterState, count: number, promptModifier?: string, baseConcept?: any): string => {
    const activeFilters = cleanFilters(filters);

    if (activeFilters.locationTerrainCustom) {
        activeFilters.locationTerrain = activeFilters.locationTerrainCustom;
    }
    delete activeFilters.locationTerrainCustom;

    let prompt = `Você é um mestre de RPG especialista em criar conteúdo para o universo de "Demon Slayer: Kimetsu no Yaiba".
Sua tarefa é enriquecer um conceito base, transformando-o em um item completo e detalhado para a categoria "${filters.category}".
O resultado DEVE ser um objeto JSON que adere estritamente ao schema fornecido.

Contexto Geral:
- Crie lore, descrições vívidas e mecânicas interessantes.
- O campo 'nome' deve ser único e criativo. 'descricao_curta' deve ser um teaser, e 'descricao' deve ser um texto rico e elaborado.

Diretriz de Foco: Seu foco principal ao expandir este conceito deve ser em "${filters.aiFocusGemini || 'Estrutura Base (Padrão)'}".
`;

    if (baseConcept && Object.keys(baseConcept).length > 0) {
        prompt += `\nCONCEITO BASE PARA EXPANDIR (fornecido por outra IA):\n${JSON.stringify(baseConcept)}\n`;
    }

    if (promptModifier) {
        prompt += `\nINSTRUÇÃO ESPECIAL (prioridade máxima):\n${promptModifier}\n\n`;
    }

    prompt += 'Filtros a serem aplicados (combine-os com o conceito base):\n';
    prompt += `- Categoria Principal: ${filters.category}\n`;

    for (const [key, value] of Object.entries(activeFilters)) {
        if (key !== 'category' && !key.startsWith('aiFocus')) {
            const formattedValue = Array.isArray(value) ? value.join(', ') : value;
            prompt += `- ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${formattedValue}\n`;
        }
    }
    
    prompt += "\nLembre-se: a saída deve ser APENAS o JSON. Sem comentários, sem explicações, apenas o JSON puro e válido. Seja extremamente criativo e detalhado nas descrições."

    return prompt;
};

export const buildResponseSchema = (filters: FilterState, count: number) => {
    if (!filters.category) {
        throw new Error("Category is required to build a response schema.");
    }
    const itemSchema = categoryToSchemaMap[filters.category];
    if (!itemSchema) {
        throw new Error(`No schema found for category: ${filters.category}`);
    }

    if (count > 1) {
        return {
            type: Type.OBJECT,
            properties: {
                items: {
                    type: Type.ARRAY,
                    items: itemSchema,
                }
            },
            required: ['items'],
        };
    }
    return itemSchema;
};