// FIX: Implemented file to resolve 'module not found' error.
import { Type } from "@google/genai";
import type { FilterState } from '../types';

export const buildResponseSchema = (filters: FilterState, step: number) => {
    const baseProperties = {
        nome: { type: Type.STRING, description: "Nome criativo e único para o item/personagem." },
        categoria: { type: Type.STRING, description: "A categoria do item gerado.", enum: [filters.category] },
        tematica: { type: Type.STRING, description: "A temática principal do item." },
        raridade: { type: Type.STRING, description: "A raridade do item (ex: Comum, Raro, Lendário)." },
        descricao_curta: { type: Type.STRING, description: "Uma descrição de 2-3 frases que captura a essência." },
        descricao: { type: Type.STRING, description: "Descrição detalhada, incluindo aparência, história e poderes." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível de poder ou desafio sugerido para um RPG." },
        ganchos_narrativos: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Pelo menos 3 ideias de missões ou histórias relacionadas."
        },
    };

    switch (filters.category) {
        case 'Caçador':
            return {
                type: Type.OBJECT,
                properties: {
                    ...baseProperties,
                    classe: { type: Type.STRING, description: "Arquétipo de combate do caçador." },
                    personalidade: { type: Type.STRING, description: "Traços de personalidade marcantes." },
                    background: { type: Type.STRING, description: "Breve história de origem do caçador." },
                }
            };
        case 'Inimigo/Oni':
            return {
                type: Type.OBJECT,
                properties: {
                    ...baseProperties,
                    power_level: { type: Type.STRING, description: "Nível de poder do Oni (ex: Lua Inferior, Superior)." },
                    kekkijutsu: {
                        type: Type.OBJECT,
                        properties: {
                            nome: { type: Type.STRING },
                            descricao: { type: Type.STRING }
                        },
                        required: ['nome', 'descricao']
                    },
                    comportamento_combate: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Estratégias e táticas do Oni em combate."
                    }
                }
            };
        case 'Arma':
        case 'Acessório':
            return {
                type: Type.OBJECT,
                properties: {
                    ...baseProperties,
                    preco_sugerido: { type: Type.INTEGER, description: "O preço sugerido do item em 'ryo', baseado em sua raridade, materiais e no filtro de preço fornecido." },
                    dano: { type: Type.STRING },
                    dados: { type: Type.STRING },
                    tipo_de_dano: { type: Type.STRING },
                    status_aplicado: { type: Type.STRING },
                    efeitos_secundarios: { type: Type.STRING }
                }
            };
        default:
            return { type: Type.OBJECT, properties: baseProperties };
    }
};

export const buildGenerationPrompt = (filters: FilterState, step: number, promptModifier?: string, context?: any): { role: string; parts: { text: string }[] }[] => {
    let prompt = `Você é uma IA especialista em criar conteúdo para RPG de mesa no universo de Demon Slayer.
Sua tarefa é gerar os detalhes para a categoria: "${filters.category}".

**Contexto dos Filtros:**
${Object.entries(filters)
    .filter(([, value]) => value && value !== 'Aleatório' && value !== 'Aleatória' && (!Array.isArray(value) || value.length > 0))
    .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n')}

**Instruções Adicionais:**
${promptModifier ? `- Prioridade: ${promptModifier}\n` : ''}
${(filters.category === 'Arma' || filters.category === 'Acessório') ? `- Considere o 'suggestedPrice' (${filters.suggestedPrice} ryo) ao descrever os materiais, a qualidade e a raridade geral do item. Um preço mais alto deve refletir materiais mais raros, artesanato superior e uma história mais rica.\n` : ''}
${(filters.category === 'Caçador' && filters.hunterWeapon && filters.hunterWeapon !== 'Aleatório') ? `- O caçador deve ser proficiente com sua Arma Principal: '${filters.hunterWeapon}'. Sua história, aparência e estilo de combate devem refletir o uso desta arma.\n` : ''}
- Seja criativo, detalhado e fiel ao tom sombrio e épico de Demon Slayer.
- Forneça uma resposta rica em lore e com ganchos para aventuras.

**Contexto da Etapa Anterior (se houver):**
${context ? JSON.stringify(context, null, 2) : 'Nenhum. Comece do zero.'}

Gere um objeto JSON completo com base no schema fornecido.
`;

    return [{ role: 'user', parts: [{ text: prompt }] }];
};