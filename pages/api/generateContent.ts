
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { serverGenerateTextOpenAI } from '../../lib/openai';
import { Type } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import type { FilterState, GeneratedItem } from '../../types';

const buildPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    const {
        generationType,
        archetypeType,
        skillType,
        kekkijutsu,
        accessoryType,
        armaduraType,
        itemDeAuxilioType,
        consumableType,
        breathingBase,
        weaponType,
        grip,
        level,
        theme,
        era,
        rarity,
        seed
    } = filters;

    let prompt = `Gere ${count} item(ns) para um RPG de mesa com tema de fantasia sombria japonesa, no estilo de "Demon Slayer".
    O tipo de geração é: "${generationType}".
    O nível/patente sugerido é em torno de ${level}.
    A raridade/impacto é: "${raridade}".
    O tom temático deve ser: "${theme}".
    A era/ambientação é: "${era}".
    `;

    if (generationType === 'Forma de Respiração' && breathingBase) {
        prompt += `Crie uma nova técnica ou forma baseada na "${breathingBase}". `;
    }
    if (generationType === 'Arma' && weaponType) {
        prompt += `O tipo de arma base é "${weaponType}". `;
    }
    if (generationType === 'Arma' && grip) {
        prompt += `A empunhadura a ser considerada é "${grip}". `;
    }
    if (generationType === 'Arquétipo/Habilidade' && archetypeType) {
        prompt += `Foque no arquétipo "${archetypeType}". `;
        if (skillType) {
            prompt += `Especialmente na habilidade "${skillType}". `;
        }
    }
    if ((generationType === 'Inimigo/Oni' || generationType === 'Híbrido Humano-Oni') && kekkijutsu) {
        prompt += `O Kekkijutsu base é "${kekkijutsu}". `;
    }
    if (generationType === 'Acessório' && accessoryType) {
        prompt += `O tipo de acessório é "${accessoryType}". `;
    }
    if (generationType === 'Armadura' && armaduraType) {
        prompt += `O tipo de armadura é "${armaduraType}". `;
    }
    if (generationType === 'Item de Auxílio' && itemDeAuxilioType) {
        prompt += `O tipo de item de auxílio é "${itemDeAuxilioType}". `;
    }
     if (generationType === 'Item Consumível' && consumableType) {
        prompt += `O tipo de item consumível é "${consumableType}". `;
    }
    if (seed) {
        prompt += `Use a seed "${seed}" para tentar gerar um resultado determinístico. `;
    }
    if (promptModifier) {
        prompt += `\nModificador do usuário: "${promptModifier}"\n`;
    }

    prompt += `
    Para cada item, forneça:
    - nome: Um nome criativo e temático em português.
    - tipo: O tipo geral do item (e.g., 'Técnica de Respiração', 'Arma Mágica', 'Kekkijutsu', 'Oni').
    - subcategoria: Um detalhamento do tipo (e.g., 'Katana', 'Respiração da Água', 'Técnica de Sangue').
    - descricao_curta: Uma frase de efeito que resume o item.
    - descricao: Uma descrição detalhada (2-3 parágrafos) sobre a aparência, história e funcionamento.
    - nivel_sugerido: Um número entre 1 e 20.
    - raridade: A raridade fornecida.
    - dano, dados, tipo_de_dano: Detalhes de combate. Se não for aplicável, use "N/A".
    - status_aplicado, efeitos_secundarios: Efeitos adicionais. Se não houver, use "Nenhum".
    - ganchos_narrativos: Uma ideia de como usar o item em uma história.
    - E para itens como armas, armaduras ou personagens, inclua: dano_base, multiplicador_de_ataque, defesa, resistencia_magica, velocidade_movimento. Se não for aplicável, use "N/A".
    - Para locais, inclua: clima, bioma.
    
    A sua resposta DEVE ser um objeto JSON contendo um array chamado "items".
    `;
    return prompt;
};

const itemSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING },
        tipo: { type: Type.STRING },
        subcategoria: { type: Type.STRING },
        categoria: { type: Type.STRING },
        descricao_curta: { type: Type.STRING },
        descricao: { type: Type.STRING },
        nivel_sugerido: { type: Type.INTEGER },
        raridade: { type: Type.STRING },
        dano: { type: Type.STRING },
        dados: { type: Type.STRING },
        tipo_de_dano: { type: Type.STRING },
        status_aplicado: { type: Type.STRING },
        efeitos_secundarios: { type: Type.STRING },
        ganchos_narrativos: { type: Type.STRING },
        dano_base: { type: Type.STRING },
        multiplicador_de_ataque: { type: Type.STRING },
        defesa: { type: Type.STRING },
        resistencia_magica: { type: Type.STRING },
        velocidade_movimento: { type: Type.STRING },
        clima: { type: Type.STRING },
        bioma: { type: Type.STRING },
    },
    required: [
        "nome", "tipo", "subcategoria", "descricao_curta", "descricao", "nivel_sugerido", "raridade"
    ]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        items: {
            type: Type.ARRAY,
            items: itemSchema
        }
    }
};


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
        let generatedItems: Partial<GeneratedItem>[] = [];

        if (filters.aiModel === 'Gemini') {
            const aiClient = getAiClient();
            const seedValue = filters.seed ? parseInt(filters.seed, 10) : undefined;
            const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.8,
                    seed: !isNaN(seedValue) ? seedValue : undefined
                },
            });

            const rawText = response.text.trim();
            if (!rawText) {
                throw new Error("A API do Gemini não retornou texto.");
            }
            const data = JSON.parse(rawText);
            generatedItems = data.items;

        } else if (filters.aiModel === 'OpenAI') {
            generatedItems = await serverGenerateTextOpenAI(prompt, responseSchema);
        } else {
             return res.status(400).json({ message: 'Modelo de IA inválido.' });
        }

        if (!generatedItems || !Array.isArray(generatedItems)) {
             throw new Error("A resposta da IA não continha o array de itens esperado.");
        }

        const itemsWithIds = generatedItems.map(item => ({
            ...item,
            id: uuidv4(),
            categoria: filters.generationType, // Ensure category is set from filter
        }));
        
        res.status(200).json({ items: itemsWithIds });

    } catch (error) {
        console.error("Erro em /api/generateContent:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: errorMessage });
    }
}
