import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient, simpleResponseSchema, detailedResponseSchema } from '../../lib/gemini';
import type { FilterState, GeneratedItem, Rarity, GenerationType } from '../../types';
import { Type } from '@google/genai';
import { randomUUID } from 'crypto';
import { BREATHING_STYLES_DATA } from '../../lib/breathingStylesData';

const EQUIPMENT_CATEGORIES: GenerationType[] = ['Arma', 'Armadura', 'Item de Auxílio', 'Acessório'];

const calculateBonuses = (rarity: Rarity, category: GenerationType): { dano_extra: string, durabilidade: string } => {
    if (!EQUIPMENT_CATEGORIES.includes(category)) {
        return { dano_extra: '-', durabilidade: '-' };
    }

    const bonuses = { dano_extra: '-', durabilidade: '-' };

    switch (rarity) {
        case 'Raro':
            if (category === 'Arma') bonuses.dano_extra = '+2';
            bonuses.durabilidade = '+20%';
            break;
        case 'Épico':
            if (category === 'Arma') bonuses.dano_extra = '+3';
            bonuses.durabilidade = '+50%';
            break;
        case 'Lendário':
            if (category === 'Arma') bonuses.dano_extra = '+4';
            bonuses.durabilidade = 'Inquebrável';
            break;
        default:
            break;
    }
    return bonuses;
};

const buildSimplePrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    let specificInstructions = '';
    let itemTypeFilter = '';
    let mainType : GeneratedItem['tipo'] = 'Equipamento';

    switch(filters.generationType) {
        case 'Local/Cenário':
            specificInstructions = `Gere um local com nome japonês, descrição, gancho narrativo, clima e bioma.`;
            break;
        case 'Arma':
            itemTypeFilter = filters.weaponType;
            specificInstructions = `Gere uma arma do tipo '${itemTypeFilter || 'qualquer'}'.`;
            break;
        case 'Acessório':
            itemTypeFilter = filters.accessoryType;
            specificInstructions = `Gere um acessório do tipo '${itemTypeFilter || 'qualquer'}'.`;
            break;
        case 'Armadura':
            itemTypeFilter = filters.armaduraType;
            specificInstructions = `Gere uma armadura do tipo '${itemTypeFilter || 'qualquer'}'.`;
            break;
        case 'Item de Auxílio':
            itemTypeFilter = filters.itemDeAuxilioType;
            specificInstructions = `Gere um item de auxílio do tipo '${itemTypeFilter || 'qualquer'}'.`;
            break;
        case 'Item Consumível':
            mainType = 'Item';
            itemTypeFilter = filters.consumableType;
            specificInstructions = `Gere um item consumível do tipo '${itemTypeFilter || 'qualquer'}'. Efeitos devem ser temporários.`;
            break;
        default:
             specificInstructions = `Gere ${filters.generationType} com foco em estatísticas de combate e ganchos de roleplay.`;
             break;
    }
    
    return `
    Objetivo: Gerar ${count} conteúdo(s) para RPG de mesa no universo de Kimetsu no Yaiba.
    Filtros: Categoria=${filters.generationType}, Tipo Específico=${itemTypeFilter}, Nível=${filters.level}, Raridade=${filters.rarity}.
    ${promptModifier ? `- Modificador: ${promptModifier}` : ''}
    Instruções:
    1. A resposta DEVE ser um array JSON com ${count} objeto(s).
    2. 'tipo' DEVE ser '${mainType}'. 'categoria' DEVE ser '${filters.generationType}'. 'subcategoria' DEVE ser '${itemTypeFilter || 'Apropriado'}'.
    3. Para TODOS, preencha 'nome', 'descricao', 'descricao_curta', 'raridade', 'efeito', 'historia', 'preco_em_moedas', 'espaco_que_ocupa' e 'prompts_de_geracao'.
    4. 'raridade' DEVE ser '${filters.rarity}'. 'historia' DEVE ser uma lenda curta.
    5. Crie 4 prompts criativos e distintos para Gemini, ChatGPT, Midjourney e Copilot.
    6. NÃO calcule 'dano_extra' ou 'durabilidade'.
    7. ${specificInstructions}
    `;
};

const buildDetailedPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    const specificType = filters.breathingBase || filters.kekkijutsu;
    let context = '';
    if (filters.generationType === 'Forma de Respiração' && filters.breathingBase) {
        const styleData = BREATHING_STYLES_DATA.find(s => s.nome === filters.breathingBase);
        if (styleData) {
            context = `Contexto da Respiração: ${styleData.descricao} (Nota Mecânica: ${styleData.nota_mecanica}).`;
        }
    }
    return `
    GERE ${count} TÉCNICA(S) DE RPG EM JSON.
    Estilo: épico, cinematográfico, Kimetsu-no-Yaiba.
    Filtros: Categoria=${filters.generationType}, Tipo=${specificType}, Nível=${filters.level}, Raridade=${filters.rarity}.
    ${context}
    ${promptModifier ? `- Modificador: ${promptModifier}` : ''}
    Regras OBRIGATÓRIAS:
    1. A resposta DEVE ser um array JSON com ${count} objeto(s).
    2. 'tipo' deve ser 'Equipamento'. 'categoria' deve ser '${filters.generationType}'. 'subcategoria' deve ser '${specificType}'.
    3. Implemente a Regra de Dano: 'dano_total_formula' DEVE ser "dado_arma + dado_forma + modificador". Em 'dano_por_nivel', separe os dados de 'arma' e 'forma'. O dano da forma deve progredir com o nível. 'dano_total_exemplo' deve concatenar a fórmula, ex: "1d8+2d6+FOR".
    4. Implemente o Sistema de Momentum: O campo 'momentum' DEVE ser preenchido exatamente como no exemplo: {"ganho_por_acerto":1,"ganho_por_crit":2,"gasta":[{"1":"+1d4 dano ou +1 ataque"},{"2":"+1d(arma) ou +1d(forma)"},{"3":"forma extra ou +2 Ki"}]}.
    5. Validação de CD: 'cd_vit' em 'dano_por_nivel' DEVE ser um valor entre 10 e 30.
    6. Preencha TODOS os outros campos do schema, incluindo 'teste_necessario', 'efeito_no_inimigo', 'exaustao', 'cura_condicional' e 'prompts_de_geracao'.
    `;
};

const buildArchetypePrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    return `
    GERE ${count} HABILIDADE(S) DE ARQUÉTIPO EM JSON.
    Estilo: Kimetsu no Yaiba, focado em mecânicas de RPG.
    Filtros: Arquétipo=${filters.archetypeType}, Habilidade=${filters.skillType}, Nível=${filters.level}, Raridade=${filters.rarity}.
    ${promptModifier ? `- Modificador: ${promptModifier}` : ''}
    Regras OBRIGATÓRIAS:
    1. A resposta DEVE ser um array JSON com ${count} objeto(s).
    2. 'tipo' deve ser 'Habilidade'. 'categoria' deve ser '${filters.generationType}'. 'subcategoria' deve ser '${filters.skillType}'. 'arquétipo' deve ser '${filters.archetypeType}'.
    3. Preencha TODOS os campos do schema: 'nome', 'tipo_habilidade' (Ativa/Passiva/etc.), 'descricao', 'custo' (stamina/ki/reagentes), 'cd' (cooldown), 'efeitos' (array de objetos), 'interacao_respirações', e 'roleplay_hook'.
    4. Se a habilidade causa dano, inclua os campos 'dano_total_formula', 'dano_por_nivel', e 'momentum' seguindo as mesmas regras da geração de técnicas.
    5. Crie 4 prompts criativos para Gemini, ChatGPT, Midjourney e Copilot.
    `;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { filters, count = 1, promptModifier } = req.body as { filters: FilterState, count: number, promptModifier?: string };
        const isTechniqueType = ['Forma de Respiração', 'Kekkijutsu'].includes(filters.generationType);
        const isSkillType = filters.generationType === 'Arquétipo/Habilidade';
        
        let prompt: string;
        let schema: any;

        if (isTechniqueType || isSkillType) {
            prompt = isSkillType ? buildArchetypePrompt(filters, count, promptModifier) : buildDetailedPrompt(filters, count, promptModifier);
            schema = detailedResponseSchema;
        } else {
            prompt = buildSimplePrompt(filters, count, promptModifier);
            schema = simpleResponseSchema;
        }

        const responseSchema = { type: Type.ARRAY, items: schema };

        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.9,
            },
        });

        const rawText = response.text.trim();
        if (!rawText) {
            throw new Error("A API não retornou texto.");
        }
        let itemsFromApi = JSON.parse(rawText);

        if (!Array.isArray(itemsFromApi)) {
            itemsFromApi = [itemsFromApi];
        }

        const processedItems: GeneratedItem[] = itemsFromApi.map((item: any) => {
            const bonuses = calculateBonuses(item.raridade, item.categoria);

            // Validação de CD
            if (item.dano_por_nivel) {
                item.dano_por_nivel.forEach((dnp: any) => {
                    if (dnp.cd_vit && (parseInt(dnp.cd_vit) < 10 || parseInt(dnp.cd_vit) > 30)) {
                       console.warn(`CD_VIT inválido gerado pela IA (${dnp.cd_vit}), ajustando para 10.`);
                       dnp.cd_vit = "10";
                    }
                });
            }

            const finalItem: GeneratedItem = {
                ...item,
                id: randomUUID(),
                dano_extra: bonuses.dano_extra,
                durabilidade: bonuses.durabilidade,
                nivel_sugerido: item.nivel_sugerido || item.nivel_requerido || filters.level,
                descricao_curta: item.descricao_curta || item.descricao?.substring(0, 100) + '...',
                respiracao_base: filters.breathingBase,
                roleplay_hook: item.roleplay_hook || item.ganchos_narrativos,
            };

            return finalItem;
        });
        
        res.status(200).json({ items: processedItems });

    } catch (error) {
        console.error("Erro na API /api/generateContent:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: errorMessage });
    }
}