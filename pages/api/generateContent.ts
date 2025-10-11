
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Type } from '@google/genai';
import type { FilterState, GeneratedItem } from '../../types';

// --- Start of inlined promptSchemas.ts content ---

// Schemas for individual item types
const baseItemSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING },
        categoria: { type: Type.STRING },
        raridade: { type: Type.STRING },
        nivel_sugerido: { type: Type.INTEGER },
        descricao_curta: { type: Type.STRING },
        descricao: { type: Type.STRING },
        dano: { type: Type.STRING, description: "Ex: 'Médio', 'Baixo', 'Alto'" },
        dados: { type: Type.STRING, description: "Ex: '2d8', '1d12'" },
        tipo_de_dano: { type: Type.STRING, description: "Ex: 'Cortante', 'Perfurante', 'Fogo'" },
        status_aplicado: { type: Type.STRING, description: "Ex: 'Queimadura', 'Lentidão', 'Nenhum'" },
        efeitos_secundarios: { type: Type.STRING, description: "Efeitos passivos ou secundários." },
        ganchos_narrativos: { type: Type.STRING, description: "Ideias de como integrar o item na história." },
    },
    required: ["nome", "categoria", "raridade", "nivel_sugerido", "descricao_curta", "descricao"]
};

const locationSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING },
        categoria: { type: Type.STRING, description: "Deve ser 'Local/Cenário'" },
        raridade: { type: Type.STRING, description: "Raridade do local, ex: Comum, Raro, Lendário." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível de desafio sugerido para o local." },
        descricao_curta: { type: Type.STRING },
        descricao: { type: Type.STRING },
        clima: { type: Type.STRING },
        bioma: { type: Type.STRING },
        ganchos_narrativos: { type: Type.STRING },
    },
    required: ["nome", "categoria", "raridade", "nivel_sugerido", "descricao_curta", "descricao", "clima", "bioma", "ganchos_narrativos"]
};

const missionNpcSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        role: { type: Type.STRING },
        dialogue_example: { type: Type.STRING },
        physical_trait: { type: Type.STRING },
        goal: { type: Type.STRING },
        secret: { type: Type.STRING },
        twist: { type: Type.STRING },
    },
    required: ["id", "name", "role", "dialogue_example", "physical_trait", "goal", "secret", "twist"]
}

const missionItemSchema = {
    type: Type.OBJECT,
    properties: {
        appearance: { type: Type.STRING },
        origin: { type: Type.STRING },
        wear: { type: Type.STRING },
        quirk: { type: Type.STRING },
        use: { type: Type.STRING },
    },
    required: ["appearance", "origin", "wear", "quirk", "use"]
}

const missionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        categoria: { type: Type.STRING, description: "Deve ser 'Missão/Cenário'" },
        raridade: { type: Type.STRING, description: "A 'raridade' ou impacto da missão, ex: Comum, Raro, Épico, Lendário." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível de desafio sugerido para a missão." },
        logline: { type: Type.STRING },
        summary: { type: Type.STRING },
        objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
        complications: { type: Type.ARRAY, items: { type: Type.STRING } },
        failure_states: { type: Type.ARRAY, items: { type: Type.STRING } },
        rewards: { type: Type.ARRAY, items: { type: Type.STRING } },
        numberOfSessions: { type: Type.INTEGER },
        environment: { type: Type.STRING, description: "Detalhes sobre a visão, som e cheiro do ambiente principal." },
        protagonist_desc: {
            type: Type.OBJECT,
            properties: {
                silhouette: { type: Type.STRING }, face: { type: Type.STRING }, attire: { type: Type.STRING }, movement: { type: Type.STRING }, defining_feature: { type: Type.STRING },
            }
        },
        oni_desc: {
             type: Type.OBJECT,
            properties: {
                scale: { type: Type.STRING }, skin: { type: Type.STRING }, appendages: { type: Type.STRING }, eyes: { type: Type.STRING }, sound_smell: { type: Type.STRING }, mystic_sign: { type: Type.STRING },
            }
        },
        demonBloodArtType: { type: Type.STRING },
        key_npcs: { type: Type.ARRAY, items: missionNpcSchema },
        relevant_items: { type: Type.ARRAY, items: missionItemSchema },
        scaling_hooks: { type: Type.STRING, description: "Ganchos para missões futuras e como a ameaça pode escalar." },
        tone_variations: { type: Type.OBJECT, description: "Como a missão mudaria com tons de 'Horror', 'Ação' e 'Mistério'." },
        sensitive_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
        micro_variants: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 pequenas variações, como 'O alvo é um traidor' ou 'O NPC chave está mentindo'." },
    },
    required: ["title", "categoria", "raridade", "nivel_sugerido", "logline", "summary", "objectives", "complications", "failure_states", "rewards", "numberOfSessions", "environment", "key_npcs", "scaling_hooks"]
}


const getResponseSchema = (category: string, count: number) => {
    let itemSchema;
    switch (category) {
        case 'Local/Cenário':
            itemSchema = locationSchema;
            break;
        case 'Missão/Cenário':
            itemSchema = missionSchema;
            break;
        default:
            itemSchema = baseItemSchema;
    }
    
    // Always wrap in items array
    return {
        type: Type.OBJECT,
        properties: {
            items: {
                type: Type.ARRAY,
                items: itemSchema,
            },
        },
        required: ["items"]
    };
};


const buildItemGenerationPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    let prompt = `Você é um mestre de RPG e escritor criativo, especializado no universo de Demon Slayer (Kimetsu no Yaiba).
Sua tarefa é gerar ${count} item(s) de RPG detalhado(s) com base nos filtros fornecidos.
A resposta DEVE ser um objeto JSON, seguindo o schema fornecido.
Seja criativo, evocativo e forneça detalhes que inspirem a narrativa e a jogabilidade.

Filtros:
- Categoria: ${filters.category}
- Raridade: ${filters.rarity}
- Era/Estilo: ${filters.era}
`;

    if (filters.category === 'Forma de Respiração' && filters.breathingStyles.length > 0) {
        prompt += `- Inspiração (Respirações): ${filters.breathingStyles.join(', ')}\n`;
    }
    if (filters.category === 'Kekkijutsu' && filters.demonArts.length > 0) {
        prompt += `- Inspiração (Kekkijutsu): ${filters.demonArts.join(', ')}\n`;
    }
    if (filters.category === 'Missão/Cenário') {
        prompt += `- Tom: ${filters.tone}\n`;
        prompt += `- Intensidade (1-5): ${filters.intensity}\n`;
        prompt += `- Escala da Ameaça: ${filters.scale}\n`;
        if(filters.protagonist) prompt += `- Protagonista: ${filters.protagonist}\n`;
        if(filters.targets) prompt += `- Alvo: ${filters.targets}\n`;
        if(filters.moodModifiers) prompt += `- Modificadores de Ambiente: ${filters.moodModifiers}\n`;
    }
    
    if (promptModifier) {
        prompt += `\nInstrução Adicional: ${promptModifier}\n`;
    }

    prompt += "\nPor favor, gere os itens no formato JSON solicitado."
    return prompt;
}

// --- End of inlined promptSchemas.ts content ---


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ items: GeneratedItem[] } | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { filters, count = 1, promptModifier } = req.body;

        if (!filters) {
            return res.status(400).json({ message: 'Filtros são obrigatórios.' });
        }

        const aiClient = getAiClient();
        const prompt = buildItemGenerationPrompt(filters, count, promptModifier);
        const schema = getResponseSchema(filters.category, count);

        const result = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = result.text?.trim();
        if (!jsonText) {
            throw new Error("A resposta da IA estava vazia. A geração pode ter sido bloqueada ou o modelo não produziu uma saída válida.");
        }

        const data = JSON.parse(jsonText);
        
        // The schema returns an object with an "items" property.
        const items = data.items || [];

        // Ensure the response is always an array
        const finalItems = Array.isArray(items) ? items : [items];

        res.status(200).json({ items: finalItems });

    } catch (error) {
        console.error("Erro em /api/generateContent:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: `Falha ao gerar conteúdo. Detalhes: ${errorMessage}` });
    }
}
