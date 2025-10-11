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
    gptParams: GptParameters
): string => {
    
    const mjParamsString = buildMidjourneyParamsString(mjParams);

    let prompt = `Você é um engenheiro de prompt de IA especialista, mestre em criar prompts para geradores de imagem como Midjourney e DALL-E 3.
Sua tarefa é criar dois prompts de imagem distintos e otimizados com base na ideia do usuário, **seguindo estritamente as políticas de conteúdo e segurança do Midjourney.**
A resposta DEVE ser um objeto JSON, seguindo o schema fornecido.

**REGRAS CRÍTICAS DE SEGURANÇA PARA MIDJOURNEY:**
- **NÃO use palavras explícitas** relacionadas a gore, violência gráfica, mutilação, sangue excessivo ou ferimentos detalhados. Em vez disso, use linguagem metafórica e descritiva (ex: "atmosfera sombria", "consequências de uma batalha feroz", "essência carmesim estilizada").
- **NÃO use termos sexualmente explícitos, pornográficos ou que possam ser interpretados como sexualização.** Mantenha o conteúdo SFW (Safe for Work).
- **EVITE nomes de figuras políticas ou celebridades** para prevenir a criação de deepfakes.
- **EVITE citar nomes de artistas diretamente** para respeitar direitos autorais. Em vez disso, descreva o *estilo* do artista (ex: "no estilo de uma pintura expressionista com pinceladas grossas e alto contraste").
- **SEMPRE priorize a segurança e a conformidade com as regras.** O objetivo é criar arte poderosa sem acionar os filtros de conteúdo.

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
        const { topic, negativePrompt, mjParams, gptParams } = req.body;

        if (!topic || !gptParams) { // mjParams is now optional
            return res.status(400).json({ message: 'Tópico e parâmetros GPT são obrigatórios.' });
        }

        const aiClient = getAiClient();
        const prompt = buildPromptForPrompts(topic, negativePrompt, mjParams, gptParams);

        const config: any = {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        };

        const result = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: config,
        });

        let jsonText = result.text?.trim();
        if (!jsonText) {
            throw new Error("A resposta da IA estava vazia. A geração pode ter sido bloqueada ou o modelo não produziu uma saída válida.");
        }
        
        const generatedPrompts = JSON.parse(jsonText);
        
        const finalResult: PromptGenerationResult = {
            ...generatedPrompts,
        };

        res.status(200).json(finalResult);

    } catch (error) {
        console.error("Erro em /api/generatePrompts:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: `Falha ao gerar prompts. Detalhes: ${errorMessage}` });
    }
}