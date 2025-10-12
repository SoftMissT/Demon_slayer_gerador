import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Type } from '@google/genai';
// FIX: Corrected type import from the now separate types.ts file.
import type { PromptGenerationResult } from '../../types';

// Helper to format Midjourney params into a string
const formatMjParams = (params: { [key: string]: any }, negativePrompt?: string): string => {
    let paramString = '';
    if (params.aspectRatio) paramString += ` --ar ${params.aspectRatio}`;
    if (params.chaos) paramString += ` --c ${params.chaos}`;
    if (params.quality) paramString += ` --q ${params.quality}`;
    if (params.style) paramString += ` --style ${params.style}`;
    if (params.stylize) paramString += ` --s ${params.stylize}`;
    if (params.weird) paramString += ` --w ${params.weird}`;
    if (params.version) {
        if (params.version.startsWith('Niji')) {
            paramString += ` --niji ${params.version.split(' ')[1]}`;
        } else {
            paramString += ` --v ${params.version}`;
        }
    }
    if (negativePrompt) {
        paramString += ` --no ${negativePrompt}`;
    }
    return paramString.trim();
};

const buildPromptGenerationPrompt = (topic: string, negativePrompt: string, mjParams: any, gptParams: any): string => {
    const mjParamsString = formatMjParams(mjParams, negativePrompt);
    
    return `Você é um especialista em engenharia de prompts, criando prompts altamente eficazes para IAs de geração de imagem como Midjourney e DALL-E 3.
Sua tarefa é gerar dois prompts distintos com base na entrada do usuário: um otimizado para Midjourney e outro para DALL-E 3 (que usa um modelo semelhante ao GPT para interpretação).

A entrada do usuário é a seguinte:
- Tópico Principal / Ideia: ${topic}
- Prompt Negativo (o que evitar): ${negativePrompt || 'Nenhum'}
- Parâmetros de Estilo GPT/DALL-E:
  - Tom/Atmosfera: ${gptParams.tone}
  - Estilo de Arte: ${gptParams.style}
  - Composição/Ângulo: ${gptParams.composition}
- Parâmetros Finais para Midjourney: ${mjParamsString}

**Instruções para Gerar os Prompts:**

1.  **Prompt para Midjourney:**
    - Crie um prompt conciso, focado em palavras-chave.
    - Combine o tópico principal com palavras-chave estilísticas relevantes derivadas dos parâmetros GPT/DALL-E.
    - O prompt deve ser uma série de frases descritivas e palavras-chave, separadas por vírgulas.
    - **IMPORTANTE**: Anexe a string de parâmetros de Midjourney \`${mjParamsString}\` exatamente como fornecida no final do prompt.

2.  **Prompt para GPT/DALL-E:**
    - Crie um parágrafo detalhado e descritivo.
    - Use linguagem natural para descrever vividamente a cena, incorporando o tópico principal.
    - Integre os parâmetros de estilo GPT/DALL-E (Tom, Estilo de Arte, Composição) de forma fluida na descrição.

A resposta DEVE ser um único objeto JSON com duas chaves: "midjourneyPrompt" e "gptPrompt".`;
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        midjourneyPrompt: { type: Type.STRING },
        gptPrompt: { type: Type.STRING },
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

        if (!topic) {
            return res.status(400).json({ message: 'O tópico é obrigatório.' });
        }

        const aiClient = getAiClient();
        if (!aiClient) {
            return res.status(500).json({ message: 'Erro de configuração do servidor: a API Key do Google Gemini não foi encontrada.' });
        }

        const prompt = buildPromptGenerationPrompt(topic, negativePrompt, mjParams, gptParams);

        const result = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = result.text?.trim();
        if (!jsonText) {
            throw new Error("A resposta da IA estava vazia.");
        }

        const data = JSON.parse(jsonText);
        
        res.status(200).json(data);

    } catch (error) {
        console.error("Erro em /api/generatePrompts:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: `Falha ao gerar prompts. Detalhes: ${errorMessage}` });
    }
}
