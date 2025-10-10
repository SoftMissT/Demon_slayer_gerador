
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { serverGenerateTextOpenAI } from '../../lib/openai';
import type { FilterState, GeneratedItem } from '../../types';
import { Type } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

// This function builds the prompt based on user-selected filters.
const buildPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    let prompt = `Gere ${count} ${count > 1 ? 'itens únicos' : 'item único'} para um RPG de mesa no universo de Demon Slayer (Kimetsu no Yaiba).
    O tipo de geração é: "${filters.generationType}".
    
    Detalhes:
    - Nível/Patente Sugerido: ${filters.level}
    - Tom Temático: ${filters.theme}
    - Era/Ambientação: ${filters.era}
    - Raridade/Impacto: ${filters.rarity}
    ${filters.seed ? `- Seed para inspiração: "${filters.seed}"` : ''}
    `;

    switch (filters.generationType) {
        case 'Forma de Respiração':
            prompt += `\n- Respiração Base (se houver): ${filters.breathingBase || 'Nenhuma'}`;
            prompt += `\n- Foco da forma: Criar uma técnica original e criativa.`;
            break;
        case 'Kekkijutsu':
            prompt += `\n- Kekkijutsu Específico (se houver): ${filters.kekkijutsu || 'Nenhum'}`;
            prompt += `\n- Foco: Criar uma técnica de arte demoníaca de sangue (Kekkijutsu) original.`;
            break;
        case 'Arma':
            prompt += `\n- Tipo de Arma (se houver): ${filters.weaponType || 'Qualquer'}`;
            prompt += `\n- Empunhadura (se houver): ${filters.grip || 'Qualquer'}`;
            break;
        case 'Acessório':
            prompt += `\n- Tipo de Acessório: ${filters.accessoryType || 'Qualquer'}`;
            break;
        case 'Armadura':
            prompt += `\n- Tipo de Armadura: ${filters.armaduraType || 'Qualquer'}`;
            break;
        case 'Item de Auxílio':
            prompt += `\n- Tipo de Item: ${filters.itemDeAuxilioType || 'Qualquer'}`;
            break;
        case 'Item Consumível':
            prompt += `\n- Tipo de Item: ${filters.consumableType || 'Qualquer'}`;
            break;
        case 'Arquétipo/Habilidade':
            prompt += `\n- Arquétipo: ${filters.archetypeType || 'Qualquer'}`;
            prompt += `\n- Habilidade Específica: ${filters.skillType || 'Qualquer'}`;
            break;
        case 'Inimigo/Oni':
        case 'Híbrido Humano-Oni':
             prompt += `\n- Kekkijutsu (se houver): ${filters.kekkijutsu || 'Nenhum'}`;
            break;
        // Default case for other types like 'Missão', 'NPC', 'Caçador', 'Local/Cenário', etc.
        default:
            prompt += `\n- Crie um conceito original e detalhado para "${filters.generationType}".`;
            break;
    }
    
    if (promptModifier) {
        prompt += `\n\nModificador Adicional: ${promptModifier}\n`;
    }

    prompt += `\nResponda APENAS com um array JSON válido, seguindo o schema fornecido.`;
    return prompt;
}

// Defines the JSON schema for the expected AI response.
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        items: {
            type: Type.ARRAY,
            description: "Um array de itens gerados.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING, description: "Nome criativo e único do item/técnica/personagem." },
                    categoria: { type: Type.STRING, description: `A categoria do item gerado, que deve ser "${"DEVE SER O VALOR DE generationType"}"` },
                    descricao_curta: { type: Type.STRING, description: "Uma descrição de uma frase, impactante e evocativa." },
                    descricao: { type: Type.STRING, description: "Descrição detalhada (2-3 parágrafos) sobre a aparência, história e funcionamento." },
                    nivel_sugerido: { type: Type.INTEGER, description: "Nível ou patente sugerido para o item/personagem, entre 1 e 20." },
                    raridade: { type: Type.STRING, description: "A raridade, conforme especificado (Comum, Raro, etc.)." },
                    dano: { type: Type.STRING, description: "Dano base da arma ou técnica (ex: '1d10', '2d6+FOR'). N/A se não aplicável." },
                    dados: { type: Type.STRING, description: "Os dados de dano (ex: 'd10', '2d6'). N/A se não aplicável." },
                    tipo_de_dano: { type: Type.STRING, description: "Tipo de dano (ex: 'Cortante', 'Perfurante', 'Elemental'). N/A se não aplicável." },
                    status_aplicado: { type: Type.STRING, description: "Status negativo aplicado (ex: 'Sangramento', 'Atordoado', 'Envenenado'). 'Nenhum' se não houver." },
                    efeitos_secundarios: { type: Type.STRING, description: "Qualquer efeito adicional passivo ou ativo. 'Nenhum' se não houver." },
                    ganchos_narrativos: { type: Type.STRING, description: "Uma pequena frase ou pergunta que sirva como gancho para aventuras. N/A se não aplicável." },
                    clima: { type: Type.STRING, description: "O clima predominante do local (apenas para Local/Cenário). N/A para outros tipos." },
                    bioma: { type: Type.STRING, description: "O bioma do local (ex: Floresta, Montanha) (apenas para Local/Cenário). N/A para outros tipos." },
                },
                 required: ["nome", "categoria", "descricao_curta", "descricao", "nivel_sugerido", "raridade"]
            }
        }
    }
};

const getResponseSchemaForOpenAI = (generationType: string) => {
    // A simple conversion for OpenAI, removing the 'Type' enum.
    // The main difference is that we are not using the 'Type' enum from @google/genai
    const schema = JSON.parse(JSON.stringify(responseSchema));
    
    const fixProperties = (props: any) => {
        for (const key in props) {
            if (props[key].type) {
                props[key].type = props[key].type.toLowerCase();
            }
            if(props[key].properties) {
                fixProperties(props[key].properties);
            }
            if(props[key].items && props[key].items.properties) {
                fixProperties(props[key].items.properties)
            }
        }
    }
    fixProperties(schema.properties);
    // Inject the specific generationType into the schema description for better results
    schema.properties.items.properties.categoria.description = `A categoria do item gerado, que deve ser "${generationType}"`;
    return schema;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { filters, count = 1, promptModifier } = req.body as { filters: FilterState, count: number, promptModifier?: string };

        if (!filters || !filters.generationType) {
            return res.status(400).json({ message: 'O tipo de geração é obrigatório.' });
        }

        const prompt = buildPrompt(filters, count, promptModifier);
        let generatedItems: Omit<GeneratedItem, 'id'>[] = [];

        if (filters.aiModel === 'OpenAI') {
            const schemaForOpenAI = getResponseSchemaForOpenAI(filters.generationType);
            const openAIPrompt = `${prompt}\n\nSchema JSON esperado:\n${JSON.stringify(schemaForOpenAI)}`;
            generatedItems = await serverGenerateTextOpenAI(openAIPrompt, schemaForOpenAI);
        } else { // Gemini
            const aiClient = getAiClient();
            
            // Inject the specific generationType into the schema description for better results
            const finalSchema = JSON.parse(JSON.stringify(responseSchema));
            finalSchema.properties.items.properties.categoria.description = `A categoria do item gerado, que deve ser "${filters.generationType}"`;

            // FIX: Use models.generateContent instead of deprecated methods.
            const result = await aiClient.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: finalSchema,
                    temperature: 0.9,
                },
            });
            
            // FIX: Extract text directly from the .text property of the response.
            const rawText = result.text.trim();
            if (!rawText) {
                throw new Error("A API da Gemini não retornou texto.");
            }
            const data = JSON.parse(rawText);
            generatedItems = data.items;
        }

        if (!generatedItems || !Array.isArray(generatedItems)) {
             throw new Error("A resposta da IA não continha o array de itens esperado.");
        }

        // Add unique IDs to each item
        const itemsWithIds: GeneratedItem[] = generatedItems.map(item => ({
            ...item,
            id: uuidv4(),
        }));

        res.status(200).json({ items: itemsWithIds });

    } catch (error) {
        console.error("Erro em /api/generateContent:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: errorMessage });
    }
}
