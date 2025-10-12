import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAiClient } from '../../lib/openai';
import { getAiClient as getGeminiClient } from '../../lib/gemini';
import type { MidjourneyParameters, GptParameters, GeminiParameters, PromptGenerationResult } from '../../types';

interface GeneratePromptsRequest {
    basePrompt: string;
    mjParams?: MidjourneyParameters;
    gptParams: GptParameters;
    geminiParams: GeminiParameters;
    generateMidjourney: boolean;
    generateGpt: boolean;
    generateGemini: boolean;
}

interface ApiResponse {
    result?: PromptGenerationResult;
    message: string;
}

const buildMidjourneyPrompt = (base: string, params?: MidjourneyParameters): string => {
    if (!params) return base;
    let prompt = base;
    const activeParams = Object.entries(params).filter(([, p]) => p.active);
    if (activeParams.length > 0) {
        prompt += ' ';
        activeParams.forEach(([key, param]) => {
            const paramKey = key === 'aspectRatio' ? 'ar' : key === 'version' ? 'v' : key === 'style' ? 'style' : key === 'stylize' ? 's' : key === 'chaos' ? 'c' : key === 'quality' ? 'q' : 'w';
            if (paramKey === 'v' && param.value.toString().startsWith('Niji')) {
                 prompt += `--niji ${param.value.toString().split(' ')[1]} `;
            } else {
                 prompt += `--${paramKey} ${param.value} `;
            }
        });
    }
    return prompt.trim();
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { basePrompt, mjParams, gptParams, geminiParams, generateMidjourney, generateGpt, generateGemini } = req.body as GeneratePromptsRequest;

        if (!basePrompt || typeof basePrompt !== 'string') {
            return res.status(400).json({ message: 'O prompt base é obrigatório.' });
        }
        
        if (!generateMidjourney && !generateGpt && !generateGemini) {
            return res.status(400).json({ message: 'Pelo menos um tipo de prompt deve ser selecionado para geração.' });
        }

        const geminiClient = getGeminiClient();
        if (!geminiClient) {
            return res.status(500).json({ message: 'Nenhuma chave de API de IA está configurada no servidor.' });
        }

        const requestedPrompts: string[] = [];
        if (generateMidjourney) requestedPrompts.push('"midjourneyPrompt"');
        if (generateGpt) requestedPrompts.push('"gptPrompt"');
        if (generateGemini) requestedPrompts.push('"geminiPrompt"');
        
        let systemPrompt = `Você é um especialista em engenharia de prompts para IAs generativas de imagem. Sua tarefa é expandir um prompt base do usuário em prompts otimizados para os modelos solicitados. O resultado deve ser um objeto JSON contendo APENAS as seguintes chaves: ${requestedPrompts.join(', ')}.\n\n`;

        let userPrompt = `**Prompt Base do Usuário:**\n"${basePrompt}"\n\n`;
        
        if (generateMidjourney) {
            systemPrompt += `Para "midjourneyPrompt":\n- Crie um prompt conciso e visual em INGLÊS. Use palavras-chave e frases curtas separadas por vírgulas.\n- Incorpore elementos de estilo como "cinematic lighting", "ultra detailed", "8k", "photorealistic".\n- Foque em descrever a composição, iluminação e a atmosfera visual.\n\n`;
        }
        if (generateGpt) {
            systemPrompt += `Para "gptPrompt":\n- Crie um prompt narrativo e descritivo em INGLÊS com 2-3 frases detalhadas para DALL-E 3.\n- Descreva a cena como se estivesse escrevendo uma história, incluindo o humor, o estilo artístico e a composição, usando os parâmetros estruturados fornecidos.\n\n`;
            userPrompt += `**Parâmetros Estruturados (para GPT/DALL-E):**\n- Tom/Atmosfera: ${gptParams.tone}\n- Estilo de Arte: ${gptParams.style}\n- Composição/Ângulo: ${gptParams.composition}\n\n`;
        }
        if (generateGemini) {
             systemPrompt += `Para "geminiPrompt":\n- Crie um prompt narrativo em PORTUGUÊS, otimizado para o Gemini.\n- Descreva a cena de forma visual e detalhada, incorporando os parâmetros de alquimia fornecidos.\n\n`;
            userPrompt += `**Parâmetros de Alquimia (para Gemini):**\n- Estilo de Arte: ${geminiParams.artStyle}\n- Iluminação: ${geminiParams.lighting}\n- Paleta de Cores: ${geminiParams.colorPalette}\n- Composição: ${geminiParams.composition}\n- Nível de Detalhe: ${geminiParams.detailLevel}\n`;
        }
        
        const response = await geminiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
            },
        });
        
        const content = response.text;
        if (!content) {
            throw new Error('A resposta da IA estava vazia.');
        }

        const generatedPrompts = JSON.parse(content) as Partial<PromptGenerationResult>;

        const result: PromptGenerationResult = {};
        
        if (generateMidjourney && generatedPrompts.midjourneyPrompt) {
            result.midjourneyPrompt = buildMidjourneyPrompt(generatedPrompts.midjourneyPrompt, mjParams);
        }
        if (generateGpt && generatedPrompts.gptPrompt) {
            result.gptPrompt = generatedPrompts.gptPrompt;
        }
        if (generateGemini && generatedPrompts.geminiPrompt) {
            result.geminiPrompt = generatedPrompts.geminiPrompt;
        }

        res.status(200).json({ result, message: 'Prompts gerados com sucesso!' });

    } catch (error: any) {
        console.error("Erro em /api/generatePrompts:", error);
        res.status(500).json({ message: `Falha ao gerar prompts. Detalhes: ${error.message}` });
    }
}