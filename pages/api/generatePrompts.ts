
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import type { MidjourneyParameters, GptParameters, GeminiParameters, PromptGenerationResult, ApiKeys } from '../../types';

interface GeneratePromptsRequest {
    basePrompt: string;
    mjParams?: MidjourneyParameters;
    gptParams: GptParameters;
    geminiParams: GeminiParameters;
    generateMidjourney: boolean;
    generateGpt: boolean;
    generateGemini: boolean;
    apiKeys?: ApiKeys;
}

const buildMidjourneyPrompt = (base: string, params?: MidjourneyParameters): string => {
    if (!params) return base;
    let prompt = base;
    const activeParams = Object.entries(params).filter(([, p]) => p.active);
    const technicalParams = activeParams.filter(([key]) => !['artStyle', 'lighting', 'colorPalette', 'composition', 'detailLevel'].includes(key));
    if (technicalParams.length > 0) {
        prompt += ' ';
        technicalParams.forEach(([key, param]) => {
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
  res: NextApiResponse<PromptGenerationResult | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const request = req.body as GeneratePromptsRequest;
        const { basePrompt, mjParams, gptParams, geminiParams, generateMidjourney, generateGpt, generateGemini, apiKeys } = request;

        const geminiClient = getAiClient(apiKeys?.gemini);
        if (!geminiClient) {
            return res.status(500).json({ message: 'Cliente Gemini não inicializado. Verifique a chave de API.' });
        }
        
        const requestedPrompts: string[] = [];
        if (generateMidjourney) requestedPrompts.push('"midjourneyPrompt"');
        if (generateGpt) requestedPrompts.push('"gptPrompt"');
        if (generateGemini) requestedPrompts.push('"geminiPrompt"');
        
        let systemInstruction = `Você é um especialista em engenharia de prompts para IAs generativas de imagem. Sua tarefa é expandir um prompt base do usuário em prompts otimizados para os modelos solicitados. O resultado deve ser um objeto JSON contendo APENAS as seguintes chaves: ${requestedPrompts.join(', ')}.\n\n`;
        let userPrompt = `**Prompt Base do Usuário:**\n"${basePrompt}"\n\n`;
        
        if (generateMidjourney) {
            systemInstruction += `Para "midjourneyPrompt":\n- Crie um prompt conciso e visual em INGLÊS. Use palavras-chave e frases curtas separadas por vírgulas.\n- Incorpore elementos de estilo como "cinematic lighting", "ultra detailed", "8k", "photorealistic".\n\n`;
            if (mjParams) {
                const descriptiveParams = [{ label: 'Estilo de Arte', param: mjParams.artStyle }, { label: 'Iluminação', param: mjParams.lighting }, { label: 'Paleta de Cores', param: mjParams.colorPalette }, { label: 'Composição', param: mjParams.composition }, { label: 'Nível de Detalhe', param: mjParams.detailLevel }].filter(({ param }) => param?.active);
                if (descriptiveParams.length > 0) {
                    userPrompt += `**Parâmetros Descritivos (para Midjourney):**\n`;
                    descriptiveParams.forEach(({ label, param }) => { if(param) userPrompt += `- ${label}: ${param.value}\n`; });
                    userPrompt += '\n';
                }
            }
        }
        if (generateGpt) {
            systemInstruction += `Para "gptPrompt":\n- Crie um prompt narrativo e descritivo em INGLÊS com 2-3 frases detalhadas para DALL-E 3.\n\n`;
            userPrompt += `**Parâmetros Estruturados (para GPT/DALL-E):**\n- Tom/Atmosfera: ${gptParams.tone}\n- Estilo de Arte: ${gptParams.style}\n- Composição/Ângulo: ${gptParams.composition}\n\n`;
        }
        if (generateGemini) {
             systemInstruction += `Para "geminiPrompt":\n- Crie um prompt narrativo em PORTUGUÊS, otimizado para o Gemini.\n\n`;
            userPrompt += `**Parâmetros de Alquimia (para Gemini):**\n- Estilo de Arte: ${geminiParams.artStyle}\n- Iluminação: ${geminiParams.lighting}\n- Paleta de Cores: ${geminiParams.colorPalette}\n- Composição: ${geminiParams.composition}\n- Nível de Detalhe: ${geminiParams.detailLevel}\n`;
        }
        
        const response = await geminiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            config: { systemInstruction, responseMimeType: "application/json" },
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

        res.status(200).json(result);

    } catch (error: any) {
        console.error("Erro na API /generatePrompts:", error);
        res.status(500).json({ message: error.message || 'Um erro inesperado ocorreu no servidor.' });
    }
}
