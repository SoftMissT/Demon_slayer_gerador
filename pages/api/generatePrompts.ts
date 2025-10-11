
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Type } from '@google/genai';
import type { PromptGenerationResult, MidjourneyParameters, GptParameters } from '../../types';

const buildMidjourneyParamsString = (params: Partial<Record<keyof MidjourneyParameters, any>>): string => {
    let paramString = '';
    if (!params || Object.keys(params).length === 0) return '';

    // Handle version separately due to --niji flag
    if (params.version) {
        if (params.version === 'Niji 6') {
            paramString += ' --niji 6';
        } else {
            paramString += ` --v ${params.version}`;
        }
    }
    
    // Handle other parameters
    for (const key in params) {
        if (key !== 'version' && params[key as keyof MidjourneyParameters] !== undefined) {
             const paramKey = {
                aspectRatio: 'ar',
                chaos: 'c',
                quality: 'q',
                stylize: 's',
                style: 'style',
                weird: 'w'
            }[key];
            if(paramKey) {
                paramString += ` --${paramKey} ${params[key as keyof MidjourneyParameters]}`;
            }
        }
    }
    return paramString.trim();
};


const buildPromptForPrompts = (
    topic: string,
    negativePrompt: string,
    mjParams: Partial<Record<keyof MidjourneyParameters, any>>, // Now receives only active params
    gptParams: GptParameters,
    useWebSearch: boolean
): string => {
    
    const mjParamsString = buildMidjourneyParamsString(mjParams);

    let prompt = `Você é um engenheiro de prompt de IA especialista, mestre em criar prompts para geradores de imagem como Midjourney e DALL-E 3.
Sua tarefa é criar dois prompts de imagem distintos e otimizados com base na ideia do usuário.
${useWebSearch ? 'Use a ferramenta de busca (Google Search) para encontrar referências visuais, artistas, estilos e detalhes relevantes sobre o tópico para enriquecer os prompts.' : 'Use seu conhecimento interno para criar os prompts.'}
A resposta DEVE ser um objeto JSON${useWebSearch ? '.' : ', seguindo o schema fornecido.'}

**Tópico da Imagem:** "${topic}"

**Elementos a Evitar (Prompt Negativo):** "${negativePrompt || 'Nenhum'}"

**1. Crie um Prompt para Midjourney:**
- Seja conciso e direto. Use palavras-chave e frases curtas separadas por vírgulas.
- Incorpore os seguintes parâmetros no final do prompt, se eles forem fornecidos: ${mjParamsString || 'Nenhum parâmetro específico fornecido.'}
- O prompt deve ser em INGLÊS.

**2. Crie um Prompt para DALL-E / GPT:**
- Seja descritivo e use linguagem natural. Crie uma cena detalhada como se estivesse descrevendo uma fotografia ou pintura.
- Incorpore os seguintes conceitos:
    - Tom/Atmosfera: ${gptParams.tone}
    - Estilo de Arte: ${gptParams.style}
    - Composição/Ângulo: ${gptParams.composition}
- O prompt deve ser em INGLÊS.

Analise o tópico, aplique os parâmetros e gere os dois prompts.
`;

    if (useWebSearch) {
        prompt += `\nLembre-se: sua resposta final DEVE ser apenas o objeto JSON, sem nenhum texto introdutório, explicação ou formatação de markdown.`
    }

    return prompt;
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        midjourneyPrompt: { type: Type.STRING, description: 'O prompt otimizado para Midjourney, em inglês, terminando com os parâmetros corretos, se fornecidos.' },
        gptPrompt: { type: Type.STRING, description: 'O prompt descritivo e detalhado para DALL-E/GPT, em inglês.' },
    },
    required: ["midjourneyPrompt", "gptPrompt"]
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PromptGenerationResult | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { topic, negativePrompt, mjParams, gptParams, useWebSearch } = req.body;

        if (!topic || !gptParams) { // mjParams is now optional
            return res.status(400).json({ message: 'Tópico e parâmetros GPT são obrigatórios.' });
        }

        const aiClient = getAiClient();
        const prompt = buildPromptForPrompts(topic, negativePrompt, mjParams, gptParams, useWebSearch);

        const config: any = {};

        if (useWebSearch) {
            config.tools = [{ googleSearch: {} }];
        } else {
            config.responseMimeType = "application/json";
            config.responseSchema = responseSchema;
        }

        const result = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: config,
        });

        let jsonText = result.text?.trim();
        if (!jsonText) {
            throw new Error("A resposta da IA estava vazia. A geração pode ter sido bloqueada ou o modelo não produziu uma saída válida.");
        }

        if (useWebSearch) {
            // Extract JSON from markdown code block if present
            const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
            if (match && match[1]) {
                jsonText = match[1];
            } else {
                // Fallback for plain JSON object
                const startIndex = jsonText.indexOf('{');
                const endIndex = jsonText.lastIndexOf('}');
                if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                    jsonText = jsonText.substring(startIndex, endIndex + 1);
                }
            }
        }
        
        const generatedPrompts = JSON.parse(jsonText);
        
        const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
        const webSearchQueries = groundingMetadata?.groundingChunks
            ?.map((chunk: any) => chunk.web)
            .filter(Boolean) ?? [];

        const finalResult: PromptGenerationResult = {
            ...generatedPrompts,
            webSearchQueries: webSearchQueries,
        };

        res.status(200).json(finalResult);

    } catch (error) {
        console.error("Erro em /api/generatePrompts:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: `Falha ao gerar prompts. Detalhes: ${errorMessage}` });
    }
}
